import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccessScreen({ navigation, route }) {
    const { orderId } = route.params || {};

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                {/* Success Animation (emoji-based) */}
                <View style={styles.iconCircle}>
                    <Text style={styles.icon}>🎉</Text>
                </View>

                <Text style={styles.title}>Order Placed!</Text>
                <Text style={styles.subtitle}>
                    Your order has been successfully placed and is being processed. You'll receive updates soon.
                </Text>

                {orderId && (
                    <View style={styles.orderIdBox}>
                        <Text style={styles.orderIdLabel}>ORDER ID</Text>
                        <Text style={styles.orderId}>#{orderId.slice(-8).toUpperCase()}</Text>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>📧</Text>
                        <Text style={styles.infoText}>Confirmation sent to your email</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>📱</Text>
                        <Text style={styles.infoText}>Track via My Orders</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('MyOrders')}>
                    <Text style={styles.btnText}>📦 Track My Order</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.outlineBtnText}>Continue Shopping →</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    iconCircle: { 
        width: 140, 
        height: 140, 
        borderRadius: 70, 
        backgroundColor: '#E11D4810', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 32, 
        borderWidth: 2, 
        borderColor: '#E11D4822',
        elevation: 4,
        shadowColor: '#E11D48',
        shadowOpacity: 0.1,
        shadowRadius: 15
    },
    icon: { fontSize: 64 },
    title: { fontSize: 34, fontWeight: '900', color: '#111827', marginBottom: 15, textAlign: 'center' },
    subtitle: { color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 35, fontSize: 16, fontWeight: '500' },
    orderIdBox: { 
        backgroundColor: '#F9FAFB', 
        borderRadius: 20, 
        paddingHorizontal: 35, 
        paddingVertical: 18, 
        marginBottom: 35, 
        borderWidth: 2, 
        borderColor: '#F3F4F6', 
        alignItems: 'center' 
    },
    orderIdLabel: { color: '#E11D48', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 6 },
    orderId: { color: '#111827', fontWeight: '900', fontSize: 24 },
    infoRow: { flexDirection: 'row', gap: 15, marginBottom: 40, width: '100%' },
    infoCard: { 
        flex: 1, 
        backgroundColor: '#FFFFFF', 
        borderRadius: 24, 
        padding: 16, 
        alignItems: 'center', 
        borderWidth: 2, 
        borderColor: '#F3F4F6',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8
    },
    infoIcon: { fontSize: 28, marginBottom: 10 },
    infoText: { color: '#6B7280', fontSize: 12, textAlign: 'center', fontWeight: '800' },
    btn: { backgroundColor: '#E11D48', borderRadius: 24, paddingVertical: 20, width: '100%', alignItems: 'center', marginBottom: 15, elevation: 5, shadowColor: '#E11D48', shadowOpacity: 0.3, shadowRadius: 10 },
    btnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 17, letterSpacing: 0.5 },
    outlineBtn: { borderWidth: 2, borderColor: '#F3F4F6', borderRadius: 24, paddingVertical: 20, width: '100%', alignItems: 'center' },
    outlineBtnText: { color: '#111827', fontWeight: '900', fontSize: 17 },
});
