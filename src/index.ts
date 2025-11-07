import express, {Request, Response} from 'express';
import {coursesRouter} from "./routers/courses-router";

export const app = express();
const port = 3000;
app.use(express.json());

app.use('/courses', coursesRouter)

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
