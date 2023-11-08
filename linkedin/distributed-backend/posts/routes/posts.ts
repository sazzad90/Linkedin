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

import { Request, Response} from 'express';

const storage = multer.diskStorage({
  destination : (req:any, file:any, cb:any)=>{
      console.log(file)
      // console.log("original name : ", file.originalname)
      cb(null, './public/images')
  },
  filename :(req:any,file:any, cb:any) => {
      const newFilename = Date.now() + path.extname(file.originalname);
      // console.log('filename : ', newFilename)
      cb(null, newFilename)
  },
 
})

const upload = multer({storage: storage})

async function uploadToMinio(file:any) {
  const bucketName = "linkedin";
  console.log('checking filenname: ', file.filename);
  // const objectKey = Date.now() + ' ' + file.originalname;
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

  console.log("object key: " + objectKey)

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




router.route('/createPost').post(authenticateToken,upload.single("image") ,async(req:Request|any, res:Response) => {
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
       _imageId =  await uploadToMinio(file)
   }
   imageId = _imageId? _imageId : null

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
        const response = await axios.post(`http://host.docker.internal/notifications/createNotification`, {postId: postId});
        console.log('notification response : ', response.data);
        res.json('notification saved!');
      } catch (error) {
        console.error('Error for creating notification: ' + error);
        res.status(400).json('error for create notification: ' + error);
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
              // image:image
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