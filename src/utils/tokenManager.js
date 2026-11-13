
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import {
  InvariantError,
  AuthenticationError,
} from '../exceptions/index.js';


// GET SECRET

const getAccessTokenKey = () => {
  if (!process.env.ACCESS_TOKEN_KEY) {
    throw new Error('ACCESS_TOKEN_KEY belum dikonfigurasi');
  }

  return process.env.ACCESS_TOKEN_KEY;
};

const getRefreshTokenKey = () => {
  if (!process.env.REFRESH_TOKEN_KEY) {
    throw new Error('REFRESH_TOKEN_KEY belum dikonfigurasi');
  }

  return process.env.REFRESH_TOKEN_KEY;
};


// GENERATE ACCESS TOKEN

export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    getAccessTokenKey(),
    {
      algorithm: 'HS256',
      expiresIn: '3h',
    }
  );
};


// GENERATE REFRESH TOKEN

export const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    getRefreshTokenKey(),
    {
      algorithm: 'HS256',
      jwtid: nanoid(16),
    }
  );
};


// VERIFY ACCESS TOKEN

export const verifyAccessToken = (token) => {
  const secret = getAccessTokenKey();

  let payload;

  try {
    payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],
    });
  } catch (error) {
    throw new AuthenticationError('Access token tidak valid');
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.id !== 'string'
  ) {
    throw new AuthenticationError('Access token tidak valid');
  }

  return payload;
};


// VERIFY REFRESH TOKEN

export const verifyRefreshToken = (token) => {
  const secret = getRefreshTokenKey();

  let payload;

  try {
    payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],
    });
  } catch (error) {
    throw new InvariantError('Refresh token tidak valid');
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.id !== 'string'
  ) {
    throw new InvariantError('Refresh token tidak valid');
  }

  return payload;
};