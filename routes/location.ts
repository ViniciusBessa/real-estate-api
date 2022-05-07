import { Router } from 'express';
import loginRequired from '../middlewares/login-required';
import restrictAccess from '../middlewares/restrict-access';
import {
  getAllLocations,
  getSpecificLocation,
  getAllStates,
  getAllCitiesFromState,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/location';

const router: Router = Router();

router
  .route('/')
  .get(getAllLocations)
  .post(loginRequired, restrictAccess('admin'), createLocation);
router.route('/states').get(getAllStates);
router.route('/cities/:state').get(getAllCitiesFromState);
router
  .route('/:locationId')
  .get(getSpecificLocation)
  .patch(loginRequired, restrictAccess('admin'), updateLocation)
  .delete(loginRequired, restrictAccess('admin'), deleteLocation);

export default router;
