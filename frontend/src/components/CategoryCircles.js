import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 72;

const FALLBACK_COLORS = ['#FFF0F3', '#FFF7ED', '#F0FDF4', '#EFF6FF', '#FDF4FF', '#FFFBEB'];
const FALLBACK_EMOJI = ['👗', '👟', '⌚', '🎧', '📱', '💄', '🧴', '🎽'];

const CategoryCircles = ({ categories, navigation }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>SHOP BY CATEGORY</Text>
                <View style={styles.titleLine} />
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {categories.map((cat, i) => (
                    <TouchableOpacity
                        key={cat._id}
                        style={styles.item}
                        onPress={() => navigation.navigate('ProductList', { categoryId: cat._id, categoryName: cat.name })}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.circle, { backgroundColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length] }]}>
                            {cat.image ? (
                                <Image source={{ uri: cat.image }} style={styles.img} />
                            ) : (
                                <Text style={{ fontSize: 28 }}>{FALLBACK_EMOJI[i % FALLBACK_EMOJI.length]}</Text>
                            )}
                        </View>
                        <Text style={styles.label} numberOfLines={2}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 20 },
    header: { paddingHorizontal: 20, marginBottom: 18 },
    title: { fontSize: 13, fontWeight: '900', color: '#111827', letterSpacing: 2 },
    titleLine: { height: 2.5, width: 24, backgroundColor: '#E11D48', borderRadius: 2, marginTop: 5 },
    scroll: { paddingHorizontal: 16, gap: 4 },
    item: { alignItems: 'center', width: CIRCLE_SIZE + 20, marginRight: 8 },
    circle: {
        width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2,
        justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 10,
        borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.04)',
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
    },
    img: { width: '100%', height: '100%', resizeMode: 'cover' },
    label: { color: '#374151', fontSize: 11, fontWeight: '800', textAlign: 'center', lineHeight: 15 },
});

export default CategoryCircles;
