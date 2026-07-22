import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView, Platform } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Client from "../../api/Client";
import { useLogin } from "../../context/LoginProvider";

const Employment = () => {
  const { profile } = useLogin();
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [workerTimelines, setWorkerTimelines] = useState({});
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [bookingTitle, setBookingTitle] = useState("");
  const [bookingDescription, setBookingDescription] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  
  const [bookingDateStr, setBookingDateStr] = useState(null);
  const [endDateStr, setEndDateStr] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [bookingEndTime, setBookingEndTime] = useState(null);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

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
    if (selectedEmployees.length === 0 || !selectedWorkType || !bookingTitle || !bookingDateStr || !endDateStr || !bookingTime || !bookingEndTime) {
      Alert.alert("Error", "Please fill all required fields and select at least one worker.");
      return;
    }

    try {
      let finalPrice = selectedWorkType.price;
      let isOffer = false;
      let offerDetails = null;
      
      if (offerPrice && !isNaN(offerPrice)) {
          finalPrice = parseFloat(offerPrice);
          isOffer = true;
          offerDetails = "Custom multi-skill package offer.";
      }

      for (const emp of selectedEmployees) {
        await Client.post("/bookings", {
          employeeId: emp.id,
          employerId: profile.id,
          workTypeId: selectedWorkType.id,
          title: bookingTitle,
          description: bookingDescription,
          bookingDate: bookingDateStr,
          endDate: endDateStr,
          bookingTime: bookingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          endTime: bookingEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: finalPrice,
          isOffer: isOffer,
          offerDetails: offerDetails
        });
      }
      
      Alert.alert("Success", "Booking(s) created successfully");
      setSelectedEmployees([]);
      setSelectedWorkType(null);
      setBookingTitle("");
      setBookingDescription("");
      setOfferPrice("");
      setBookingDateStr(null);
      setEndDateStr(null);
      setBookingTime(null);
      setBookingEndTime(null);
      navigation.navigate('My Bookings');
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || err.message || "Could not create booking");
    }
  };

  const toggleEmployee = async (emp) => {
    setSelectedEmployees(prev => {
      const exists = prev.find(e => e.id === emp.id);
      if (exists) return prev.filter(e => e.id !== emp.id);
      return [...prev, emp];
    });

    if (!workerTimelines[emp.id]) {
      try {
        const res = await Client.get(`/bookings/employee/${emp.id}`);
        const busy = res.data.filter(b => b.status === 'Processing' || b.status === 'Approved');
        setWorkerTimelines(prev => ({ ...prev, [emp.id]: busy }));
      } catch (err) {
        console.error('Error fetching worker timeline', err);
      }
    }
  };

  // Filter employees based on selected work type
  const availableWorkers = selectedWorkType 
    ? employees.filter(emp => emp.workType && emp.workType.split(',').includes(selectedWorkType.name))
    : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Create Booking Request</Text>

      <Text style={styles.subtitle}>1. Select Work Type:</Text>
      <FlatList
        horizontal
        data={workTypes}
        keyExtractor={(item) => item.id.toString()}
        style={styles.horizontalList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.workTypeCard, selectedWorkType?.id === item.id && styles.selectedCard]}
            onPress={() => {
              setSelectedWorkType(item);
              setSelectedEmployees([]); // Reset employees when work type changes
              setWorkerTimelines({});
            }}
          >
            <Text style={styles.workTypeName}>{item.name}</Text>
            <Text>Price: LKR {Number(item.price).toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedWorkType && (
        <>
          <Text style={styles.subtitle}>2. Select Employer(s): (Multi-Select)</Text>
          {availableWorkers.length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic', marginBottom: 12 }}>
              No workers available for this work type.
            </Text>
          ) : (
            <FlatList
              horizontal
              data={availableWorkers}
              keyExtractor={(item) => item.id.toString()}
              style={styles.horizontalList}
              renderItem={({ item }) => {
                const isSelected = selectedEmployees.some(e => e.id === item.id);
                const timeline = workerTimelines[item.id] || [];
                return (
                <TouchableOpacity
                  style={[styles.employeeCard, isSelected && styles.selectedCard]}
                  onPress={() => toggleEmployee(item)}
                >
                  <Text style={styles.employeeName}>{item.name}</Text>
                  <Text>Contact: {item.contactNo}</Text>
                  <Text style={{ 
                    marginTop: 4, 
                    fontWeight: 'bold', 
                    color: item.status === 'Available' ? '#10b981' : item.status === 'Busy' ? '#ef4444' : '#64748b' 
                  }}>
                    {item.status || 'Offline'}
                  </Text>
                  {isSelected && timeline.length > 0 && (
                    <View style={{ marginTop: 8, padding: 6, backgroundColor: '#f1f5f9', borderRadius: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Busy Times:</Text>
                      {timeline.map(b => (
                        <Text key={b.id} style={{ fontSize: 11, color: '#475569' }}>
                          {new Date(b.bookingDate).toLocaleDateString()} {b.bookingTime}-{b.endTime}
                        </Text>
                      ))}
                    </View>
                  )}
                  {isSelected && timeline.length === 0 && (
                    <View style={{ marginTop: 8, padding: 6, backgroundColor: '#f1f5f9', borderRadius: 4 }}>
                      <Text style={{ fontSize: 12, color: '#10b981', fontWeight: 'bold' }}>Schedule Empty</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}}
            />
          )}
        </>
      )}

      <TextInput style={styles.input} placeholder="Booking Title" value={bookingTitle} onChangeText={setBookingTitle} />
      <TextInput style={[styles.input, styles.multilineInput]} placeholder="Description" value={bookingDescription} onChangeText={setBookingDescription} multiline />
      
      <Text style={styles.subtitle}>3. Custom Multi-Skill Offer (Optional):</Text>
      <TextInput style={styles.input} placeholder="Propose Custom Price (LKR)" keyboardType="numeric" value={offerPrice} onChangeText={setOfferPrice} />
      
      <Text style={styles.subtitle}>4. Schedule:</Text>
      
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: bookingDateStr ? '#000' : '#888' }}>
          {bookingDateStr ? bookingDateStr.toDateString() : "Select Start Date"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={bookingDateStr || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setBookingDateStr(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowEndDatePicker(true)}>
        <Text style={{ color: endDateStr ? '#000' : '#888' }}>
          {endDateStr ? endDateStr.toDateString() : "Select End Date"}
        </Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDateStr || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDateStr(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowStartTimePicker(true)}>
        <Text style={{ color: bookingTime ? '#000' : '#888' }}>
          {bookingTime ? bookingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select Start Time"}
        </Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={bookingTime || new Date()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) setBookingTime(selectedTime);
          }}
        />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowEndTimePicker(true)}>
        <Text style={{ color: bookingEndTime ? '#000' : '#888' }}>
          {bookingEndTime ? bookingEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select End Time"}
        </Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={bookingEndTime || new Date()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) setBookingEndTime(selectedTime);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={createBooking}>
        <Text style={styles.buttonText}>Send Booking Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 30, backgroundColor: "#ffffff" },
  title: { fontSize: 32, fontWeight: "800", color: "#000000", marginBottom: 20, letterSpacing: -0.5 },
  subtitle: { fontSize: 20, fontWeight: "700", color: "#000000", marginVertical: 12, letterSpacing: -0.3 },
  horizontalList: { marginBottom: 20 },
  employeeCard: { padding: 16, borderWidth: 1, borderColor: "#f3f4f6", borderRadius: 12, marginRight: 12, minWidth: 160, backgroundColor: "#ffffff", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  workTypeCard: { padding: 16, borderWidth: 1, borderColor: "#f3f4f6", borderRadius: 12, marginRight: 12, minWidth: 160, backgroundColor: "#ffffff", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  selectedCard: { borderColor: "#000000", backgroundColor: "#f9fafb", borderWidth: 2 },
  employeeName: { fontWeight: "700", fontSize: 18, color: "#000000", marginBottom: 4 },
  workTypeName: { fontWeight: "700", fontSize: 18, color: "#000000", marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#f9fafb", borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, color: "#000000" },
  multilineInput: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: "#000000", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 10, marginBottom: 40, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  buttonText: { color: "#ffffff", fontWeight: "700", fontSize: 18 }
});

export default Employment;

