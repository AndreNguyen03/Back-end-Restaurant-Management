import purchaseModel from '../models/purchaseModel.js';
import ingredientModel from '../models/ingredientModel.js';

// Tiện ích xử lý lỗi
const handleError = (res, error, statusCode = 400) => {
  res.status(statusCode).json({ success: false, message: error.message });
};

// Tiện ích tính toán tổng tiền và cập nhật kho
const processPurchaseDetails = async (details) => {
  let totalAmount = 0;

  const enrichedDetails = await Promise.all(
    details.map(async (detail) => {
      const ingredient = await ingredientModel.findById(detail.ingredient);
      if (!ingredient) {
        throw new Error(`Không tìm thấy nguyên liệu với ID ${detail.ingredient}`);
      }

      const totalPrice = ingredient.unitprice * detail.quantity;
      totalAmount += totalPrice;

      
      ingredient.quantity += detail.quantity;
      await ingredient.save();

      return { ingredient: ingredient._id, quantity: detail.quantity, totalPrice };
    })
  );

  return { enrichedDetails, totalAmount };
};

// Thêm một giao dịch mua mới
const addPurchase = async (req, res) => {
  const { details } = req.body;

  try {
    const { enrichedDetails, totalAmount } = await processPurchaseDetails(details);

    const purchase = new purchaseModel({
      details: enrichedDetails,
      totalAmount,
    });

    await purchase.save();
    res.json({ success: true, message: 'Thêm giao dịch thành công', data: purchase });
  } catch (error) {
    handleError(res, error);
  }
};

// Liệt kê tất cả giao dịch
const listPurchases = async (req, res) => {
  try {
    const purchases = await purchaseModel.find().populate('details.ingredient').lean();
    res.json({ success: true, data: purchases });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Liệt kê một giao dịch cụ thể
const listSpecificPurchase = async (req, res) => {
  const { id } = req.body;

  try {
    const purchase = await purchaseModel.findById(id).populate('details.ingredient').lean();
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch' });
    }
    res.json({ success: true, data: purchase });
  } catch (error) {
    handleError(res, error, 500);
  }
};

export { addPurchase, listPurchases, listSpecificPurchase };
