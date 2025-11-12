import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config({ path: './.env' });
console.log('Loaded environment variables.');

const createTestUser = async () => {
    try {
        console.log('Attempting to connect to DB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB connection successful!');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'test@example.com' });
        if (existingUser) {
            console.log('Test user already exists:', existingUser.email);
            return;
        }

        // Create test user
        const testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'testpassword123',
            role: 'user'
        });

        await testUser.save();
        console.log('Test user created successfully:', testUser.email);

    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed.');
    }
};

createTestUser(); 