import accountModel from "../models/accountModel.js";
import customerModel from "../models/customerModel.js";
import bcrypt from 'bcrypt';

const customerRegister = async (req, res) => {

    const { fullName, email, phoneNumber, username, password } = req.body;
    try {
        const existingEmail = await customerModel.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already in use" });

        const existingPhoneNumber = await customerModel.findOne({ phone_number: phoneNumber });
        if (existingPhoneNumber) return res.status(400).json({ message: "Phone number already in use" });

        const existingAccount = await accountModel.findOne({ username });
        if (existingAccount) return res.status(400).json({ message: "Username already in use" });

        const newCustomer = new customerModel({ full_name: fullName, phone_number: phoneNumber, email });

        await newCustomer.save();

        const newAccount = new accountModel({ username: username, password, role: "customer", userId: newCustomer._id });

        await newAccount.save();

        return res.status(201).json({ message: "Account registered successfully" });

    }

    catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();

}

const customerLogin = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await accountModel.findOne({ username }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        console.log('user found');

        const isPasswordValid = await bcrypt.compare(`${req.body.password}`, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        let options = {
            maxAge: 20 * 60 * 1000, // would expire in 20minutes
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
        
        const token = user.generateAccessJWT();
        res.cookie('SessionID', token, options);
        res.status(200).json({
            status: 'success',
            message: 'You have successfully logged in'
        });


    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            code: 500,
            message: error.message
        })
    }
    res.end();
}

export { customerRegister, customerLogin };