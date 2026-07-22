import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Modal, TextInput, Linking } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Client from "../../api/Client";
import { useLogin } from "../../context/LoginProvider";

const MyBookings = () => {
  const { profile } = useLogin();
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedBookingToPay, setSelectedBookingToPay] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

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

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating.");
      return;
    }
    try {
      await Client.put(`/bookings/${selectedBooking.id}/review`, { rating, reviewText });
      Alert.alert("Success", "Rating submitted successfully!");
      setRatingModalVisible(false);
      loadBookings();
    } catch (err) {
      Alert.alert("Error", "Could not submit rating");
    }
  };

  const submitPayment = async () => {
    try {
      const res = await Client.post(`/payment/checkout`, { 
        bookingId: selectedBookingToPay.id,
        amount: selectedBookingToPay.price
      });
      if (res.data.success && res.data.url) {
        Linking.openURL(res.data.url);
        setPaymentModalVisible(false);
      } else {
        Alert.alert("Error", "Could not start payment process.");
      }
    } catch (err) {
      Alert.alert("Error", "Payment failed. Please try again.");
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
          <View style={[styles.card, item.status === 'Rejected' ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : null]}>
            <Text style={styles.name}>{item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Date: {new Date(item.bookingDate).toDateString()}</Text>
            {item.bookingTime || item.endTime ? <Text>Time: {item.bookingTime || 'N/A'} - {item.endTime || 'N/A'}</Text> : null}
            <Text>Employee: {item.employee?.name || "N/A"}</Text>
            <Text>Work Type: {item.worktype?.name || "N/A"}</Text>
            <Text>Price: LKR {Number(item.price).toFixed(2)}</Text>
            <View style={{ marginTop: 8, padding: 6, borderRadius: 4, alignSelf: 'flex-start', backgroundColor: item.status === 'Rejected' || item.status === 'Cancelled' ? '#ef4444' : item.status === 'Pending' ? '#f59e0b' : '#10b981' }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Status: {item.status === 'Rejected' ? 'Failed' : item.status}
                </Text>
            </View>
            {item.status === 'Pending' && (
              <TouchableOpacity
                style={{ marginTop: 10, padding: 8, backgroundColor: '#ef4444', borderRadius: 6, alignSelf: 'flex-start' }}
                onPress={() => {
                  Alert.alert("Cancel", "Are you sure you want to cancel this booking?", [
                    { text: "No", style: "cancel" },
                    { text: "Yes, Cancel", onPress: () => updateStatus(item.id, 'Cancelled'), style: "destructive" }
                  ]);
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel Booking</Text>
              </TouchableOpacity>
            )}
            {item.status === 'Completed' && !item.isPaid && (
              <TouchableOpacity
                style={{ marginTop: 10, padding: 8, backgroundColor: '#3b82f6', borderRadius: 6, alignSelf: 'flex-start' }}
                onPress={() => {
                  setSelectedBookingToPay(item);
                  setPaymentModalVisible(true);
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>💳 Pay LKR {Number(item.price).toFixed(2)}</Text>
              </TouchableOpacity>
            )}
            {item.isPaid && (
              <View style={{ marginTop: 10, padding: 8, backgroundColor: '#dcfce7', borderRadius: 6, alignSelf: 'flex-start' }}>
                <Text style={{ color: '#166534', fontWeight: 'bold' }}>Paid ✅</Text>
              </View>
            )}
            {item.status === 'Completed' && !item.rating && (
              <TouchableOpacity 
                style={styles.rateButton} 
                onPress={() => {
                  setSelectedBooking(item);
                  setRating(0);
                  setReviewText("");
                  setRatingModalVisible(true);
                }}
              >
                <Text style={styles.rateButtonText}>⭐ Rate Employee</Text>
              </TouchableOpacity>
            )}
            {item.status !== 'Completed' && (
              <Text style={{ marginTop: 10, fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>
                ⭐ Rating will be available once the job is completed.
              </Text>
            )}
            {item.rating ? (
              <View style={styles.ratedContainer}>
                <Text style={styles.ratedText}>You rated: {item.rating} ⭐</Text>
              </View>
            ) : null}
            
            {item.status !== 'Cancelled' && item.status !== 'Rejected' && item.status !== 'Completed' && (
              <TouchableOpacity
                style={{ marginTop: 10, padding: 8, backgroundColor: '#000', borderRadius: 6, alignSelf: 'flex-start' }}
                onPress={() => navigation.navigate('ChatRoom', { bookingId: item.id, title: `Chat with ${item.employee?.name || 'Worker'}` })}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>💬 Chat</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      
      <Modal
        visible={ratingModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate Employee</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={[styles.star, star <= rating ? styles.starSelected : null]}>⭐</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write a review (optional)"
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setRatingModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.submitBtn]} onPress={submitRating}>
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Secure Payment</Text>
            <Text style={{ marginBottom: 15, textAlign: 'center', fontSize: 16 }}>
              Total: LKR {selectedBookingToPay ? Number(selectedBookingToPay.price).toFixed(2) : "0.00"}
            </Text>
            
            <Text style={{ marginBottom: 20, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
              You will be redirected to Stripe to complete this payment securely.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setPaymentModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#3b82f6' }]} onPress={submitPayment}>
                <Text style={styles.btnText}>Confirm Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 20, color: '#1e293b' },
  card: { padding: 20, backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  name: { fontWeight: "800", fontSize: 18, color: '#1e293b', marginBottom: 5 },
  row: { flexDirection: "row", marginTop: 8 },
  accept: { backgroundColor: "green", padding: 8, borderRadius: 6, marginRight: 8 },
  reject: { backgroundColor: "red", padding: 8, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  rateButton: { marginTop: 12, backgroundColor: '#4f46e5', padding: 10, borderRadius: 8, alignSelf: 'flex-start', shadowColor: '#4f46e5', shadowOpacity: 0.3, shadowRadius: 5, elevation: 2 },
  rateButtonText: { color: '#ffffff', fontWeight: 'bold' },
  ratedContainer: { marginTop: 12, padding: 8, backgroundColor: '#ecfdf5', borderRadius: 8, alignSelf: 'flex-start' },
  ratedText: { color: '#059669', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: 20 },
  modalContent: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#1e293b' },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  star: { fontSize: 36, color: '#cbd5e1', marginHorizontal: 5 },
  starSelected: { color: '#fbbf24' },
  reviewInput: { borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, height: 100, textAlignVertical: 'top', marginBottom: 20, fontSize: 16, color: '#1e293b' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 15, fontSize: 16, color: '#1e293b' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', marginHorizontal: 6 },
  cancelBtn: { backgroundColor: '#ef4444' },
  submitBtn: { backgroundColor: '#10b981' },
});

export default MyBookings;