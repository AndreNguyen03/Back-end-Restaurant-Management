import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required: true},
    price: {type:Number, required: true},
    image: {type: String, required: true},
    category: {type: String, required:true},
})

const dishModel = mongoose.models.dish ||  mongoose.model('dish', dishSchema);


export default dishModel;