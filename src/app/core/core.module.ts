import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { Title } from '@angular/platform-browser';



@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [
    BrowserAnimationsModule
  ],
  providers: [
    Title
  ],
})
export class CoreModule {

  constructor(
    @Optional() @SkipSelf() parentModel: CoreModule
  ) {

    if (parentModel) {
      throw new Error('CoreModule já foi lido. Importe apenas no AppModule');
    }
  }
}
