import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const WebApiUrl = httpRequest.url.startsWith(`${environment.webApiUrl}`);

        const userData = localStorage.getItem("_LBS_UD_");

        if (userData && WebApiUrl) {
            const UserData = JSON.parse(userData)

            const modifiedRequest = httpRequest.clone({
                setHeaders: {
                    Authorization: `Bearer ${UserData.token}`
                }
            });
            return next.handle(modifiedRequest);
        } else {
            return next.handle(httpRequest);
        }
    }
}