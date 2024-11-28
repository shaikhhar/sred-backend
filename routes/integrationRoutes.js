import { Router } from "express";
import {authenticate, callback, getStatus, removeIntegration} from "../controllers/githubController.js";

export const integrationRouter = Router();

integrationRouter.get('/authenticate', authenticate);
integrationRouter.get('/callback', callback);
integrationRouter.get('/status', getStatus);
integrationRouter.delete('/remove', removeIntegration);

export default integrationRouter;