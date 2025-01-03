import axios from 'axios';
import CryptoJS from 'crypto-js';
import { v1 as uuidv1 } from 'uuid';
import moment from 'moment';

const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const createOrder = async (items, fullName, amount, customerId, district, city, exactAddress, ward) => {
  const embed_data = {
    redirecturl: "http://localhost:5174",
    customerId,
    district,
    city,
    exactAddress,
    ward
  };
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: fullName,
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount,
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: "",
    callback_url: "https://af63-183-81-96-10.ngrok-free.app/api/order/add",
  };

  // appid|apptransid|appuser|amount|apptime|embeddata|item
  const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const response = await axios.post(config.endpoint, null, { params: order });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export { createOrder };