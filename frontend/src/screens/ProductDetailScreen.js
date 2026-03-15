import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
    ActivityIndicator, Alert, Dimensions, TextInput, Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
    ArrowLeft, 
    Heart, 
    Share2, 
    Star, 
    Truck, 
    ShieldCheck, 
    MessageSquare,
    ChevronRight,
    ShoppingBag
} from 'lucide-react-native';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axiosInstance';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
    const { id } = route.params;
    const { product, loading, fetchProduct } = useProductStore();
    const addToCart = useCartStore((s) => s.addToCart);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(0);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => { fetchProduct(id); }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) return navigation.navigate('Profile');
        const result = await addToCart(id, qty);
        if (result.success) Alert.alert('Added to Bag', 'Product added successfully!');
        else Alert.alert('Error', result.message);
    };

    const onShare = async () => {
        try {
            await Share.share({ message: `Check out ${product.name} on StoreHub!`, url: 'https://storehub.app' });
        } catch (error) { }
    };

    if (loading || !product) return (
        <View style={[styles.container, styles.center]}>
            <ActivityIndicator color="#6C63FF" size="large" />
        </View>
    );

    const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    const discount = product.discountPrice > 0 ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ArrowLeft size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={onShare} style={styles.headerBtn}>
                        <Share2 size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsWishlisted(!isWishlisted)} style={styles.headerBtn}>
                        <Heart size={20} color={isWishlisted ? '#FF6584' : '#fff'} fill={isWishlisted ? '#FF6584' : 'transparent'} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Image Gallery */}
                <View style={styles.gallery}>
                    <Image 
                        source={{ uri: product.images?.[activeImg]?.url || 'https://via.placeholder.com/400' }} 
                        style={styles.mainImg} 
                    />
                    {discount > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{discount}% OFF</Text>
                        </View>
                    )}
                    {product.images?.length > 1 && (
                        <View style={styles.pagination}>
                            {product.images.map((_, i) => (
                                <View key={i} style={[styles.dot, activeImg === i && styles.dotActive]} />
                            ))}
                        </View>
                    )}
                </View>

                {/* Thumbnails */}
                {product.images?.length > 1 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbs}>
                        {product.images.map((img, i) => (
                            <TouchableOpacity key={i} onPress={() => setActiveImg(i)} style={[styles.thumbBox, activeImg === i && styles.thumbActive]}>
                                <Image source={{ uri: img.url }} style={styles.thumbImg} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.brand}>{product.brand || 'OFFICIAL MERCH'}</Text>
                            <Text style={styles.name}>{product.name}</Text>
                        </View>
                        <View style={styles.ratingBox}>
                             <Star size={14} color="#FFD700" fill="#FFD700" />
                             <Text style={styles.ratingValue}>{product.ratings?.toFixed(1) || '4.0'}</Text>
                        </View>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₹{displayPrice}</Text>
                        {discount > 0 && <Text style={styles.oldPrice}>₹{product.price}</Text>}
                        <View style={styles.taxInfo}>
                             <Text style={styles.taxText}>Inclusive of all taxes</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Trust Badges */}
                    <View style={styles.trustRow}>
                        <View style={styles.trustItem}>
                            <Truck size={20} color="#43E97B" />
                            <Text style={styles.trustText}>Free Delivery</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <ShieldCheck size={20} color="#6C63FF" />
                            <Text style={styles.trustText}>100% Cotton</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Product Details</Text>
                        <Text style={styles.descText}>{product.description}</Text>
                    </View>

                    {/* Reviews Summary */}
                    <TouchableOpacity style={styles.reviewSummary}>
                        <View style={styles.iconBox}>
                            <MessageSquare size={18} color="#6C63FF" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 15 }}>
                            <Text style={styles.reviewTitle}>Reviews ({product.numReviews})</Text>
                            <Text style={styles.reviewSub}>See what other fans are saying</Text>
                        </View>
                        <ChevronRight size={20} color="#555" />
                    </TouchableOpacity>

                </View>
            </ScrollView>

            {/* Sticky Bottom Footer */}
            <View style={styles.footerSticky}>
                <View style={styles.qtyPicker}>
                    <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}><Text style={styles.qtyBtnContent}>-</Text></TouchableOpacity>
                    <Text style={styles.qtyText}>{qty}</Text>
                    <TouchableOpacity onPress={() => setQty(Math.min(product.stock, qty + 1))} style={styles.qtyBtn}><Text style={styles.qtyBtnContent}>+</Text></TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={[styles.mainBtn, product.stock === 0 && styles.btnDisabled]} 
                    disabled={product.stock === 0}
                    onPress={handleAddToCart}
                >
                    <ShoppingBag size={20} color="#fff" />
                    <Text style={styles.mainBtnText}>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    center: { justifyContent: 'center', alignItems: 'center' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 10, 
        paddingTop: 10 
    },
    headerBtn: { 
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#F3F4F6',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    headerActions: { flexDirection: 'row', gap: 10 },
    gallery: { width: width, height: 480, backgroundColor: '#F9FAFB' },
    mainImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    discountBadge: { 
        position: 'absolute', 
        bottom: 25, 
        left: 20, 
        backgroundColor: '#E11D48', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 12 
    },
    discountText: { color: '#fff', fontSize: 13, fontWeight: '900' },
    pagination: { position: 'absolute', bottom: 25, alignSelf: 'center', flexDirection: 'row', gap: 8 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(225, 29, 72, 0.2)' },
    dotActive: { width: 24, backgroundColor: '#E11D48' },
    thumbs: { paddingHorizontal: 20, marginVertical: 20, gap: 12 },
    thumbBox: { width: 65, height: 65, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: '#F3F4F6' },
    thumbActive: { borderColor: '#E11D48' },
    thumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    content: { paddingHorizontal: 20, paddingBottom: 20 },
    titleRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        paddingBottom: 20 
    },
    brand: { color: '#E11D48', fontSize: 13, fontWeight: '900', letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' },
    name: { color: '#111827', fontSize: 26, fontWeight: '900', lineHeight: 32 },
    ratingBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 5, 
        backgroundColor: '#F9FAFB', 
        paddingHorizontal: 10, 
        paddingVertical: 6, 
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    ratingValue: { color: '#111827', fontSize: 13, fontWeight: '800' },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginBottom: 25 },
    price: { color: '#111827', fontSize: 32, fontWeight: '900' },
    oldPrice: { color: '#9CA3AF', fontSize: 20, textDecorationLine: 'line-through' },
    taxInfo: { marginLeft: 'auto' },
    taxText: { color: '#6B7280', fontSize: 11, fontWeight: '700' },
    divider: { height: 1.5, backgroundColor: '#F3F4F6', marginVertical: 15 },
    trustRow: { flexDirection: 'row', gap: 16, marginVertical: 15 },
    trustItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10, 
        backgroundColor: '#F9FAFB', 
        padding: 14, 
        borderRadius: 20, 
        flex: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    trustText: { color: '#111827', fontSize: 12, fontWeight: '800' },
    section: { marginVertical: 20 },
    sectionTitle: { color: '#111827', fontSize: 18, fontWeight: '900', marginBottom: 12 },
    descText: { color: '#4B5563', fontSize: 15, lineHeight: 24, fontWeight: '500' },
    reviewSummary: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F9FAFB', 
        padding: 22, 
        borderRadius: 28, 
        marginVertical: 15, 
        borderWidth: 1, 
        borderColor: '#F3F4F6' 
    },
    iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#E11D4810', justifyContent: 'center', alignItems: 'center' },
    reviewTitle: { color: '#111827', fontSize: 16, fontWeight: '900' },
    reviewSub: { color: '#6B7280', fontSize: 13, marginTop: 3, fontWeight: '600' },
    footerSticky: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: '#FFFFFF', 
        padding: 20, 
        paddingBottom: 40, 
        borderTopWidth: 1, 
        borderTopColor: '#F3F4F6', 
        flexDirection: 'row', 
        gap: 16,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15
    },
    qtyPicker: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F9FAFB', 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: '#F3F4F6',
        paddingHorizontal: 8
    },
    qtyBtn: { 
        width: 40, 
        height: 48, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    qtyBtnContent: { color: '#E11D48', fontSize: 22, fontWeight: '900' },
    qtyText: { color: '#111827', fontSize: 18, fontWeight: '900', minWidth: 30, textAlign: 'center' },
    mainBtn: { 
        flex: 1, 
        backgroundColor: '#E11D48', 
        borderRadius: 20, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 12,
        height: 56
    },
    btnDisabled: { backgroundColor: '#D1D5DB' },
    mainBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' }
});
