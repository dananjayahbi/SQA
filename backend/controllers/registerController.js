const Register = require('../models/Register');

const createRegister = async(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const address = req.body.address;
    const phone = req.body.phone;
    const password = req.body.password;
    const retypePassword = req.body.retypePassword;
 

    const register = new Register({
        name,
        email,
        gender,
        dob,
        address,
        phone,
        password,
        retypePassword,

     
    })

    register.save().then(()=>{
        res.json("Register Successfully")
    }).catch((err)=>{
        console.log(err);
    })
  
}

module.exports ={createRegister};