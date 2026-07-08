import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Client from "../../api/Client";
import { useLogin } from "../../context/LoginProvider";

const Booking = () => {
  const { profile } = useLogin();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await Client.get(`/bookings/employer/${profile.id}`);
      setBookings(res.data);
    } catch (err) {
      Alert.alert("Error", "Could not load bookings");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await Client.put(`/bookings/${id}/status`, { status });
      Alert.alert("Success", "Status updated");
      loadBookings();
    } catch (err) {
      Alert.alert("Error", "Could not update booking");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Requests</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Employee: {item.employee?.name || "N/A"}</Text>
            <Text>Work Type: {item.worktype?.name || "N/A"}</Text>
            <Text>Price: {item.price}</Text>
            <Text>Status: {item.status}</Text>
            {item.status === "Pending" && (
              <View style={styles.row}>
                <TouchableOpacity style={styles.accept} onPress={() => updateStatus(item.id, "Approved")}>
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reject} onPress={() => updateStatus(item.id, "Rejected")}>
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
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
  name: { fontWeight: "bold", fontSize: 16 },
  row: { flexDirection: "row", marginTop: 8 },
  accept: { backgroundColor: "green", padding: 8, borderRadius: 6, marginRight: 8 },
  reject: { backgroundColor: "red", padding: 8, borderRadius: 6 },
  btnText: { color: "#fff" }
});

export default Booking;