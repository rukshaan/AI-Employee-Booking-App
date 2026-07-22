import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Client from "../../api/Client";

const ViewWorkType = () => {
  const [workTypes, setWorkTypes] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadWorkTypes();
    }, [])
  );

  const loadWorkTypes = async () => {
    try {
      const res = await Client.get("/worktypes");
      setWorkTypes(res.data);
    } catch (err) {
      Alert.alert("Error", "Could not load work types");
    }
  };

  const confirmDelete = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => deleteItem(id), style: "destructive" }
    ]);
  };

  const deleteItem = async (id) => {
    try {
      await Client.delete(`/worktypes/${id}`);
      Alert.alert("Success", "Deleted successfully");
      loadWorkTypes();
    } catch (err) {
      Alert.alert("Error", "Could not delete");
    }
  };

  const handleOptions = (item) => {
    Alert.alert(
      "Options",
      `Choose an action for ${item.name}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Edit", onPress: () => {
            setSelectedItem(item);
            setEditName(item.name);
            setEditPrice(item.price ? item.price.toString() : "0");
            setIsEditModalVisible(true);
        }},
        { text: "Delete", onPress: () => confirmDelete(item.id), style: "destructive" }
      ]
    );
  };

  const handleUpdate = async () => {
    try {
      await Client.put(`/worktypes/${selectedItem.id}`, { name: editName, price: parseFloat(editPrice) });
      Alert.alert("Success", "Updated successfully");
      setIsEditModalVisible(false);
      loadWorkTypes();
    } catch (err) {
      Alert.alert("Error", "Could not update");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>View Work Type</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddWorkType')}>
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={workTypes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Description: {item.description}</Text>
              <Text>Price: LKR {Number(item.price).toFixed(2)}</Text>
              <Text>Status: {item.status}</Text>
            </View>
            <TouchableOpacity onPress={() => handleOptions(item)} style={styles.optionsBtn}>
              <Text style={styles.optionsBtnText}>⋮</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Work Type</Text>
            <TextInput style={styles.input} value={editName} onChangeText={setEditName} placeholder="Name" />
            <TextInput style={styles.input} value={editPrice} onChangeText={setEditPrice} placeholder="Price" keyboardType="numeric" />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  card: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  optionsBtn: { padding: 10 },
  optionsBtnText: { fontSize: 24, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15 },
  modalBtns: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { backgroundColor: '#ef4444', padding: 10, borderRadius: 8, flex: 1, marginRight: 5, alignItems: 'center' },
  saveBtn: { backgroundColor: '#10b981', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default ViewWorkType;

