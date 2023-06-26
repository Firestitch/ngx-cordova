import { Injectable } from '@angular/core';

import { from, Observable, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Platform } from '@ionic/angular';

import { CordovaState } from '../enums';
import { getCordova } from '../helpers';

import { FsCordovaCookie } from './cordova-cookie.service';


@Injectable({
  providedIn: 'root',
})
export class FsCordova {

  public CordovaFile;
  public CordovaFileReader;
  public NativeFile;
  public NativeFileReader;
  
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

  public get state(): CordovaState {
    return this.window.cordovaState;
  }

  public set state(value: CordovaState) {
    this.window.cordovaState = value;
  }

  public get cordova(): any {
    return this.window.cordova;
  }

  public get ready(): boolean {
    return this.state === CordovaState.Ready;
  }

  public get unsupported(): boolean {
    return this.state === CordovaState.Unsupported;
  }

  public _cordovaReady(): Observable<void> {
    if(this.state === CordovaState.Unsupported) {
      return throwError('Cordova not supported');
    }

    if(this.state === CordovaState.Ready) {
      return of(null);
    }

    return new Observable((observer) => {
      this.window.addEventListener('fsCordovaReady', () => {  
        observer.next(this.cordova);
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
    this.NativeFile = this.window.File;
    this.NativeFileReader = this.window.FileReader;

    return this.ready$
      .pipe(
        tap(() => {
          console.log('Cordova Service init() ready');
        }),
        tap(() => this._initFile()),
        tap(() => this._cordovaCookie.init()),
        tap(() => this._initInsets()),
      );
  }

  private _initInsets() {
    if(this.window.totalpave) {6
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
    this.CordovaFile = this.window.File;
    this.CordovaFileReader = this.window.FileReader;
    this.window.File = this.NativeFile;
    this.window.FileReader = this.NativeFileReader;

    this.window.CordovaFile = this.CordovaFile;
    this.window.CordovaFileReader = this.CordovaFileReader;
  }

}

