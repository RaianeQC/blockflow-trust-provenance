const express = require('express')
const User = require('../model/userModel')
const helper = require('../blockchain-controller/helper');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const configSecret = require('../config/config');
const shell = require('shelljs')

const router = express.Router();

router.post("/register", async (req, res) =>{
    
    
    const { email } = req.body;
 
    try{

       

        if(await User.findOne({email}))
            return res.status(400).send({erro : 'User alredy Register'});

        const user = await User.create(req.body);
   

        user.password = undefined;

        console.log(user);

        return res.json({user});

    }catch(err){
        return res.status(401).send({err : 'Registration failed'});
    }

})

/*router.post('/autentication', async (req, res) =>{
    const { email , password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({erro: 'User not found'})

    
    await bcrypt.compare(password, user.password, function(err, passequals){

        if(passequals){

            let token =  jwt.sign({id: user._id, username : user.username, organization: user.organization},  configSecret.secret,{
                expiresIn : 86400
            })

            console.log('Oi');
            return res.status(200).send({token: token});
        }else{

            return res.status(400).send({erro: 'Invalid Password'})
        }

    });
    
    //console.log('entra aqui')
       //return res.status(400).send({erro: 'Invalid Password'})
    //}*/

    //res.json({ message: 'Enjoy your token!' , user: user});


//})

router.post('/autentication', async (req, res) =>{
        const { email , password } = req.body;

  
        /*const user = await User.findOne({ email }).select('+password');

    
        if(!user)
            return res.status(400).send({erro: 'User not found'})*/
        

       
        /*if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({erro: 'Invalid Password'})*/
        

        /*let token =  jwt.sign({id: user._id, username : user.username, organization: user.organization},  configSecret.secret,{
          expiresIn : 86400
        })*/


        //user.password = undefined;

        /*console.log(token);


        res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');*/
        



        

        res.status(400).send({err: "oi"});

     

    

})



router.post('/userss', async (req, res) =>{
    
    const { email, username, organization } = req.body;
 
    console.log(req.body);

    try{

        if(await User.findOne({email}))
            return res.status(400).send({erro : 'User alredy Register'});

        const user = await User.create(req.body)

        if(user)
            user.password = undefined

            let response = await helper.getRegisteredUser(username, organization, true);
	        logger.debug('-- returned from registering the username %s for organization %s',username,organization);
	        if (response && typeof response !== 'string') {
		        logger.debug('Successfully registered the username %s for organization %s',username,organization);
		        response.token = token;
		        res.json(response, {user});
	        } else {
		        logger.debug('Failed to register the username %s for organization %s with::%s',username,organization,response);
		        res.json({success: false, message: response});
	         }
        

    }catch(err){

        return res.status(401).send({err : 'Registration failed'});
        
    }
})





router.get('/users', async (req, res) =>{
    const users = await User.find();

    

    console.log(users);

  

    return res.json(users);
})

module.exports = (app) => app.use('/api/user', router);