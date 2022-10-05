import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  requestHeader = new HttpHeaders(
    { 'Content-Type':  'application/x-www-form-urlencoded'}
  );


  constructor(private httpClient: HttpClient) { }


  public login(loginData:any) {

    let body = new HttpParams()
    .set('username', loginData.username)
    .set('password', loginData.password)

    return this.httpClient.post("http://localhost:8080/login", body, {headers: this.requestHeader});
  }

  public getRolesByUsername(username: string) {
    return this.httpClient.get(`http://localhost:8080/user/getuser/${username}`);
  }
}
