import './config.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {router} from './routes/index.js';

console.log('process.env', process.env.GITHUB_CLIENT_ID)
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', router)

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log('connected to Mongodb'))
    .catch((err) => console.error(err));

const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})