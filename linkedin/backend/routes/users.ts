let  User = require('../models/users.model');
const router = require('express').Router();

import { Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
require('dotenv').config();

// declare global {
//   namespace Express {
//     interface Request {
//       loggedUser?: JwtPayload;
//     }
//   }
// }

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
    console.log('here');
     
    const accessToken = jwt.sign(user.toJSON(), accessTokenSecret);

    console.log('not here');
    
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
 

module.exports = router;