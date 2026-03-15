import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.4;

const ProductScroll = ({ title, products, navigation }) => {
    if (!products || products.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ProductList', {})}>
                    <Text style={styles.seeAll}>SEE ALL</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {products.map((item) => (
                    <TouchableOpacity 
                        key={item._id} 
                        style={styles.card}
                        onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
                    >
                        <View style={styles.imageBox}>
                            <Image source={{ uri: item.images?.[0]?.url }} style={styles.image} />
                            {item.discountPrice > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>SALE</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>₹{item.discountPrice || item.price}</Text>
                                {item.discountPrice > 0 && <Text style={styles.oldPrice}>₹{item.price}</Text>}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 25 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
    title: { color: '#111827', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
    seeAll: { color: '#E11D48', fontSize: 11, fontWeight: '900' },
    scroll: { paddingHorizontal: 15 },
    card: { 
        width: ITEM_WIDTH, 
        marginRight: 15, 
        backgroundColor: '#FFFFFF', 
        borderRadius: 24, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: '#F3F4F6',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10
    },
    imageBox: { height: 180, backgroundColor: '#F9FAFB' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    badge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#E11D48', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
    info: { padding: 14 },
    name: { color: '#111827', fontSize: 13, fontWeight: '700' },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
    price: { color: '#E11D48', fontSize: 15, fontWeight: '900' },
    oldPrice: { color: '#9CA3AF', fontSize: 12, textDecorationLine: 'line-through' }
});

export default ProductScroll;
