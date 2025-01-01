import orderModel from '../models/orderModel.js';
import customerModel from '../models/customerModel.js';
import dishModel from '../models/dishModel.js';
import CryptoJS from 'crypto-js';
import nodemailer from 'nodemailer';
import { sendMail } from '../service/mailSender.js';

const config = {
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf"
};

const handleZaloPayCallback = async (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      let dataJson = JSON.parse(dataStr);
      console.log(dataJson);
      const { embed_data, amount, item } = dataJson;
      const parsedEmbededData = JSON.parse(embed_data);
      const { customerId, district, city, exactAddress, ward } = parsedEmbededData;
      // Create new order
      const customer = await customerModel.findById(customerId);
      if (!customer) {
        console.log('Khong thay user');
        return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng" });
      }

      // Retrieve dish details
      const items = JSON.parse(item);
      const dishDetails = await Promise.all(items.map(async (i) => {
        const dish = await dishModel.findById(i.dishId);
        return {
          dishId: i.dishId,
          name: dish.name,
          quantity: i.quantity,
          price: dish.price
        };
      }));

      const newOrder = new orderModel({
        customerId,
        district,
        city,
        exactAddress,
        ward,
        amount,
        items,
        status: "confirmed",
      }); 
      console.log(newOrder);

      await newOrder.save();
      console.log('Order saved');
      // Clear cart data
      customer.cartData = {};
      await customer.save();

      const mailOptions = {
        from: 'tomato22520060@gmail.com',
        to: customer.email,
        subject: 'Đơn hàng của bạn đã được đặt thành công',
        text: `
Kính gửi ${customer.full_name},

Chúng tôi xin thông báo rằng đơn hàng của bạn đã được đặt thành công. Dưới đây là thông tin chi tiết về đơn hàng của bạn:

Mã đơn hàng: ${newOrder._id}
Ngày đặt hàng: ${new Date().toLocaleDateString()}
Tổng số tiền: ${amount} VND

Địa chỉ giao hàng:
${exactAddress}, ${ward}, ${district}, ${city}

Các mặt hàng đã đặt:
${dishDetails.map(i => `- ${i.name}: ${i.quantity} x ${i.price} VND`).join('\n')}

Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất và thông báo cho bạn khi đơn hàng được giao.

Cảm ơn bạn đã mua sắm tại Nhà hàng Cà Chua.

Trân trọng,
Nhà hàng Cà Chua
`
      };

      
      sendMail(mailOptions);

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0;
    result.return_message = ex.message;
  }

  res.json(result);
};

const fetchOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      const customer = await customerModel.findById(order.customerId).select('full_name phone_number');
      const items = await Promise.all(order.items.map(async (item) => {
        const dish = await dishModel.findById(item.dishId);
        return {
          dishId: item.dishId,
          name: dish.name,
          quantity: item.quantity,
          price: dish.price
        };
      }));

      return {
        ...order.toObject(),
        customer: {
          name: customer.full_name,
          phone: customer.phone_number
        },
        items
      };
    }));

    res.status(200).json({ success: true, data: enrichedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export { handleZaloPayCallback, fetchOrders };