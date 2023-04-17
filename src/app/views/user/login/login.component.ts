import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserInfoType} from "../../../../types/user-info.type";
import { throwError} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    rememberMe: [false]
  });
  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,
              private _snackBar: MatSnackBar, private router: Router) {

  }

  ngOnInit() {
  }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .pipe(

        )
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType) !== undefined) {
              error = (data as DefaultResponseType).message
            }
            const loginResponse = data as LoginResponseType;
            if (!loginResponse.refreshToken || !loginResponse.accessToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open('Вы успешно авторизовались');
            this.authService.getUserInfo()
              .subscribe({
                next: (data: UserInfoType | DefaultResponseType) => {
                  const userResponse = data as UserInfoType;
                  if (!userResponse.id || !userResponse.email || !userResponse.name) {
                    throw new Error('Authorization error')
                  }
                  this.authService.userName = userResponse.name;
                },
                error: (errorResponse: HttpErrorResponse) => {
                  throw throwError(errorResponse.error.message);
                }
              });
            this.router.navigate(['/']);

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);

            } else {
              this._snackBar.open('Ошибка авторизации');
            }

          }
        })
    }

  }
}
