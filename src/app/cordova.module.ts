import { ModuleWithProviders, NgModule } from '@angular/core';

import { FS_CORDOVA_CONFIG } from './consts';
import { FsCordovaConfig } from './interfaces';


@NgModule()
export class FsCordovaModule {
  public static forRoot(config: FsCordovaConfig = {}): ModuleWithProviders<FsCordovaModule> {
    return {
      ngModule: FsCordovaModule,
      providers:[
        { provide: FS_CORDOVA_CONFIG, useValue: config },
      ],
    };
  }
}


