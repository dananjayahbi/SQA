
const mongoose = require('mongoose');

 const RegisterSchema = new mongoose.Schema({
         name:{
         type:String,
         },

        email:{
            type:String,
            required:true,
        },

        gender:{
            type:String,
            required:true,
        },
        
        dob:{
            type:String,
            required:true,
        },

        address:{
            type:String,
            required:true,
        },

        phone:{
            type:String,
            required:true,
        },

        password:{
            type:String,
            required:true,
        },

        retypePassword:{
            type:String,
            required:true,
        },


});
 const Register = mongoose.model('Register', RegisterSchema);

 module.exports = Register;