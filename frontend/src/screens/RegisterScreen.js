import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../store/authStore';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const { register, loading } = useAuthStore();

    const handleRegister = async () => {
        if (!name || !email || !password) return Alert.alert('Error', 'Please fill all fields');
        if (password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
        const result = await register(name.trim(), email.trim(), password);
        if (!result.success) Alert.alert('Registration Failed', result.message);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <Text style={styles.emoji}>✨</Text>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us today & start shopping</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.label}>FULL NAME</Text>
                        <TextInput
                            style={styles.input} value={name} onChangeText={setName}
                            placeholder="John Doe" placeholderTextColor="#444"
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>EMAIL</Text>
                        <TextInput
                            style={styles.input} value={email} onChangeText={setEmail}
                            placeholder="you@email.com" placeholderTextColor="#444"
                            keyboardType="email-address" autoCapitalize="none"
                        />

                        <Text style={styles.label}>PASSWORD</Text>
                        <View style={styles.passRow}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]} value={password} onChangeText={setPassword}
                                placeholder="Min. 6 characters" placeholderTextColor="#444"
                                secureTextEntry={!showPass}
                            />
                            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                                <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account →</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkRow}>
                            <Text style={styles.linkText}>Already have an account? <Text style={styles.link}>Sign In</Text></Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 40 },
    emoji: { fontSize: 70, marginBottom: 16 },
    title: { fontSize: 32, fontWeight: '900', color: '#111827', marginBottom: 8 },
    subtitle: { color: '#6B7280', fontSize: 16, fontWeight: '600' },
    card: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 26, borderWidth: 1.5, borderColor: '#F3F4F6', elevation: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
    label: { color: '#E11D48', fontSize: 11, fontWeight: '900', marginBottom: 10, marginTop: 18, letterSpacing: 1.5 },
    input: { backgroundColor: '#F9FAFB', color: '#111827', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 16, fontSize: 16, borderWidth: 1.5, borderColor: '#F3F4F6', fontWeight: '600' },
    passRow: { flexDirection: 'row', alignItems: 'center' },
    eyeBtn: { position: 'absolute', right: 18 },
    eyeText: { fontSize: 20 },
    btn: { backgroundColor: '#E11D48', borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginTop: 32, elevation: 5, shadowColor: '#E11D48', shadowOpacity: 0.3, shadowRadius: 10 },
    btnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 17, letterSpacing: 0.5 },
    linkRow: { marginTop: 24, alignItems: 'center' },
    linkText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
    link: { color: '#E11D48', fontWeight: '900' },
});
