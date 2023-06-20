# Installation

1. Call initCordova() in main.ts
```
import { initCordova } from '@firestitch/cordova';

initCordova();
```

2. Provide the HTTP_INTERCEPTORS in the main module 
```
{
  provide: HTTP_INTERCEPTORS,
  useClass: CordovaHttpInterceptor,
  multi: true,
  deps: [Platform, FsCordovaHttp],
},
```

3. Call FsCordova.init() 
```
{
  provide: APP_INITIALIZER,
  useFactory: (cordova: FsCordova) => () => {
    return of(null)
      .pipe(
        switchMap(() => cordova.init()),
      )
      .toPromise();
  },
  multi: true,
  deps: [FsCordova],
}, 
```