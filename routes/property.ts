import { Router } from 'express';
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

const upload = multer();
const router: Router = Router();

router
  .route('/')
  .get(getAllProperties)
  .post(
    loginRequired,
    restrictAccess('admin', 'announcer'),
    upload.any(),
    createProperty
  );
router
  .route('/:propertyId')
  .get(getSpecificProperty)
  .patch(loginRequired, restrictAccess('admin', 'announcer'), updateProperty)
  .delete(loginRequired, restrictAccess('admin', 'announcer'), deleteProperty);
router.route('/user/:userId').get(getPropertiesOfOneUser);

export default router;
