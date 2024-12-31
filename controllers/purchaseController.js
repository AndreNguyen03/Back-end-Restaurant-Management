import purchaseModel from "../models/purchaseModel.js";
import ingredientModel from "../models/ingredientModel.js";

const addPurchase = async (req, res) => {
  console.log("Payload nhận từ frontend:", req.body);

  const { ingredients } = req.body;

  try {
    // Kiểm tra payload hợp lệ
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid ingredients array",
      });
    }

    // Kiểm tra và xử lý từng nguyên liệu
    const purchaseDetails = await Promise.all(
      ingredients.map(async (item) => {
        const { ingredientId, quantity, unitPrice, totalPrice, unit, name } = item;

        if (!ingredientId || !quantity || !unitPrice || !totalPrice || !unit) {
          throw new Error("Each ingredient must have ingredientId, quantity, unitPrice, totalPrice, and unit.");
        }

        // Kiểm tra trong database nếu cần
        const ingredient = await ingredientModel.findById(ingredientId);
        if (!ingredient) {
          throw new Error(`Ingredient ${ingredientId} not found`);
        }

        // Cập nhật số lượng nguyên liệu trong kho
        ingredient.quantity += quantity;
        await ingredient.save();

        return {
          ingredientId: ingredient._id,
          name: name || ingredient.name,
          quantity,
          unitPrice,
          unit,
          totalPrice,
        };
      })
    );

    // Tính tổng chi phí
    const totalAmount = purchaseDetails.reduce((sum, item) => sum + item.totalPrice, 0);

    // Tạo đơn hàng
    const purchase = await purchaseModel.create({
      ingredient: purchaseDetails,
      totalAmount,
      // Không cần gửi purchaseDate vì nó sẽ được tạo tự động
    });

    res.status(201).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    console.error("Lỗi xử lý:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};







// Get all purchases
const listPurchases = async (req, res) => {
  try {
    const purchases = await purchaseModel.find({});
    res.json({success: true, data: purchases});
  }
  catch(error){
    console.log(error);
    res.json({success: false, message: 'error fetching purchase list'});
  }
};

// Get single purchase by ID
const listSpecificPurchase = async (req, res) => {
  try {
    const purchase = await purchaseModel.findById(req.body.id);

    if(!purchase){
      return res.json({success: false, message: 'purchase not found'});
    }
    return res.json({success: true, data: purchase});
  }
  catch(error){
    console.log(error);
    res.json({success: false, message: 'error fetching purchase list'});
  }
    
};



export {
  addPurchase,
  listPurchases,
  listSpecificPurchase,
};