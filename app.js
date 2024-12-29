import express from "express";
import cors from "cors";
import Database from "./dbs/init.mongodb.js";
import dishRouter from "./routes/dishRoute.js";
import customerAuthRouter from "./routes/customerAuthRoute.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import tableRouter from "./routes/tableRoute.js";
import commentRouter from "./routes/commentRoute.js";
import invoiceRouter from './routes/invoice.route.js'
import purchaseRouter from "./routes/purchaseRoute.js";
import ingredientRouter from './routes/ingredientRoute.js';
import reservationRouter from './routes/reservation.route.js';
import errorHandler from "./middlewares/errorHandler.js";

// app config
const app = express();

// middleware
app.use(express.json()); //
app.use(
  cors(
    {
      origin: ["http://localhost:5173"],
      methods: ["POST", "GET"],
      credentials: true,
    }
    // set cors như này thì mới gửi token qua được
  )
);
app.use(cookieParser());
// db connetion

Database.getInstance();

// api endpoints
app.use("/api/dish", dishRouter);
app.use("/api/table", tableRouter);
app.use("/images", express.static("uploads"));
app.use("/api/cAuth", customerAuthRouter); // customer auth
app.use("/api/eAuth", authRouter);; // employee auth
app.use("/api/employee", employeeRouter); // employee
app.use('/api/ingredient', ingredientRouter); // ingredient
app.use('/api/comment',commentRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/reservations', reservationRouter);

app.use('/api/comment',commentRouter);
app.use('/api/purchase',purchaseRouter)
app.get("/", (req, res) => {
  res.send("API working");
});

app.use(errorHandler);


export default app;
