let  notification = require('../models/notifications.model');
let  Post = require('../models/posts.model');
const authenticateToken2 = require('../middlewares/authenticateToken');
const router = require('express').Router();
import { Request, Response} from 'express';
require('dotenv').config();

interface CustomRequest extends Request {
    email: string; // Change the type to match the data type of 'email'
  }
router.route('/getNotifications').get(authenticateToken2 ,async (req: CustomRequest, res: Response) => {
    try{
        const email = req.email;
        console.log('email', email);
        
        const notifications = await notification.find({
             receiverEmail: email,
             seen:false
            }); 
        notifications.reverse();

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
        res.json(notificationsWithUsername);
    }catch (err) {
        res.status(400).json('error: ' + err);
    }
})   

// router.route('/getClickedPost').post(authenticateToken2 ,async (req: CustomRequest, res: Response) => {
//     try{
//         const _id = req.body.postId;
//         console.log('postID: ' + _id);
        
//         const post = await Post.findOne({ _id }).exec();
//         console.log('post: ' + post);
//         res.json(post);
//     }catch(err){
//         res.status(404).json({message: err.message});
//     }
// })


router.route('/checkedNotifications').post(authenticateToken2 ,async (req: CustomRequest, res: Response) => {
    try{
        const postId = req.body.postId;
        console.log('postID: ' + postId);
        
        const checkedNotification = await notification.findOne({ postId }).exec();
        checkedNotification.seen = true;
        await checkedNotification.save();
        console.log('checkedNotification: ' + checkedNotification);
        res.json(checkedNotification);
    }catch(err){
        res.status(404).json({message: err});
    }
})

module.exports = router;