const mongoose = require('../database/connection')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required : true
    },
    password : {
        type: String,
        required: true,
        select : false
    },
    username : {
        type : String,
        required : true,
    },
    organization : {
        type: String,
        required: true
    },
    createdAt :{
        type: Date,
        default : Date.now
    }
})

UserSchema.pre('save', async function(next){
    const user = this

    //console.log(user);

   const hash =  await bcrypt.hash(user.password, 10)

   

    console.log(hash);

    user.password = hash;

    next();

    /*bcrypt.genSalt(10, (err, salt) =>{
       
        bcrypt.hash(user.password, salt, (err, hash) =>{
            console.log(hash);

            user.password = hash;
            
            next();
        } )
    } )*/

})

const user = mongoose.model('User', UserSchema);

module.exports = user;