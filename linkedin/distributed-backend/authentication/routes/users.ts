let  User = require('../models/users.model');
const router = require('express').Router();
const authenticateToken = require('../middlewares/authenticateToken');

import { Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
require('dotenv').config();

interface CustomRequest extends Request {
  email: string; // Change the type to match the data type of 'email'
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret;     

router.route('/').get(async(req:Request, res:Response) => {
   try{
      await User.find()
      res.json("user found!");
   }catch(err){
   res.status(400).json('error: ' + err);
}
})

const saltRounds:number = 10; // Number of salt rounds for bcrypt to use
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

router.route('/register').post(async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, newPassword} = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: 'Password is required.' });
    }
    const password = await hashPassword(newPassword);

    const newUser = new User({ 
      email,
      firstName,
      lastName,
      password 
   });
   console.log(newUser);
    await newUser.save();
    res.json('user added!');
  } catch (err) {
    res.status(400).json('error: ' + err);
  }
});

async function comparePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

router.route('/login').post( async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body; 
      const user = await User.findOne({ 
        email: email
   });
 
   if (!user) {
       return res.status(404).json('User not found');
     }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json('Invalid password');
    }       
    const accessToken = jwt.sign(user.toJSON(), accessTokenSecret);
    
    console.log('login successful');

      res.json({
       accessToken: accessToken,
       message: 'Login successful',
       another_msg : 'Login successful',
       user: user
     });
   } catch (err: any) {
     res.status(400).json('error: ' + err);
   }
 });
 
 router.route('/getName').get(authenticateToken ,async (req: CustomRequest, res: Response) => {
  try{
      const email = req.email;
      console.log('email', email);
      
      const user = await User.findOne({
           email: email,
          }).exec(); 
      res.json(user.firstName + ' ' + user.lastName);

  }catch (err) {
      res.status(400).json('error: ' + err);
  }
})   


router.route('/fetchAllUsers').get(async (req: Request|any, res: Response) => {
  try {
    console.log('Fetching users');
    
    const users = await User.find()
    console.log('users: ', users)
    res.json(users);
  
} catch (err) {
    res.status(500).json({ message: 'Internal server error' });
}
})  

module.exports = router;