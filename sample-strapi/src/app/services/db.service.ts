import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParamsOptions } from '@angular/common/http';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as moment from 'moment';

interface Product {
  id: string
  productName: string
  unitPrice: number
}

interface Order {
  orderId: string
  userId?: string
  amount: number
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
  private productsUrl: string = 'api/products';
  private productCountUrl: string = 'api/products/count';
  private ordersUrl: string = 'api/orders';
  private orderCountUrl: string = 'api/orders/count';
  private signUpURL: string = 'api/auth/local/register';
  private signInUrl: string = 'api/auth/local';
  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getAuthHeader()
    })
  };

  // product api ---
  getProducts(): Observable<Product[]> | undefined {
    if (!this.isSignIn()) return
    return this.http.get<Product[]>(this.productsUrl, this.options)
  }

  countProducts(): Observable<number> | undefined {
    if (!this.isSignIn()) return
    return this.http.get<number>(this.productCountUrl, this.options)
  }

  findProducts(id: string): Observable<Product> | undefined{
    if (!this.isSignIn()) return
    return this.http.get<Product>(this.productsUrl + '/' + id, this.options)
  }
  
  // order api ---
  createOrder(orderId: string, amount: number): Observable<Order> | undefined {
    // if (!this.isSignIn()) return
    const userId = this.getUserId()
    const order: Order = {orderId: orderId, userId: userId!, amount: amount}
    return this.http.post<Order>(this.ordersUrl, order, this.options)
  }

  getOrders(): Observable<Order[]> | undefined {
    if (!this.isSignIn()) return
    return this.http.get<Order[]>(this.ordersUrl, this.options)
  }

  countOrder(): Observable<number> | undefined {
    if (!this.isSignIn()) return
    return this.http.get<number>(this.orderCountUrl, this.options)
  }

  findOrder(orderId: string): Observable<Order> | undefined{
    console.log("findOrder", this.isSignIn())
    if (!this.isSignIn()) return
    return this.http.get<Order>(this.ordersUrl + '/' + orderId, this.options)
  }
  // order api ---

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

  isSignIn(): boolean {
    if (!localStorage.getItem('id_token')) return false
    return moment().isBefore(this.getExpiration())
  }

  private getExpiration(): moment.Moment | undefined {
    const expiration: string | null = localStorage.getItem('expires_at')
    if (expiration) {
      return moment(JSON.parse(expiration!))
  }
    return
  }

  getUserId(): string | null {
    return localStorage.getItem('userId')
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error)
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'))
  }
}
