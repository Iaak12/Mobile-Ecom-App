import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TRUST_ITEMS = [
    { emoji: '🚚', title: 'Free Delivery', sub: 'Orders over ₹999' },
    { emoji: '↩️', title: 'Easy Returns', sub: '7-day policy' },
    { emoji: '🔒', title: 'Secure Pay', sub: '100% encrypted' },
    { emoji: '✅', title: 'Authentic', sub: 'Official merch only' },
];

const TrustBar = () => (
    <View style={styles.container}>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
        >
            {TRUST_ITEMS.map((item, i) => (
                <View key={i} style={styles.pill}>
                    <Text style={styles.emoji}>{item.emoji}</Text>
                    <View>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.sub}>{item.sub}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    scroll: { paddingHorizontal: 16, gap: 10, paddingVertical: 4 },
    pill: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#F9FAFB', borderRadius: 16,
        paddingHorizontal: 14, paddingVertical: 10,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    emoji: { fontSize: 18 },
    title: { color: '#111827', fontSize: 11, fontWeight: '900' },
    sub: { color: '#9CA3AF', fontSize: 10, fontWeight: '600', marginTop: 1 },
});

export default TrustBar;
