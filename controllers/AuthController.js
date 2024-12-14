// Đăng Nhập, Đăng Ký cho  employee
import accountModel from "../models/accountModel.js";
import employeeModel from "../models/employeeModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Register = async (req, res) => {
  const { fullName, phoneNumber, address, employeeRole, socialId, username, password } = req.body;
  try {
      // Check if socialId already exists
      const existingSocialId = await employeeModel.findOne({ socialId });
      if (existingSocialId) return res.status(400).json({ message: "CCCD Đã tồn tại" });

      // Check if username already exists
      if (username && password) {
          const existingAccount = await accountModel.findOne({ username });
          if (existingAccount) return res.status(400).json({ success: false, message: "Username already in use" });
      }

      // Create new employee
      const newEmployee = new employeeModel({ full_name: fullName, phone_number: phoneNumber, address, employee_role: employeeRole, socialId });
      await newEmployee.save();

      // If username and password are provided, create new account
      if (username && password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newAccount = new accountModel({ username, password: hashedPassword, role: "employee", userId: newEmployee._id });
          await newAccount.save();
          return res.status(201).json({ success: true, message: "Employee and account registered successfully" });
      }

      // If no username and password, only employee is registered
      return res.status(201).json({ success: true, message: "Employee registered successfully" });

  } catch (err) {
      res.status(500).json({
          status: "error",
          code: 500,
          data: [],
          message: err.message,
      });
  }
  res.end();
};

const Login = async (req, res) => {
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
            maxAge: 24 * 60 * 60 * 1000, 
            httpOnly: true, // The cookie is only accessible by the web server
            sameSite: "Lax", // Change SameSite attribute to Lax
        };
        
        
        
        const token = user.generateAccessJWT();
        res.cookie('SessionID', token, options);
        console.log('cookie set: ', token);
        res.status(200).json({
            status: 'success',
            data: {role: user.role},
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


// In your backend authRoute.js or a similar file
const checkAuth = async (req, res) => {
    try {
      if (req.cookies.SessionID) {
        const decoded = jwt.verify(req.cookies.SessionID, process.env.SECRET_ACCESS_TOKEN);
        
  
        const user = await accountModel.findById(decoded.id);
        if (user) {
          return res.json({
            isAuthenticated: true,
            role: user.role
          });
        }
      }
  
      console.log('No valid token'); // Add logging
      return res.status(401).json({
        isAuthenticated: false
      });
    } catch (error) {
      console.error('Error in checkAuth:', error); // Add logging
      return res.status(401).json({
        isAuthenticated: false
      });
    }
  };
  
  const logout = async (req, res) => {
    try {
      // Clear the cookie
      res.clearCookie('SessionID');
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Logout failed' });
    }
  };
  

export { Register, Login, checkAuth, logout }; 