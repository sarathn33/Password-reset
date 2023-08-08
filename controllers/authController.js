import User from "../models/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { email, password } = req.body;
    const emailExist = await User.findOne({ email });
    if (!emailExist) {
        res.status(400).send(`${email} is not registered`);
    }
    else {
        const passwordCheck = await bcrypt.compare(password, emailExist.password);
        if(passwordCheck){
            const token = jwt.sign({foo:emailExist.email},process.env.SECRET_KEY)
            res.status(200).send({
               message: "User logged in successfully",
               token:token
            })
        }
        else{
            res.status(400).send("Incorrect password")
        }
       }
};

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const emailExist = await User.findOne({ email });
    if (!emailExist) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ name, email, password: hashedPassword });
        res.status(200).send("User signed up successfully");
    }
    else res.status(400).send(`${email} is already registered`);
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "sarathsarath345@gmail.com",
            pass: process.env.PASS
        }
    })
    const secretCode = String(Math.random()*100000).substring(0, 5);
    const userExist = await User.findOne({ email });
    if (!userExist) {
        res.status(400).send(`${email} is not registered`);
    }
    try {
        let setusertoken= await User.findOneAndUpdate({ email }, { secretCode });
        if (setusertoken) {
            let info = await transporter.sendMail({
                from: process.env.USER,
                to: `${email}`,
                subject: "Regarding password reset",
                text: "follow the given link to reset your account password",
                html: `<h3>OTP to reset your password is given below</h3>
                <p>${secretCode}</p>`,
            })
            res.status(201).send("Mail sent successfully");
        } else {
            res.status(400).send("Error occured while sending email")
            
        }   
    } catch (error) {
        console.log(error)
    }
       
    }  


export const passwordReset = async (req, res) => {
    const { secretCode, newPassword } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword,salt);
    const userExist = await User.findOne({secretCode});
    if(!userExist){
        res.status(400).send("User does not exist");
    }
    else{
        await User.findOneAndUpdate(
            {secretCode},
            {password:hashedNewPassword,secretCode:""}
        );
        res.send("Password reset successful");
    }
};