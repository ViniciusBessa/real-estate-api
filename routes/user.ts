import { Router } from 'express';
import loginRequired from '../middlewares/login-required';
import restrictAccess from '../middlewares/restrict-access';
import {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUsername,
  updateEmail,
  updatePassword,
} from '../controllers/user';

const router: Router = Router();

router.route('/').get(loginRequired, restrictAccess('admin'), getAllUsers);
router.route('/getCurrentUser').get(loginRequired, getCurrentUser);
router.route('/:userId').get(getSingleUser);
router.route('/updateUsername').patch(loginRequired, updateUsername);
router.route('/updateEmail').patch(loginRequired, updateEmail);
router.route('/updatePassword').patch(loginRequired, updatePassword);

export default router;
