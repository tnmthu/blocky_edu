import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [
    LogoComponent,
  ],
  imports: [
    RouterModule,
  ],
  providers: [],
  entryComponents: [],
  exports: [
    LogoComponent,
  ],
})
export class SharedModule {
}
