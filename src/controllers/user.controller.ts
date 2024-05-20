import crypto from "node:crypto";
import {UserModel} from "../models/user.model";
import {Request, Response} from "express";
import {Types} from "mongoose";

const getValidUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});
    if (!user) {
      res.status(401).send({message: 'Your email is wrong or user does not exist'});
    } else if (user.password === encryptPassword(req.body.password)) {
      res.status(200).send(await getSanitizedUser(user._id));
    } else {
      res.status(401).send({message: 'Your password doesn\'t match'});
    }
  } catch (error: any) {
    res.status(500).send({message: error.message});
  }
};

const createUser = async (req: Request, res: Response) => {
  const {firstName, lastName, email, password} = req.body;

  const user = new UserModel({

    firstName, lastName, email, password: encryptPassword(password)
  });
  try {
    const newUser = await user.save();
    res.status(201).send(await getSanitizedUser(newUser._id));
  } catch (error: any) {
    res.status(400).send({message: error.message});
  }
};

const updateUserByEmail = async (req: Request, res: Response) => {
  try {
    const existingUser = await UserModel.findOne({email: req.body.currentEmail});

    if (!existingUser) {
      res.status(404).send({message: 'User not found'});
      return;
    }
    const {firstName, lastName, email, password, preferences} = req.body;

    if (firstName && existingUser.firstName !== firstName) {
      existingUser.firstName = firstName;
    }
    if (lastName && existingUser.lastName !== firstName) {
      existingUser.lastName = lastName;
    }
    if (email && existingUser.email !== email) {
      existingUser.email = email;
    }
    if (password && existingUser.password !== encryptPassword(password)) {
      existingUser.password = encryptPassword(password);
    }

    if (preferences && existingUser.preferences !== preferences) {
      existingUser.preferences = preferences;
    }

    const updatedUser = await existingUser.save();
    res.status(200).send(await getSanitizedUser(updatedUser._id));
  } catch (error: any) {
    res.status(500).send({message: error.message});
  }
};

const getSanitizedUser = async (id: Types.ObjectId) => {
  return UserModel
  .findById(id).select('-_id -__v -password').lean();
}

const encryptPassword = (password: string) => {
  return crypto.createHash('sha512').update(password).digest('hex');
}

export const UserController = {createUser, getValidUserByEmail, updateUserByEmail};
