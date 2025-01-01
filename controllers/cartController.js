import accountModel from "../models/accountModel.js";
import customerModel from "../models/customerModel.js";
import jwt from "jsonwebtoken";

export const updateCart = async (req, res) => {
    if (!req.cookies.SessionID) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(
        req.cookies.SessionID,
        process.env.SECRET_ACCESS_TOKEN
    );
    const account = await accountModel.findById(decoded.id);
    if (!account) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await customerModel.findById(account.userId);
    const newCartData = req.body.cartData;

    // Merge new cart data with existing cart data
    user.cartData = { ...user.cartData, ...newCartData };

    // Remove items with quantity 0
    for (const itemId in user.cartData) {
        if (user.cartData[itemId] === 0) {
            delete user.cartData[itemId];
        }
    }

    await user.save();
    return res.json({ success: true, message: "Cart updated successfully" });
};
export const getCart = async (req, res) => {
    try {
        const token = req.cookies.SessionID;
        if (!token) {
            return res.status(401).json({ success: false, message: "Token không được cung cấp" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
        const account = await accountModel.findById(decoded.id);
        if (!account) {
            return res.status(404).json({ success: false, message: "Tài khoản không tồn tại" });
        }

        const user = await customerModel.findById(account.userId);
        res.json({ success: true, cartData: user.cartData });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token đã hết hạn" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Token không hợp lệ" });
        }
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};