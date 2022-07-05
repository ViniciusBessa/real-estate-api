import { Router } from 'express';
import apicache from 'apicache';
import loginRequired from '../middlewares/login-required';
import restrictAccess from '../middlewares/restrict-access';
import {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  getPropertiesFavorited,
  updateUsername,
  updateEmail,
  updatePassword,
  addPropertyToFavorites,
  removePropertyFromFavorites,
} from '../controllers/user';

const router: Router = Router();
const cache = apicache.middleware;

router
  .route('/')
  .get(loginRequired, restrictAccess('admin'), cache('2 minutes'), getAllUsers);
router.route('/currentUser').get(loginRequired, getCurrentUser);
router
  .route('/currentUser/propertiesFavorited')
  .get(loginRequired, getPropertiesFavorited);
router.route('/:userId').get(cache('2 minutes'), getSingleUser);
router.route('/currentUser/username').patch(loginRequired, updateUsername);
router.route('/currentUser/email').patch(loginRequired, updateEmail);
router.route('/currentUser/password').patch(loginRequired, updatePassword);
router
  .route('/currentUser/:propertyId')
  .patch(loginRequired, addPropertyToFavorites);
router
  .route('/currentUser/:propertyId')
  .delete(loginRequired, removePropertyFromFavorites);

export default router;
