import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { Payload } from '.';
import RefreshToken from '../../models/refreshToken';

const publicRefreshKey = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'keys',
  'refreshToken',
  'public.key'
);
const refreshToken = new RefreshToken();

export const verifyRefreshToken = async (token: string): Promise<Payload> => {
  try {
    const publicKey = await fs.promises.readFile(publicRefreshKey, 'utf8');
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'Task-App'
    }) as Payload;
    const cachedToken = await refreshToken.getRefreshToken(decoded.id);
    
    if (!cachedToken || cachedToken !== token) {
      throw new Error('Refresh token not found or expired');
    }
    return decoded;
  } catch (err) {
    throw new Error(`Failed to verify refreshToken: ${(err as Error).message}`);
  }
};
