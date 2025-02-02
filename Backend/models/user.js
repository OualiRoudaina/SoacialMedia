import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' }, 
  bio: { type: String, maxLength: 200 },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], 
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], 
  isVerified: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
