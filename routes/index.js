import { integrationRouter } from './integrationRoutes.js';
import express from "express";


export const router = express.Router();

router.get('/test', (req, res) => {
    res.send('Ok')
})

router.use('/github', integrationRouter)

