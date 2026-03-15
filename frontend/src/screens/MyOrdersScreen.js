import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useOrderStore from '../store/orderStore';

const STATUS_COLORS = {
    Processing: '#F7971E', Confirmed: '#6C63FF', Shipped: '#43E97B',
    'Out for Delivery': '#43E97B', Delivered: '#43E97B', Cancelled: '#FF6584',
};

const STATUS_ICONS = {
    Processing: '⏳', Confirmed: '✅', Shipped: '🚚',
    'Out for Delivery': '🏃', Delivered: '📦', Cancelled: '❌',
};

export default function MyOrdersScreen({ navigation }) {
    const { orders, loading, fetchMyOrders } = useOrderStore();

    useEffect(() => { fetchMyOrders(); }, []);

    if (loading) return (
        <SafeAreaView style={styles.center}>
            <ActivityIndicator color="#6C63FF" size="large" />
            <Text style={styles.loadingText}>Loading orders...</Text>
        </SafeAreaView>
    );

    const renderOrder = ({ item }) => (
        <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate('OrderDetail', { id: item._id })}>
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderId}>#{item._id.slice(-8).toUpperCase()}</Text>
                    <Text style={styles.orderDate}>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[item.status] || '#666') + '22' }]}>
                    <Text style={styles.statusIcon}>{STATUS_ICONS[item.status] || '•'}</Text>
                    <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || '#666' }]}>{item.status}</Text>
                </View>
            </View>
            <View style={styles.orderMeta}>
                <Text style={styles.itemCount}>🛍️ {item.orderItems.length} item{item.orderItems.length > 1 ? 's' : ''}</Text>
                <Text style={styles.payMethod}>💳 {item.paymentMethod}</Text>
            </View>
            <View style={styles.orderFooter}>
                <Text style={styles.total}>₹{item.totalPrice.toLocaleString()}</Text>
                <Text style={styles.viewBtn}>View Details →</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                <Text style={styles.orderCount}>{orders.length}</Text>
            </View>
            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(i) => i._id}
                contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={{ fontSize: 64, marginBottom: 16 }}>📦</Text>
                        <Text style={styles.emptyTitle}>No Orders Yet</Text>
                        <Text style={styles.emptyText}>Your orders will appear here</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    loadingText: { color: '#6B7280', marginTop: 12, fontWeight: '700' },
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
    headerTitle: { color: '#111827', fontSize: 22, fontWeight: '900', flex: 1 },
    orderCount: { backgroundColor: '#E11D48', color: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, fontWeight: '900', fontSize: 12, overflow: 'hidden' },
    orderCard: { 
        backgroundColor: '#FFFFFF', 
        borderRadius: 24, 
        padding: 20, 
        marginBottom: 15, 
        borderWidth: 1.5, 
        borderColor: '#F3F4F6',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10
    },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    orderId: { color: '#111827', fontWeight: '900', fontSize: 16 },
    orderDate: { color: '#6B7280', fontSize: 12, marginTop: 4, fontWeight: '600' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
    statusIcon: { fontSize: 13 },
    statusText: { fontSize: 12, fontWeight: '900' },
    orderMeta: { flexDirection: 'row', gap: 20, marginBottom: 16 },
    itemCount: { color: '#4B5563', fontSize: 13, fontWeight: '700' },
    payMethod: { color: '#4B5563', fontSize: 13, fontWeight: '700' },
    orderFooter: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderTopWidth: 1.5, 
        borderColor: '#F3F4F6', 
        paddingTop: 16 
    },
    total: { color: '#E11D48', fontWeight: '900', fontSize: 20 },
    viewBtn: { color: '#111827', fontSize: 13, fontWeight: '800' },
    empty: { alignItems: 'center', paddingTop: 100 },
    emptyTitle: { color: '#111827', fontSize: 22, fontWeight: '900', marginBottom: 10 },
    emptyText: { color: '#6B7280', fontWeight: '600' },
});
