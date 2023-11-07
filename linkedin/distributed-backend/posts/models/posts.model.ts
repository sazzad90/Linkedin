import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

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

