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
    container: { marginVertical: 30 },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 22, 
        marginBottom: 20 
    },
    title: { 
        color: '#111827', 
        fontSize: 18, 
        fontWeight: '900', 
        letterSpacing: -0.5,
        textTransform: 'uppercase'
    },
    seeAll: { 
        color: '#E11D48', 
        fontSize: 11, 
        fontWeight: '900',
        letterSpacing: 1.5
    },
    scroll: { paddingHorizontal: 15 },
    card: { 
        width: ITEM_WIDTH, 
        marginRight: 18, 
        backgroundColor: '#FFFFFF', 
        borderRadius: 28, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: '#F3F4F6',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12
    },
    imageBox: { height: 200, backgroundColor: '#F9FAFB' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    badge: { 
        position: 'absolute', 
        top: 12, 
        left: 12, 
        backgroundColor: '#000', 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 10 
    },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    info: { padding: 18 },
    name: { 
        color: '#111827', 
        fontSize: 14, 
        fontWeight: '800',
        letterSpacing: -0.2
    },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
    price: { color: '#000', fontSize: 17, fontWeight: '900' },
    oldPrice: { color: '#9CA3AF', fontSize: 13, textDecorationLine: 'line-through', fontWeight: '700' }
});

export default ProductScroll;
