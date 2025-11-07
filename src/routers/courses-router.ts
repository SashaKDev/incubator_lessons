import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams, RequestWithQuery} from "../../types";
import {QueryCoursesModel} from "../models/QueryCoursesModel";
import {CreateCourseModel} from "../models/CreateCourseModel";
import {URIParamsCourseModel} from "../models/URIParamsCourseModel";
import {CourseViewModel} from "../models/CourseViewModel";
import {UpdateCourseModel} from "../models/UpdateCourseModel";

export const coursesRouter = Router({});

coursesRouter.get('/', (req: RequestWithQuery<QueryCoursesModel>, res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.includes(req.query.title));
    }
    res
        .status(HTTP_STATUSES.OK_200)
        .json(foundCourses.map(getToViewModel));
});
coursesRouter.get('/:id', (req: RequestWithParams<URIParamsCourseModel>, res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    res
        .status(HTTP_STATUSES.OK_200)
        .json(getToViewModel(foundCourse));
});
coursesRouter.post('/', (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {
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
        .json(getToViewModel(createdCourse));
});
coursesRouter.put('/:id', (req: RequestWithBodyAndParams<URIParamsCourseModel,UpdateCourseModel>, res) => {
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
coursesRouter.delete('/:id', (req: RequestWithParams<URIParamsCourseModel>, res) => {
    const deletedCourse = db.courses.find(c => c.id === +req.params.id);
    db.courses = db.courses.filter(c => c.id !== +req.params.id);

    if (!deletedCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    res.sendStatus(HTTP_STATUSES.OK_200);
    return;
});
coursesRouter.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

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

const getToViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

type CourseType = {
    id: number, title: string
}