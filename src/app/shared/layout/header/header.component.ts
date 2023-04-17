import {Component, OnInit,} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar,} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserInfoType} from "../../../../types/user-info.type";
import {throwError} from "rxjs";
import {Location} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userName: string | null = null;
  menuOpened:boolean= false;


  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private location: Location) {
    this.isLogged = this.authService.getIsLoggedIn();
    this.userName = localStorage.getItem(this.authService.userNameKey);
  }

  ngOnInit() {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      this.authService.getUserInfo()
        .subscribe({
          next: (data: UserInfoType | DefaultResponseType) => {
            const userResponse = data as UserInfoType;
            if (!userResponse.id || !userResponse.email || !userResponse.name) {
              throw new Error('Authorization error')
            }
            this.userName = userResponse.name;
          },
          error: (errorResponse: HttpErrorResponse) => {
            throw throwError(errorResponse.error.message);
          }
        });
    });
  }


  logout() {
    this.authService.logout().subscribe({
      next: (data: DefaultResponseType) => {
        this.doLogout();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.doLogout()
      }
    })
  }

  doLogout() {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.authService.userName = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  scrollInto(element: string) {
    setTimeout(() => {
      document.getElementById(element)?.scrollIntoView({behavior: 'smooth'});
      this.menuOpened=false;
    }, 100);
  }

  openMenu() {
    this.menuOpened = true;
  }
  closeMenu(){
    this.menuOpened = false;
  }
}
