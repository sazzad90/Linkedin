const axios = require('axios');
let  Notification = require('../models/notifications.model');
let  Post = require('../models/posts.model');
const authenticateToken = require('../middlewares/authenticateToken');
const router = require('express').Router();
import { Request, Response} from 'express';
require('dotenv').config();

interface CustomRequest extends Request {
    email: string; // Change the type to match the data type of 'email'
  }

router.post('/getNotifications', authenticateToken, async (req: Request|any, res: Response|any) => {

// router.route('/getNotifications').post(authenticateToken ,async (req: Request|any, res: Response) => {
    try{
        const email = req.email;
        console.log('email', email);
        
        const notifications = await Notification.find({
             receiverEmail: email,
             seen:false
            }); 
        notifications.reverse();
        console.log('notifications: ', notifications)

        const notificationsWithUsername = await Promise.all(
            notifications.map(async (notification:any) => {
                const post = await Post.findOne({ _id: notification.postId });      
                return { 
                    ...notification.toObject(), 
                    userName: post.firstName + ' ' + post.lastName
                };
            })
          );

        console.log('notifications with username: ', notificationsWithUsername);
        res.json({"notice":notificationsWithUsername});
    }catch (err) {
        res.status(400).json('error: ' + err);
    }
})   


router.route('/checkedNotifications').post(authenticateToken ,async (req: CustomRequest, res: Response) => {
    try{
        const postId = req.body.postId;
        console.log('postID: ' + postId);
        
        const checkedNotification = await Notification.findOne({ postId }).exec();
        checkedNotification.seen = true;
        await checkedNotification.save();
        console.log('checkedNotification: ' + checkedNotification);
        res.json(checkedNotification);
    }catch(err){
        res.status(404).json({message: err});
    }
})

//create notif.
router.post('/createNotification', async (req: Request, res: Response) => {
    try{  
        console.log(req.body.postId);
        const postId:string = req.body.postId;
        const users:any = await axios.get('http://host.docker.internal/users/fetchAllUsers');
        console.log('users : ',users);
        const post:any = await axios.post(`http://host.docker.internal/posts/getPost`, {postId: postId});
        console.log('post : ',post)

        const postEmail = post.data.email;

        users.data.map(async (user:any)=>{
            console.log(  'mapping users', user );
            
            if(user.email !== postEmail){
                const receiverEmail:string = user.email;
                const seen:boolean = false;

                const newNotification = new Notification({postId, receiverEmail, seen})
                await newNotification.save()
            }
        })
        console.log('notification created successfully');
        
        res.json("notification created successfully")
    }
    catch(err){
        console.error("error creating notifications :" + err)
        res.status(400).json('error: ' + err);
    }
})

module.exports = router;