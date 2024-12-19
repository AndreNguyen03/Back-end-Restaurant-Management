import ingredientModel from '../models/ingredientModel.js';

//add ingredient 
const addIngredient = async (req, res) => {
    
    const ingredient = new ingredientModel({
        name: req.body.name,
        unitprice: req.body.unitprice,
        quantity: req.body.quantity,
        unit: req.body.unit,

    })
    try {await ingredient.save();
        res.json({success: true, message: 'ingredient added'});
    }
    catch(error){
        console.log(error);
        res.json({success: false, message: 'ingredient added unsuccessfully'});
    }
}
//list ingredient
const listIngredient = async (req, res) => {
    try {
        const ingredients = await ingredientModel.find({});
        res.json({success: true, data: ingredients});
    }
    catch(error){
        console.log(error);
        res.json({success: false, message: 'error fetching ingredient list'});
    }
}

//delete ingredient
const deleteIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientModel.findById(req.body.id);
        console.log(ingredient);
        await ingredientModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: 'ingredient deleted'});
    }
    catch(error){
        res.json({success: false, message: 'error'});
    }
}

// edit a ingredient
const editIngredient = async (req, res) => {
    try {
        await ingredientModel.findByIdAndUpdate(
            req.body.id,
            {
                name: req.body.name,
                unitprice: req.body.unitprice,
                quantity: req.body.quantity,
                unit: req.body.unit,
            }
        );
        res.json({success: true, message: 'ingredient updated'});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}
// list a specific ingredient
const listSpecificIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientModel.findById(req.body.id);
        if(!ingredient){
            return res.json({success: false, message: 'ingredient not found'});
        }
        return res.json({success: true, data: ingredient});
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
};

export  {
    addIngredient,
    listIngredient,
    deleteIngredient,
    editIngredient,
    listSpecificIngredient,
};