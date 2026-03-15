import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useOrderStore from '../store/orderStore';

const STATUS_COLORS = {
    Processing: '#F7971E', Confirmed: '#6C63FF', Shipped: '#43E97B',
    'Out for Delivery': '#43E97B', Delivered: '#43E97B', Cancelled: '#FF6584',
};
const STATUS_FLOW = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
const STATUS_ICONS = ['⏳', '✅', '🚚', '🏃', '📦'];

export default function OrderDetailScreen({ navigation, route }) {
    const { id } = route.params;
    const { order, loading, fetchOrder } = useOrderStore();

    useEffect(() => { fetchOrder(id); }, [id]);

    if (loading || !order) return (
        <SafeAreaView style={styles.center}>
            <ActivityIndicator color="#6C63FF" size="large" />
            <Text style={styles.loadingText}>Loading order details...</Text>
        </SafeAreaView>
    );

    const currStep = STATUS_FLOW.indexOf(order.status);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Order ID */}
                <View style={styles.card}>
                    <View style={styles.orderTop}>
                        <View>
                            <Text style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</Text>
                            <Text style={styles.orderDate}>
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[order.status] || '#666') + '22' }]}>
                            <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] || '#666' }]}>
                                {order.status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Progress Tracker */}
                {order.status !== 'Cancelled' && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Order Progress</Text>
                        <View style={styles.progressContainer}>
                            {STATUS_FLOW.map((step, i) => (
                                <View key={step} style={styles.stepWrapper}>
                                    <View style={styles.stepLeft}>
                                        <View style={[styles.stepDot, i <= currStep && styles.stepDotActive]}>
                                            <Text style={styles.stepDotIcon}>{i <= currStep ? STATUS_ICONS[i] : ''}</Text>
                                        </View>
                                        {i < STATUS_FLOW.length - 1 && (
                                            <View style={[styles.stepLine, i < currStep && styles.stepLineActive]} />
                                        )}
                                    </View>
                                    <Text style={[styles.stepLabel, i <= currStep && { color: '#fff', fontWeight: '600' }]}>{step}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Items */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Items ({order.orderItems.length})</Text>
                    {order.orderItems.map((item, i) => (
                        <View key={i} style={[styles.itemRow, i < order.orderItems.length - 1 && styles.itemBorder]}>
                            <View style={styles.itemEmoji}><Text style={{ fontSize: 20 }}>📦</Text></View>
                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.itemQty}>×{item.quantity}</Text>
                            <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</Text>
                        </View>
                    ))}
                </View>

                {/* Shipping Address */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📍 Shipping Address</Text>
                    <Text style={styles.addressName}>{order.shippingAddress.fullName}</Text>
                    <Text style={styles.addressText}>{order.shippingAddress.addressLine1}
                        {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                    </Text>
                    <Text style={styles.addressText}>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</Text>
                    <Text style={styles.addressText}>📞 {order.shippingAddress.phone}</Text>
                </View>

                {/* Payment */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>💳 Payment Summary</Text>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Method</Text><Text style={styles.summaryValue}>{order.paymentMethod}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{order.itemsPrice?.toLocaleString()}</Text></View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={[styles.summaryValue, !order.shippingPrice && { color: '#43E97B' }]}>
                            {order.shippingPrice ? `₹${order.shippingPrice}` : 'FREE'}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax (GST)</Text><Text style={styles.summaryValue}>₹{order.taxPrice?.toLocaleString()}</Text></View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₹{order.totalPrice?.toLocaleString()}</Text>
                    </View>
                </View>
            </ScrollView>
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
    headerTitle: { color: '#111827', fontSize: 22, fontWeight: '900' },
    card: { 
        backgroundColor: '#FFFFFF', 
        borderRadius: 28, 
        padding: 22, 
        marginHorizontal: 16, 
        marginBottom: 16, 
        borderWidth: 1.5, 
        borderColor: '#F3F4F6',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    orderId: { color: '#111827', fontWeight: '900', fontSize: 18 },
    orderDate: { color: '#6B7280', marginTop: 4, fontSize: 13, fontWeight: '600' },
    statusBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
    statusText: { fontWeight: '900', fontSize: 13 },
    sectionTitle: { color: '#111827', fontWeight: '900', fontSize: 16, marginBottom: 20 },
    progressContainer: { paddingLeft: 4 },
    stepWrapper: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
    stepLeft: { alignItems: 'center', width: 44 },
    stepDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFFFFF' },
    stepDotActive: { backgroundColor: '#E11D48', elevation: 3 },
    stepDotIcon: { fontSize: 16 },
    stepLine: { width: 2.5, height: 28, backgroundColor: '#F3F4F6', marginTop: 2 },
    stepLineActive: { backgroundColor: '#E11D48' },
    stepLabel: { color: '#9CA3AF', fontSize: 14, marginLeft: 15, paddingTop: 6, fontWeight: '800' },
    itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
    itemBorder: { borderBottomWidth: 1.5, borderColor: '#F3F4F6' },
    itemEmoji: { width: 44, height: 44, backgroundColor: '#F9FAFB', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#F3F4F6' },
    itemName: { flex: 1, color: '#111827', fontSize: 14, fontWeight: '700' },
    itemQty: { color: '#6B7280', marginHorizontal: 12, fontWeight: '800' },
    itemPrice: { color: '#111827', fontWeight: '900', fontSize: 15 },
    addressName: { color: '#111827', fontWeight: '900', fontSize: 16, marginBottom: 8 },
    addressText: { color: '#4B5563', marginBottom: 5, fontSize: 14, fontWeight: '600' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    summaryLabel: { color: '#6B7280', fontSize: 14, fontWeight: '700' },
    summaryValue: { color: '#111827', fontSize: 14, fontWeight: '800' },
    totalRow: { borderTopWidth: 1.5, borderColor: '#F3F4F6', paddingTop: 18, marginTop: 8 },
    totalLabel: { color: '#111827', fontWeight: '900', fontSize: 18 },
    totalValue: { color: '#E11D48', fontWeight: '900', fontSize: 24 },
});
