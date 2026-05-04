import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, RefreshControl, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, User, Heart, Menu } from 'lucide-react-native';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import useCMSStore from '../store/cmsStore';

// Components
import BannerSlider from '../components/BannerSlider';
import CategoryCircles from '../components/CategoryCircles';
import ProductScroll from '../components/ProductScroll';
import FeaturedGrid from '../components/FeaturedGrid';
import TrustBar from '../components/TrustBar';
import CollectionBanner from '../components/CollectionBanner';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const { products, categories, fetchProducts, fetchCategories } = useProductStore();
    const { homeContent, fetchHomeContent, loading: cmsLoading } = useCMSStore();
    const { user, isAuthenticated } = useAuthStore();

    const loadData = useCallback(async () => {
        await Promise.all([
            fetchHomeContent(),
            fetchCategories(),
            fetchProducts({ limit: 12 })
        ]);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

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
                const sectionProducts = products.filter(p => section.referenceIds.includes(p._id));
                const displayProducts = sectionProducts.length > 0 ? sectionProducts : products.slice(0, 6);
                return <ProductScroll key={section._id} title={section.title} products={displayProducts} navigation={navigation} />;
            case 'featured_grid':
            case 'official_merch_grid':
                return <FeaturedGrid key={section._id} title={section.title} items={section.items} navigation={navigation} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Menu size={22} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.brandText}>TSS<Text style={{ color: '#6C63FF' }}>.</Text></Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                         <Heart size={21} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('ProfileTab')}>
                         <User size={21} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                         <Bell size={21} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />}
            >
                {/* Search Bar */}
                <TouchableOpacity 
                    style={styles.searchWrap} 
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('ProductList', {})}
                >
                    <View style={styles.searchInner}>
                        <Search size={18} color="#8B8BA7" />
                        <Text style={styles.searchPlaceholder}>Search official merchandise...</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.greeting}>
                     <Text style={styles.greetText}>Shop official merch,</Text>
                     <Text style={styles.userName}>{isAuthenticated ? `Welcome back, ${user?.name.split(' ')[0]}!` : 'Hey there, Rockstar!'}</Text>
                </View>

                {cmsLoading && !refreshing ? (
                    <ActivityIndicator color="#E11D48" style={{ marginTop: 50 }} />
                ) : (
                    <View style={styles.content}>
                        {homeContent.banners?.length > 0 && (
                            <BannerSlider banners={homeContent.banners} navigation={navigation} />
                        )}
                        
                        <TrustBar />

                        {homeContent.sections?.map(renderSection)}
                        
                        {(!homeContent.sections || homeContent.sections.length === 0) && (
                            <CategoryCircles categories={categories} navigation={navigation} />
                        )}

                        <CollectionBanner 
                            title="THE CURATED LIST" 
                            subtitle="BEST OF MERCHANDISE"
                            image="https://plus.unsplash.com/premium_photo-1673356263234-58079ed0c67e?q=80&w=1887"
                            onPress={() => navigation.navigate('ProductList', {})}
                        />

                        <ProductScroll title="TRENDING NOW" products={products} navigation={navigation} />
                    </View>
                )}
                
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        height: 70, 
        backgroundColor: '#FFFFFF',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    brandText: { 
        color: '#000', 
        fontSize: 28, 
        fontWeight: '900', 
        letterSpacing: -2,
        textTransform: 'uppercase'
    },
    iconBtn: { 
        padding: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    searchWrap: { 
        paddingHorizontal: 20, 
        marginTop: 5, 
        marginBottom: 15 
    },
    searchInner: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F3F4F6', 
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    searchPlaceholder: { 
        color: '#9CA3AF', 
        fontSize: 14, 
        marginLeft: 12, 
        fontWeight: '700',
        letterSpacing: -0.3
    },
    greeting: { 
        paddingHorizontal: 22, 
        marginVertical: 10,
        marginBottom: 20
    },
    greetText: { 
        color: '#9CA3AF', 
        fontSize: 11, 
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: 2 
    },
    userName: { 
        color: '#111827', 
        fontSize: 32, 
        fontWeight: '900', 
        marginTop: 2,
        letterSpacing: -1.2
    },
    content: { flex: 1 },
});
