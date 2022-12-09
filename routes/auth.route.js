const express = require('express');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/user.controller');
const userSchema = require('../models/user');
const signUpSchema = require('../models/signup');
const validator = require('../utils/validator');
const config = require('../config');
const loginValidator = require('../utils/auth');

const router = express.Router();

router.route('/')
    .post(validator(userSchema), async (req, res) => {
        
        let user = await userController.getByEmailAndPassword(req.body);

        if (!user) {
            res.status(401).json({message: "Combinaison email/password incorrecte"});
        } else {
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                roles: user.roles
            }, config.jwtPass, { expiresIn: config.jwtExpireLength });
    
            res.json({
                access_token: token
            });
        }
    })
;

router.route('/test')
    .get(loginValidator.isAuth(), (req, res) => {
        res.json({message: "coucou"});
    })
;

router.route('/test/admin')
    .get(loginValidator.isAdmin(), (req, res) => {
        res.json({message: "coucou admin"});
    })
;

router.route('/signup')
    .post(validator(signUpSchema), async (req, res) => {
        const user = await userController.getByEmail(req.body);

        if (user) {
            res.status(400).json({message: "L'email est déjà utilisé"});
        } else {
            const newUser = await userController.add(req.body);
            const token = jwt.sign({
                id: newUser.id,
                email: newUser.email,
                roles: newUser.roles
            }, config.jwtPass, { expiresIn: '1 hour' });
    
            res.json({
                access_token: token
            });
        }
    })
;



// Créer une route POST /api/signup dans auth.route.js qui créé un utilisateur 
// avec le role "user"

module.exports = router;