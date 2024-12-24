import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: "Your full name is required",
        max: 134,
    },
    phone_number: {
        type: String,
        required: "Your phone number is required",
        max: 10,
        unique: true,
    },
    cartData: {
        type: Object,
        default: {}
    },
    email: {
        type: String,
        required: "Your email is required",
        unique: true,
    },
})

const customerModel = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default customerModel;