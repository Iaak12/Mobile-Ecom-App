import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { 
    Home, 
    User, 
    LayoutGrid, 
    ShoppingCart
} from 'lucide-react-native';

import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import RazorpayWebViewScreen from '../screens/RazorpayWebViewScreen';
import RazorpayVerifyScreen from '../screens/RazorpayVerifyScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = { headerShown: false, cardStyle: { backgroundColor: '#FFFFFF' } };

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </Stack.Navigator>
    );
}

function CartStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="RazorpayWebView" component={RazorpayWebViewScreen} />
            <Stack.Screen name="RazorpayVerify" component={RazorpayVerifyScreen} />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            {isAuthenticated ? (
                <>
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
                    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
                    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

function MainTabs() {
    const cartCount = useCartStore((s) => s.getCount());

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#E11D48',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIcon: ({ focused, color }) => {
                    const iconSize = 24;
                    if (route.name === 'HomeTab') return <Home size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />;
                    if (route.name === 'CategoriesTab') return <LayoutGrid size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />;
                    if (route.name === 'CartTab') return <ShoppingCart size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />;
                    if (route.name === 'ProfileTab') return <User size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />;
                    return <Home size={iconSize} color={color} />;
                },
            })}>
            <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="CategoriesTab" component={CategoryScreen} options={{ tabBarLabel: 'Categories' }} />
            <Tab.Screen
                name="CartTab"
                component={CartStack}
                options={{
                    tabBarLabel: 'Cart',
                    tabBarBadge: cartCount > 0 ? cartCount : undefined,
                    tabBarBadgeStyle: { backgroundColor: '#E11D48', color: '#fff', fontSize: 10, fontWeight: '900' },
                }}
            />
            <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ tabBarLabel: 'Account' }} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { initAuth } = useAuthStore();
    const [booting, setBooting] = React.useState(true);

    useEffect(() => {
        (async () => {
            await initAuth();
            setTimeout(() => setBooting(false), 2000);
        })();
    }, []);

    if (booting) return (
        <View style={styles.splash}>
            <View style={styles.logoContainer}>
                <Text style={styles.splashEmoji}>🛍️</Text>
                <Text style={styles.splashTitle}>THE SOULED<Text style={{ color: '#E11D48' }}> STORE</Text></Text>
                <Text style={styles.splashSubtitle}>OFFICIAL MERCHANDISE</Text>
            </View>
            <ActivityIndicator color="#E11D48" size="large" style={styles.loader} />
        </View>
    );

    return (
        <NavigationContainer>
            <MainTabs />
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    splash: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
    logoContainer: { alignItems: 'center' },
    splashEmoji: { fontSize: 70, marginBottom: 20 },
    splashTitle: { color: '#111827', fontSize: 28, fontWeight: '900', letterSpacing: 0.5 },
    splashSubtitle: { color: '#E11D48', fontSize: 11, fontWeight: '800', letterSpacing: 5, marginTop: 10 },
    loader: { position: 'absolute', bottom: 100 },
    tabBar: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#F3F4F6',
        borderTopWidth: 1,
        height: 75,
        paddingBottom: 15,
        paddingTop: 10,
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: -4 }
    },
    tabBarLabel: { fontSize: 11, fontWeight: '900', marginTop: 4 }
});
