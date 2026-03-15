import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function CollectionBanner({ title, subtitle, image, onPress }) {
    return (
        <TouchableOpacity 
            style={styles.container} 
            activeOpacity={0.9}
            onPress={onPress}
        >
            <Image 
                source={{ uri: image || 'https://images.unsplash.com/photo-1523381235312-3a1647fa9921?q=80&w=2070' }} 
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.subtitle}>{subtitle || 'SEASONAL FAVS'}</Text>
                    <Text style={styles.title}>{title || 'SUMMER COLLECTION'}</Text>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>SHOP NOW</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width - 32,
        height: 200,
        marginHorizontal: 16,
        borderRadius: 32,
        overflow: 'hidden',
        marginBottom: 25,
        backgroundColor: '#F3F4F6',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
        padding: 24,
    },
    content: {
        alignItems: 'flex-start',
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 4,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    btn: {
        backgroundColor: '#E11D48',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 14,
    },
    btnText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },
});
