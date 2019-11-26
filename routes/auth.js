let express = require('express');
const { User } = require('../models/user');

let router = express.Router();

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log("logging in user");

    // Use the static method on the User model to find a user
    // by their email and password
    User.findByEmailPassword(email, password).then((user) => {
        if (!user) {
            res.status(404).json({
                error: "invalid login"
            });
        } else {
            // Add the user's id to the session cookie.
            // We can check later if this exists to ensure we are logged in.
            req.session.user = user._id;
            res.status(200).json({
                data: user
            });
        }
    }).catch((error) => {
        res.status(400).json({
            error: error.message
        });
    })
});

router.post('/signup', (req, res, next) => {
    const user = new User({
        user_name: req.body.user_name,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    });

    // Save the user
    user.save().then((user) => {
        res.send(user)
    }, (error) => {
        res.status(400).json({
            error: error.message
        });
    })
});

// A route to logout a user
router.post('/users/logout', (req, res) => {
    // Remove the session
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.redirect('/')
        }
    })
});

router.get('/current', (req, res) => {
    if (req.session.user) {
        return User.findOne({ _id: req.session.user }).then((user) => {
            if(!user){
                res.status(400).json({
                    error: "invalid session token"
                });
            }
            else{
                res.status(200).json(user);
            }
        });
    }
    else {
        res.status(400).json({
            error: "no current user"
        });
    }
});


module.exports = router;
