import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useOrderStore from '../store/orderStore';
import useCartStore from '../store/cartStore';
import usePaymentStore from '../store/paymentStore';

// Emoji/icon mapping for payment methods
const METHOD_ICONS = {
    'Razorpay':         { emoji: '💳', desc: 'UPI, Cards, Net Banking, Wallets' },
    'PayPal':           { emoji: '🅿️', desc: 'PayPal account or card' },
    'Stripe':           { emoji: '💠', desc: 'Visa, Mastercard, Amex' },
    'UPI':              { emoji: '📱', desc: 'Pay via any UPI app' },
    'Cash on Delivery': { emoji: '💵', desc: 'Pay when you receive' },
    'Net Banking':      { emoji: '🏦', desc: 'Direct bank transfer' },
};

function FormField({ label, value, onChangeText, placeholder, keyboard }) {
    const [focused, setFocused] = useState(false);
    return (
        <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, focused && styles.inputFocused]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#C4C4C4"
                keyboardType={keyboard || 'default'}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </View>
    );
}

export default function CheckoutScreen({ navigation }) {
    const [form, setForm] = useState({
        fullName: '', phone: '', addressLine1: '', addressLine2: '',
        city: '', state: '', pincode: ''
    });
    const [payMethod, setPayMethod] = useState(null);
    const { items, total, clearCart } = useCartStore();
    const { placeOrder, loading: orderLoading } = useOrderStore();
    const { methods, loading: methodsLoading, fetchEnabledMethods, createRazorpayOrder } = usePaymentStore();

    const shipping = total > 999 ? 0 : 49;
    const tax = Math.round(total * 0.18);
    const grandTotal = total + shipping + tax;

    useEffect(() => {
        fetchEnabledMethods();
    }, []);

    // Auto-select first method when loaded
    useEffect(() => {
        if (methods.length > 0 && !payMethod) {
            setPayMethod(methods[0].name);
        }
    }, [methods]);

    const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const validateForm = () => {
        const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
        for (const f of required) {
            if (!form[f].trim()) {
                Alert.alert('Missing Field', `Please fill in ${f.replace(/([A-Z])/g, ' $1').trim()}`);
                return false;
            }
        }
        if (!payMethod) {
            Alert.alert('Payment Method', 'Please select a payment method.');
            return false;
        }
        return true;
    };

    const buildOrderItems = () => items.map(i => ({
        product: i.product, name: i.name, image: i.image, price: i.price, quantity: i.quantity,
    }));

    // ─── COD / Direct methods ───
    const handleCOD = async () => {
        const result = await placeOrder({
            orderItems: buildOrderItems(),
            shippingAddress: form,
            paymentMethod: payMethod,
        });
        if (result.success) {
            clearCart?.();
            navigation.replace('OrderSuccess', { orderId: result.order._id });
        } else {
            Alert.alert('Order Failed', result.message);
        }
    };

    // ─── Razorpay gateway ───
    const handleRazorpay = async () => {
        // 1. Create order on backend first to get MongoDB order id
        const orderResult = await placeOrder({
            orderItems: buildOrderItems(),
            shippingAddress: form,
            paymentMethod: 'Razorpay',
        });
        if (!orderResult.success) {
            Alert.alert('Order Error', orderResult.message);
            return;
        }
        const mongoOrderId = orderResult.order._id;

        // 2. Create Razorpay order
        const rzpResult = await createRazorpayOrder(grandTotal);
        if (!rzpResult.success) {
            Alert.alert('Payment Error', rzpResult.message || 'Could not initialize Razorpay');
            return;
        }

        // 3. Navigate to WebView checkout
        navigation.navigate('RazorpayWebView', {
            razorpayOrderId: rzpResult.order.id,
            amount: grandTotal,
            key: rzpResult.key,
            name: form.fullName,
            email: '',
            phone: form.phone,
            orderId: mongoOrderId,
        });
    };

    // ─── UPI deep-link ───
    const handleUPI = async () => {
        const result = await placeOrder({
            orderItems: buildOrderItems(),
            shippingAddress: form,
            paymentMethod: 'UPI',
        });
        if (result.success) {
            clearCart?.();
            navigation.replace('OrderSuccess', { orderId: result.order._id });
        } else {
            Alert.alert('Order Failed', result.message);
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        if (payMethod === 'Razorpay') {
            await handleRazorpay();
        } else if (payMethod === 'UPI') {
            await handleUPI();
        } else {
            // COD, Net Banking (redirect-less), etc.
            await handleCOD();
        }
    };

    const isLoading = orderLoading || methodsLoading;

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 180 }} showsVerticalScrollIndicator={false}>
                {/* ── Shipping Address ── */}
                <Text style={styles.sectionTitle}>📍 Shipping Address</Text>
                <View style={styles.card}>
                    <FormField label="Full Name *" value={form.fullName} onChangeText={v => update('fullName', v)} placeholder="John Doe" />
                    <FormField label="Phone Number *" value={form.phone} onChangeText={v => update('phone', v)} placeholder="+91 9876543210" keyboard="phone-pad" />
                    <FormField label="Address Line 1 *" value={form.addressLine1} onChangeText={v => update('addressLine1', v)} placeholder="House No, Street" />
                    <FormField label="Address Line 2 (Optional)" value={form.addressLine2} onChangeText={v => update('addressLine2', v)} placeholder="Landmark, Area" />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <FormField label="City *" value={form.city} onChangeText={v => update('city', v)} placeholder="Mumbai" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormField label="State *" value={form.state} onChangeText={v => update('state', v)} placeholder="Maharashtra" />
                        </View>
                    </View>
                    <FormField label="Pincode *" value={form.pincode} onChangeText={v => update('pincode', v)} placeholder="400001" keyboard="number-pad" />
                </View>

                {/* ── Payment Methods ── */}
                <Text style={styles.sectionTitle}>💳 Payment Method</Text>
                <View style={styles.card}>
                    {methodsLoading ? (
                        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                            <ActivityIndicator color="#E11D48" />
                            <Text style={{ color: '#6B7280', marginTop: 10, fontWeight: '600', fontSize: 13 }}>
                                Loading payment options...
                            </Text>
                        </View>
                    ) : methods.length === 0 ? (
                        <Text style={{ color: '#9CA3AF', textAlign: 'center', paddingVertical: 16, fontWeight: '600' }}>
                            No payment methods available. Please contact support.
                        </Text>
                    ) : (
                        methods.map((m) => {
                            const icon = METHOD_ICONS[m.name] || { emoji: '💰', desc: m.name };
                            const isActive = payMethod === m.name;
                            return (
                                <TouchableOpacity
                                    key={m._id}
                                    style={[styles.methodRow, isActive && styles.methodActive]}
                                    onPress={() => setPayMethod(m.name)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.methodIconBox, isActive && styles.methodIconBoxActive]}>
                                        <Text style={{ fontSize: 22 }}>{icon.emoji}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.methodLabel, isActive && styles.methodLabelActive]}>
                                            {m.name}
                                        </Text>
                                        <Text style={styles.methodDesc}>{icon.desc}</Text>
                                        {m.name === 'Razorpay' && (
                                            <View style={styles.methodBadge}>
                                                <Text style={styles.methodBadgeText}>Recommended</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={[styles.radio, isActive && styles.radioActive]}>
                                        {isActive && <View style={styles.radioDot} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>

                {/* ── Order Summary ── */}
                <Text style={styles.sectionTitle}>📋 Order Summary</Text>
                <View style={styles.card}>
                    {items.map((item, i) => (
                        <View key={i} style={styles.orderItem}>
                            <Text style={styles.orderItemName} numberOfLines={1}>{item.name} × {item.quantity}</Text>
                            <Text style={styles.orderItemPrice}>₹{(item.price * item.quantity).toLocaleString()}</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryVal}>₹{total.toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={[styles.summaryVal, !shipping && { color: '#10B981', fontWeight: '800' }]}>
                            {shipping ? `₹${shipping}` : 'FREE ✓'}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tax (18% GST)</Text>
                        <Text style={styles.summaryVal}>₹{tax.toLocaleString()}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₹{grandTotal.toLocaleString()}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* ── Bottom Bar ── */}
            <View style={styles.bottomBar}>
                <View style={{ flex: 1, marginRight: 16 }}>
                    <Text style={styles.bottomLabel}>Total Amount</Text>
                    <Text style={styles.bottomTotal}>₹{grandTotal.toLocaleString()}</Text>
                    {payMethod && <Text style={styles.bottomMethod}>via {payMethod}</Text>}
                </View>
                <TouchableOpacity
                    style={[styles.placeBtn, isLoading && { opacity: 0.6 }]}
                    onPress={handlePlaceOrder}
                    disabled={isLoading || !payMethod}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.placeBtnText}>
                            {payMethod === 'Razorpay' ? 'Pay Now →' : 'Place Order →'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#FFFFFF',
    },
    backBtn: { width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    backText: { fontSize: 20, fontWeight: '900', color: '#111827' },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#111827' },
    sectionTitle: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 12, marginTop: 8, paddingHorizontal: 2 },
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, marginBottom: 20,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 2 }, elevation: 3,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    label: { fontSize: 10, fontWeight: '900', color: '#E11D48', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 },
    input: {
        backgroundColor: '#F9FAFB', color: '#111827', borderRadius: 14,
        paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, fontWeight: '600',
        borderWidth: 1.5, borderColor: '#F3F4F6',
    },
    inputFocused: { borderColor: '#E11D48', backgroundColor: '#FFF5F7' },
    // Payment Methods
    methodRow: {
        flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18,
        marginBottom: 10, backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#F3F4F6',
    },
    methodActive: { borderColor: '#E11D48', backgroundColor: '#FFF5F7' },
    methodIconBox: {
        width: 48, height: 48, borderRadius: 14, backgroundColor: '#F3F4F6',
        alignItems: 'center', justifyContent: 'center', marginRight: 14,
    },
    methodIconBoxActive: { backgroundColor: '#FFE4EA' },
    methodLabel: { fontSize: 15, fontWeight: '800', color: '#111827' },
    methodLabelActive: { color: '#E11D48' },
    methodDesc: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginTop: 3 },
    methodBadge: { backgroundColor: '#FEF3C7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 5, alignSelf: 'flex-start' },
    methodBadgeText: { fontSize: 10, fontWeight: '800', color: '#D97706' },
    radio: {
        width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D5DB',
        alignItems: 'center', justifyContent: 'center',
    },
    radioActive: { borderColor: '#E11D48' },
    radioDot: { width: 11, height: 11, borderRadius: 5.5, backgroundColor: '#E11D48' },
    // Summary
    orderItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    orderItemName: { flex: 1, fontSize: 13, fontWeight: '700', color: '#374151', marginRight: 10 },
    orderItemPrice: { fontSize: 13, fontWeight: '800', color: '#111827' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
    summaryVal: { fontSize: 14, fontWeight: '800', color: '#111827' },
    totalRow: { marginTop: 6, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    totalLabel: { fontSize: 16, fontWeight: '900', color: '#111827' },
    totalValue: { fontSize: 20, fontWeight: '900', color: '#E11D48' },
    // Bottom bar
    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34,
        backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6',
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: 16,
    },
    bottomLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '700' },
    bottomTotal: { fontSize: 20, fontWeight: '900', color: '#111827', marginTop: 1 },
    bottomMethod: { fontSize: 10, color: '#E11D48', fontWeight: '700', marginTop: 2 },
    placeBtn: {
        flex: 1, backgroundColor: '#E11D48', borderRadius: 18, paddingVertical: 18,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#E11D48', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8,
    },
    placeBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16, letterSpacing: 0.3 },
});
