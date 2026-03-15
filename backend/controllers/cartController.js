const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc  Get cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock');
    res.json({ success: true, cart: cart || { items: [], total: 0 } });
});

// @desc  Add item to cart
// @route POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) { res.status(404); throw new Error('Product not found'); }
    if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({
            product: productId,
            name: product.name,
            image: product.images[0]?.url || '',
            price: product.discountPrice > 0 ? product.discountPrice : product.price,
            quantity,
        });
    }
    await cart.save();
    res.json({ success: true, cart });
});

// @desc  Update cart item quantity
// @route PUT /api/cart/:itemId
const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) { res.status(404); throw new Error('Cart not found'); }
    const item = cart.items.id(req.params.itemId);
    if (!item) { res.status(404); throw new Error('Item not found in cart'); }
    item.quantity = quantity;
    await cart.save();
    res.json({ success: true, cart });
});

// @desc  Remove item from cart
// @route DELETE /api/cart/:itemId
const removeCartItem = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) { res.status(404); throw new Error('Cart not found'); }
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    res.json({ success: true, cart });
});

// @desc  Clear cart
// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
