import app from './src/app.js';
import connectDB from './db/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            throw new Error('Set JWT_SECRET to a random value with at least 32 characters in backend/.env');
        }
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running successfully on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
