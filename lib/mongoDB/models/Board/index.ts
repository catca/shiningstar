import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Please add a id'],
    unique: true,
    trim: true,
    maxlength: [12, 'id cannot be more than 12 char'],
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: false,
    trim: true,
    maxlength: [10, 'name cannot be more than 10 char'],
  },
  imageUrl: {
    type: String,
    required: true,
    unique: false,
  },
  boardImageUrl: {
    type: Array,
    required: true,
    unique: false,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  favorite: {
    type: Array,
    required: true,
    unique: false,
  },
  createDate: {
    type: Date,
    required: true,
    unique: false,
  },
  modifiedDate: {
    type: Date,
    required: true,
    unique: false,
  },
  reply: {
    type: Array,
    required: true,
  },
});

export default mongoose.models.Board ||
  mongoose.model('Board', BoardSchema, 'board');
