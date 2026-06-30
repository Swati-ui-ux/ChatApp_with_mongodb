const {Schema,model} = require('mongoose')

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref:"User",
    required: true,
    trim: true,
    default: 'Guest',
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  delivered: {
    type: Boolean,
    default: false,
},

seen: {
    type: Boolean,
    default: false,
},
  receiver: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Message = model('Message', messageSchema)
module.exports = Message
