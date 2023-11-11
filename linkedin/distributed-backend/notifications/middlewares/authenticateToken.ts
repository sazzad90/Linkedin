const jwt = require('jsonwebtoken');

const authenticateToken=(req:any, res:any, next:any)=>{
    const {authorization} = req.headers;
    try{
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const {email, firstName, lastName} = decoded;
        req.email = email;
        req.firstName = firstName;
        req.lastName = lastName;
        next();
    }catch(err){
        console.error(err)
        res.status(401).json({message: 'Invalid token'});
    }
}

module.exports = authenticateToken;