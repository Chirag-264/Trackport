import mongoose from "mongoose";
import 'dotenv/config';

if(!process.env.DB_URI) {
    throw new Error('Please define the database URI in env.');
}

async function connectDB() {
    try{ 
        await mongoose.connect(process.env.DB_URI);
        console.log('Database connected successfully')
    }
    catch(err) {
        console.log(err + ': Failed to connect to Database');
    }
    
}

export default connectDB;
