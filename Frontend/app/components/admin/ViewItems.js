import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Client from '../../api/Client';

const ViewItems = () => {
  const [items, setItems] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    try {
      const res = await Client.get('/items');
      setItems(res.data);
    } catch (err) {
      Alert.alert('Error', 'Could not load items');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => deleteItem(id), style: "destructive" }
    ]);
  };

  const deleteItem = async (id) => {
    try {
      await Client.delete(`/items/${id}`);
      Alert.alert("Success", "Item deleted successfully");
      loadItems();
    } catch (err) {
      Alert.alert("Error", "Could not delete item");
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
      await Client.put(`/items/${selectedItem.id}`, { name: editName, price: parseFloat(editPrice) });
      Alert.alert("Success", "Item updated successfully");
      setIsEditModalVisible(false);
      loadItems();
    } catch (err) {
      Alert.alert("Error", "Could not update item");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>View Items</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddItems')}>
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? (
              <Image source={{ uri: `http://localhost:8080${item.image}` }} style={styles.itemImage} />
            ) : (
              <View style={[styles.itemImage, { backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#9ca3af' }}>No Image</Text>
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.roleText}>Role: {item.worktype?.name || 'General'}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>Price: LKR {Number(item.price).toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleOptions(item)} style={styles.optionsBtn}>
              <Text style={styles.optionsBtnText}>⋮</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ fontStyle: 'italic', color: '#888' }}>No items found.</Text>}
      />

      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Item</Text>
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
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
  addButton: { backgroundColor: '#4f46e5', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, shadowColor: '#4f46e5', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { padding: 15, backgroundColor: '#ffffff', borderWidth: 0, borderRadius: 16, marginBottom: 15, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  itemImage: { width: 70, height: 70, borderRadius: 12 },
  name: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  description: { color: '#64748b', marginVertical: 5, fontSize: 14 },
  roleText: { color: '#475569', fontSize: 13, fontWeight: '500' },
  price: { fontWeight: '700', color: '#10b981', fontSize: 16, marginTop: 4 },
  optionsBtn: { padding: 10 },
  optionsBtnText: { fontSize: 24, fontWeight: 'bold', color: '#94a3b8' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20, color: '#1e293b', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 15, fontSize: 16, color: '#1e293b' },
  modalBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { backgroundColor: '#ef4444', padding: 14, borderRadius: 12, flex: 1, marginRight: 8, alignItems: 'center' },
  saveBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 12, flex: 1, marginLeft: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ViewItems;

