import { Router } from 'express';
import { createUserHandler } from './controller/user.controller';
import { getUniqueWordHandler, validateWordHandler } from './controller/word.controller';
const router = Router();

router.post('/users', createUserHandler);

router.get('/unique-word', getUniqueWordHandler);
router.post('/validate-word', validateWordHandler);

export default router;
