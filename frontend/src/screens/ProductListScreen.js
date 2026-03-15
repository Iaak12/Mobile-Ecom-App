import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
    Image, ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, SlidersHorizontal, Grid, List } from 'lucide-react-native';
import useProductStore from '../store/productStore';

const { width } = Dimensions.get('window');
const SLENDER_CARD_WIDTH = (width - 50) / 2;

const SORT_OPTIONS = [
    { label: 'Latest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
];

export default function ProductListScreen({ navigation, route }) {
    const { category, categoryName, search: initialSearch } = route.params || {};
    const [search, setSearch] = useState(initialSearch || '');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const { products, pages, fetchProducts, loading } = useProductStore();

    const load = useCallback((pg = 1) => {
        fetchProducts({ category, search: search || undefined, sort, page: pg, limit: 12 });
    }, [category, search, sort]);

    useEffect(() => { load(1); setPage(1); }, [sort]);
    useEffect(() => { load(1); }, []);

    const handleSearch = () => { load(1); setPage(1); };
    const loadMore = () => {
        if (page < pages) { const next = page + 1; setPage(next); load(next); }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
        >
            <View style={styles.imgBox}>
                <Image 
                    source={{ uri: item.images?.[0]?.url || 'https://via.placeholder.com/300' }} 
                    style={styles.img} 
                />
                {item.discountPrice > 0 && (
                    <View style={styles.offerBadge}>
                        <Text style={styles.offerText}>
                            {Math.round((1 - item.discountPrice / item.price) * 100)}% OFF
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>₹{item.discountPrice || item.price}</Text>
                    {item.discountPrice > 0 && (
                        <Text style={styles.oldPrice}>₹{item.price}</Text>
                    )}
                </View>
                <View style={styles.footer}>
                     <Text style={styles.brand}>Official Merch</Text>
                     <Text style={styles.rating}>⭐ {item.ratings?.toFixed(1) || '4.0'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <ArrowLeft size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.titleWrap}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{categoryName || 'The Collection'}</Text>
                    <Text style={styles.itemCount}>{products.length} Items Available</Text>
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                     <Search size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <TouchableOpacity style={styles.filterItem}>
                    <SlidersHorizontal size={14} color="#8B8BA7" />
                    <Text style={styles.filterLabel}>Filters</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.filterItem}>
                    <Text style={styles.filterLabel}>{SORT_OPTIONS.find(o => o.value === sort)?.label}</Text>
                </TouchableOpacity>
            </View>

            {loading && page === 1 ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#6C63FF" size="large" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(i) => i._id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <ActivityIndicator color="#6C63FF" style={{ marginVertical: 20 }} /> : null}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={{ width: 100, height: 100, marginBottom: 20, opacity: 0.5 }} />
                            <Text style={styles.emptyTitle}>Nothing here yet!</Text>
                            <Text style={styles.emptySub}>Try adjusting your filters or search.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFFFFF'
    },
    iconBtn: { padding: 8, backgroundColor: '#F9FAFB', borderRadius: 12 },
    titleWrap: { flex: 1, marginHorizontal: 15 },
    headerTitle: { color: '#111827', fontSize: 16, fontWeight: '900' },
    itemCount: { color: '#6B7280', fontSize: 11, fontWeight: '700', marginTop: 2 },
    filterBar: { 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        height: 50, 
        borderBottomWidth: 1, 
        borderBottomColor: '#F3F4F6',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    filterItem: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    filterLabel: { color: '#111827', fontSize: 12, fontWeight: '800' },
    divider: { width: 1, height: '50%', backgroundColor: '#F3F4F6', alignSelf: 'center' },
    listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
    row: { justifyContent: 'space-between', marginBottom: 20 },
    card: { 
        width: SLENDER_CARD_WIDTH, 
        backgroundColor: '#FFFFFF', 
        borderRadius: 24, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: '#F3F4F6',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10
    },
    imgBox: { height: 180, width: '100%', backgroundColor: '#F9FAFB' },
    img: { width: '100%', height: '100%', resizeMode: 'cover' },
    offerBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#E11D48', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    offerText: { color: '#fff', fontSize: 10, fontWeight: '900' },
    info: { padding: 14 },
    name: { color: '#111827', fontSize: 13, fontWeight: '800', marginBottom: 6 },
    priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    price: { color: '#E11D48', fontSize: 16, fontWeight: '900' },
    oldPrice: { color: '#9CA3AF', fontSize: 12, textDecorationLine: 'line-through' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    brand: { color: '#6B7280', fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
    rating: { color: '#111827', fontSize: 10, fontWeight: '800' },
    emptyTitle: { color: '#111827', fontSize: 18, fontWeight: '900', marginBottom: 5 },
    emptySub: { color: '#6B7280', fontSize: 13 }
});
