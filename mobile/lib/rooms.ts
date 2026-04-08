import { getApiBaseUrl } from "@/lib/api";

export const ROOM_LETTERS = ["A", "B", "C"] as const;

export type RoomLetter = (typeof ROOM_LETTERS)[number];

export type RoomRecord = {
  room_nr: number;
  room_letter: RoomLetter;
  floor: number;
  grade: number | null;
};

export type RoomGroup = Partial<Record<RoomLetter, RoomRecord | null>>;

export type RoomGroupMap = Record<string, RoomGroup>;

type RoomResponse = {
  success?: boolean;
  data?: RoomGroupMap;
  message?: string;
  error?: string;
};

export type RoomSummary = {
  roomNumber: string;
  room: RoomGroup;
  availableLetters: RoomLetter[];
};

export const parseRoomNumber = (roomNumber: string) => Number(roomNumber);

export const normalizeSearchValue = (value: string) => value.trim().replace(/\s+/g, "");

export const getRoomSummariesForFloor = (
  roomGroups: RoomGroupMap,
  floor: string,
  searchValue = ""
): RoomSummary[] => {
  const normalizedFloor = Number(floor);
  const normalizedSearchValue = normalizeSearchValue(searchValue);

  return Object.entries(roomGroups)
    .map(([roomNumber, room]) => {
      const availableLetters = ROOM_LETTERS.filter((letter) => room?.[letter] !== null);

      return {
        roomNumber,
        room,
        availableLetters,
      };
    })
    .filter(({ room }) => {
      const firstAvailableRoom = ROOM_LETTERS.map((letter) => room?.[letter]).find(Boolean);
      return firstAvailableRoom?.floor === normalizedFloor;
    })
    .filter(({ roomNumber, availableLetters }) => {
      if (!normalizedSearchValue) {
        return true;
      }

      const searchableRoomNumber = normalizeSearchValue(roomNumber);
      return searchableRoomNumber.includes(normalizedSearchValue) || availableLetters.some((letter) => letter.includes(normalizedSearchValue as RoomLetter));
    })
    .sort((left, right) => parseRoomNumber(left.roomNumber) - parseRoomNumber(right.roomNumber));
};

export async function fetchRoomsByFloor(floor: string, token: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/rooms?floor=${encodeURIComponent(floor)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await response.json()) as RoomResponse;

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || "Failed to load rooms");
  }

  return data.data ?? {};
}