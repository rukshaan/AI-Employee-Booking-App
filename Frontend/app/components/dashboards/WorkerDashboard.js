import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLogin } from '../../context/LoginProvider';
import Client from '../../api/Client';

const WorkerDashboard = () => {
    const { profile, isDarkMode } = useLogin();
    const navigation = useNavigation();
    const [status, setStatus] = useState(profile?.status || 'Available');
    const [futureWorks, setFutureWorks] = useState([]);
    const [recentWorks, setRecentWorks] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadBookings();
        }, [])
    );

    const loadBookings = async () => {
        try {
            const res = await Client.get(`/bookings/employee/${profile.id}`);
            const allBookings = res.data;
            const now = new Date();
            
            const future = allBookings.filter(b => new Date(b.bookingDate) >= now || b.status === 'Pending' || b.status === 'Approved');
            const recent = allBookings.filter(b => new Date(b.bookingDate) < now && (b.status === 'Finished' || b.status === 'Completed'));
            
            // Auto calculate status
            const hasActiveProcessingJob = allBookings.some(b => {
                if (b.status !== 'Processing') return false;
                
                // Detailed check based on time if needed, but if it's 'Processing' it means they started it
                return true;
            });
            
            const newStatus = hasActiveProcessingJob ? 'Busy' : 'Available';
            if (status !== newStatus) {
                setStatus(newStatus);
                Client.put(`/employees/${profile.id}/status`, { status: newStatus });
            }

            setFutureWorks(future);
            setRecentWorks(recent);
        } catch (err) {
            console.error('Error fetching bookings', err);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await Client.put(`/bookings/${id}/status`, { status: newStatus });
            loadBookings();
        } catch (error) {
            console.error('Error updating booking status', error);
        }
    };

    return (
        <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.header}>
                <Text style={[styles.greeting, isDarkMode && styles.darkText]}>Welcome, {profile?.name}</Text>
                <Text style={[styles.subtitle, isDarkMode && styles.darkMuted]}>Manage your availability and incoming requests</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
                    <Text style={[styles.statLabel, isDarkMode && styles.darkMuted]}>Total Jobs</Text>
                    <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{futureWorks.length + recentWorks.length}</Text>
                </View>
                <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
                    <Text style={[styles.statLabel, isDarkMode && styles.darkMuted]}>Completed</Text>
                    <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{recentWorks.length}</Text>
                </View>
                <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
                    <Text style={[styles.statLabel, isDarkMode && styles.darkMuted]}>Rating</Text>
                    <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{profile?.averageRating || 'New'}</Text>
                </View>
            </View>

            <View style={[styles.statusCard, isDarkMode && styles.darkCard]}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Automated Status</Text>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 28, fontWeight: '800', color: status === 'Busy' ? '#ef4444' : '#000000' }}>
                        {status === 'Busy' ? '🔴 BUSY (On Job)' : '🟢 AVAILABLE'}
                    </Text>
                    <Text style={{ color: '#888', marginTop: 5 }}>Your status is automatically determined by your active Processing jobs.</Text>
                </View>
            </View>

            <View style={[styles.requestsCard, isDarkMode && styles.darkCard]}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Processing & Future Works</Text>
                {futureWorks.length === 0 ? (
                    <Text style={[styles.emptyText, isDarkMode && styles.darkMuted]}>No future works at the moment.</Text>
                ) : (
                    futureWorks.map(item => (
                        <View key={item.id} style={[styles.workCard, isDarkMode && styles.darkBorder]}>
                            <Text style={[styles.workTitle, isDarkMode && styles.darkText]}>{item.title}</Text>
                            <Text style={isDarkMode ? styles.darkMuted : null}>Date: {new Date(item.bookingDate).toDateString()}</Text>
                            <Text style={isDarkMode ? styles.darkMuted : null}>Time: {item.bookingTime || 'N/A'} - {item.endTime || 'N/A'}</Text>
                            <Text style={isDarkMode ? styles.darkMuted : null}>Status: {item.status}</Text>
                            {item.status === 'Pending' && (
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#000000', padding: 10, borderRadius: 8, flex: 1, marginRight: 5, alignItems: 'center' }} onPress={() => updateStatus(item.id, 'Approved')}>
                                        <Text style={{ color: '#fff', fontWeight: '700' }}>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: '#ef4444', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5, alignItems: 'center' }} onPress={() => updateStatus(item.id, 'Rejected')}>
                                        <Text style={{ color: '#fff', fontWeight: '700' }}>Reject</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {item.status === 'Approved' && (
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#000000', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' }} onPress={() => updateStatus(item.id, 'Processing')}>
                                        <Text style={{ color: '#fff', fontWeight: '700' }}>Start Job</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {(item.status === 'Approved' || item.status === 'Processing') && (
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' }} onPress={() => navigation.navigate('ChatRoom', { bookingId: item.id, title: `Chat with Customer` })}>
                                        <Text style={{ color: '#fff', fontWeight: '700' }}>💬 Chat with Customer</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </View>

            <View style={[styles.requestsCard, isDarkMode && styles.darkCard]}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Recent Works</Text>
                {recentWorks.length === 0 ? (
                    <Text style={[styles.emptyText, isDarkMode && styles.darkMuted]}>No recent works at the moment.</Text>
                ) : (
                    recentWorks.map(item => (
                        <View key={item.id} style={[styles.workCard, isDarkMode && styles.darkBorder]}>
                            <Text style={[styles.workTitle, isDarkMode && styles.darkText]}>{item.title}</Text>
                            <Text style={isDarkMode ? styles.darkMuted : null}>Date: {new Date(item.bookingDate).toDateString()}</Text>
                            <Text style={isDarkMode ? styles.darkMuted : null}>Status: {item.status}</Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 20, paddingTop: 40 },
    header: { marginBottom: 30 },
    greeting: { fontSize: 32, fontWeight: '800', color: '#000000', letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: '#555555', marginTop: 6, fontWeight: '500' },
    statusCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 24, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#f3f4f6', alignItems: 'center' },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#000000', marginBottom: 16, letterSpacing: -0.3 },
    requestsCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#f3f4f6' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, flex: 1, marginHorizontal: 4, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#f3f4f6' },
    statLabel: { fontSize: 12, color: '#64748b', marginBottom: 4, fontWeight: '600', textAlign: 'center' },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
    emptyText: { color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', marginTop: 10, fontSize: 15 },
    workCard: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', marginBottom: 5 },
    workTitle: { fontWeight: '700', fontSize: 18, color: '#000000', marginBottom: 4 },
    darkContainer: { backgroundColor: '#000000' },
    darkText: { color: '#ffffff' },
    darkMuted: { color: '#a1a1aa' },
    darkCard: { backgroundColor: '#18181b', shadowColor: '#000', elevation: 2, borderColor: '#27272a', borderWidth: 1 },
    darkBtn: { backgroundColor: '#27272a' },
    darkBorder: { borderBottomColor: '#27272a' }
});

export default WorkerDashboard;
