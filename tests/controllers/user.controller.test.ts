import request from 'supertest';
import express from 'express';
import {UserController} from '../../src/controllers/user.controller';
import {UserModel} from '../../src/models/user.model';
import mongoose from 'mongoose';
import crypto from 'node:crypto';

jest.mock('../../src/models/user.model');
jest.mock('node:crypto');

const app = express();
app.use(express.json());

app.post('/login', UserController.getValidUserByEmail);
app.post('/profile', UserController.createUser);
app.put('/profile', UserController.updateUserByEmail);

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getValidUserByEmail', () => {
    it('should return 401 if user is not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
      .post('/login')
      .send({email: 'test@example.com', password: 'password'});

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Your email is wrong or user does not exist');
    });

    it('should return 401 if password does not match', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({password: 'hashedpassword'});
      (crypto.createHash as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('wronghashedpassword')
        })
      });

      const response = await request(app)
      .post('/login')
      .send({email: 'test@example.com', password: 'password'});

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Your password doesn\'t match');
    });

    it('should return 200 and sanitized user if credentials are valid', async () => {
      const userId = new mongoose.Types.ObjectId();
      (UserModel.findOne as jest.Mock).mockResolvedValue({_id: userId, password: 'hashedpassword'});
      (crypto.createHash as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('hashedpassword')
        })
      });
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({firstName: 'John', lastName: 'Doe'})
      }));

      const response = await request(app)
      .post('/login')
      .send({email: 'test@example.com', password: 'password'});

      expect(response.status).toBe(200);
      expect(response.body).toEqual({firstName: 'John', lastName: 'Doe'});
    });
  });

  describe('createUser', () => {
    it('should create a new user and return sanitized user', async () => {
      const userId = new mongoose.Types.ObjectId();
      (crypto.createHash as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('hashedpassword')
        })
      });
      (UserModel.prototype.save as jest.Mock).mockResolvedValue({_id: userId});
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({firstName: 'John', lastName: 'Doe'})
      }));

      const response = await request(app)
      .post('/profile')
      .send({firstName: 'John', lastName: 'Doe', email: 'test@example.com', password: 'password'});

      expect(response.status).toBe(201);
      expect(response.body).toEqual({firstName: 'John', lastName: 'Doe'});
    });

    it('should return 400 if there is an error', async () => {
      (UserModel.prototype.save as jest.Mock).mockRejectedValue(new Error('Save error'));

      const response = await request(app)
      .post('/profile')
      .send({firstName: 'John', lastName: 'Doe', email: 'test@example.com', password: 'password'});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Save error');
    });
  });

  describe('updateUserByEmail', () => {
    it('should update user and return sanitized user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const user = {
        _id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'hashedpassword',
        save: jest.fn().mockResolvedValue({})
      };
      (UserModel.findOne as jest.Mock).mockResolvedValue(user);
      (crypto.createHash as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('hashedpassword')
        })
      });
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({firstName: 'John', lastName: 'Doe'})
      }));

      const response = await request(app)
      .put('/profile')
      .send({
        currentEmail: 'test@example.com',
        firstName: 'Jane',
        email: 'new@example.com',
        password: 'password'
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({firstName: 'John', lastName: 'Doe'});
      expect(user.firstName).toBe('Jane');
      expect(user.email).toBe('new@example.com');
    });

    it('should return 404 if user is not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
      .put('/profile')
      .send({currentEmail: 'test@example.com', firstName: 'Jane'});

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 if there is an error', async () => {
      (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('Update error'));

      const response = await request(app)
      .put('/profile')
      .send({currentEmail: 'test@example.com', firstName: 'Jane'});

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Update error');
    });
  });
});
