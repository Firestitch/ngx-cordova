import { Injectable } from '@angular/core';

import { parse } from '@firestitch/date';

import { Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';

import { Platform } from '@ionic/angular';
import { isAfter, isBefore } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root',
})
export class FsCordovaCookie {

  constructor(
    private _platform: Platform,
    private _cookieService: CookieService,
  ) {}

  public init(): Observable<void> {
    if(!this._platform.is('ios')) {
      return of(null);
    }

    this._polyfillCookie();

    return this.saveCookies()
      .pipe(
        mapTo(null),
      );
  }

  public saveCookies(): Observable<any> {
    return new Observable((observer) => {
      // https://github.com/CWBudde/cordova-plugin-wkwebview-inject-cookie
      const wkWebView = (window as any).wkWebView;

      if(!wkWebView) {
        return observer
          .error('window.wkWebView is required for saveCookies(). '
          + 'cordova-plugin-wkwebview-inject-cookie not installed');
      }

      if(!wkWebView) {
        observer.next();
        observer.complete();

        return;
      }

      wkWebView.getCookies(window.location.host,
        (cookies: {
          HTTPOnly: boolean;
          domain: string;
          name: string;
          expireDate: string;
          path: string;
          sessionOnly: boolean;
          value: string;
        }[]) => {
          cookies = cookies.map((cookie) => ({
            ...cookie,
            value: decodeURIComponent(cookie.value),
          }));

          cookies
            .filter((cookie) => !cookie.HTTPOnly)
            .forEach((cookie) => {
              this._cookieService.set(cookie.name, cookie.value, parse(cookie.expireDate));
            });

          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        });
    })
      .pipe(
        catchError((error) =>{
          console.error(error);

          return of(null);
        }),
      );
  }

  private _polyfillCookie() {
    const doc: any = document;
    doc.cookies = [];
    Object.defineProperty(doc, 'cookie', {
      get() {
        return doc.cookies
          .filter((cookie) => {
            return isAfter(cookie.expires, new Date());
          })
          .map((cookie) => {
            return `${cookie.name}=${cookie.value}`;
          })
          .join('; ');
      },
      set(cookieStr) {
        const cookie: {
          name: string;
          expires: Date;
          path: string;

        } = cookieStr.replace(/;$/,'').split(';')
          .reduce((accum, item, index) => {
            const values = item.split('=');
            const name = values[0];
            let value = values[1];

            if(index === 0) {
              return {
                ...accum,
                name,
                value,
              };
            }

            if(name === 'expires') {
              value = new Date(value);
            }

            return {
              ...accum,
              [name]: value,
            };
          }, {});

        doc.cookies =  doc.cookies
          .filter((item) => {
            return item.name !== cookie.name;
          });

        const expired = isBefore(cookie.expires || 0, new Date());

        if(!expired) {
          doc.cookies.push(cookie);
        }
      },
    });
  }

  private _injectCookie(): Observable<void> {
    return new Observable((observer) => {
      const wkWebView = (window as any).wkWebView;

      if(!wkWebView) {
        return observer.error('window.wkWebView is required for injectCookie(). cordova-plugin-wkwebview-inject-cookie not installed');
      }

      const domain = window.location.host;
      wkWebView.injectCookie(domain, '/',
        () => {
          console.log(`Inject Cookie Successful for domain ${domain}`);
          observer.next(null);
          observer.complete();
        },
        (event) => {
          observer.error({ message: `Inject Cookie Error for domain ${domain}`, event });
        },
      );
    })
      .pipe(
        catchError((error) =>{
          console.error(error);

          return of(null);
        }),
      );
  }

}

