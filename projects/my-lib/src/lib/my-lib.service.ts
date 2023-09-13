import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
  
  @Injectable({
    providedIn: 'root',
  }) 
  export class MyLibService {
    ApiUrl:string="http://localhost:3000/Columns";
    constructor(private http: HttpClient) {} 
  fetchNodeData(data:any):Observable<any>{ 
  return this.http.get(this.ApiUrl);
  }

}
