import { Router } from 'express';
import apicache from 'apicache';
import multer from 'multer';
import loginRequired from '../middlewares/login-required';
import restrictAccess from '../middlewares/restrict-access';
import {
  getAllProperties,
  getSpecificProperty,
  getPropertiesOfOneUser,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/property';

const router: Router = Router();
const cache = apicache.middleware;
const upload = multer();

router
  .route('/')
  .get(cache('1 day'), getAllProperties)
  .post(
    loginRequired,
    restrictAccess('admin', 'announcer'),
    upload.any(),
    createProperty
  );
router
  .route('/:propertyId')
  .get(cache('1 day'), getSpecificProperty)
  .patch(loginRequired, restrictAccess('admin', 'announcer'), updateProperty)
  .delete(loginRequired, restrictAccess('admin', 'announcer'), deleteProperty);
router.route('/user/:userId').get(cache('1 day'), getPropertiesOfOneUser);

export default router;
