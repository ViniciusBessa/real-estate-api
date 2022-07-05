import { Router } from 'express';
import apicache from 'apicache'
import loginRequired from '../middlewares/login-required';
import restrictAccess from '../middlewares/restrict-access';
import {
  getAllLocations,
  getSpecificLocation,
  getAllStates,
  getAllCities,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/location';

const router: Router = Router();
const cache = apicache.middleware;

router
  .route('/')
  .get(cache('5 minutes'), getAllLocations)
  .post(loginRequired, restrictAccess('admin'), createLocation);
router.route('/states').get(cache('5 minutes'), getAllStates);
router.route('/cities').get(cache('5 minutes'), getAllCities);
router
  .route('/:locationId')
  .get(cache('2 minutes'), getSpecificLocation)
  .patch(loginRequired, restrictAccess('admin'), updateLocation)
  .delete(loginRequired, restrictAccess('admin'), deleteLocation);

export default router;
