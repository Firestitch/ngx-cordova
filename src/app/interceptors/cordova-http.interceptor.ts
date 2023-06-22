import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import { Platform } from '@ionic/angular';

import { FsCordovaHttp } from '../services';


@Injectable()
export class CordovaHttpInterceptor implements HttpInterceptor {
  constructor(
    private _platform: Platform,
    private _cordovaHttp: FsCordovaHttp,
  ) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this._platform.is('hybrid') ? this._cordovaHttp.sendRequest(request) : next.handle(request);
  }
}
