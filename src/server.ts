import express, {Request, Response} from 'express';
import {CreateCourseModel} from "./models/CreateCourseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";
import {QueryCoursesModel} from "./models/QueryCoursesModel";
import {CourseViewModel} from "./models/CourseViewModel";

export const app = express();
const port = 3000;
app.use(express.json());

type CourseType = {
    id:number, title: string
}

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST: 400,
    NOT_FOUND: 404
};
const db: { courses: CourseType[] } = {
    courses: [
        {id: 1, title: 'front-end'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'automation qa'},
        {id: 4, title: 'devops'}
    ]
}

app.get('/courses', (req: Request<{}, {}, {}, QueryCoursesModel>,
                     res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.includes(req.query.title as string));
    }
    res
        .status(HTTP_STATUSES.OK_200)
        .json(foundCourses);
});
app.get('/courses/:id', (req: Request<{id: string}>,
                         res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res
            .sendStatus(HTTP_STATUSES.NOT_FOUND);
    }
    res
        .status(HTTP_STATUSES.OK_200)
        .json(foundCourse);
});
app.post('/courses', (req: Request<{}, {}, CreateCourseModel>,
                      res: Response<CourseViewModel>) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    }
    db.courses.push(createdCourse);
    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(createdCourse);
});
app.delete('/courses/:id', (req: Request<{id: string}>,
                            res) => {
    const deletedCourse = db.courses.find(c => c.id === +req.params.id);
    db.courses = db.courses.filter(c => c.id !== +req.params.id);

    if (!deletedCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }
    res.sendStatus(HTTP_STATUSES.OK_200);
});
app.put('/courses/:id', (req: Request<{id: string}, {}, UpdateCourseModel>,
                         res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
        return;
    }
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.OK_200);
});
app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
