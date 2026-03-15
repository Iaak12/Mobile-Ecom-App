import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width * 0.85;

const BannerSlider = ({ banners, navigation }) => {
    if (!banners || banners.length === 0) return null;

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.slide} 
            activeOpacity={0.9}
            onPress={() => {
                if (item.linkType === 'product') navigation.navigate('ProductDetail', { id: item.linkId });
                if (item.linkType === 'category') navigation.navigate('ProductList', { category: item.linkId });
            }}
        >
            <Image source={{ uri: item.image.url }} style={styles.image} />
            {(item.title || item.subtitle) && (
                <View style={styles.overlay}>
                    {item.title && <Text style={styles.title}>{item.title}</Text>}
                    {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={banners}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SLIDE_WIDTH + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.container}
            keyExtractor={(_, index) => index.toString()}
        />
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, paddingVertical: 15 },
    slide: {
        width: SLIDE_WIDTH,
        height: 190,
        marginRight: 20,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: '#F9FAFB',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(225, 29, 72, 0.75)', // Premium Red Translucent
    },
    title: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
    subtitle: { color: '#fff', opacity: 0.9, fontSize: 12, fontWeight: '700', marginTop: 2 }
});

export default BannerSlider;
