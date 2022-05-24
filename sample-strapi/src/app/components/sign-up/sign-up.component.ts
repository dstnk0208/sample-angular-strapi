import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/services/db.service';

interface UserRegister {
  email: string,
  password: string,
  username: string
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm = this.fb.group({
    email: ['', Validators.required],
    password: ['' ,Validators.required],
    username: ['' ,Validators.required]
  })

  public user: UserRegister = {
    email: '',
    password: '',
    username: ''
  };
  
  public signedUp: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dbService: DbService
  ) { }

  ngOnInit(): void {
  }

  onSignUp(): void {
    this.dbService
      .signUp(this.signUpForm.value)
      .subscribe(user => {
        this.user = user
        this.signedUp = true;
      });
  }
}
