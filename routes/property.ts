import { Router } from 'express';
import multer from 'multer';
import {
  getAllProperties,
  getSpecificProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/property';

const upload = multer();
const router: Router = Router();

router.route('/').get(getAllProperties).post(upload.any(), createProperty);
router
  .route('/:propertyId')
  .get(getSpecificProperty)
  .patch(updateProperty)
  .delete(deleteProperty);

export default router;
