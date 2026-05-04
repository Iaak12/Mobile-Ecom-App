import React, { useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Image, ActivityIndicator, Alert, Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, Package } from 'lucide-react-native';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const { width } = Dimensions.get('window');
const PRIMARY = '#E11D48';

export default function CartScreen({ navigation }) {
    const { items, total, loading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    useEffect(() => { if (isAuthenticated) fetchCart(); }, [isAuthenticated]);

    if (!isAuthenticated) return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.emptyState}>
                <View style={styles.emptyIconBox}>
                    <ShoppingBag size={48} color={PRIMARY} />
                </View>
                <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                <Text style={styles.emptySubtitle}>Login to see your saved items{'\n'}and start shopping.</Text>
                <TouchableOpacity
                    style={styles.emptyBtn}
                    onPress={() => navigation.getParent()?.navigate('ProfileTab')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.emptyBtnText}>Login to Continue</Text>
                    <ArrowRight size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    if (loading) return (
        <SafeAreaView style={[styles.safe, styles.center]}>
            <ActivityIndicator color={PRIMARY} size="large" />
            <Text style={styles.loadingText}>Loading your cart...</Text>
        </SafeAreaView>
    );

    if (items.length === 0) return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart</Text>
            </View>
            <View style={styles.emptyState}>
                <Text style={{ fontSize: 72, marginBottom: 16 }}>🛍️</Text>
                <Text style={styles.emptyTitle}>Nothing Here Yet</Text>
                <Text style={styles.emptySubtitle}>Browse our collection and{'\n'}add items to your cart.</Text>
                <TouchableOpacity
                    style={styles.emptyBtn}
                    onPress={() => navigation.getParent()?.navigate('HomeTab')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.emptyBtnText}>Start Shopping</Text>
                    <ArrowRight size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    const shipping = total > 999 ? 0 : 49;
    const tax = Math.round(total * 0.18);
    const grandTotal = total + shipping + tax;
    const amountToFreeShipping = 1000 - total;

    const renderItem = ({ item, index }) => (
        <View style={styles.cartItem}>
            <View style={styles.imgBox}>
                {item.image
                    ? <Image source={{ uri: item.image }} style={styles.img} />
                    : <Package size={32} color="#D1D5DB" />
                }
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
                <View style={styles.qtyRow}>
                    <TouchableOpacity
                        style={[styles.qtyBtn, item.quantity <= 1 && styles.qtyBtnDanger]}
                        onPress={() => item.quantity > 1 ? updateQuantity(item._id, item.quantity - 1) : removeItem(item._id)}
                        activeOpacity={0.7}
                    >
                        {item.quantity <= 1
                            ? <Trash2 size={13} color={PRIMARY} />
                            : <Minus size={13} color="#111827" />
                        }
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item._id, item.quantity + 1)}
                        activeOpacity={0.7}
                    >
                        <Plus size={13} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.itemRight}>
                <Text style={styles.subtotal}>₹{(item.price * item.quantity).toLocaleString()}</Text>
                <TouchableOpacity
                    onPress={() => removeItem(item._id)}
                    style={styles.removeBtn}
                    activeOpacity={0.7}
                >
                    <Trash2 size={14} color="#D1D5DB" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>My Cart</Text>
                    <Text style={styles.headerSub}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
                </View>
                <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Clear All', style: 'destructive', onPress: clearCart },
                    ])}
                    activeOpacity={0.7}
                >
                    <Trash2 size={16} color={PRIMARY} />
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            {/* Free shipping progress */}
            {amountToFreeShipping > 0 && (
                <View style={styles.shippingBanner}>
                    <Text style={styles.shippingBannerText}>
                        Add <Text style={{ fontWeight: '900', color: PRIMARY }}>₹{amountToFreeShipping.toLocaleString()}</Text> more for FREE shipping 🚚
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${Math.min((total / 1000) * 100, 100)}%` }]} />
                    </View>
                </View>
            )}

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={i => i._id}
                contentContainerStyle={{ padding: 16, paddingBottom: 300 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Order Summary */}
            <View style={styles.summary}>
                <View style={styles.summaryRows}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
                        <Text style={styles.summaryValue}>₹{total.toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery</Text>
                        <Text style={[styles.summaryValue, !shipping && { color: '#10B981' }]}>
                            {shipping ? `₹${shipping}` : 'FREE ✓'}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>GST (18%)</Text>
                        <Text style={styles.summaryValue}>₹{tax.toLocaleString()}</Text>
                    </View>
                </View>
                <View style={styles.totalRow}>
                    <View>
                        <Text style={styles.totalLabelSmall}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{grandTotal.toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.checkoutBtn}
                        onPress={() => navigation.navigate('Checkout')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.checkoutText}>Checkout</Text>
                        <ArrowRight size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#9CA3AF', fontWeight: '600', marginTop: 12 },
    // Empty State
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyIconBox: { width: 100, height: 100, backgroundColor: '#FFF0F3', borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 22, fontWeight: '900', color: '#111827', marginBottom: 10, textAlign: 'center' },
    emptySubtitle: { fontSize: 15, color: '#9CA3AF', fontWeight: '600', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    emptyBtn: { backgroundColor: PRIMARY, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 18, shadowColor: PRIMARY, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
    emptyBtnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff',
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    },
    headerTitle: { fontSize: 22, fontWeight: '900', color: '#111827' },
    headerSub: { fontSize: 12, color: '#9CA3AF', fontWeight: '700', marginTop: 2 },
    clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFF0F3', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
    clearText: { color: PRIMARY, fontWeight: '800', fontSize: 12 },
    // Shipping banner
    shippingBanner: { backgroundColor: '#F0FDF4', borderBottomWidth: 1, borderColor: '#D1FAE5', paddingHorizontal: 20, paddingVertical: 10 },
    shippingBannerText: { fontSize: 12, color: '#374151', fontWeight: '700', marginBottom: 8 },
    progressBar: { height: 4, backgroundColor: '#D1FAE5', borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 2 },
    // Cart Item
    cartItem: {
        flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20,
        padding: 14, marginBottom: 10, alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    imgBox: { width: 80, height: 80, backgroundColor: '#F9FAFB', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14, overflow: 'hidden' },
    img: { width: '100%', height: '100%', resizeMode: 'cover' },
    itemInfo: { flex: 1 },
    itemName: { color: '#111827', fontWeight: '800', fontSize: 13, lineHeight: 18, marginBottom: 4 },
    itemPrice: { color: PRIMARY, fontWeight: '900', fontSize: 14, marginBottom: 10 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    qtyBtn: { width: 30, height: 30, backgroundColor: '#F3F4F6', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    qtyBtnDanger: { backgroundColor: '#FFF0F3', borderColor: '#FFD6DE' },
    qty: { color: '#111827', fontWeight: '900', fontSize: 15, minWidth: 20, textAlign: 'center' },
    itemRight: { alignItems: 'flex-end', justifyContent: 'space-between', paddingLeft: 8, alignSelf: 'stretch' },
    subtotal: { color: '#111827', fontWeight: '900', fontSize: 14 },
    removeBtn: { padding: 4 },
    // Summary
    summary: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 20, paddingBottom: 34,
        shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 20, shadowOffset: { width: 0, height: -8 }, elevation: 20,
        borderTopWidth: 1, borderTopColor: '#F3F4F6',
    },
    summaryRows: { gap: 8, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#F3F4F6' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryLabel: { color: '#6B7280', fontSize: 13, fontWeight: '700' },
    summaryValue: { color: '#111827', fontSize: 13, fontWeight: '800' },
    totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    totalLabelSmall: { color: '#9CA3AF', fontSize: 11, fontWeight: '700', marginBottom: 2 },
    totalValue: { color: '#111827', fontWeight: '900', fontSize: 22 },
    checkoutBtn: {
        backgroundColor: PRIMARY, flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 16, borderRadius: 18,
        shadowColor: PRIMARY, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    },
    checkoutText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});
