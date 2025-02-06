const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chatId: {
    type: String,
  },
  text: {
    type: String,
  },
  timeStamp: { type: Date, default: Date.now },
});

messageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
messageSchema.set("toJSON", { virtuals: true });

// Corrigez l'exportation en utilisant un nom cohérent
const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;
