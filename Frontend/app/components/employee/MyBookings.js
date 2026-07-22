
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
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
      // Filter out Pending bookings since they are managed on the Dashboard
      const filtered = res.data.filter(b => b.status !== 'Pending');
      setBookings(filtered);
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
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Date: {new Date(item.bookingDate).toDateString()}</Text>
            {item.bookingTime || item.endTime ? <Text>Time: {item.bookingTime || 'N/A'} - {item.endTime || 'N/A'}</Text> : null}
            <Text>Employer: {item.employer?.name || "N/A"}</Text>
            <Text>Work Type: {item.worktype?.name || "N/A"}</Text>
            <Text>Price: LKR {Number(item.price).toFixed(2)}</Text>
            <Text>Status: {item.status}</Text>
            
            {item.status === 'Pending' && (
              <View style={styles.row}>
                <TouchableOpacity style={styles.accept} onPress={() => updateStatus(item.id, 'Approved')}>
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reject} onPress={() => updateStatus(item.id, 'Rejected')}>
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {item.status === 'Approved' && (
              <View style={styles.row}>
                <TouchableOpacity style={[styles.accept, { backgroundColor: '#3b82f6' }]} onPress={() => updateStatus(item.id, 'Processing')}>
                  <Text style={styles.btnText}>Start Job (Processing)</Text>
                </TouchableOpacity>
              </View>
            )}

            {item.status === 'Processing' && (
              <View style={styles.row}>
                <TouchableOpacity style={[styles.accept, { backgroundColor: '#10b981' }]} onPress={() => updateStatus(item.id, 'Finished')}>
                  <Text style={styles.btnText}>Finish Job</Text>
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
  btnText: { color: "#fff", fontWeight: "bold" }
});

export default MyBookings;
