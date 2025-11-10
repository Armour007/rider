import { Router } from 'express';
import { 
  searchRides, 
  selectRide, 
  initRide, 
  confirmRide,
  onSearch,
  onSelect,
  onInit,
  onConfirm,
  onStatus
} from '../controllers/ondc.controller';

const router = Router();

// BAP endpoints (our requests to ONDC)
router.post('/search', searchRides);
router.post('/select', selectRide);
router.post('/init', initRide);
router.post('/confirm', confirmRide);

// Callback endpoints (ONDC responses)
router.post('/on_search', onSearch);
router.post('/on_select', onSelect);
router.post('/on_init', onInit);
router.post('/on_confirm', onConfirm);
router.post('/on_status', onStatus);

export default router;
