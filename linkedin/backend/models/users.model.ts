import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export interface IUser extends Document {
  username: string;
  // Other user properties
}
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      trim: true,
    }
  }, {
    timestamps: true
  });
  
const User = mongoose.model('User', userSchema);
module.exports = User;