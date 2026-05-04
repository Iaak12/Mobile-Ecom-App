import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import usePaymentStore from '../store/paymentStore';

export default function RazorpayVerifyScreen({ route, navigation }) {
    const { paymentData, orderId } = route.params || {};
    const { verifyRazorpayPayment } = usePaymentStore();
    const [status, setStatus] = useState('verifying'); // verifying | success | failed

    useEffect(() => {
        const verify = async () => {
            const result = await verifyRazorpayPayment(orderId, paymentData);
            if (result.success) {
                setStatus('success');
                setTimeout(() => {
                    navigation.replace('OrderSuccess', { orderId });
                }, 1500);
            } else {
                setStatus('failed');
                Alert.alert(
                    'Verification Failed',
                    result.message || 'Payment verification failed. Contact support.',
                    [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
                );
            }
        };
        verify();
    }, []);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.center}>
                {status === 'verifying' && (
                    <>
                        <ActivityIndicator size="large" color="#E11D48" />
                        <Text style={styles.title}>Verifying Payment</Text>
                        <Text style={styles.sub}>Please wait, confirming your payment...</Text>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <Text style={styles.icon}>✅</Text>
                        <Text style={styles.title}>Payment Confirmed!</Text>
                        <Text style={styles.sub}>Redirecting to your order...</Text>
                    </>
                )}
                {status === 'failed' && (
                    <>
                        <Text style={styles.icon}>❌</Text>
                        <Text style={styles.title}>Verification Failed</Text>
                        <Text style={styles.sub}>Contact support with your payment ID.</Text>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    icon: { fontSize: 64, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '900', color: '#111827', marginTop: 16, textAlign: 'center' },
    sub: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginTop: 8, textAlign: 'center' },
});
