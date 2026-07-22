import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Client from '../../api/Client';
import { useLogin } from '../../context/LoginProvider';

const EmployeeComplain = () => {
  const { profile } = useLogin();
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

  const loadBookings = async () => {
    try {
      const res = await Client.get(`/bookings/employer/${profile.id}`);
      // Filter for completed or at least existing bookings that are past Pending
      const validStatuses = ['Approved', 'Processing', 'Finished', 'Completed'];
      const allowedBookings = res.data.filter(b => validStatuses.includes(b.status));
      setBookings(allowedBookings);
    } catch (err) {
      console.log('Error fetching bookings', err);
    }
  };

  const submitComplaint = async () => {
    if (!selectedBooking) {
      Alert.alert('Error', 'Please select a booking to complain about.');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your complaint message.');
      return;
    }

    try {
      await Client.post('/complaints', {
        userType: 'Customer',
        userEmail: profile.email,
        message: message,
        employeeId: selectedBooking.employeeId,
        bookingId: selectedBooking.id
      });
      Alert.alert('Success', 'Complaint submitted successfully. An Admin will review it.');
      setSelectedBooking(null);
      setMessage('');
      navigation.navigate('Dashboard');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit complaint.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Submit a Complaint</Text>
      
      <Text style={styles.subtitle}>Select a recent booking:</Text>
      <FlatList
        horizontal
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        style={{ flexGrow: 0, marginBottom: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.bookingCard, selectedBooking?.id === item.id && styles.selectedCard]}
            onPress={() => setSelectedBooking(item)}
          >
            <Text style={styles.bookingTitle}>{item.title}</Text>
            <Text style={styles.workerName}>Worker: {item.employee?.name || 'Unknown'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ fontStyle: 'italic', color: '#888' }}>No approved or finished bookings found.</Text>}
      />

      <TextInput
        style={styles.input}
        placeholder="Please describe your issue..."
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={6}
      />

      <TouchableOpacity style={styles.button} onPress={submitComplaint}>
        <Text style={styles.buttonText}>Submit Complaint</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#1e293b' },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#475569' },
  bookingCard: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 10, minWidth: 150 },
  selectedCard: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  bookingTitle: { fontWeight: 'bold', fontSize: 16, color: '#334155' },
  workerName: { fontSize: 14, color: '#64748b' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 20, height: 120, textAlignVertical: 'top' },
  button: { backgroundColor: '#ef4444', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default EmployeeComplain;

