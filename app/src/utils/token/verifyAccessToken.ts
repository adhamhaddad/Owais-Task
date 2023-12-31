import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { verifyRefreshToken, setAccessToken, DecodedToken } from '.';
import AccessToken from '../../models/accessToken';

const publicAccessKey = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'keys',
  'accessToken',
  'public.key'
);
interface Request extends ExpressRequest {
  user?: DecodedToken;
}
const accessToken = new AccessToken();

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization as string;
    if (!authorization) {
      return res.status(401).json({
        message: 'Not Authorized'
      });
    }
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new Error(
        'Invalid Authorization header format. Format is "Bearer <token>".'
      );
    }
    try {
      const publicKey = await fs.promises.readFile(publicAccessKey, 'utf8');
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: 'Task-App'
      }) as DecodedToken;
      console.log('decoded', decoded);
      // await accessToken.deleteAccessToken({user_id: decoded.id, expiration: decoded.});
      const cachedToken = await accessToken.getAccessToken(decoded.id);
      console.log(cachedToken);
      console.log('Logged');
      if (!cachedToken || cachedToken !== token) {
        throw new Error('Access token not found or expired');
      }
      req.user = { id: decoded.id, email: decoded.email };

      return next();
    } catch (err) {
      if ((err as Error).name !== 'TokenExpiredError') {
        throw new Error('Invalid access token');
      }
      // Get Refresh-Token
      const refreshToken = req.get('X-Refresh-Token') as string;

      // const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error('Refresh token missing');
      }
      const [bearer, token] = refreshToken.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new Error(
          'Invalid Authorization header format. Format is "Bearer <token>".'
        );
      }
      const decoded = await verifyRefreshToken(token);
      const { id, first_name, last_name, email } = decoded;
      const newAccessToken = await setAccessToken({
        id,
        first_name,
        last_name,
        email
      });

      // Attach user object to request and proceed with new access token
      req.user = { id, email };

      return next();
    }
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
};
