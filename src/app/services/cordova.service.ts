import { Inject, Injectable } from '@angular/core';

import { from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FS_CORDOVA_CONFIG } from '../consts';
import { FsCordovaConfig } from '../interfaces';
import { CordovaState } from '../enums';
import { getCordova } from '../helpers';

import { FsCordovaCookie } from './cordova-cookie.service';


@Injectable({
  providedIn: 'root',
})
export class FsCordova {

  private _ready = false;

  constructor(
    @Inject(FS_CORDOVA_CONFIG) private _config: FsCordovaConfig,
    private _splashScreen: SplashScreen,
    private _statusbar: StatusBar,
    private _platform: Platform,
    private _cordovaCookie: FsCordovaCookie,
  ) {}

  public get ready$(): Observable<any> {
    if(this._ready) {
      return of(true);
    }

    return from(this._platform.ready())
      .pipe(
        switchMap(() => this._cordovaReady()),
        tap(() => {
          this._ready = true;
        }),
      );
  }

  public get resume$(): Observable<void> {
    return this._platform.resume;
  }

  public _cordovaReady(): Observable<void> {
    const win = (window as any);
    if(win.cordova || !win.cordovaState) {
      return of(null);
    }

    return new Observable((observer) => {
      if(win.cordovaState === CordovaState.Ready) {
        observer.next(win.cordova);
        observer.complete();
      }

      window.addEventListener('cordovaready', () => {
        observer.next(win.cordova);
        observer.complete();
      });
    })
      .pipe(
        switchMap((cordova: any) => this._cordovaPluginsReady(cordova)),
      );
  }

  public getAppVersion(): Observable<string> {
    if(!getCordova()?.getAppVersion) {
      return of(null);
    }

    return from<string>(getCordova().getAppVersion.getVersionNumber());
  }

  public _cordovaPluginsReady(cordova): Observable<void> {
    const channel = cordova.require('cordova/channel');

    if(channel.state === 2) {
      return of(null);
    }

    return new Observable((observer) => {
      channel.onPluginsReady
        .subscribe(() => {
          observer.next();
          observer.complete();
        });
    });
  }

  public init(): Observable<void> {
    return this.ready$
      .pipe(
        switchMap(() => this._cordovaCookie.init()),
        tap(() => {
          console.log('Cordova Service init() ready');
          this._statusbar.styleLightContent();
          this._splashScreen.hide();
        }),
      );
  }

}

