import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

// // Define the Post interface for type-checking and auto-completion
// interface IPost extends Document {
//   email: string;
//   post: string;
// }
// Define the Post schema
const postSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique:false,
      },
      firstName: {
        type: String,
        trim: true
      },
      lastName: {
        type: String,
        trim: true
      },
      content: {
        type: String,
        trim: true,
    },
      imageId: {
        type: String,
        trim: true,
      }
}, {
    timestamps: true
  });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

