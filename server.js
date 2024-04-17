import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './Backend/routers/router.js'
import { connectToDB } from './Backend/config/mongoDB.js'
import expresseLayouts from 'express-ejs-layouts';

const server = express();
server.use(expresseLayouts);

const filename = fileURLToPath(
    import.meta.url); // get the resolved path to the file
// ejs 
server.set('view engine', 'ejs');
server.set('views', path.join(process.cwd(), 'Frontend', 'views'));

// routers 
server.use('/', router);

server.listen(process.env.PORT, () => {
    console.log(`Server is Listening on port: ${process.env.PORT}`);
    connectToDB();
})