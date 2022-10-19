import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NewsService } from './news.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private user: User;

  private loginUrl = 'http://sanger.dia.fi.upm.es/pui-rest-news/login';

  private message: string;

  private httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'x-www-form-urlencoded'),
  };

  constructor(private http: HttpClient, private newsService: NewsService) {
    this.user = { username: null, password: null };
    this.message = '';
  }

  isLogged() {``
    return this.user != null;
  }

  login(name: string, pwd: string): Observable<User> {
    const usereq = new HttpParams().set('username', name).set('passwd', pwd);
    return this.http.post<User>(this.loginUrl, usereq).pipe(
      tap((user) => {
        this.user = user;
        this.newsService.setUserApiKey(user.apikey!)
      })
    );
  }

  getUser() {
    return this.user;
  }

  logout() {
    // this.user = null;
    this.user = { username: null, password: null };
    this.newsService.setAnonymousApiKey()
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //this.user = null;
      this.user = { username: null, password: null };
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
