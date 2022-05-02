import { Router } from 'express';
import {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUsername,
  updateEmail,
  updatePassword,
} from '../controllers/user';

const router: Router = Router();

router.route('/').get(getAllUsers);
router.route('/getCurrentUser').get(getCurrentUser);
router.route('/:userId').get(getSingleUser);
router.route('/updateUserName').patch(updateUsername);
router.route('/UpdateUserEmail').patch(updateEmail);
router.route('/UpdateUserPassword').patch(updatePassword);

export default router;
