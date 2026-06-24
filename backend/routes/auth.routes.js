import Router from 'express';
import {registerUser, loginUser} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/auth/register', registerUser)

authRouter.post('/auth/login', loginUser)

authRouter.post('/auth/sign-out', (req, res) => {
    res.send({
        title: 'sign-out'
    });
})

export default authRouter;