import { useState } from "react";
import ModalManager from "../Components/Modals/ModalManager";
import { API_BASE_URL } from "../API";
import { useEffect } from "react";
import userIco from "../assets/icons/icons8-user-48.png"
const Home = () => {

    const [activeModal, setActiveModal] = useState(null);
    const [modalProps, setModalProps] = useState({});
    const [events, setEvents] = useState([]);
    const [complaints, setComplaints] = useState([]);

    const getStatusClass = (status) => {
        switch (status) {
            case "saadetud":
                return "bg-gray-300 text-gray-800";
            case "tegutseme":
                return "bg-yellow-300 text-yellow-800";
            case "lahendatud":
                return "bg-green-300 text-green-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalProps({});
    }

    const fetchData = () => {
        // EVENTS FETCH
        fetch(API_BASE_URL + "/api/events",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("admin_auth_token")}`,
                }
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setEvents(data.data || []);
            })

        // COMPLAINT FETCH
        fetch(API_BASE_URL + "/api/complaints",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("admin_auth_token")}`,
                }
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setComplaints(data.complaints || []);
            })
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div class="h-screen">
            <div class="px-32 py-16 flex gap-4">
                <h1 class="poppins-bold text-4xl">Admin page</h1>
                <button class="rounded-md bg-acent px-2 py-1 mt-1.5 items-center flex gap-2 h-8 cursor-pointer" onClick={() => fetchData()}>

                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 30 30">
                        <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
                    </svg><h1>Uuenda</h1>
                </button>
                <button onClick={() => window.location.href = "/users"} class="rounded-md bg-acent px-2 py-1 mt-1.5 items-center flex gap-2 h-8 cursor-pointer">

                    <img class=" w-6 h-6" src={userIco} alt="Kasutajad" />
                    <h1>Kasutajad</h1>
                </button>
            </div>
            <div class="flex justify-between h-3/4 gap-16 px-32">
                <div class="w-1/4">
                    <div class="flex justify-between">
                        <h1 class="poppins-bold">Üritused</h1>
                        <button class="rounded-md bg-acent px-2 py-1" onClick={() => setActiveModal("createevent")}><h1 class="poppins-regular">Lisa uus</h1></button>
                    </div>

                    {events.length === 0 && (
                        <div class="bg-acent border-main rounded-md mt-4 p-4">
                            <h1 class="poppins-regular">Üritusi ei leitud</h1>
                        </div>
                    )}

                    {events.map((key, index) => {
                        return (
                            <div key={index} class="bg-acent border-main rounded-md mt-4 relative options-hover-container">
                                <div class="p-4">
                                    <h1 class="poppins-bold">{key.name}</h1>
                                    <p class="poppins-regular">{key.location}</p>
                                    <h1 class="poppins-regular">{formatDate(key.date)}</h1>
                                </div>

                                <div class="flex flex-col options-container">
                                    <button onClick={() => {
                                        setActiveModal("updateevent");
                                        setModalProps({ event: key });
                                    }} class="border-main rounded-md">Muuda</button>
                                    <button onClick={() => {
                                        setActiveModal("deleteevent");
                                        setModalProps({ event: key, onDeleteSuccess: () => setEvents(events.filter(e => e.id !== key.id)) });
                                    }} class="border-main rounded-md">Kustuta</button>
                                </div>
                            </div>
                        )
                    })}

                </div>
                <div class="w-1/4">
                    <div class="flex justify-between">
                        <h1 class="poppins-bold">Sündmused</h1>
                        <button class="rounded-md bg-acent px-2 py-1"><h1 class="poppins-regular" onClick={() => setActiveModal("createsundmus")}>Lisa uus</h1></button>
                    </div>
                    <div class="bg-acent border-main rounded-md mt-4 relative options-hover-container">
                        <div class="p-4">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <circle cx="7" cy="7" r="7" fill="#8C8C8C" />
                                </svg>
                                <h1 class="poppins-regular">Homme, Teisipäev</h1>
                            </div>
                            <h1 class="poppins-bold">Koristuspäev</h1>
                        </div>

                        <div class="flex flex-col options-container">
                            <button class="border-main rounded-md">Muuda</button>
                            <button class="border-main rounded-md">Kustuta</button>
                        </div>
                    </div>
                </div>
                <div class="w-1/3 h-full">
                    <div class="flex justify-between">
                        <h1 class="poppins-bold">Kaebused</h1>

                    </div>
                    <div class="overflow-y-scroll h-full pb-4">
                        {complaints.filter(c => c.complaint_status !== 'lahendatud').map((key, index) => {
                            return (
                                <div key={index} class="bg-acent border-main rounded-md mt-4 relative options-hover-container">

                                    <div class="p-4">
                                        <div class="flex items-center gap-2">
                                            {key.Rooms.map((room, idx) => {
                                                return (<h1 key={idx} class="poppins-bold">{room.room_nr}{room.room_letter}</h1>)
                                            })}

                                        </div>
                                        <div className={`absolute right-2 top-2 px-2 py-1 rounded-md ${getStatusClass(key.complaint_status)}`}><h1 className="text-xs poppins-bold">{key.complaint_status}</h1></div>
                                        <h1 class="poppins-regular">Kaebus: {key.type}</h1>
                                        <h1 class="poppins-regular">Kirjeldus: {key.reasoning}</h1>
                                        <h1 class="poppins-regular mt-2">Esitaja: {key.User.first_name} {key.User.last_name} <br /> {key.User.email}</h1>
                                    </div>

                                    <div class="flex flex-col options-container">
                                        <button onClick={() => {
                                            setActiveModal("updatecomplaint");
                                            setModalProps({
                                                complaint: key, onUpdateSuccess: (updatedComplaint) => {
                                                    setComplaints(complaints.map(c => c.complaint_id === updatedComplaint.complaint_id ? updatedComplaint : c));
                                                }
                                            });
                                        }} class="border-main rounded-md">Muuda staatust</button>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <ModalManager modal={activeModal} modalProps={{ ...modalProps }} onClose={closeModal} />
        </div>
    )
}

export default Home;