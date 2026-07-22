import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Client from '../../api/Client';

const AddItems = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [image, setImage] = useState('');
  const [workTypes, setWorkTypes] = useState([]);
  const [selectedWorkType, setSelectedWorkType] = useState(null);

  useEffect(() => {
    loadWorkTypes();
  }, []);

  const loadWorkTypes = async () => {
    try {
      const res = await Client.get('/worktypes');
      setWorkTypes(res.data);
    } catch (err) {
      console.log('Error fetching work types', err);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      // The backend saveBase64Image utility expects the base64 string
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const save = async () => {
    if (!name || !price || !selectedWorkType) {
      Alert.alert('Error', 'Please enter a name, price, and select a role.');
      return;
    }

    try {
      await Client.post('/items', { 
        name, 
        description, 
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        image,
        workTypeId: selectedWorkType.id 
      });
      Alert.alert('Success', 'Item added successfully');
      setName('');
      setDescription('');
      setPrice('');
      setDiscountPrice('');
      setImage('');
      setSelectedWorkType(null);
      if(navigation) navigation.navigate('ViewItems');
    } catch (err) {
      Alert.alert('Error', 'Could not add item');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Add Item</Text>
      <TextInput placeholder="Item Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Regular Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Discount Price (Optional)" value={discountPrice} onChangeText={setDiscountPrice} keyboardType="numeric" style={styles.input} />
      
      <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
        <Text style={styles.imagePickerText}>{image ? 'Change Image' : 'Select Image'}</Text>
      </TouchableOpacity>
      {image ? <Text style={styles.imageSuccessText}>Image Selected ✓</Text> : null}
      
      <Text style={styles.subtitle}>Select Database Role (Work Type):</Text>
      <FlatList
        horizontal
        data={workTypes}
        keyExtractor={(item) => item.id.toString()}
        style={{ flexGrow: 0, marginBottom: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.roleCard, selectedWorkType?.id === item.id && styles.selectedRoleCard]}
            onPress={() => setSelectedWorkType(item)}
          >
            <Text style={[styles.roleName, selectedWorkType?.id === item.id && styles.selectedRoleText]}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#475569' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  roleCard: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 10, backgroundColor: '#f8fafc' },
  selectedRoleCard: { borderColor: '#007bff', backgroundColor: '#eff6ff' },
  roleName: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  selectedRoleText: { color: '#007bff', fontWeight: 'bold' },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  imagePickerBtn: { backgroundColor: '#e2e8f0', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 5 },
  imagePickerText: { color: '#475569', fontWeight: 'bold' },
  imageSuccessText: { color: '#10b981', fontSize: 12, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }
});

export default AddItems;

