
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from "react-native";
import Client from "../../api/Client";
import { useLogin } from "../../context/LoginProvider";

const Employment = () => {
  const { profile } = useLogin();
  const [employees, setEmployees] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [bookingTitle, setBookingTitle] = useState("");
  const [bookingDescription, setBookingDescription] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [empRes, wtRes] = await Promise.all([
        Client.get("/employees"),
        Client.get("/worktypes")
      ]);
      setEmployees(empRes.data);
      setWorkTypes(wtRes.data);
    } catch (err) {
      Alert.alert("Error", "Could not load data");
    }
  };

  const createBooking = async () => {
    if (!selectedEmployee || !selectedWorkType || !bookingTitle) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      await Client.post("/bookings", {
        employeeId: selectedEmployee.id,
        employerId: profile.id,
        workTypeId: selectedWorkType.id,
        title: bookingTitle,
        description: bookingDescription,
        bookingDate: new Date(),
        price: selectedWorkType.price
      });
      Alert.alert("Success", "Booking created successfully");
      setSelectedEmployee(null);
      setSelectedWorkType(null);
      setBookingTitle("");
      setBookingDescription("");
    } catch (err) {
      Alert.alert("Error", "Could not create booking");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Booking</Text>

      <Text style={styles.subtitle}>Select Employee:</Text>
      <FlatList
        horizontal
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        style={styles.horizontalList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.employeeCard, selectedEmployee?.id === item.id && styles.selectedCard]}
            onPress={() => setSelectedEmployee(item)}
          >
            <Text style={styles.employeeName}>{item.name}</Text>
            <Text>Work Type: {item.workType}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.subtitle}>Select Work Type:</Text>
      <FlatList
        horizontal
        data={workTypes}
        keyExtractor={(item) => item.id.toString()}
        style={styles.horizontalList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.workTypeCard, selectedWorkType?.id === item.id && styles.selectedCard]}
            onPress={() => setSelectedWorkType(item)}
          >
            <Text style={styles.workTypeName}>{item.name}</Text>
            <Text>Price: {item.price}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Booking Title"
        value={bookingTitle}
        onChangeText={setBookingTitle}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={bookingDescription}
        onChangeText={setBookingDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={createBooking}>
        <Text style={styles.buttonText}>Create Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  horizontalList: { marginBottom: 12 },
  employeeCard: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginRight: 8, minWidth: 150 },
  workTypeCard: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginRight: 8, minWidth: 150 },
  selectedCard: { borderColor: "#007bff", backgroundColor: "#e6f2ff" },
  employeeName: { fontWeight: "bold", fontSize: 16 },
  workTypeName: { fontWeight: "bold", fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  multilineInput: { height: 80 },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" }
});

export default Employment;

