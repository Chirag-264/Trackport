import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

if (!process.env.DB_URI) {
    throw new Error('Please define the DB_URI in backend/.env');
}

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await conn.connection.collection('users').updateMany(
            { leetcodeCredentialsEncrypted: { $exists: true } },
            { $unset: { leetcodeCredentialsEncrypted: '' } }
        );
        return conn;
    } catch (err) {
        console.error('Failed to connect to Database:', err.message);
        throw err;
    }
}

export default connectDB;
