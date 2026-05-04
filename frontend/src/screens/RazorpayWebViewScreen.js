import React, { useRef, useState } from 'react';
import {
    View, ActivityIndicator, Text, TouchableOpacity,
    StyleSheet, StatusBar, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

/**
 * RazorpayWebViewScreen
 * Receives via route.params:
 *   - razorpayOrderId   : string  — the Razorpay order id from backend
 *   - amount            : number  — in INR (not paise)
 *   - key               : string  — Razorpay API key
 *   - name              : string  — customer name
 *   - email             : string  — customer email
 *   - phone             : string  — customer phone
 *   - orderId           : string  — your app's MongoDB order id
 *   - onSuccess         : fn(paymentData) — called on successful payment
 */
export default function RazorpayWebViewScreen({ route, navigation }) {
    const {
        razorpayOrderId, amount, key,
        name = 'Customer', email = '', phone = '',
        orderId,
    } = route.params || {};

    const webViewRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [paid, setPaid] = useState(false);

    // Build the Razorpay checkout HTML page
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f8f9fa; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .card { background: white; border-radius: 24px; padding: 32px 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); width: 100%; max-width: 400px; }
    .logo { font-size: 28px; font-weight: 900; text-align: center; margin-bottom: 8px; color: #111; }
    .logo span { color: #E11D48; }
    .subtitle { text-align: center; color: #6b7280; font-size: 13px; margin-bottom: 28px; }
    .amount { text-align: center; font-size: 36px; font-weight: 900; color: #111; margin-bottom: 32px; }
    .amount small { font-size: 20px; color: #E11D48; }
    .btn { width: 100%; padding: 18px; background: linear-gradient(135deg, #E11D48, #FB7185); color: white; border: none; border-radius: 16px; font-size: 17px; font-weight: 800; cursor: pointer; letter-spacing: 0.5px; }
    .btn:active { opacity: 0.85; }
    .secure { text-align: center; color: #9ca3af; font-size: 11px; margin-top: 16px; }
    .loader { display: none; }
    .loading .loader { display: block; text-align: center; color: #6b7280; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card" id="card">
    <div class="logo">THE <span>STORE</span></div>
    <div class="subtitle">Secure Checkout</div>
    <div class="amount"><small>₹</small>${Number(amount).toLocaleString('en-IN')}</div>
    <button class="btn" onclick="openRazorpay()">Pay Now with Razorpay</button>
    <div class="secure">🔒 256-bit SSL encrypted &amp; PCI DSS compliant</div>
    <div class="loader">Initializing payment gateway...</div>
  </div>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
    function openRazorpay() {
      var options = {
        key: "${key}",
        amount: ${Math.round(amount * 100)},
        currency: "INR",
        name: "The Store",
        description: "Order Payment",
        order_id: "${razorpayOrderId}",
        prefill: {
          name: "${name}",
          email: "${email}",
          contact: "${phone}"
        },
        theme: { color: "#E11D48" },
        handler: function(response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PAYMENT_SUCCESS',
            data: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }
          }));
        },
        modal: {
          ondismiss: function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAYMENT_CANCELLED' }));
          }
        }
      };
      var rzp = new Razorpay(options);
      rzp.on('payment.failed', function(resp) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'PAYMENT_FAILED',
          data: resp.error
        }));
      });
      rzp.open();
    }

    // Auto-open after short delay
    setTimeout(openRazorpay, 500);
  </script>
</body>
</html>
    `;

    const handleMessage = (event) => {
        try {
            const msg = JSON.parse(event.nativeEvent.data);

            if (msg.type === 'PAYMENT_SUCCESS') {
                setPaid(true);
                navigation.replace('RazorpayVerify', {
                    paymentData: msg.data,
                    orderId,
                });
            } else if (msg.type === 'PAYMENT_CANCELLED') {
                Alert.alert('Payment Cancelled', 'You cancelled the payment. Please try again.', [
                    { text: 'Go Back', onPress: () => navigation.goBack() },
                    { text: 'Try Again', onPress: () => webViewRef.current?.reload() },
                ]);
            } else if (msg.type === 'PAYMENT_FAILED') {
                Alert.alert('Payment Failed', msg.data?.description || 'Your payment could not be processed.', [
                    { text: 'Go Back', onPress: () => navigation.goBack() },
                ]);
            }
        } catch (e) {
            console.error('WebView message parse error', e);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Razorpay Checkout</Text>
                <View style={styles.secureBadge}>
                    <Text style={styles.secureText}>🔒 Secure</Text>
                </View>
            </View>

            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#E11D48" />
                    <Text style={styles.loaderText}>Loading payment gateway...</Text>
                </View>
            )}

            <WebView
                ref={webViewRef}
                source={{ html }}
                onLoadEnd={() => setLoading(false)}
                onMessage={handleMessage}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState={false}
                style={[styles.webview, loading && { height: 0 }]}
                mixedContentMode="always"
                allowsInlineMediaPlayback
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#fff',
    },
    backBtn: { padding: 8, backgroundColor: '#F9FAFB', borderRadius: 10 },
    backText: { fontSize: 16, fontWeight: '700', color: '#111' },
    headerTitle: { fontSize: 17, fontWeight: '800', color: '#111' },
    secureBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    secureText: { fontSize: 11, fontWeight: '700', color: '#059669' },
    webview: { flex: 1 },
    loader: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 70, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 5 },
    loaderText: { color: '#6b7280', fontWeight: '600', marginTop: 16, fontSize: 14 },
});
