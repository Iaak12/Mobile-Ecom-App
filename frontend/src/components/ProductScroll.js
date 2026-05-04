import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

const ProductScroll = ({ title, products, navigation }) => {
    if (!products || products.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.titleUnderline} />
                </View>
                <TouchableOpacity
                    style={styles.seeAllBtn}
                    onPress={() => navigation.navigate('ProductList', {})}
                    activeOpacity={0.7}
                >
                    <Text style={styles.seeAll}>VIEW ALL</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 16}
                snapToAlignment="start"
            >
                {products.map((item) => {
                    const price = item.discountPrice > 0 ? item.discountPrice : item.price;
                    const hasDiscount = item.discountPrice > 0;
                    const discountPct = hasDiscount ? Math.round((1 - item.discountPrice / item.price) * 100) : 0;

                    return (
                        <TouchableOpacity
                            key={item._id}
                            style={styles.card}
                            onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
                            activeOpacity={0.93}
                        >
                            <View style={styles.imageBox}>
                                <Image
                                    source={{ uri: item.images?.[0]?.url || 'https://via.placeholder.com/300' }}
                                    style={styles.image}
                                />
                                {hasDiscount && (
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountText}>{discountPct}% OFF</Text>
                                    </View>
                                )}
                                {item.isFeatured && !hasDiscount && (
                                    <View style={styles.featuredBadge}>
                                        <Text style={styles.featuredText}>✦ FEATURED</Text>
                                    </View>
                                )}
                                <TouchableOpacity style={styles.wishBtn} activeOpacity={0.8}>
                                    <Heart size={14} color="#E11D48" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.info}>
                                {item.brand && (
                                    <Text style={styles.brand} numberOfLines={1}>{item.brand.toUpperCase()}</Text>
                                )}
                                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.price}>₹{price.toLocaleString()}</Text>
                                    {hasDiscount && (
                                        <Text style={styles.oldPrice}>₹{item.price.toLocaleString()}</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 24 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, marginBottom: 18,
    },
    title: { fontSize: 17, fontWeight: '900', color: '#111827', letterSpacing: -0.5, textTransform: 'uppercase' },
    titleUnderline: { height: 2.5, width: 24, backgroundColor: '#E11D48', borderRadius: 2, marginTop: 4 },
    seeAllBtn: { backgroundColor: '#FFF0F3', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#FFD6DE' },
    seeAll: { color: '#E11D48', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
    scroll: { paddingHorizontal: 16, paddingBottom: 4 },
    card: {
        width: CARD_WIDTH, marginRight: 14, backgroundColor: '#FFFFFF',
        borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4,
    },
    imageBox: { height: 190, backgroundColor: '#F9FAFB', position: 'relative' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    discountBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#E11D48', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    discountText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
    featuredBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#111827', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    featuredText: { color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
    wishBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', borderRadius: 10, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
    info: { padding: 14 },
    brand: { fontSize: 9, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1.5, marginBottom: 4 },
    name: { color: '#111827', fontSize: 13, fontWeight: '800', letterSpacing: -0.2, lineHeight: 18 },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
    price: { color: '#111827', fontSize: 15, fontWeight: '900' },
    oldPrice: { color: '#D1D5DB', fontSize: 12, textDecorationLine: 'line-through', fontWeight: '700' },
});

export default ProductScroll;
