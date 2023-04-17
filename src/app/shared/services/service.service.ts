import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {RequestType} from "../../../types/request.type";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {
  }

  createOrder(name:string,phone:string,type:string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests',{name,phone,type});
  }
  sendRequest(params: { name: string, phone: string, type: RequestType, service?: string }): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', params);
  }
}
