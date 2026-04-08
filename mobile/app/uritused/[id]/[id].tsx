import { Image } from 'expo-image';
import { usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView } from 'react-native';
import { getApiBaseUrl } from '@/lib/api';
import { getAuthToken } from '@/lib/session';

type EventItem = {
  event_id: number;
  name: string;
  description?: string | null;
  location?: string | null;
  date: string;
  image?: string | null;
};

export default function EventDetailScreen() {
  const pathname = usePathname();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const pathParts = pathname.split('/').filter(Boolean);
      const eventId = pathParts[pathParts.length - 1];

      if (!eventId) {
        setEvent(null);
        return;
      }

      const token = await getAuthToken();
      const detailResponse = await fetch(`${getApiBaseUrl()}/api/event/${eventId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const detailData = await detailResponse.json();

      if (detailResponse.ok && detailData?.success && detailData?.data) {
        setEvent(detailData.data);
        return;
      }

      const listResponse = await fetch(`${getApiBaseUrl()}/api/events`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const listData = await listResponse.json();

      if (!listResponse.ok || !listData?.success || !Array.isArray(listData?.data)) {
        setEvent(null);
        return;
      }

      const matchedEvent = listData.data.find((item: EventItem) => String(item.event_id) === String(eventId));
      setEvent(matchedEvent ?? null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  if (!event) {
    return <Text>Sündmust ei leitud</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Pilt */}
      <Image
        source={event.image ? { uri: event.image } : undefined}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{event.name}</Text>

        <Text style={styles.meta}>
           {event.location}
        </Text>

        <Text style={styles.meta}>
           {new Date(event.date).toLocaleString()}
        </Text>

        <Text style={styles.description}>
          {event.description}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  meta: {
    fontSize: 16,
    marginBottom: 6,
    color: "#555",
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22,
  },
});