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
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        paddingVertical: 25,
        paddingHorizontal: 10,
        borderRadius: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginTop: 15,
        marginBottom: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    item: {
        flex: 1,
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    label: {
        color: '#111827',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.2,
        textTransform: 'uppercase'
    },
    sub: {
        color: '#9CA3AF',
        fontSize: 8,
        fontWeight: '800',
        marginTop: 3,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
});
