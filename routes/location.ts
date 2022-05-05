import { Router } from 'express';
import {
  getAllLocations,
  getSpecificLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/location';

const router: Router = Router();

router.route('/').get(getAllLocations).post(createLocation);
router
  .route('/:locationId')
  .get(getSpecificLocation)
  .patch(updateLocation)
  .delete(deleteLocation);

export default router;
