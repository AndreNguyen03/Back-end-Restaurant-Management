import express from "express";
import {
  addtable,
  listtable,
  deletetable,
  edittable,
  listSpecifictable,
} from "../controllers/tableController.js";
const tableRouter = express.Router();

tableRouter.post("/add", addtable);
tableRouter.get("/list", listtable);
tableRouter.post("/delete", deletetable);
tableRouter.post("/edit", edittable);
tableRouter.post("/listSpecific", listSpecifictable);

export default tableRouter;
