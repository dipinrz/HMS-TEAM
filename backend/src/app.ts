import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from 'cookie-parser'
import userRouter from './routes/auth.routes'
import adminRoutes from "./routes/admin.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))



app.use("/api/v1/auth", userRouter)
app.use("/api/v1/users", adminRoutes)



app.use(errorHandler)




export default app;
