const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

module.exports = {
    Mutation: {
        async register(
            _, 
            { username, email, password, confirmPassword }, 
            context, 
            info
        ){
            //Todo validate user data
            //Todo make sure user  doesnot already exist 
            //Todo hash password and create an auth token
            const salt = bcrypt.genSaltSync(12);
            password = await bcrypt.hashSync(password, salt);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jwt.sign(
                {
                id: res.id,
                email: res.email,
                username: res.username
                }, 
                SECRET_KEY, 
                { expiresIn: '1h' }
            );
          
            return{
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};