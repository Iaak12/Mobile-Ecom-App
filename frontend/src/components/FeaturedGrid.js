import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';

const { width } = Dimensions.get('window');

const FeaturedGrid = ({ title, items, navigation }) => {
    if (!items || items.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.grid}>
                {items.slice(0, 4).map((item, idx) => (
                    <TouchableOpacity 
                        key={idx} 
                        style={styles.item}
                        onPress={() => {
                            if (item.linkType === 'category') navigation.navigate('ProductList', { category: item.linkId });
                            if (item.linkType === 'product') navigation.navigate('ProductDetail', { id: item.linkId });
                        }}
                    >
                        <Image source={{ uri: item.image?.url }} style={styles.image} />
                        <View style={styles.footer}>
                           <Text style={styles.itemTitle}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, marginVertical: 25 },
    title: { color: '#111827', fontSize: 16, fontWeight: '900', marginBottom: 15, letterSpacing: 0.5 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    item: { 
        width: '48%', 
        aspectRatio: 1, 
        backgroundColor: '#FFFFFF', 
        borderRadius: 24, 
        marginBottom: '4%', 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: '#F3F4F6',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(255, 255, 255, 0.85)' },
    itemTitle: { color: '#111827', fontSize: 11, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' }
});

export default FeaturedGrid;
