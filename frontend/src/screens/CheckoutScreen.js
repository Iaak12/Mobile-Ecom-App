import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useOrderStore from '../store/orderStore';
import useCartStore from '../store/cartStore';

const METHODS = [
    { id: 'COD', label: 'Cash on Delivery', emoji: '💵', desc: 'Pay when you receive' },
    { id: 'Razorpay', label: 'Razorpay', emoji: '💳', desc: 'UPI, Cards, Wallets' },
];

function FormField({ label, fieldKey, value, onChangeText, placeholder, keyboard }) {
    return (
        <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#444"
                keyboardType={keyboard || 'default'}
            />
        </View>
    );
}

export default function CheckoutScreen({ navigation }) {
    const [form, setForm] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
    const [payMethod, setPayMethod] = useState('COD');
    const { items, total } = useCartStore();
    const { placeOrder, loading } = useOrderStore();

    const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));
    const shipping = total > 999 ? 0 : 49;
    const tax = Math.round(total * 0.18);
    const grandTotal = total + shipping + tax;

    const handlePlaceOrder = async () => {
        const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
        for (const f of required) {
            if (!form[f].trim()) return Alert.alert('Missing Field', `Please fill in ${f.replace(/([A-Z])/g, ' $1').trim()}`);
        }
        const orderItems = items.map((i) => ({
            product: i.product, name: i.name, image: i.image, price: i.price, quantity: i.quantity,
        }));
        const result = await placeOrder({ orderItems, shippingAddress: form, paymentMethod: payMethod });
        if (result.success) {
            navigation.replace('OrderSuccess', { orderId: result.order._id });
        } else {
            Alert.alert('Order Failed', result.message);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 180 }}>
                <Text style={styles.sectionTitle}>📍 Shipping Address</Text>
                <View style={styles.card}>
                    <FormField label="Full Name" fieldKey="fullName" value={form.fullName} onChangeText={(v) => update('fullName', v)} placeholder="John Doe" />
                    <FormField label="Phone Number" fieldKey="phone" value={form.phone} onChangeText={(v) => update('phone', v)} placeholder="+91 9876543210" keyboard="phone-pad" />
                    <FormField label="Address Line 1" fieldKey="addressLine1" value={form.addressLine1} onChangeText={(v) => update('addressLine1', v)} placeholder="House No, Street" />
                    <FormField label="Address Line 2 (Optional)" fieldKey="addressLine2" value={form.addressLine2} onChangeText={(v) => update('addressLine2', v)} placeholder="Landmark, Area" />
                    <View style={styles.rowFields}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <FormField label="City" fieldKey="city" value={form.city} onChangeText={(v) => update('city', v)} placeholder="Mumbai" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormField label="State" fieldKey="state" value={form.state} onChangeText={(v) => update('state', v)} placeholder="Maharashtra" />
                        </View>
                    </View>
                    <FormField label="Pincode" fieldKey="pincode" value={form.pincode} onChangeText={(v) => update('pincode', v)} placeholder="400001" keyboard="number-pad" />
                </View>

                <Text style={styles.sectionTitle}>💳 Payment Method</Text>
                <View style={styles.card}>
                    {METHODS.map((m) => (
                        <TouchableOpacity key={m.id} style={[styles.methodRow, payMethod === m.id && styles.methodActive]} onPress={() => setPayMethod(m.id)}>
                            <Text style={styles.methodEmoji}>{m.emoji}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.methodLabel, payMethod === m.id && { color: '#6C63FF' }]}>{m.label}</Text>
                                <Text style={styles.methodDesc}>{m.desc}</Text>
                            </View>
                            <View style={[styles.radio, payMethod === m.id && styles.radioActive]} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>📋 Order Summary</Text>
                <View style={styles.card}>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryVal}>₹{total.toLocaleString()}</Text></View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={[styles.summaryVal, !shipping && { color: '#43E97B', fontWeight: '700' }]}>{shipping ? `₹${shipping}` : '✓ FREE'}</Text>
                    </View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax (18% GST)</Text><Text style={styles.summaryVal}>₹{tax.toLocaleString()}</Text></View>
                    <View style={[styles.summaryRow, { borderTopWidth: 1, borderColor: '#252336', marginTop: 10, paddingTop: 12 }]}>
                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Total</Text>
                        <Text style={{ color: '#6C63FF', fontWeight: '800', fontSize: 20 }}>₹{grandTotal.toLocaleString()}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <View style={styles.totalPreview}>
                    <Text style={{ color: '#8B8BA7', fontSize: 12 }}>Total Amount</Text>
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>₹{grandTotal.toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={[styles.placeBtn, loading && { opacity: 0.7 }]} onPress={handlePlaceOrder} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.placeBtnText}>Place Order →</Text>}
                </TouchableOpacity>
            </View>
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
    sectionTitle: { color: '#111827', fontWeight: '900', fontSize: 17, marginBottom: 15, marginTop: 10, paddingHorizontal: 4 },
    card: { 
        backgroundColor: '#FFFFFF', 
        borderRadius: 28, 
        padding: 20, 
        marginBottom: 25, 
        borderWidth: 1.5, 
        borderColor: '#F3F4F6',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12
    },
    label: { color: '#E11D48', fontSize: 11, fontWeight: '900', marginBottom: 10, letterSpacing: 1.5, textTransform: 'uppercase' },
    input: { backgroundColor: '#F9FAFB', color: '#111827', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 15, fontSize: 15, borderWidth: 1.5, borderColor: '#F3F4F6', fontWeight: '600' },
    rowFields: { flexDirection: 'row' },
    methodRow: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, marginBottom: 12, backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#F3F4F6' },
    methodActive: { borderColor: '#E11D48', backgroundColor: '#E11D4808' },
    methodEmoji: { fontSize: 26, marginRight: 16 },
    methodLabel: { color: '#111827', fontWeight: '900', fontSize: 15 },
    methodDesc: { color: '#6B7280', fontSize: 12, marginTop: 4, fontWeight: '600' },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D5DB' },
    radioActive: { borderColor: '#E11D48', backgroundColor: '#E11D48' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    summaryLabel: { color: '#6B7280', fontSize: 14, fontWeight: '700' },
    summaryVal: { color: '#111827', fontSize: 14, fontWeight: '800' },
    bottomBar: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 24, 
        paddingBottom: 45, 
        backgroundColor: '#FFFFFF', 
        borderTopWidth: 1.5, 
        borderColor: '#F3F4F6',
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: -5 }
    },
    totalPreview: { marginRight: 20 },
    placeBtn: { flex: 1, backgroundColor: '#E11D48', borderRadius: 20, paddingVertical: 20, alignItems: 'center', elevation: 5, shadowColor: '#E11D48', shadowOpacity: 0.3, shadowRadius: 10 },
    placeBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 17, letterSpacing: 0.5 },
});
