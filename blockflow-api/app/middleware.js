const jwt = require('jsonwebtoken')
const configSecret = require('./config/config')


module.exports = async (req, res, next) =>  {
    //const tokenreq = req.token;

   const tokenreq = req.headers.authorization;

    if(!tokenreq)
        res.status(400).send({err: 'Token not provided'});

    const parts = tokenreq.split(' ')
    
    if(!parts.lenght === 2 )
        res.status(400).send({err: 'Token error'});

    
    const [ scheme, token] = parts;

    if(!/^Baerer$/i.test(scheme))
        res.status(400).send({err: 'Token malformed'});

    
    jwt.verify(token, configSecret.secret, (err, decoded)=>{
        if(err) return res.status(401).send({ error : "Token invalid"})

        
        req.userId = decoded.id;
        req.username = decoded.username;
        req.organization = decoded.organization;
        
        
            

        return next();
    });

}
