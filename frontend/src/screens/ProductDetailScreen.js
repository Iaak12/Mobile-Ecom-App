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
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.95)', 
        justifyContent: 'center', alignItems: 'center', 
        borderWidth: 1, borderColor: '#F3F4F6',
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 4,
    },
    headerActions: { flexDirection: 'row', gap: 10 },
    gallery: { width, height: 460, backgroundColor: '#F9FAFB' },
    mainImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    discountBadge: { 
        position: 'absolute', bottom: 20, left: 20, 
        backgroundColor: '#E11D48', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 
    },
    discountText: { color: '#fff', fontSize: 13, fontWeight: '900' },
    pagination: { position: 'absolute', bottom: 20, right: 20, flexDirection: 'row', gap: 6 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.15)' },
    dotActive: { width: 20, backgroundColor: '#E11D48', borderRadius: 3 },
    thumbs: { paddingHorizontal: 20, marginVertical: 16, gap: 10 },
    thumbBox: { width: 60, height: 60, borderRadius: 14, overflow: 'hidden', borderWidth: 2, borderColor: '#F3F4F6' },
    thumbActive: { borderColor: '#E11D48' },
    thumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    content: { paddingHorizontal: 20, paddingBottom: 20 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 14 },
    brand: { color: '#E11D48', fontSize: 10, fontWeight: '900', letterSpacing: 2.5, marginBottom: 6, textTransform: 'uppercase' },
    name: { color: '#111827', fontSize: 22, fontWeight: '900', lineHeight: 28, letterSpacing: -0.5, flex: 1, marginRight: 12 },
    ratingBox: { 
        flexDirection: 'row', alignItems: 'center', gap: 4, 
        backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 6, 
        borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A', alignSelf: 'flex-start'
    },
    ratingValue: { color: '#92400E', fontSize: 12, fontWeight: '900' },
    priceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
    price: { color: '#111827', fontSize: 28, fontWeight: '900' },
    oldPrice: { color: '#D1D5DB', fontSize: 18, textDecorationLine: 'line-through', fontWeight: '700' },
    taxInfo: {},
    taxText: { color: '#10B981', fontSize: 11, fontWeight: '800', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },
    trustRow: { flexDirection: 'row', gap: 10, marginVertical: 10 },
    trustItem: { 
        flexDirection: 'row', alignItems: 'center', gap: 7,
        backgroundColor: '#F9FAFB', padding: 12, borderRadius: 14, flex: 1,
        borderWidth: 1, borderColor: '#F3F4F6'
    },
    trustText: { color: '#374151', fontSize: 11, fontWeight: '800' },
    section: { marginVertical: 14 },
    sectionTitle: { color: '#111827', fontSize: 16, fontWeight: '900', marginBottom: 10, letterSpacing: -0.3 },
    descText: { color: '#6B7280', fontSize: 14, lineHeight: 22, fontWeight: '500' },
    reviewSummary: { 
        flexDirection: 'row', alignItems: 'center', 
        backgroundColor: '#F9FAFB', padding: 16, borderRadius: 18, 
        marginVertical: 10, borderWidth: 1, borderColor: '#F3F4F6' 
    },
    iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF0F3', justifyContent: 'center', alignItems: 'center' },
    reviewTitle: { color: '#111827', fontSize: 14, fontWeight: '900' },
    reviewSub: { color: '#9CA3AF', fontSize: 12, marginTop: 2, fontWeight: '600' },
    footerSticky: { 
        position: 'absolute', bottom: 0, left: 0, right: 0, 
        backgroundColor: '#FFFFFF', 
        paddingHorizontal: 16, paddingTop: 14, paddingBottom: 34, 
        borderTopWidth: 1, borderTopColor: '#F3F4F6', 
        flexDirection: 'row', gap: 12,
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, 
        shadowOffset: { width: 0, height: -6 }, elevation: 15,
    },
    qtyPicker: { 
        flexDirection: 'row', alignItems: 'center', 
        backgroundColor: '#F9FAFB', borderRadius: 16, 
        borderWidth: 1.5, borderColor: '#F3F4F6', paddingHorizontal: 4
    },
    qtyBtn: { width: 36, height: 48, justifyContent: 'center', alignItems: 'center' },
    qtyBtnContent: { color: '#E11D48', fontSize: 22, fontWeight: '900' },
    qtyText: { color: '#111827', fontSize: 17, fontWeight: '900', minWidth: 26, textAlign: 'center' },
    mainBtn: { 
        flex: 1, backgroundColor: '#E11D48', borderRadius: 16, 
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, height: 52,
        shadowColor: '#E11D48', shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
    },
    btnDisabled: { backgroundColor: '#E5E7EB', shadowOpacity: 0 },
    mainBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.2 }
});
