import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    FlatList, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '../api/axiosInstance';
import useOrderStore from '../store/orderStore';

const STATUS_FLOW = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

const STATUS_COLORS = {
    Processing: '#F7971E', Confirmed: '#6C63FF', Shipped: '#43E97B',
    'Out for Delivery': '#43E97B', Delivered: '#43E97B', Cancelled: '#FF6584',
};

export default function AdminDashboardScreen({ navigation }) {
    const [stats, setStats] = useState(null);
    const [tab, setTab] = useState('orders');
    const [loadingStats, setLoadingStats] = useState(true);
    const { orders, fetchAllOrders, updateOrderStatus, loading } = useOrderStore();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axiosInstance.get('/admin/stats');
                setStats(data.stats);
            } catch { }
            setLoadingStats(false);
        })();
        fetchAllOrders();
    }, []);

    const advanceStatus = async (order) => {
        const currIdx = STATUS_FLOW.indexOf(order.status);
        if (currIdx === -1 || currIdx >= STATUS_FLOW.length - 1) return;
        const next = STATUS_FLOW[currIdx + 1];
        Alert.alert('Update Status', `Change to "${next}"?`, [
            { text: 'Cancel' },
            { text: 'Update', onPress: async () => { await updateOrderStatus(order._id, next); fetchAllOrders(); } },
        ]);
    };

    const STAT_CARDS = [
        { icon: '💰', label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, color: '#43E97B' },
        { icon: '📦', label: 'Orders', value: stats?.totalOrders || 0, color: '#6C63FF' },
        { icon: '👥', label: 'Users', value: stats?.totalUsers || 0, color: '#F7971E' },
        { icon: '🏷️', label: 'Products', value: stats?.totalProducts || 0, color: '#FF6584' },
    ];

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    <Text style={styles.headerSub}>Manage your store</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Stats */}
                {loadingStats ? (
                    <ActivityIndicator color="#6C63FF" style={{ marginVertical: 32 }} />
                ) : (
                    <View style={styles.statsGrid}>
                        {STAT_CARDS.map((s) => (
                            <View key={s.label} style={[styles.statCard, { borderTopColor: s.color }]}>
                                <Text style={styles.statIcon}>{s.icon}</Text>
                                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                                <Text style={styles.statLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Tabs */}
                <View style={styles.tabs}>
                    {['orders', 'products'].map((t) => (
                        <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
                            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                                {t === 'orders' ? '📋 Orders' : '📦 Products'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {tab === 'orders' && (
                    loading ? <ActivityIndicator color="#6C63FF" style={{ marginTop: 32 }} /> :
                        <FlatList
                            data={orders}
                            scrollEnabled={false}
                            keyExtractor={(i) => i._id}
                            contentContainerStyle={{ padding: 16 }}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Text style={{ fontSize: 40, marginBottom: 10 }}>📋</Text>
                                    <Text style={styles.emptyText}>No orders yet</Text>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <View style={styles.orderCard}>
                                    <View style={styles.orderRow}>
                                        <Text style={styles.orderId}>#{item._id.slice(-8).toUpperCase()}</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[item.status] || '#666') + '22' }]}>
                                            <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || '#666' }]}>{item.status}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.orderUser}>👤 {item.user?.name || 'Unknown'}</Text>
                                    <Text style={styles.orderTotal}>₹{item.totalPrice.toLocaleString()} • {item.orderItems.length} items</Text>
                                    <View style={styles.orderFooter}>
                                        <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString('en-IN')}</Text>
                                        {item.status !== 'Delivered' && item.status !== 'Cancelled' && (
                                            <TouchableOpacity style={styles.advanceBtn} onPress={() => advanceStatus(item)}>
                                                <Text style={styles.advanceBtnText}>Advance →</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        />
                )}

                {tab === 'products' && (
                    <View style={styles.addBtnWrap}>
                        <Text style={{ fontSize: 48, marginBottom: 16 }}>🏷️</Text>
                        <Text style={styles.hintTitle}>Product Management</Text>
                        <Text style={styles.hintText}>Use the API or Postman to add and manage products.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFFFFF'
    },
    backBtn: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 10, marginRight: 15, borderWidth: 1, borderColor: '#F3F4F6' },
    backText: { color: '#111827', fontSize: 18, fontWeight: '900' },
    headerTitle: { color: '#111827', fontSize: 22, fontWeight: '900' },
    headerSub: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 15, gap: 12 },
    statCard: { 
        flex: 1, 
        minWidth: '45%', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 24, 
        padding: 20, 
        alignItems: 'center', 
        borderWidth: 1.5, 
        borderColor: '#F3F4F6', 
        borderTopWidth: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    statIcon: { fontSize: 32, marginBottom: 10 },
    statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
    statLabel: { color: '#6B7280', fontSize: 13, fontWeight: '800' },
    tabs: { 
        flexDirection: 'row', 
        marginHorizontal: 16, 
        marginBottom: 15, 
        backgroundColor: '#F3F4F6', 
        borderRadius: 20, 
        padding: 5, 
    },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 16 },
    tabActive: { backgroundColor: '#E11D48', elevation: 3 },
    tabText: { color: '#6B7280', fontWeight: '800', fontSize: 14 },
    tabTextActive: { color: '#FFFFFF' },
    orderCard: { 
        backgroundColor: '#FFFFFF', 
        borderRadius: 24, 
        padding: 20, 
        marginBottom: 12, 
        borderWidth: 1.5, 
        borderColor: '#F3F4F6',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8
    },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    orderId: { color: '#111827', fontWeight: '900', fontSize: 16 },
    statusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
    statusText: { fontSize: 11, fontWeight: '900' },
    orderUser: { color: '#4B5563', fontSize: 14, marginBottom: 6, fontWeight: '600' },
    orderTotal: { color: '#6B7280', fontSize: 14, marginBottom: 15, fontWeight: '700' },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 15 },
    orderDate: { color: '#9CA3AF', fontSize: 12, fontWeight: '700' },
    advanceBtn: { backgroundColor: '#E11D4815', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#E11D4833' },
    advanceBtnText: { color: '#E11D48', fontWeight: '900', fontSize: 13 },
    addBtnWrap: { padding: 60, alignItems: 'center' },
    hintTitle: { color: '#111827', fontWeight: '900', fontSize: 18, marginBottom: 10 },
    hintText: { color: '#6B7280', textAlign: 'center', fontSize: 15, lineHeight: 22, fontWeight: '500' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { color: '#6B7280', fontSize: 16, fontWeight: '700' },
});
