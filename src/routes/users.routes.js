const { Router } = require('express');
const router = Router();

const { renderSignUpForm, renderSignInForm, signup, signin, logout, renderProfile, updateUser, renderEditForm } = require('../controllers/users.controller');

const {isAuthenticated} = require('../helpers/auth')

router.get('/users/signup', renderSignUpForm);

router.post('/users/signup', signup);

router.get('/users/signin', renderSignInForm);

router.post('/users/signin', signin);

router.get('/users/logout', logout);

router.get('/users/edit/profile', isAuthenticated, renderEditForm)

router.get('/users/profile', isAuthenticated, renderProfile);

router.put('/users/profile/:id', isAuthenticated, updateUser);

module.exports = router; 