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
    if (!this._platform.is('ios') && !this._platform.is('android')) {
      return next.handle(request);
    }

    return this._cordovaHttp.sendRequest(request);
  }
}
