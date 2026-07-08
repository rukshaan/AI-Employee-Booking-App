
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import Client from "../../api/Client";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await Client.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      Alert.alert("Error", "Could not load bookings");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Price: {item.price}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Employee: {item.employee?.name || "N/A"}</Text>
            <Text>Employer: {item.employer?.name || "N/A"}</Text>
            <Text>Work Type: {item.worktype?.name || "N/A"}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  card: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 10 },
  name: { fontWeight: "bold", fontSize: 16 }
});

export default Bookings;

