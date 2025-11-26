import express from 'express';
import { createPit, deletePit, getAllPit, getPitDetail, updatePit } from '../controllers/pit_controller.js';

const router = express.Router();

router.post('/', createPit);
router.get('/', getAllPit);
router.get("/:idPit", getPitDetail);
router.patch('/:idPit', updatePit);
router.delete('/:idPit', deletePit);

export default router;