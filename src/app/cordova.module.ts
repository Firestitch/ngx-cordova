import { ModuleWithProviders, NgModule } from '@angular/core';

import { FS_API_REQUEST_INTERCEPTOR } from '@firestitch/api';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

import { IosCookieInterceptorFactory } from './interceptors';
import { FS_CORDOVA_CONFIG } from './consts';
import { FsCordovaConfig } from './interfaces';
import { FsCordovaCookie } from './services';


@NgModule()
export class FsCordovaModule {
  public static forRoot(config: FsCordovaConfig): ModuleWithProviders<FsCordovaModule> {
    return {
      ngModule: FsCordovaModule,
      providers:[
        { provide: FS_CORDOVA_CONFIG, useValue: config },
        {
          provide: FS_API_REQUEST_INTERCEPTOR,
          useFactory: IosCookieInterceptorFactory,
          multi: true,
          deps: [FsCordovaCookie, Platform],
        },
        StatusBar,
        SplashScreen,
      ],
    };
  }
}


