import express from 'express'
import {addDish, deleteDish, listDish, editDish, listSpecificDish} from '../controllers/dishController.js'

import multer from 'multer'


const dishRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req,file,cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    } 
})

const upload = multer({storage: storage});

dishRouter.post('/add', upload.single('image'), addDish);
dishRouter.get('/list', listDish);
dishRouter.post('/delete', deleteDish);
dishRouter.post('/edit', upload.single('image'), editDish);
dishRouter.post('/specificDish', listSpecificDish);









export default dishRouter;