import { createOrder } from '../service/ZaloPayService.js';

const createZaloPayOrder = async (req, res) => {
  const items = req.body.items;
  const fullName = req.body.fullName;
  const amount = req.body.amount;
  const customerId = req.body.customerId;
  const district = req.body.district;
  const city = req.body.city;
  const exactAddress = req.body.exactAddress;
  const ward = req.body.ward;
  try {
    const orderData = await createOrder(items, fullName, amount, customerId, district, city, exactAddress, ward);
    res.status(200).json({
      success: true,
      data: orderData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export { createZaloPayOrder };