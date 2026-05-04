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
    container: { marginVertical: 25 },
    header: { paddingHorizontal: 22, marginBottom: 18 },
    title: { 
        color: '#111827', 
        fontSize: 14, 
        fontWeight: '900', 
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    scroll: { paddingHorizontal: 18 },
    item: { alignItems: 'center', width: 90, marginRight: 10 },
    circle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    catName: { 
        color: '#111827', 
        fontSize: 10, 
        fontWeight: '900', 
        marginTop: 10, 
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    }
});

export default CategoryCircles;
