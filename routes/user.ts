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
router.route('/updateUsername').patch(updateUsername);
router.route('/updateEmail').patch(updateEmail);
router.route('/updatePassword').patch(updatePassword);

export default router;
