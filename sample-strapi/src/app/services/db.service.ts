import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as moment from 'moment';

interface Product {
  id: string
  productName: string
  unitPrice: number
}

interface UserSignUp {
  email: string,
  password: string,
  username: string
}

interface UserSignIn {
  identifier: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(
    private http: HttpClient
  ) { }
  private productsUrl = 'api/products';
  private productCountUrl = 'api/products/count';
  private productFindUrl = 'api/products';
  private signUpURL = 'api/auth/local/register';
  private signInUrl = 'api/auth/local';

  getProducts(): Observable<Product[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader()
      })
    };
    return this.http.get<Product[]>(this.productsUrl, options)
  }

  countProducts(): Observable<number> {
    const options = {
      headers: new HttpHeaders({
        Authorization: this.getAuthHeader()
      })
    };
    return this.http.get<number>(this.productCountUrl, options)
  }

  findProducts(id: string): Observable<Product> {
    const options = {
      headers: new HttpHeaders({
        Authorization: this.getAuthHeader()
      })
    };
    return this.http.get<Product>(this.productFindUrl + '/' + id, options)
  }

  signUp(user: UserSignUp): Observable<UserSignUp> {
    return this.http.post<UserSignUp>(this.signUpURL, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  signIn(user: UserSignIn): Observable<any> {
    return this.http.post<UserSignIn>(this.signInUrl, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAuthHeader(): string {
    return 'Bearer ' + localStorage.getItem('id_token')
  }

  isSignIn(): Boolean {
    if (!localStorage.getItem('id_token')) return false
    return moment().isBefore(this.getExpiration())
  }

  private getExpiration(): moment.Moment | undefined {
    const expiration: string | null = localStorage.getItem('expires_at');
    if (expiration) {
      return moment(JSON.parse(expiration!))
  }
    return
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
