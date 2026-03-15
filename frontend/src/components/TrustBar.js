import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Truck, ShieldCheck, RefreshCcw, Award } from 'lucide-react-native';

const TRUST_ITEMS = [
    { icon: Truck, label: 'FREE SHIPPING', sub: 'On orders above ₹999' },
    { icon: ShieldCheck, label: '100% GENUINE', sub: 'Official merchandise' },
    { icon: RefreshCcw, label: 'EASY RETURNS', sub: '30 days return policy' },
];

export default function TrustBar() {
    return (
        <View style={styles.container}>
            {TRUST_ITEMS.map((item, index) => (
                <View key={index} style={styles.item}>
                    <item.icon size={20} color="#E11D48" strokeWidth={2.5} />
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>{item.label}</Text>
                        <Text style={styles.sub}>{item.sub}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9FAFB',
        marginHorizontal: 16,
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        marginTop: 10,
        marginBottom: 20,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    label: {
        color: '#111827',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    sub: {
        color: '#6B7280',
        fontSize: 7,
        fontWeight: '700',
        marginTop: 2,
        textAlign: 'center',
    },
});
