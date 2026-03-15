const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Product = require('../models/Product');
const PageContent = require('../models/PageContent');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data
        await Category.deleteMany();
        await Product.deleteMany();
        await PageContent.deleteMany();

        console.log('Cleared existing categories, products, and page content.');

        // 1. Seed Categories
        const categoryData = [
            {
                name: 'Official Merch',
                slug: 'official-merch',
                image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop',
                description: 'Exclusive official merchandise from your favorite movies and shows.'
            },
            {
                name: 'Oversized Tees',
                slug: 'oversized-tees',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
                description: 'Relaxed fit tees for ultimate comfort and style.'
            },
            {
                name: 'Bottomwear',
                slug: 'bottomwear',
                image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=600&auto=format&fit=crop',
                description: 'Stylish joggers, shorts, and denims.'
            },
            {
                name: 'Accessories',
                slug: 'accessories',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
                description: 'Backpacks, caps, and more to complete your look.'
            }
        ];
        const categories = await Category.insertMany(categoryData);

        console.log('Seeded 4 Categories.');

        // 2. Seed Products
        const productsRaw = [
            {
                name: 'Batman Logo T-Shirt',
                description: 'Iconic Batman logo on a classic charcoal black t-shirt. 100% premium cotton.',
                price: 999,
                discountPrice: 799,
                category: categories[0]._id,
                stock: 50,
                images: [{ url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', public_id: 'sample_1' }],
                brand: 'Warner Bros.'
            },
            {
                name: 'Marvel Avengers Oversized Tee',
                description: 'Show your love for the Earth\'s mightiest heroes with this oversized white tee.',
                price: 1299,
                discountPrice: 1099,
                category: categories[1]._id,
                stock: 30,
                images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', public_id: 'sample_2' }],
                brand: 'Marvel'
            },
            {
                name: 'Iron Man ARC Reactor Tee',
                description: 'Glow-in-the-dark ARC reactor print. Proof that Tony Stark has a heart.',
                price: 899,
                discountPrice: 0,
                category: categories[0]._id,
                stock: 25,
                images: [{ url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop', public_id: 'sample_3' }],
                brand: 'Marvel'
            },
            {
                name: 'Urban Cargo Joggers',
                description: 'Multi-pocket heavy duty joggers for the modern explorer.',
                price: 2499,
                discountPrice: 1999,
                category: categories[2]._id,
                stock: 20,
                images: [{ url: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop', public_id: 'sample_4' }],
                brand: 'TSS Originals'
            },
            {
                name: 'Canvas Lifestyle Backpack',
                description: 'Durable canvas backpack with dedicated laptop sleeve.',
                price: 1999,
                discountPrice: 1499,
                category: categories[3]._id,
                stock: 15,
                images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', public_id: 'sample_5' }],
                brand: 'TSS Gear'
            }
        ];

        const products = await Product.insertMany(productsRaw);
        console.log(`Seeded ${products.length} Products.`);

        // 3. Seed Page Content (Home CMS)
        const homeContent = {
            page: 'home',
            content: {
                banners: [
                    {
                        image: { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop' },
                        title: 'THE BIG SALE IS LIVE',
                        subtitle: 'Up to 50% OFF on Official Merch',
                        linkType: 'category',
                        linkId: categories[0].slug,
                        active: true
                    }
                ],
                sections: [
                    {
                        title: 'SHOP BY CATEGORY',
                        type: 'category_circles',
                        active: true,
                        order: 0,
                        items: categories.map(c => ({ image: { url: c.image }, title: c.name, linkId: c.slug }))
                    },
                    {
                        title: 'NEW ARRIVALS',
                        type: 'product_scroll',
                        active: true,
                        order: 1,
                        referenceIds: products.map(p => p._id.toString())
                    },
                    {
                        title: 'FEATURED COLLECTIONS',
                        type: 'featured_grid',
                        active: true,
                        order: 2,
                        items: [
                            { image: { url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600' }, title: 'Oversized Tees', linkId: categories[1].slug },
                            { image: { url: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=600' }, title: 'Bottomwear', linkId: categories[2].slug }
                        ]
                    }
                ]
            }
        };

        await PageContent.create(homeContent);
        console.log('Seeded Home Page CMS Content.');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
