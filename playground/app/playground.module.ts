import { APP_INITIALIZER, NgModule, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsStoreModule } from '@firestitch/store';


import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CordovaFileClickInterceptor, CordovaHttpInterceptor, FsCordova, FsCordovaHttp } from '@firestitch/cordova';
import { FS_FILE_CLICK_INTERCEPTOR } from '@firestitch/file';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { FsCordovaModule } from 'src/app/cordova.module';
import { AppComponent } from './app.component';
import {
  CordovaComponent,
  ExamplesComponent
} from './components';
import { AppMaterialModule } from './material.module';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsStoreModule.forRoot(),
    FsExampleModule.forRoot(),
    FsCordovaModule.forRoot(),
    FsMessageModule.forRoot(),
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    CordovaComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (
        cordova: FsCordova,
      ) => () => {
        return of(null)
          .pipe(
            switchMap(() => cordova.getAppVersion()),
            tap((version: string) => {
              console.log('Cordova Version', version);
            }),
            switchMap(() => cordova.init()
              .pipe(
                catchError(() => of(null))
              )
            ),
          )
          .toPromise();
      },
      multi: true,
      deps: [FsCordova],
    },    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CordovaHttpInterceptor,
      multi: true,
      deps: [FsCordova, FsCordovaHttp],
    },
    {
      provide: FS_FILE_CLICK_INTERCEPTOR,
      multi: true,
      useFactory: (ngZone: NgZone) => {
        return new CordovaFileClickInterceptor(ngZone);
      },
      deps: [NgZone],
    },
  ]
})
export class PlaygroundModule {
}
