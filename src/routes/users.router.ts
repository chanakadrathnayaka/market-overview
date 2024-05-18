import express, {Router} from 'express';
import {UserController} from "../controllers/user.controller";

const router: Router = express.Router();

router.post('/login', UserController.getValidUserByEmail);
router.post('/profile', UserController.createUser);
router.put('/profile', UserController.updateUserByEmail);

export const usersRouter = router;
