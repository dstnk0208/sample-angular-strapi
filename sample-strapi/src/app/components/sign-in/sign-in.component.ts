import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/services/db.service';
import { UserSignIn } from 'src/assets/interfaces';
import * as moment from 'moment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm = this.fb.group({
    identifier: ['', Validators.required],
    password: ['' ,Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private dbService: DbService
  ) { }

  public token: string = '';

  public userName: string = '';

  public userId: string = '';

  public signedIn: boolean = false;

  public signInStatus: string = '';

  ngOnInit(): void {
  }

  onSignIn(): void {
    this.dbService.signIn(this.signInForm.value).subscribe({
      next: (result) => {
        this.token = result.jwt
        this.signedIn = true
        this.signInStatus = 'Sign in is success'
        this.userName = result.user.username
        this.userId = result.user.id
        this.saveToken(this.token)
      },
      error: (e) => this.signInStatus = 'Failed to sign in'
    });
  }

  saveToken(token: string): void {
    const expiresAt = moment().add(1, 'day')
    localStorage.setItem('id_token', token)
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()))
    localStorage.setItem('userId', this.userId)
  }

}
