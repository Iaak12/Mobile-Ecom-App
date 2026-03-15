import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'lucide-react-native';
import useAuthStore from '../store/authStore';

const MENU = [
    { icon: '📦', label: 'My Orders', screen: 'MyOrders' },
    { icon: '📍', label: 'My Addresses', screen: null },
    { icon: '🔒', label: 'Change Password', screen: null },
    { icon: '⭐', label: 'My Reviews', screen: null },
];

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuthStore();

    const handleLogout = () =>
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout },
        ]);

    if (!user) return (
        <SafeAreaView style={styles.center}>
            <View style={styles.guestContent}>
                <View style={styles.guestIconBox}>
                    <User size={60} color="#6C63FF" />
                </View>
                <Text style={styles.guestTitle}>Join the Crew!</Text>
                <Text style={styles.guestText}>Login to track orders, manage addresses, and get exclusive official merch drops.</Text>
                
                <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginBtnText}>LOGIN / REGISTER</Text>
                </TouchableOpacity>

                <View style={styles.footerBrand}>
                    <Text style={styles.footerBrandText}>TSS<Text style={{ color: '#6C63FF' }}>.</Text></Text>
                </View>
            </View>
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    {user.role === 'admin' && (
                        <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>⚙️ Admin</Text></View>
                    )}
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statVal}>🛍️</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statVal}>⭐</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statVal}>💰</Text>
                        <Text style={styles.statLabel}>Savings</Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuCard}>
                    {MENU.map((item, idx) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[styles.menuRow, idx < MENU.length - 1 && styles.menuBorder]}
                            onPress={() => item.screen ? navigation.navigate(item.screen) : null}
                        >
                            <Text style={styles.menuIcon}>{item.icon}</Text>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>
                    ))}
                    {user.role === 'admin' && (
                        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('AdminDashboard')}>
                            <Text style={styles.menuIcon}>🛠️</Text>
                            <Text style={[styles.menuLabel, { color: '#6C63FF' }]}>Admin Dashboard</Text>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>🚪  Logout</Text>
                </TouchableOpacity>

                <Text style={styles.version}>ShopEase v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    center: { flex: 1, backgroundColor: '#FFFFFF' },
    guestContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    guestIconBox: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 28, borderWidth: 1, borderColor: '#F3F4F6', elevation: 2 },
    guestTitle: { color: '#111827', fontSize: 28, fontWeight: '900', marginBottom: 12 },
    guestText: { color: '#6B7280', fontSize: 16, marginBottom: 35, textAlign: 'center', lineHeight: 24, fontWeight: '500' },
    loginBtn: { backgroundColor: '#E11D48', borderRadius: 20, width: '100%', paddingVertical: 20, alignItems: 'center', elevation: 5, shadowColor: '#E11D48', shadowOpacity: 0.3, shadowRadius: 12 },
    loginBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 17, letterSpacing: 1 },
    footerBrand: { position: 'absolute', bottom: 40 },
    footerBrandText: { color: '#F3F4F6', fontSize: 32, fontWeight: '900', letterSpacing: -1.5 },
    avatarSection: { alignItems: 'center', paddingTop: 40, paddingBottom: 35, backgroundColor: '#F9FAFB', marginBottom: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E11D48', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 4, borderColor: '#FFFFFF', elevation: 3 },
    avatarText: { color: '#FFFFFF', fontSize: 40, fontWeight: '900' },
    name: { color: '#111827', fontSize: 26, fontWeight: '900', marginBottom: 5 },
    email: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
    adminBadge: { marginTop: 12, backgroundColor: '#E11D4815', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: '#E11D4833' },
    adminBadgeText: { color: '#E11D48', fontWeight: '800', fontSize: 13 },
    statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 14, marginBottom: 20 },
    statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 18, alignItems: 'center', borderWidth: 1.5, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    statVal: { fontSize: 26, marginBottom: 8 },
    statLabel: { color: '#6B7280', fontSize: 12, fontWeight: '800' },
    menuCard: { backgroundColor: '#FFFFFF', borderRadius: 24, marginHorizontal: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: '#F3F4F6', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 20 },
    menuBorder: { borderBottomWidth: 1.5, borderColor: '#F3F4F6' },
    menuIcon: { fontSize: 24, marginRight: 18 },
    menuLabel: { flex: 1, color: '#111827', fontSize: 16, fontWeight: '700' },
    menuArrow: { color: '#D1D5DB', fontSize: 24 },
    logoutBtn: { marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 20, alignItems: 'center', borderWidth: 1.5, borderColor: '#FECACA' },
    logoutText: { color: '#E11D48', fontWeight: '800', fontSize: 16 },
    version: { color: '#E5E7EB', textAlign: 'center', marginTop: 30, fontSize: 13, fontWeight: '700' },
});
