const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:admin123@cluster0.ou5wz2i.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log('failed');
  });

const users = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const contacts = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
});

const collection = mongoose.model("users", users);
const collection2 = mongoose.model("contacts", contacts);

module.exports = { collection, collection2 };
