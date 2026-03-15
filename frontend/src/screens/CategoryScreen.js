import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronRight } from 'lucide-react-native';
import useProductStore from '../store/productStore';

const { width } = Dimensions.get('window');

export default function CategoryScreen({ navigation }) {
    const { categories, fetchCategories } = useProductStore();

    useEffect(() => {
        fetchCategories();
    }, []);

    const renderCategory = ({ item }) => (
        <TouchableOpacity 
            style={styles.catBox}
            onPress={() => navigation.navigate('ProductList', { category: item._id, categoryName: item.name })}
        >
            <View style={styles.catImageWrap}>
                <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.catImage} />
                <View style={styles.overlay} />
                <View style={styles.catInfo}>
                    <Text style={styles.catName}>{item.name.toUpperCase()}</Text>
                    <View style={styles.shopNow}>
                        <Text style={styles.shopNowText}>SHOP NOW</Text>
                        <ChevronRight size={14} color="#6C63FF" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>CATEGORIES</Text>
                <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate('ProductList', {})}>
                    <Search size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={item => item._id}
                numColumns={2}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
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
        height: 60, 
        borderBottomWidth: 1, 
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFFFFF'
    },
    headerTitle: { color: '#111827', fontSize: 18, fontWeight: '900', letterSpacing: 1.5 },
    searchIcon: { padding: 8 },
    list: { padding: 12 },
    catBox: { 
        width: (width - 40) / 2, 
        margin: 8, 
        height: 240, 
        borderRadius: 24, 
        overflow: 'hidden', 
        backgroundColor: '#F9FAFB',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10
    },
    catImageWrap: { flex: 1 },
    catImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
    catInfo: { position: 'absolute', bottom: 15, left: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.95)', padding: 12, borderRadius: 16 },
    catName: { color: '#111827', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
    shopNow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
    shopNowText: { color: '#E11D48', fontSize: 10, fontWeight: '900' }
});
