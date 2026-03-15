import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const CategoryCircles = ({ categories, navigation }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>SHOP BY CATEGORY</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {categories.map((cat) => (
                    <TouchableOpacity 
                        key={cat._id} 
                        style={styles.item}
                        onPress={() => navigation.navigate('ProductList', { category: cat._id, categoryName: cat.name })}
                    >
                        <View style={styles.circle}>
                            {cat.image ? (
                                <Image source={{ uri: cat.image }} style={styles.image} />
                            ) : (
                                <Text style={{fontSize: 24}}>📁</Text>
                            )}
                        </View>
                        <Text style={styles.catName} numberOfLines={1}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 20 },
    header: { paddingHorizontal: 20, marginBottom: 15 },
    title: { color: '#111827', fontSize: 13, fontWeight: '900', letterSpacing: 1.2 },
    scroll: { paddingHorizontal: 15 },
    item: { alignItems: 'center', width: 85, marginRight: 8 },
    circle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E11D4822',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    catName: { color: '#374151', fontSize: 11, fontWeight: '800', marginTop: 8, textAlign: 'center' }
});

export default CategoryCircles;
