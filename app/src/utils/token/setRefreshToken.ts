import jwt, { SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import configs from '../../configs';
import { Payload } from '.';
import RefreshToken from '../../models/refreshToken';

const privateRefreshKey = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'keys',
  'refreshToken',
  'private.key'
);
const refreshToken = new RefreshToken();

export const setRefreshToken = async (payload: Payload): Promise<string> => {
  try {
    const privateKey = await fs.promises.readFile(privateRefreshKey, 'utf8');
    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn: configs.refresh_expires,
      issuer: 'Task-App',
      audience: `user_id-${String(payload.id)}`,
      subject: 'refresh_token'
    };
    const token = jwt.sign(payload, privateKey, options);
    const expiration = new Date(Date.now() + configs.refresh_expires * 1000);
    await refreshToken.createRefreshToken({
      user_id: payload.id,
      token,
      expiration
    });
    
    return token;
  } catch (err) {
    throw new Error('Failed to sign JWT');
  }
};
