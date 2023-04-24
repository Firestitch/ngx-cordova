import { Component } from '@angular/core';

import { FsClipboard } from '@firestitch/cordova';


@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss']
})
export class CopyComponent {

  public constructor(
    private _clipboard: FsClipboard,
  ) {}

  public copy(): void {
    this._clipboard.copy('Copied Text!');
  }
}
