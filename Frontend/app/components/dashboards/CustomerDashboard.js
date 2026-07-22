import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLogin } from '../../context/LoginProvider';
import Client from '../../api/Client';

const CustomerDashboard = () => {
    const { profile, isDarkMode } = useLogin();
    const navigation = useNavigation();
    const [workers, setWorkers] = useState([]);
    const [stats, setStats] = useState({ workers: 0, customers: 0, orders: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Client.get('/employees');
                if (res.data) setWorkers(res.data);
                
                const statRes = await Client.get('/analytics/dashboard');
                if (statRes.data && statRes.data.success) {
                    setStats(statRes.data.stats);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    const renderWorker = ({ item }) => (
        <View style={[styles.workerCard, isDarkMode && styles.darkCard]}>
            <View style={styles.workerInfo}>
                <Text style={[styles.workerName, isDarkMode && styles.darkText]}>{item.name}</Text>
                <Text style={styles.workerType}>{item.workType}</Text>
                <View style={styles.stats}>
                    <Text style={[styles.statText, isDarkMode && styles.darkMuted]}>⭐ {item.averageRating?.toFixed(1) || 'New'}</Text>
                    <Text style={[styles.statText, isDarkMode && styles.darkMuted]}>🎉 {item.congratulationsCount || 0}</Text>
                </View>
            </View>
            <View style={styles.workerStatus}>
                <View style={[styles.statusIndicator, item.status === 'Available' ? styles.statusGreen : item.status === 'Busy' ? styles.statusRed : styles.statusGray]} />
                <Text style={[styles.statusText, isDarkMode && styles.darkMuted]}>{item.status}</Text>
            </View>
        </View>
    );

    const renderHeader = () => (
        <>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, isDarkMode && styles.darkText]}>Hello, {profile?.name} 👋</Text>
                    <Text style={[styles.subtitle, isDarkMode && styles.darkMuted]}>Find your perfect service</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={[styles.iconBtn, isDarkMode && styles.darkBtn]} onPress={() => navigation.navigate('Settings')}>
                        <Text style={styles.iconText}>⚙️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={[styles.statBox, { backgroundColor: '#6366f1' }]}>
                    <Text style={styles.statBoxNum}>{stats.workers}</Text>
                    <Text style={styles.statBoxLabel}>Active Workers</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#10b981' }]}>
                    <Text style={styles.statBoxNum}>{stats.customers}</Text>
                    <Text style={styles.statBoxLabel}>Happy Customers</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#f43f5e' }]}>
                    <Text style={styles.statBoxNum}>{stats.orders}</Text>
                    <Text style={styles.statBoxLabel}>Recent Bookings</Text>
                </View>
            </View>

            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Top Rated Workers</Text>
        </>
    );

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <FlatList
                data={workers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderWorker}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 20, paddingTop: 40 },
    header: { marginBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    greeting: { fontSize: 32, fontWeight: '800', color: '#000000', letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: '#555555', marginTop: 6, fontWeight: '500' },
    headerIcons: { flexDirection: 'row' },
    iconBtn: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 25, marginLeft: 10 },
    iconText: { fontSize: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#000000', marginBottom: 20, letterSpacing: -0.3 },
    workerCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#f3f4f6' },
    workerName: { fontSize: 18, fontWeight: '700', color: '#000000', marginBottom: 4 },
    workerType: { fontSize: 15, color: '#555555', marginBottom: 12, fontWeight: '500' },
    stats: { flexDirection: 'row', gap: 15 },
    statText: { fontSize: 14, color: '#333333', marginRight: 15, fontWeight: '600' },
    workerStatus: { alignItems: 'center', backgroundColor: '#f9fafb', padding: 10, borderRadius: 12 },
    statusIndicator: { width: 10, height: 10, borderRadius: 5, marginBottom: 6 },
    statusGreen: { backgroundColor: '#000000' }, // Uber style - black for available
    statusRed: { backgroundColor: '#ef4444' },
    statusText: { fontSize: 12, color: '#555555', fontWeight: '600' },
    statusGray: { backgroundColor: '#9ca3af' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    statBox: { flex: 1, padding: 15, borderRadius: 16, marginHorizontal: 5, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
    statBoxNum: { fontSize: 24, fontWeight: '800', color: '#fff' },
    statBoxLabel: { fontSize: 12, color: '#e0e7ff', marginTop: 4, fontWeight: '600', textAlign: 'center' },
    darkContainer: { backgroundColor: '#0f172a' },
    darkText: { color: '#ffffff' },
    darkMuted: { color: '#a1a1aa' },
    darkCard: { backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1 },
    darkBtn: { backgroundColor: '#334155' }
});

export default CustomerDashboard;
