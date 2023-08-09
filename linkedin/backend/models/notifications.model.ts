import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
        trim: true,
      },
      receiverEmail: { 
        type: String
      },
      seen: {
        type: Boolean,
    }
}, {
    timestamps: true
  });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;

