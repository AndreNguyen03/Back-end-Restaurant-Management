import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://quyenanh:Quyenanh29032004@cluster0.4xoq4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('DB connected'));
}


