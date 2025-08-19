import express from "express";
import { getPatientBill } from "../controllers/bill.controller";
import { authenticate } from "../middlewares/auth.middleware";

const billRoutes = express.Router();
billRoutes.use(authenticate);

billRoutes.get('/', getPatientBill);

export default billRoutes;