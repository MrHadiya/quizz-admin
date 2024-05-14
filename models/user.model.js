const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    user_name: {
        type: String,
        default: null
    },
    full_name: {
        type: String,
        default: null
    },
    email: {
        type: String,   
        required: true
    },
    is_social_login: {
        type: Number,
        required: true,
        default: 0
    },
    social_media_id: {
        type: Number,
        default: null
    },
    social_media_type: {
        type: String,
        default: "google",
        enum: ['google', 'facebook']
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        default: null
    },
    birth_year: {
        type: Number,
        default: null
    },
    country_id: {
        type: Number,
        default: null
    },
    contact_no: {
        type: Number,
        default: null
    },
    is_email_verify: {
        type: Number,
        required: true,
        default: 0
    },
    is_contact_verify: {
        type: Number,
        required: true,
        default: 0
    },
    avatar: {
        type: String,
        default: null
    }, 
    account_type_id: {
        type: Number,
        default: null
    },
    status: {
        type: Number,
        required: true,
        default: 1
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    role:{
      type:String,
      default:"user",
    }
}, { timestamps: true, versionKey: false })

const User = mongoose.model("User", userSchema);

module.exports = User;
