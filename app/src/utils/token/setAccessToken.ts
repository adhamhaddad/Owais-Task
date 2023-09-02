import jwt, { SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import configs from '../../configs';
import { Payload } from '.';
import AccessToken from '../../models/accessToken';

const privateAccessKey = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'keys',
  'accessToken',
  'private.key'
);
const accessToken = new AccessToken();

export const setAccessToken = async (payload: Payload): Promise<string> => {
  try {
    const privateKey = await fs.promises.readFile(privateAccessKey, 'utf8');
    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn: configs.access_expires,
      issuer: 'Task-App',
      audience: `user_id-${String(payload.id)}`,
      subject: 'access_token'
    };
    const token = jwt.sign(payload, privateKey, options);
    const expiration = new Date(Date.now() + configs.access_expires * 1000);
    await accessToken.createAccessToken({
      user_id: payload.id,
      token,
      expiration
    });
    
    return token;
  } catch (err) {
    throw new Error('Failed to sign JWT');
  }
};
