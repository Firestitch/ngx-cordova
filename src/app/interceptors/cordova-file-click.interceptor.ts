import { Observable, of } from 'rxjs';

import { InputProcessorService, FileClickHandler, FileClickInterceptor, FsFile } from '@firestitch/file';

import { hasCordovaCameraSupport } from '../helpers';
import { CordovaCameraFileService, FsCordova } from '../services';
import { tap } from 'rxjs/operators';
import { NgZone } from '@angular/core';


export class CordovaFileClickInterceptor extends FileClickInterceptor {

  public constructor(
    private _ngZone: NgZone,
  ) {
    super();
  }

  public intercept(event: PointerEvent, inputProcessorService: InputProcessorService, next: FileClickHandler): Observable<any> {
    if (hasCordovaCameraSupport()) {

      // if(inputProcessorService.capture === 'library') {
      //   this._cordovaCameraFileService.selectCordovaCameraLibrary();  
        
      //   return of(null);      
      // } else 
      
      if (inputProcessorService.capture === 'camera' && inputProcessorService.isAcceptImage()) {
        (new CordovaCameraFileService())
          .selectCordovaCameraPicture()
          .pipe(
            tap((file: File) => {
              this._ngZone.run(() => {
                inputProcessorService.selectFiles([file]);
              });
            }),
          );

        return of(null);   
      }
    }
  
    return next.handle(event, inputProcessorService);
  }

}

