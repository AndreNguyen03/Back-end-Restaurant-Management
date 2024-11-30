import dishModel from '../models/dishModel.js'
import fs from 'fs'



// add dish item


const addDish = async (req,res) => {

    let image_filename = `${req.file.filename}`;

    const dish = new dishModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try{
        await dish.save();
        res.json({success: true, message:"food added"}) 
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:'food added unsuccessfully'})
    }

}


// all dish list
const listDish = async(req,res) => {
    try{
        const dishes = await dishModel.find({});
        res.json({success:true, data: dishes})
    }
    catch(error){
        console.log(error);
        res.json({success:false, message: 'error fetching dish list'})
    }
}

// delete a dish
const deleteDish = async(req,res) => {
    try{
        const dish = await dishModel.findById(req.body.id);
        console.log(dish);
        fs.unlink(`uploads/${dish.image}`, () => {}) // delete the image in the uploads folder
        await dishModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: 'dish deleted'});

    }
    catch(error)
    {
        res.json({success:false, message: "error"})
    }
}


//edit a dish
const editDish = async (req, res) => {
    try {
        const dish = await dishModel.findById(req.body.id);
        if (!dish) {
            return res.json({ success: false, message: "dish not found" });
        }

        // Update dish details
        dish.name = req.body.name || dish.name;
        dish.description = req.body.description || dish.description;
        dish.price = req.body.price || dish.price;
        dish.category = req.body.category || dish.category;
        
        // If a new image is uploaded, update the image and delete the old one
        if (req.file) {
            fs.unlink(`uploads/${dish.image}`, () => { }) // delete the old image
            dish.image = req.file.filename;
        }

        await dish.save();
        res.json({ success: true, message: "dish updated", data: dish });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "error updating dish" });
    }
}

// list a specific dish
const listSpecificDish = async (req, res) => {
    try {
        const dish = await dishModel
            .findById(req.body.id);
        res.json({ success: true, data: dish });
    }
    catch(error) {
        console.log(error);
        res.json({ success: false, message: "error fetching dish" });
    }
};

export {addDish, listDish, deleteDish, editDish, listSpecificDish}