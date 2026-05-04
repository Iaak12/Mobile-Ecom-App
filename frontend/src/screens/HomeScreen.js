import React, { useEffect, useCallback, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, RefreshControl, Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, ShoppingBag, Heart, User } from 'lucide-react-native';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import useCMSStore from '../store/cmsStore';
import useCartStore from '../store/cartStore';

import BannerSlider from '../components/BannerSlider';
import CategoryCircles from '../components/CategoryCircles';
import ProductScroll from '../components/ProductScroll';
import FeaturedGrid from '../components/FeaturedGrid';
import TrustBar from '../components/TrustBar';
import CollectionBanner from '../components/CollectionBanner';

const { width } = Dimensions.get('window');
const PRIMARY = '#E11D48';

export default function HomeScreen({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const { products, categories, fetchProducts, fetchCategories } = useProductStore();
    const { homeContent, fetchHomeContent, loading: cmsLoading } = useCMSStore();
    const { user, isAuthenticated } = useAuthStore();
    const cartCount = useCartStore(s => s.getCount?.() || s.items?.length || 0);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const loadData = useCallback(async () => {
        await Promise.all([
            fetchHomeContent(),
            fetchCategories(),
            fetchProducts({ limit: 12 }),
        ]);
    }, []);

    useEffect(() => { loadData(); }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const renderSection = (section) => {
        if (!section.active) return null;
        switch (section.type) {
            case 'banner_slider':
                return <BannerSlider key={section._id} banners={section.items} navigation={navigation} />;
            case 'category_circles':
                return <CategoryCircles key={section._id} categories={categories} navigation={navigation} />;
            case 'product_scroll':
                const sp = products.filter(p => section.referenceIds?.includes(p._id));
                const dp = sp.length > 0 ? sp : products.slice(0, 6);
                return <ProductScroll key={section._id} title={section.title} products={dp} navigation={navigation} />;
            case 'featured_grid':
            case 'official_merch_grid':
                return <FeaturedGrid key={section._id} title={section.title} items={section.items} navigation={navigation} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* ── Top Header ── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.brandName}>THE <Text style={{ color: PRIMARY }}>STORE</Text></Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => navigation.navigate('ProductList', {})}
                        activeOpacity={0.7}
                    >
                        <Search size={20} color="#111827" strokeWidth={2.5} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => navigation.navigate('CartTab')}
                        activeOpacity={0.7}
                    >
                        <ShoppingBag size={20} color="#111827" strokeWidth={2.5} />
                        {cartCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{cartCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconBtn, { overflow: 'hidden' }]}
                        onPress={() => navigation.navigate('ProfileTab')}
                        activeOpacity={0.7}
                    >
                        {isAuthenticated ? (
                            <View style={styles.avatarBadge}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
                            </View>
                        ) : (
                            <User size={20} color="#111827" strokeWidth={2.5} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* ── Search Bar ── */}
                <TouchableOpacity
                    style={styles.searchWrap}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('ProductList', {})}
                >
                    <View style={styles.searchInner}>
                        <Search size={17} color="#9CA3AF" />
                        <Text style={styles.searchText}>Search products, brands...</Text>
                        <View style={styles.searchFilter}>
                            <Text style={{ color: PRIMARY, fontSize: 11, fontWeight: '800' }}>Filter</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* ── Greeting ── */}
                <View style={styles.greetSection}>
                    <Text style={styles.greetSub}>{greeting()} {isAuthenticated ? `${user?.name?.split(' ')[0]}` : 'there'} 👋</Text>
                    <Text style={styles.greetMain}>Discover what's{'\n'}trending today</Text>
                </View>

                {/* ── Content Sections ── */}
                {cmsLoading && !refreshing ? (
                    <View style={{ paddingVertical: 60, alignItems: 'center' }}>
                        <ActivityIndicator color={PRIMARY} size="large" />
                        <Text style={{ color: '#9CA3AF', marginTop: 12, fontWeight: '600', fontSize: 13 }}>Loading store...</Text>
                    </View>
                ) : (
                    <View>
                        {homeContent.banners?.length > 0 && (
                            <BannerSlider banners={homeContent.banners} navigation={navigation} />
                        )}
                        <TrustBar />
                        {homeContent.sections?.map(renderSection)}
                        {(!homeContent.sections || homeContent.sections.length === 0) && (
                            <CategoryCircles categories={categories} navigation={navigation} />
                        )}
                        <CollectionBanner
                            title="THE CURATED EDIT"
                            subtitle="EXCLUSIVE COLLECTION"
                            image="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1887"
                            onPress={() => navigation.navigate('ProductList', {})}
                        />
                        <ProductScroll title="TRENDING NOW" products={products} navigation={navigation} />
                        <ProductScroll title="NEW ARRIVALS" products={[...products].reverse().slice(0, 8)} navigation={navigation} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
    },
    brandName: { fontSize: 24, fontWeight: '900', letterSpacing: -1, color: '#111827' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconBtn: {
        width: 40, height: 40, borderRadius: 12, backgroundColor: '#F9FAFB',
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F3F4F6',
    },
    badge: {
        position: 'absolute', top: -4, right: -4, backgroundColor: PRIMARY,
        width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: '#fff',
    },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
    avatarBadge: { width: 28, height: 28, borderRadius: 8, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 12, fontWeight: '900' },
    // Search
    searchWrap: { paddingHorizontal: 20, marginTop: 14, marginBottom: 6 },
    searchInner: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
        borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12,
        borderWidth: 1, borderColor: '#F3F4F6', gap: 10,
    },
    searchText: { flex: 1, color: '#C4C4C4', fontSize: 14, fontWeight: '600' },
    searchFilter: { backgroundColor: '#FFF0F3', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#FFD6DE' },
    // Greeting
    greetSection: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 6 },
    greetSub: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', marginBottom: 6 },
    greetMain: { fontSize: 28, fontWeight: '900', color: '#111827', letterSpacing: -1, lineHeight: 34 },
});
