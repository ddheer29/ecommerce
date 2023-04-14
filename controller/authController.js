import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        // validation
        if (!name) {
            res.send({ message: "Name is Required" });
        }
        if (!email) {
            res.send({ message: "Email is Required" });
        }
        if (!password) {
            res.send({ message: "Password is Required" });
        }
        if (!phone) {
            res.send({ message: "Phone is Required" });
        }
        if (!address) {
            res.send({ message: "Address is Required" });
        }
        // check user
        const exisitingUser = await userModel.findOne({ email });
        // check exisiting user
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already Registered with this email',
            })
        }
        // register user
        const hashedPassword = await hashPassword(password);
        // save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword
        }).save();
        res.status(201).send({
            success: true,
            message: "User registered Successfully",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        })
    }
};

// post LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                messgae: 'Invalid email or password',
            })
        }
        // check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }
        // token 
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).send({
            success: true,
            message: 'Login Succesfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

// test controller
export const testController = (req, res) => {
    res.send('Protected Route');
}

