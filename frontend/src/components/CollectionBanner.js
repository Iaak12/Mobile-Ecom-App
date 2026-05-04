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
        width: width - 40,
        height: 220,
        marginHorizontal: 20,
        borderRadius: 40,
        overflow: 'hidden',
        marginBottom: 30,
        backgroundColor: '#F3F4F6',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 20
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        padding: 30,
    },
    content: {
        alignItems: 'center',
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 3,
        marginBottom: 8,
        textTransform: 'uppercase'
    },
    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: -1.5,
        lineHeight: 38
    },
    btn: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 20,
    },
    btnText: {
        color: '#000000',
        fontWeight: '900',
        fontSize: 11,
        letterSpacing: 2,
    },
});
