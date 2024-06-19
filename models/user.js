const { types, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type:String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);     // Passport local mongoose by default creates a username, salt and hashedPassword field

module.exports = mongoose.model('User',userSchema);
