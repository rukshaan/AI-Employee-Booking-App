
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import Client from "../../api/Client";

const ViewWorkType = () => {
  const [workTypes, setWorkTypes] = useState([]);

  useEffect(() => {
    loadWorkTypes();
  }, []);

  const loadWorkTypes = async () => {
    try {
      const res = await Client.get("/worktypes");
      setWorkTypes(res.data);
    } catch (err) {
      Alert.alert("Error", "Could not load work types");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Work Type</Text>
      <FlatList
        data={workTypes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Price: {item.price}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12
  },
  card: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 10 }
});

export default ViewWorkType;

