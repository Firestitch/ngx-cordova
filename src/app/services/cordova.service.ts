import { Injectable } from '@angular/core';

import { from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Platform } from '@ionic/angular';

import { CordovaState } from '../enums';
import { getCordova } from '../helpers';

import { FsCordovaCookie } from './cordova-cookie.service';


@Injectable({
  providedIn: 'root',
})
export class FsCordova {

  public File;
  public FileReader;

  private _ready = false;

  constructor(
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

  public get window(): any {
    return window as any;
  }

  public _cordovaReady(): Observable<void> {
    if(this.window.cordova || !this.window.cordovaState) {
      return of(null);
    }

    return new Observable((observer) => {
      if(this.window.cordovaState === CordovaState.Ready) {
        observer.next(this.window.cordova);
        observer.complete();
      }

      this.window.addEventListener('cordovaready', () => {
        observer.next(this.window.cordova);
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
    this._initFile();

    return this.ready$
      .pipe(
        tap(() => {
          console.log('Cordova Service init() ready');
        }),
        switchMap(() => this._cordovaCookie.init()),
        tap(() => {
          this._initInsets();
        }),
      );
  }

  private _initInsets() {
    if(this.window.totalpave) {
      this.window.totalpave.Insets.addListener((insets) => {
        const root: any = document.querySelector(':root');
        root.style.setProperty('--safe-area-inset-top', `${insets.top}px`);
        root.style.setProperty('--safe-area-inset-right', `${insets.right}px`);
        root.style.setProperty('--safe-area-inset-bottom', `${insets.bottom}px`);
        root.style.setProperty('--safe-area-inset-left', `${insets.left}px`);
      });
    }
  }

  /**
   * Restored the File/FileReader object from cordova-plugin-file overriding it
   */
  private _initFile(): void {
    const nativeFile = this.window.File;
    const nativeFileReader = this.window.FileReader;

    this.ready$
      .subscribe(() => {
        this.File = this.window.File;
        this.FileReader = this.window.FileReader;
        this.window.File = nativeFile;
        this.window.FileReader = nativeFileReader;
      });
  }

}

