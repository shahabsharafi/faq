import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    signin(username: string, password: string): Observable<boolean> {
        return this.http.post('/api/accounts/authenticate', { username: username, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                if (response.json()) {
                    let data = response.json();
                    let token = data.token;
                    if (token) {
                        // set token property
                        this.token = token;

                        // store username and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify({
                            username: username,
                            token: token,
                            firstName: data.firstName,
                            lastName: data.lastName
                        }));

                        // return true to indicate successful login
                        return true;
                    }
                }
                return false;
            });
    }

    signout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }

    isAuthenticated(): boolean {
        if (localStorage.getItem('currentUser'))
            return true;
        else
            return false;
    }

    getCurrentInfo(): any {
        var currentInfo: any = null;
        var currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            currentInfo = JSON.parse(currentUser);
        }
        return currentInfo;
    }
}
