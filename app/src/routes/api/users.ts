import { Router } from 'express';
import {
  validateGetUser,
  validateUpdateUser,
  validateDeleteUser
} from '../../middleware/validation/users';
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser
} from '../../controllers/users';
import { verifyToken, expressFilterRequest } from '../../middleware';

const allowedKeys = {
  patch: ['first_name', 'last_name', 'email']
};

const router = Router();

router
  .get('/', verifyToken, getUsers)
  .get('/:id', validateGetUser, verifyToken, getUser)
  .patch(
    '/:id',
    validateUpdateUser,
    verifyToken,
    expressFilterRequest(allowedKeys),
    updateUser
  )
  .delete('/:id', validateDeleteUser, verifyToken, deleteUser);

export default router;
