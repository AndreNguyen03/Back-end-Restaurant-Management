import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';
import dishRouter from './routes/dishRoute.js';



// app config
const app = express()
const port = 4000

// middleware
app.use(express.json()); //
app.use(cors());

// db connetion
connectDB();


// api endpoints
app.use('/api/dish', dishRouter); 
app.use('/images',express.static('uploads'));

app.get('/', (req,res) => {
    res.send('API working')
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})


//mongodb+srv://quyenanh:<db_password>@cluster0.4xoq4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0