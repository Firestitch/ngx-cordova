import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';

import { FsCordova, FsCordovaHttp } from '../services';


@Injectable()
export class CapacitorHttpInterceptor implements HttpInterceptor {
  constructor(
    private _cordova: FsCordova,
    private _cordovaHttp: FsCordovaHttp,
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this._cordova.ready && request.url.match(/^http/) ? this._cordovaHttp.sendRequest(request) : next.handle(request);
  }
}
