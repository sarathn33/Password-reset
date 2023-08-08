import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { forgotPasswordRoute, loginRoute, passwordResetRoute, signupRoute } from "./routes/auth.js";

dotenv.config();

const app=express();

const PORT=process.env.PORT 

//connecting to database
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true})
.then(()=>console.log("Database connected successfully"))
.catch((err)=>console.log("Error connecting Database",err))

//middlewares
app.use(express.json());
app.use(cors());

app.get ("/",(req,res)=>{
    res.status(200).send("Welcome to the password reset app")
})

//routes
app.use("/login",loginRoute);
app.use("/signup",signupRoute);
app.use("/forgotPassword",forgotPasswordRoute);
app.use("/passwordReset",passwordResetRoute);


//setting port 
app.listen(PORT,()=>console.log("Server listening on port",PORT))