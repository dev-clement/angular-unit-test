import { fakeAsync, flush, flushMicrotasks, tick, waitForAsync } from "@angular/core/testing";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async testing example', () => {

    it('Asynchronous test example with jasmine done method', (done: DoneFn) => {
        let test = false;
        setTimeout(() => {
            console.log('running the assertion !');
            test = true;
            expect(test).toBeTruthy();
            done();
        }, 1000);
    })

    it('Asynchronous example using setTimeout method', fakeAsync(() => {
        let test = false;

        setTimeout(() => {});

        setTimeout(() => {
            console.log('running the assertion setTimeout()');
            test = true;
        }, 1000);

        tick(500);
        tick(499);
        tick(1);
        flush();

        expect(test).toBeTruthy();
    }));

    it('Asynchronous test - Plain promise', fakeAsync(() => {

        let test = false;

        console.log('Initializing promise O1');

        Promise.resolve().then(() => {
            console.log('Promise first then block evaluated successfully !! O3');
            return Promise.resolve();
        })
        .then(() => {
            console.log('Promise second then block evaluated successfully !! O3-1');
            test = true;
        });
        flushMicrotasks();
        console.log('Running the assertion about test O4');
        expect(test).toBeTruthy();
    }));

    it('Asynchronous example - Promise and setTimeout', fakeAsync(() => {
        let counter = 0;
        Promise.resolve().then(() => {
            counter += 10;
            setTimeout(() => {
                counter += 1;
            }, 1000);
        });
        expect(counter).toBe(0);
        flushMicrotasks();
        expect(counter).toBe(10);
        tick(500);
        expect(counter).toBe(10);
        tick(500);
        expect(counter).toBe(11);
    }));

    it('Asynchronous test example - Observables', fakeAsync(() => {
        let test = false;
        console.log('Creating observable');
        
        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => {
            test = true;
        });
        tick(1000);
        
        console.log('running expect statements');
        expect(test).toBe(true);
    }));
    
});