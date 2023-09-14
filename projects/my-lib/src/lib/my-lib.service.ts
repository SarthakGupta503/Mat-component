import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
  
  @Injectable({
    providedIn: 'root',
  }) 
  export class MyLibService {
    ApiUrl:string="http://localhost:3000/Columns";
    ApiUrl1:string="http://localhost:3000/RootLevalData";
    ApiUrl2:string="http://localhost:3000/data2";
    constructor(private http: HttpClient) {} 
  fetchNodeData(){ 
  return this.http.get(this.ApiUrl);
  }
  getRootLevalData(){
    return this.http.get(this.ApiUrl1);
  }
  getflatData(){
    return this.http.get(this.ApiUrl2);
  }
}
