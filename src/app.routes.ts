import { Router } from 'express';
import { createUserHandler } from './controller/user.controller';
import { getUniqueWordHandler, validateWordHandler } from './controller/word.controller';
import { validateRoleMiddleware } from './middleware/jwt.midleware';
const router = Router();

router.post('/users', createUserHandler);

router.get('/game/word', validateRoleMiddleware('USER_GAME'), getUniqueWordHandler);
router.put('/game/word', validateRoleMiddleware('USER_GAME'), validateWordHandler);

export default router;
