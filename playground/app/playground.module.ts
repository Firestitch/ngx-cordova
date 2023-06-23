import { APP_INITIALIZER, NgModule, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsLabelModule } from '@firestitch/label';
import { FsStore, FsStoreModule } from '@firestitch/store';

import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  ExamplesComponent,
  CordovaComponent
} from './components';
import { AppComponent } from './app.component';
import { FsCordovaModule } from 'src/app/cordova.module';
import { CordovaCameraFileService, CordovaFileClickInterceptor, CordovaHttpInterceptor, FsCordova, FsCordovaHttp } from '@firestitch/cordova';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { FS_FILE_CLICK_INTERCEPTOR } from '@firestitch/file';


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
    ToastrModule.forRoot({ preventDuplicates: true }),
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
