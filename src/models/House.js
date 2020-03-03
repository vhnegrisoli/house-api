import { Schema, model } from 'mongoose';

const HouseSchema = new Schema({
  thumbnail: String,
  description: String,
  price: Number,
  location: String,
  status: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
},
  {
    toJSON: {
      virtuals: true
    }
  });

HouseSchema.virtual('url').get(function () {
  return `http://localhost:8080/uploads/${this.thumbnail}`
})

export default model('House', HouseSchema);