import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CollectionBanner = ({ title, subtitle, image, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
        <ImageBackground
            source={{ uri: image }}
            style={styles.bg}
            imageStyle={{ borderRadius: 24 }}
        >
            {/* Gradient Overlay */}
            <View style={styles.overlay} />
            <View style={styles.content}>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.cta}>
                    <Text style={styles.ctaText}>EXPLORE NOW</Text>
                    <Text style={styles.arrow}>→</Text>
                </View>
            </View>
        </ImageBackground>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { marginHorizontal: 16, marginVertical: 20, borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
    bg: { width: '100%', height: 200, justifyContent: 'flex-end' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 24 },
    content: { padding: 24 },
    subtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '900', letterSpacing: 3, marginBottom: 6 },
    title: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.5, marginBottom: 16, lineHeight: 26 },
    cta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E11D48', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
    ctaText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
    arrow: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});

export default CollectionBanner;
