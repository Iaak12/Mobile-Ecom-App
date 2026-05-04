import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react-native';

const PRIMARY = '#E11D48';

export default function OrderSuccessScreen({ navigation, route }) {
    const { orderId } = route.params || {};
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 6, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>

                {/* Animated Check Icon */}
                <Animated.View style={[styles.iconRing, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.iconInner}>
                        <CheckCircle size={52} color={PRIMARY} strokeWidth={2} />
                    </View>
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}>
                    <Text style={styles.successLabel}>ORDER CONFIRMED</Text>
                    <Text style={styles.title}>You're all set! 🎉</Text>
                    <Text style={styles.subtitle}>
                        Your order has been placed successfully and is now being processed. We'll notify you when it ships.
                    </Text>

                    {/* Order ID */}
                    {orderId && (
                        <View style={styles.orderIdBox}>
                            <Text style={styles.orderIdLabel}>ORDER ID</Text>
                            <Text style={styles.orderId}>#{orderId.slice(-8).toUpperCase()}</Text>
                            <View style={styles.orderIdLine} />
                            <Text style={styles.orderIdHint}>Save this for tracking</Text>
                        </View>
                    )}

                    {/* Info Cards */}
                    <View style={styles.infoRow}>
                        {[
                            { emoji: '📧', text: 'Confirmation\nvia email' },
                            { emoji: '🚚', text: '3-5 days\ndelivery' },
                            { emoji: '📦', text: 'Track in\nMy Orders' },
                        ].map((item, i) => (
                            <View key={i} style={styles.infoCard}>
                                <Text style={styles.infoEmoji}>{item.emoji}</Text>
                                <Text style={styles.infoText}>{item.text}</Text>
                            </View>
                        ))}
                    </View>

                    {/* CTA Buttons */}
                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => navigation.navigate('MyOrders')}
                        activeOpacity={0.85}
                    >
                        <Package size={20} color="#fff" />
                        <Text style={styles.primaryBtnText}>Track My Order</Text>
                        <ArrowRight size={18} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => navigation.navigate('Home')}
                        activeOpacity={0.8}
                    >
                        <Home size={18} color="#6B7280" />
                        <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 },
    // Icon
    iconRing: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: '#FFF0F3', borderWidth: 2, borderColor: '#FFD6DE',
        justifyContent: 'center', alignItems: 'center', marginBottom: 28,
        shadowColor: PRIMARY, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
    },
    iconInner: { width: 80, height: 80, backgroundColor: '#fff', borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
    successLabel: { color: PRIMARY, fontSize: 10, fontWeight: '900', letterSpacing: 3, marginBottom: 10 },
    title: { fontSize: 28, fontWeight: '900', color: '#111827', marginBottom: 12, textAlign: 'center', letterSpacing: -0.5 },
    subtitle: { color: '#9CA3AF', textAlign: 'center', lineHeight: 22, fontSize: 14, fontWeight: '600', marginBottom: 28, paddingHorizontal: 8 },
    // Order ID
    orderIdBox: {
        backgroundColor: '#F9FAFB', borderRadius: 20, paddingHorizontal: 32, paddingVertical: 20,
        marginBottom: 28, borderWidth: 1.5, borderColor: '#F3F4F6', alignItems: 'center', width: '100%',
    },
    orderIdLabel: { color: PRIMARY, fontSize: 9, fontWeight: '900', letterSpacing: 2.5, marginBottom: 8 },
    orderId: { color: '#111827', fontWeight: '900', fontSize: 26, letterSpacing: -0.5 },
    orderIdLine: { height: 1, width: 40, backgroundColor: '#E5E7EB', marginVertical: 10 },
    orderIdHint: { color: '#D1D5DB', fontSize: 11, fontWeight: '700' },
    // Info
    infoRow: { flexDirection: 'row', gap: 10, marginBottom: 32, width: '100%' },
    infoCard: {
        flex: 1, backgroundColor: '#FAFAFA', borderRadius: 18, paddingVertical: 16,
        paddingHorizontal: 8, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6',
    },
    infoEmoji: { fontSize: 24, marginBottom: 8 },
    infoText: { color: '#6B7280', fontSize: 11, textAlign: 'center', fontWeight: '800', lineHeight: 16 },
    // Buttons
    primaryBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: PRIMARY, borderRadius: 18, paddingVertical: 17,
        width: '100%', justifyContent: 'center', marginBottom: 12,
        shadowColor: PRIMARY, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8,
    },
    primaryBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
    secondaryBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#F9FAFB', borderRadius: 18, paddingVertical: 16,
        width: '100%', justifyContent: 'center', borderWidth: 1, borderColor: '#F3F4F6',
    },
    secondaryBtnText: { color: '#6B7280', fontWeight: '800', fontSize: 15 },
});
