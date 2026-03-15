import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import useAuthStore from '../store/authStore';

export default function SplashScreen({ navigation }) {
    const initAuth = useAuthStore((s) => s.initAuth);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
        const bootstrap = async () => {
            await initAuth();
            setTimeout(() => {
                // Navigation handled by AppNavigator via isAuthenticated state
            }, 1500);
        };
        bootstrap();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.logoBox}>
                <Text style={styles.logo}>🛍️</Text>
                <Text style={styles.title}>ShopEase</Text>
                <Text style={styles.subtitle}>Your Premium Store</Text>
            </View>
            <ActivityIndicator size="large" color="#E11D48" style={{ marginTop: 50 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
    logoBox: { alignItems: 'center' },
    logo: { fontSize: 84, marginBottom: 10 },
    title: { fontSize: 40, fontWeight: '900', color: '#111827', marginTop: 12, letterSpacing: 1 },
    subtitle: { fontSize: 16, color: '#E11D48', marginTop: 6, letterSpacing: 3, fontWeight: '800', textTransform: 'uppercase' },
});
