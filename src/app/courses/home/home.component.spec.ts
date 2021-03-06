import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { click } from '../common/test-utils';

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const begginnerCourses = setupCourses()
      .filter(course => course.category === 'BEGINNER');
  const advancedCourses = setupCourses()
      .filter(course => course.category === 'ADVANCED');

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses'])
    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy}
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesService = TestBed.inject(CoursesService);
    });
  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(begginnerCourses));
    fixture.detectChanges();
    const tab = el.queryAll(By.css('.mat-tab-label'));
    expect(tab.length).toBe(1, 'Unexpected number of tab found !');
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tab = el.queryAll(By.css('.mat-tab-label'));
    expect(tab.length).toBe(1, 'Unexpected number of tab found !');
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tab = el.queryAll(By.css('.mat-tab-label'));
    expect(tab.length).toBe(2, 'Unexpected number of tab found !');
  });


  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tab = el.queryAll(By.css('.mat-tab-label'));
    click(tab[1]);
    fixture.detectChanges();
    flush();
    const cardTitles = el.queryAll(By.css('.mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find title');
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Testing Course');  
  }));
});


