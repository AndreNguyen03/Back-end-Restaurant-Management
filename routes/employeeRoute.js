import express from 'express'
import { listEmployee, listSpecificEmployee, editEmployee, deleteEmployee } from '../controllers/employeeController.js'

const employeeRouter = express.Router();

employeeRouter.get('/list', listEmployee);
employeeRouter.post('/listSpecific', listSpecificEmployee); 
employeeRouter.post('/edit', editEmployee);
employeeRouter.post('/delete', deleteEmployee);
export default employeeRouter;