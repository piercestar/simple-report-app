import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { mockreports } from '../mock-server/mock-data/mock-reports'; 

// array in local storage for registered users
let reports = JSON.parse(localStorage.getItem('reports')) || [];

@Injectable()
export class MockReportInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(200))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/report/create') && method === 'POST':
                    return create();
                case url.endsWith('/report/update') && method === 'POST':
                    return update();
                case url.endsWith('/report') && method === 'GET':
                    return enquire();
                case url.match(/\/report\/delete\/\d+$/) && method === 'DELETE':
                    return remove();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function update() {
            const report = body;
            const index = reports.findIndex(x => x.report_id === report.report_id);
            
            reports[index] = report;
            localStorage.setItem('reports', JSON.stringify(reports));

            return ok();
        }

        function create() {
            const report = body

            // set user.id
            report.report_id = reports.length ? Math.max(...reports.map(x => x.report_id)) + 1 : 1;

            reports.push(report);
            localStorage.setItem('reports', JSON.stringify(reports));

            return ok();
        }

        function enquire() {
            // load sample reports if local storage is empty
            if (reports.length == 0) {
                reports = mockreports;
                localStorage.setItem('reports', JSON.stringify(reports));
            }

            return ok(reports);
        }

        function remove() {
            reports = reports.filter(x => x.report_id !== idFromUrl());
            localStorage.setItem('reports', JSON.stringify(reports));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const MockReportService = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockReportInterceptor,
    multi: true
};