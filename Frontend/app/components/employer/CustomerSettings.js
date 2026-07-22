import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Client from '../../api/Client';
import { useLogin } from '../../context/LoginProvider';

const CustomerSettings = () => {
  const { profile } = useLogin();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    try {
      const res = await Client.put(`/employers/${profile.id}/password`, {
        oldPassword,
        newPassword
      });
      if (res.data.success) {
        Alert.alert('Success', 'Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', res.data.message || 'Failed to update password.');
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Could not update password.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <Text style={styles.detailText}>Email: {profile.email}</Text>
        <Text style={styles.detailText}>Name: {profile.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Old Password" 
          secureTextEntry 
          value={oldPassword} 
          onChangeText={setOldPassword} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="New Password" 
          secureTextEntry 
          value={newPassword} 
          onChangeText={setNewPassword} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Confirm New Password" 
          secureTextEntry 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
  section: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginBottom: 15 },
  detailText: { fontSize: 16, color: '#475569', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#0ea5e9', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default CustomerSettings;
