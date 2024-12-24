import express from 'express';
import { addIngredient, listIngredient, deleteIngredient, editIngredient, listSpecificIngredient } from '../controllers/ingredientController.js';
const ingredientRouter = express.Router();

ingredientRouter.post('/add', addIngredient);
ingredientRouter.get('/list', listIngredient);
ingredientRouter.post('/delete', deleteIngredient);
ingredientRouter.post('/edit', editIngredient);
ingredientRouter.post('/listSpecific', listSpecificIngredient);

export default ingredientRouter;