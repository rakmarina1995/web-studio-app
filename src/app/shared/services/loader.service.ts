import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
private isShowed:boolean=false;
 isShowed$:Subject<boolean>=new Subject<boolean>();
  constructor() { }
  show(){
    this.isShowed$.next(true);
  }
  hide(){
   this.isShowed$.next(false);

  }
}
