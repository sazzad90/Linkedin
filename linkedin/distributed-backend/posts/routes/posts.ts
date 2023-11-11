const axios = require('axios');
let  Post = require('../models/posts.model');
let User = require('../models/users.model');
let  notification = require('../models/notifications.model');
require('dotenv').config();

const router = require('express').Router();
const authenticateToken = require('../middlewares/authenticateToken');
const multer = require('multer')
const path = require('path')
const minioClient = require('../minio/minioClient')

// const hostDocker = '192.168.0.105';

import { Request, Response} from 'express';

const storage = multer.diskStorage({
  destination : (req:any, file:any, cb:any)=>{
      console.log(file)
      cb(null, './images')
  },
  filename :(req:any,file:any, cb:any) => {
      const newFilename = Date.now() + path.extname(file.originalname);
      cb(null, newFilename)
  },
 
})

const upload = multer({storage: storage})

async function uploadToMinio(file:any) {
  const bucketName = "linkedin";
  const objectKey = file.filename;
  const metaData = {
      'Content-Type': file.mimetype,
  }


  await minioClient.fPutObject(bucketName, objectKey, file.path, metaData, (err:any, etag:any) => {
      if (err) {
          console.log(err);
          return null;
      }
  }); //bucketName, objectKey

  return objectKey;
}


// router.route('/createPost').post(authenticateToken,upload.single("image") ,async(req:Request|any, res:Response) => {
//    try{
//     const content  = req.body.content; 
//     const file = req.file
//     const email = req.email;
//     const firstName = req.firstName;
//     const lastName = req.lastName;
//     console.log("firstName: " + firstName)

//     let _imageId = null
//     let imageId = null

//     if(file){
//         _imageId =  await uploadToMinio(file)
//     }
//     imageId = _imageId? _imageId : null

//     console.log("imageId: " + imageId)

//     const newPost = new Post({ 
//         email,
//         firstName,
//         lastName,
//         content,
//         imageId,
//      });
//       await newPost.save();

//       const postId = newPost._id;
//       console.log("content:", newPost.content);

//       const allUsers = await User.find({})
//       const seen:boolean = false;

//       for (const user of allUsers) {
//         const receiverEmail = user.email;
        
//         if(receiverEmail === email) console.log('same user');
        
//         else{
//           console.log('receiverId: ', receiverEmail);
//           console.log('currentUserId: ', email);
          
//         const newNotification = new notification({ 
//           postId,
//           receiverEmail,
//           seen 
//         });
      
//         try {
//           await newNotification.save();
//           console.log('Notification saved for user:', user.username); // Optional: Print a message for each user
//         } catch (error) {
//           console.error('Error saving notification:', error);
//           // Handle the error appropriately, e.g., log it, continue with the next user, etc.
//         }
//       }
//       }
//       res.json('post posted!');
//     } catch (err) {
//       console.log("post not inserted")
//       res.status(400).json('error: ' + err);
//     }
// });




router.route('/createPost').post(authenticateToken, upload.single("image") ,async(req:Request|any, res:Response) => {
  try{
   const content  = req.body.content; 
   const file = req.file
   const email = req.email;
   const firstName = req.firstName;
   const lastName = req.lastName;

   let _imageId = null
   let imageId = null

   console.log('creating Posts');
   

   if(file){
    console.log('got image');

       _imageId =  await uploadToMinio(file)
       console.log('image id: ' + _imageId);
       
   }

   imageId = _imageId? _imageId : null
   console.log('123');
   const newPost = new Post({ 
       email,
       firstName,
       lastName,
       content,
       imageId,
    });
     await newPost.save();

     const postId = newPost._id;
    //create notification
    try {
        const response = await axios.post(`http://192.168.0.105:5052/notifications/createNotification`, {postId: postId});
        console.log('notification response : ', response.data);
        res.json('notification saved!');
      } catch (error:any) {
        // res.status(400).json('error for create notification: ' + error);
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Server responded with an error:', error.response.status);
          console.error('Error details:', error.response.data);
          res.status(400).json('Error for creating notification: ' + error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received from the server');
          res.status(500).json('No response received from the server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up the request:', error.message);
          res.status(500).json('Error setting up the request: ' + error.message);
        }
      }
      
     } catch (err) {
     console.log("post not inserted")
     res.status(400).json('error: ' + err);
     
   }
});



const getImageFromMinio = (imageId:any) => {
  return new Promise((resolve, reject) => {
      minioClient.getObject('linkedin', imageId, (err:any, dataStream:any) => {
          if (err) {
              // Handle any error when fetching the image from MinIO
              reject(err);
          } else {
              const chunks:any = [];
              dataStream.on('data', (chunk:any) => {
                  chunks.push(chunk);
              });

              dataStream.on('end', () => {
                  // Concatenate the binary chunks and resolve with the image data
                  const imageData = Buffer.concat(chunks);
                  resolve(imageData);
              });

              dataStream.on('error', (err:any) => {
                  reject(err);
              });
          }
      });
  });
};



router.route('/getPostForNotification').post(async(req:Request, res:Response) => {
  try{
    console.log('here');
    
    const postId  = req.body.postId; 
    const post = await Post.findOne({ _id: postId }); 
    console.log('fetching post for notification: ' + post);
      
    res.json(post)
   } catch (err) {
     res.status(400).json('error sending post from server: ' + err);
   }
});




router.route('/getPosts').get(authenticateToken ,async(req:Request, res:Response) => {
  try{
    const posts = await Post.find(); // Fetch all posts from the collection
    posts.reverse();
    const postsWithUsername = await Promise.all(
      posts.map(async (post:any) => {
          const user = await User.findOne({ email: post.email });
          // const imageBuffer:any = post.imageId ? await getImageFromMinio(post.imageId) : null;
          // const base64String = imageBuffer ? imageBuffer.toString('base64') : null;
          // const mimeType = 'image/jpeg';
          // const image = base64String ? `data:${mimeType};base64,${base64String}` : null;

          return { 
              ...post.toObject(), 
              username: user ? user.username : 'Unknown',
          };
      })
    );
    res.json(postsWithUsername)
   } catch (err) {
     res.status(400).json('error sending post from server: ' + err);
   }
});

router.route('/getClickedPost').post(authenticateToken ,async (req: Request, res: Response) => {
  try{
      const _id = req.body.postId;
      console.log('postID: ' + _id);
      
      const post = await Post.findOne({ _id }).exec();
      console.log('post: ' + post);
      res.json(post);
  }catch(err){
      res.status(404).json({message: err});
  }
})


router.route('/getPost').post(async (req: Request|any, res: Response) => {
  try{
      const _id  = req.body.postId;
      console.log('postID: ' + _id );
      
      const post = await Post.findById(_id).exec();
      console.log('post: ' + post);
      res.json(post);
  }catch(err){
      res.status(404).json({message: err});
  }
})
module.exports = router;