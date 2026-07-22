import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import Client from '../../api/Client';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ workers: 0, customers: 0, orders: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [compRes, statRes] = await Promise.all([
                    Client.get('/complaints'),
                    Client.get('/analytics/dashboard')
                ]);
                if (compRes.data) setComplaints(compRes.data);
                if (statRes.data && statRes.data.success) setStats(statRes.data.stats);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    const renderComplaint = ({ item }) => (
        <View style={styles.complaintCard}>
            <View style={styles.complaintHeader}>
                <Text style={styles.complaintType}>{item.userType}</Text>
                <View style={[styles.statusBadge, item.status === 'Pending' ? styles.badgePending : styles.badgeResolved]}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                </View>
            </View>
            <Text style={styles.complaintEmail}>{item.userEmail}</Text>
            <Text style={styles.complaintMessage}>{item.message}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Admin Dashboard</Text>
                <Text style={styles.subtitle}>System Overview & Dispute Resolution</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total Workers</Text>
                    <Text style={styles.statValue}>{stats.workers}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total Customers</Text>
                    <Text style={styles.statValue}>{stats.customers}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total Orders</Text>
                    <Text style={styles.statValue}>{stats.orders}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Complaint Inbox</Text>
            {complaints.length === 0 ? (
                <Text style={styles.emptyText}>No complaints found.</Text>
            ) : (
                <FlatList
                    data={complaints}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderComplaint}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
    header: { marginBottom: 24 },
    greeting: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
    subtitle: { fontSize: 16, color: '#64748b', marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#334155', marginBottom: 16 },
    emptyText: { color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
    complaintCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#ef4444', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    complaintHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    complaintType: { fontSize: 14, fontWeight: 'bold', color: '#ef4444' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgePending: { backgroundColor: '#fef3c7' },
    badgeResolved: { backgroundColor: '#d1fae5' },
    badgeText: { fontSize: 12, fontWeight: '600' },
    complaintEmail: { fontSize: 12, color: '#64748b', marginBottom: 8 },
    complaintMessage: { fontSize: 15, color: '#334155' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, flex: 1, marginHorizontal: 4, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    statLabel: { fontSize: 12, color: '#64748b', marginBottom: 4, fontWeight: '600', textAlign: 'center' },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' }
});

export default AdminDashboard;
