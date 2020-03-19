const usersCtrl = {};
const User = require('../models/User');
const passport = require('passport');

usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersCtrl.signup = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (password != confirm_password) {
        errors.push({ text: 'Password do not match' });
    }
    if (password.length < 8) {
        errors.push({ text: 'Password must be at least 8 characters' });
    }
    if (errors.length > 0) {
        res.render('users/signup', {
            errors,
            name,
            email
        })
    } else {
        const emailUser = await User.findOne({ email });
        if (emailUser) {
            req.flash('error_msg', 'The email is already used');
            res.redirect('/users/signup');
        } else {
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered');
            res.redirect('/users/signin');
        }
    }
    console.log(req.body);
    //res.send('received')
};

usersCtrl.renderSignInForm = (req, res) => {
    res.render('users/signin')
};

usersCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/notes',
    failureFlash: true
});

usersCtrl.renderProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.render('users/profile', {user});
}

usersCtrl.renderEditForm = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.render('users/edit-profile', {user});
}

usersCtrl.updateUser = async(req, res) => {
    const {name, email} = req.body;
    await User.findByIdAndUpdate(req.user.id, {name, email})
    req.flash('success_msg', 'Profile Updated Successfully');
    res.redirect('/users/profile'); 
}

usersCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/signin');
};
module.exports = usersCtrl;