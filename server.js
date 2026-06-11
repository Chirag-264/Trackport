import app from './src/app.js'
import connectDB from './db/db.js';
connectDB();
app.listen(5000, () => {
    console.log('Server is running successfully');
})