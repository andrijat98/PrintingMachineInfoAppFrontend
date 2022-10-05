import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppComponent } from "../app.component";
import { User } from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private user: User) {}

  private token: string = "";

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.headers.get("Content-Type") === "application/x-www-form-urlencoded" || req.headers.get("Authorization") === `Bearer ${AppComponent.refreshToken}`) {
      console.log("no change");
      return next.handle(req.clone());
    } else if
    (req.headers.get("Authorization") === `Bearer ${AppComponent.authToken}`) {
      this.token = AppComponent.refreshToken;
      req = this.addToken(req, this.token)
      console.log("swapped to refresh token");
    } else if (AppComponent.authToken){
      this.token = AppComponent.authToken;
      req = this.addToken(req, this.token)
      console.log("added normal token");
    }
    console.log("Lastest token: " + this.token);
    return next.handle(req).pipe();
  }

  private addToken(request:HttpRequest<any>, token: string) {
    return request.clone(
      {
        setHeaders: {
          Authorization : `Bearer ${token}`
        }
      }
    );
  }

}
