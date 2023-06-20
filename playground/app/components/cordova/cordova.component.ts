import { Component } from '@angular/core';
import { FsMessage } from '@firestitch/message';


@Component({
  selector: 'app-cordova',
  templateUrl: './cordova.component.html',
  styleUrls: ['./cordova.component.scss']
})
export class CordovaComponent {

  public config = {};

  constructor(
    private message: FsMessage
  ) {
  }
}
