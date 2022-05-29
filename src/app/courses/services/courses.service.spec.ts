import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService', () => {
    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController;
    const COURSE_ID = 12;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                CoursesService,
            ]
        }).compileComponents();
        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should retrieve all courses', () => {
        coursesService.findAllCourses()
                .subscribe(courses => {
            expect(courses).toBeTruthy('Courses should contains course!');
            expect(courses.length).toBe(12, 'Courses length should be 12');
            const course = courses.find(course => course.id === COURSE_ID);
            expect(course.titles.description).toBe('Angular Testing Course');
        });
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toBe('GET');
        req.flush({ payload: Object.values(COURSES) });
    });

    it('should find a course by id', () => {
        coursesService.findCourseById(COURSE_ID).subscribe(course => {
            expect(course).toBeTruthy();
            expect(course.id).toBe(COURSE_ID);
        });
        const req = httpTestingController.expectOne(`/api/courses/${ COURSE_ID }`);
        expect(req.request.method).toBe('GET');
        req.flush(COURSES[COURSE_ID]);
    });

    it('should save the course data', () => {
        const partialCourse: Partial<Course> = {titles: {description: 'Testing course !'}};
        coursesService.saveCourse(COURSE_ID, partialCourse).subscribe(course => {
            expect(course.id).toBe(COURSE_ID);
        });
        const req = httpTestingController.expectOne(`/api/courses/${COURSE_ID}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body.titles.description).toEqual(partialCourse.titles.description);
        req.flush({
            ...COURSES[COURSE_ID], 
            ...partialCourse
        })
    });

    it('should be an error if the saveCourse fails', () => {
        const partialCourse: Partial<Course> = {titles: {description: 'Testing course !'}};
        coursesService.saveCourse(COURSE_ID, partialCourse).subscribe(
            () => fail('An error occured, the test should fail !!!'),
            (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
            }
        );
        const req = httpTestingController.expectOne(`/api/courses/${COURSE_ID}`);
        expect(req.request.method).toBe('PUT');
        req.flush('Save course failed...', {status: 500, statusText: 'Internal server error'});
    });

    it('should find a list of lessons', () => {
        coursesService.findLessons(COURSE_ID).subscribe(lessons => {
            expect(lessons).toBeTruthy();
            expect(lessons.length).toBe(3);
        });
        const req = httpTestingController.expectOne(req => req.url === '/api/lessons');
        expect(req.request.method).toBe('GET');
        expect(req.request.params.get('courseId')).toEqual('12');
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toBe('asc');
        expect(req.request.params.get('pageNumber')).toBe('0');
        expect(req.request.params.get('pageSize')).toBe('3');
        req.flush({
            payload: findLessonsForCourse(COURSE_ID).slice(0, 3)
        })
    });

    afterEach(() => {
        httpTestingController.verify();
    })
});
