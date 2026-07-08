
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import Client from "../../api/Client";
import { useLogin } from "../../context/LoginProvider";

const MyBookings = () => {
  const { profile } = useLogin();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await Client.get(`/bookings/employee/${profile.id}`);
      setBookings(res.data);
    } catch (err) {
      Alert.alert("Error", "Could not load bookings");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Employer: {item.employer?.name || "N/A"}</Text>
            <Text>Work Type: {item.worktype?.name || "N/A"}</Text>
            <Text>Price: {item.price}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  card: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 10 },
  name: { fontWeight: "bold", fontSize: 16 }
});

export default MyBookings;
