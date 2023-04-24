
import { FsApiConfig, makeInterceptorFactory, RequestInterceptor } from '@firestitch/api';

import { Observable } from 'rxjs';
import { filter, mapTo, switchMap } from 'rxjs/operators';

import { HttpEvent, HttpEventType, HttpHandler, HttpRequest } from '@angular/common/http';
import { Platform } from '@ionic/angular';

import { FsCordovaCookie } from '../services';


export class IosCookieInterceptor extends RequestInterceptor {

  constructor(
    public config: FsApiConfig,
    public data: any,
    private _cordovaCookie: FsCordovaCookie,
    private _platform: Platform,

  ) {
    super(config, data);
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this._platform.is('ios')) {
      return next.handle(req.clone());
    }

    return next.handle(req.clone({ withCredentials: true }))
      .pipe(
        filter((event: HttpEvent<any>) => (event.type === HttpEventType.Response)),
        switchMap((event: HttpEvent<any>) => {
          return this._cordovaCookie.saveCookies()
            .pipe(
              mapTo(event),
            );
        }),
      );
  }

}

export const IosCookieInterceptorFactory = makeInterceptorFactory(IosCookieInterceptor);
