import React, { useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Image, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag } from 'lucide-react-native';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function CartScreen({ navigation }) {
    const { items, total, loading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) fetchCart();
    }, [isAuthenticated]);

    if (!isAuthenticated) return (
        <SafeAreaView style={styles.center}>
            <View style={styles.guestContent}>
                <View style={styles.guestIconBox}>
                    <ShoppingBag size={60} color="#6C63FF" />
                </View>
                <Text style={styles.guestTitle}>Your Bag is Empty!</Text>
                <Text style={styles.guestText}>Login to see items you've added previously or start shopping the latest trends.</Text>
                <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.getParent()?.navigate('ProfileTab')}>
                    <Text style={styles.actionBtnText}>LOGIN TO CONTINUE</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    if (loading) return (
        <SafeAreaView style={styles.center}>
            <ActivityIndicator color="#6C63FF" size="large" />
            <Text style={styles.emptyText}>Loading your cart...</Text>
        </SafeAreaView>
    );

    if (items.length === 0) return (
        <SafeAreaView style={styles.center}>
            <Text style={{ fontSize: 80, marginBottom: 16 }}>🛒</Text>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyText}>Add items to get started</Text>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.getParent()?.navigate('HomeTab')}>
                <Text style={styles.actionBtnText}>Start Shopping</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );

    const shipping = total > 999 ? 0 : 49;
    const tax = Math.round(total * 0.18);
    const grandTotal = total + shipping + tax;

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={styles.imgBox}>
                {item.image ? <Image source={{ uri: item.image }} style={styles.img} /> : <Text style={{ fontSize: 32 }}>📦</Text>}
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
                <View style={styles.qtyRow}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => item.quantity > 1 ? updateQuantity(item._id, item.quantity - 1) : removeItem(item._id)}
                    >
                        <Text style={styles.qtyBtnTxt}>{item.quantity > 1 ? '−' : '🗑️'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item._id, item.quantity + 1)}>
                        <Text style={styles.qtyBtnTxt}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.subtotal}>₹{(item.price * item.quantity).toLocaleString()}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart 🛒</Text>
                <TouchableOpacity onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
                    { text: 'Cancel' }, { text: 'Clear All', style: 'destructive', onPress: clearCart }
                ])}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(i) => i._id}
                contentContainerStyle={{ padding: 16, paddingBottom: 260 }}
            />

            {/* Order Summary */}
            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
                    <Text style={styles.summaryValue}>₹{total.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={[styles.summaryValue, !shipping && { color: '#43E97B', fontWeight: '700' }]}>
                        {shipping ? `₹${shipping}` : '✓ FREE'}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax (18% GST)</Text>
                    <Text style={styles.summaryValue}>₹{tax.toLocaleString()}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{grandTotal.toLocaleString()}</Text>
                </View>
                {total < 1000 && (
                    <Text style={styles.freeShipHint}>Add ₹{(1000 - total).toLocaleString()} more for FREE shipping!</Text>
                )}
                <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
                    <Text style={styles.checkoutBtnText}>Proceed to Checkout →</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 32 },
    emptyTitle: { color: '#111827', fontSize: 24, fontWeight: '900', marginBottom: 10 },
    emptyText: { color: '#6B7280', fontSize: 16, marginBottom: 32, textAlign: 'center', lineHeight: 24 },
    actionBtn: { backgroundColor: '#E11D48', borderRadius: 20, paddingHorizontal: 40, paddingVertical: 18, elevation: 5, shadowColor: '#E11D48', shadowOpacity: 0.2, shadowRadius: 10 },
    actionBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingTop: 15, 
        paddingHorizontal: 20, 
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    headerTitle: { color: '#111827', fontSize: 22, fontWeight: '900' },
    clearText: { color: '#E11D48', fontWeight: '800', fontSize: 13 },
    cartItem: { 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 24, 
        padding: 16, 
        marginBottom: 12, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#F3F4F6',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8
    },
    imgBox: { width: 85, height: 85, backgroundColor: '#F9FAFB', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16, overflow: 'hidden' },
    img: { width: '100%', height: '100%', resizeMode: 'cover' },
    itemInfo: { flex: 1 },
    itemName: { color: '#111827', fontWeight: '800', fontSize: 14, marginBottom: 6 },
    itemPrice: { color: '#E11D48', fontWeight: '900', marginBottom: 12, fontSize: 15 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    qtyBtn: { backgroundColor: '#F9FAFB', borderRadius: 12, width: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
    qtyBtnTxt: { color: '#111827', fontWeight: '900', fontSize: 18 },
    qty: { color: '#111827', fontWeight: '900', fontSize: 16, minWidth: 24, textAlign: 'center' },
    subtotal: { color: '#111827', fontWeight: '900', marginLeft: 10, fontSize: 15 },
    summary: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: '#FFFFFF', 
        borderTopLeftRadius: 32, 
        borderTopRightRadius: 32, 
        padding: 24, 
        paddingBottom: 40, 
        borderTopWidth: 1, 
        borderColor: '#F3F4F6',
        elevation: 25,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -10 }
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    summaryLabel: { color: '#6B7280', fontSize: 14, fontWeight: '700' },
    summaryValue: { color: '#111827', fontSize: 14, fontWeight: '800' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, borderColor: '#F3F4F6', paddingTop: 16, marginTop: 6, marginBottom: 8 },
    totalLabel: { color: '#111827', fontWeight: '900', fontSize: 18 },
    totalValue: { color: '#E11D48', fontWeight: '900', fontSize: 24 },
    freeShipHint: { color: '#10B981', fontSize: 12, textAlign: 'center', marginBottom: 15, fontWeight: '800' },
    checkoutBtn: { 
        backgroundColor: '#E11D48', 
        borderRadius: 20, 
        paddingVertical: 20, 
        alignItems: 'center', 
        marginTop: 8,
        elevation: 5,
        shadowColor: '#E11D48',
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    checkoutBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 17, letterSpacing: 0.5 },
});
