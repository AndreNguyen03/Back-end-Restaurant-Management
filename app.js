import express from 'express'
import cors from 'cors'
import Database from './dbs/init.mongodb.js';
import dishRouter from './routes/dishRoute.js';


// app config
const app = express()

// middleware
app.use(express.json()); //
app.use(cors());

// db connetion
Database.getInstance();

// api endpoints
app.use('/api/dish', dishRouter); 
app.use('/images',express.static('uploads'));

app.get('/', (req,res) => {
    res.send('API working')
})

export default app;

