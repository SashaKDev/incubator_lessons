import express, {Request, Response} from 'express';
import {CreateCourseModel} from "./models/CreateCourseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";
import {QueryCoursesModel} from "./models/QueryCoursesModel";
import {CourseViewModel} from "./models/CourseViewModel";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams, RequestWithQuery} from "./types";
import {URIParamsCourseModel} from "./models/URIParamsCourseModel";

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

app.get('/courses', (req: RequestWithQuery<QueryCoursesModel>,
                     res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.includes(req.query.title));
    }
    res
        .status(HTTP_STATUSES.OK_200)
        .json(foundCourses.map(dbCourse => {
            return {
                id: dbCourse.id,
                title: dbCourse.title
            }
        }));
});
app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseModel>,
                         res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    res
        .status(HTTP_STATUSES.OK_200)
        .json({
            id: foundCourse.id,
            title: foundCourse.title
        });
});
app.post('/courses', (req: RequestWithBody<CreateCourseModel>,
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
        .json({
            id: createdCourse.id,
            title: createdCourse.title
        });
});
app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseModel>,
                            res) => {
    const deletedCourse = db.courses.find(c => c.id === +req.params.id);
    db.courses = db.courses.filter(c => c.id !== +req.params.id);

    if (!deletedCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    res.sendStatus(HTTP_STATUSES.OK_200);
});
app.put('/courses/:id', (req: RequestWithBodyAndParams<URIParamsCourseModel,UpdateCourseModel>,
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
