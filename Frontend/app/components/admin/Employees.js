import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import Client from '../../api/Client';

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await Client.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      Alert.alert("Error", "Could not load employees");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employees</Text>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Contact: {item.contactNo}</Text>
            <Text>Work Type: {item.workType}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  card: { padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 }
});

export default Employees;
