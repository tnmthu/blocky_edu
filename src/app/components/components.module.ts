import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { EduComponent } from './edu/edu.component';
import { SharedModule } from '../shared/shared.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CodelabComponent } from './codelab/codelab.component';

@NgModule({
  declarations: [
    EduComponent,
    LandingPageComponent,
    CodelabComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    SharedModule,
    CommonModule
  ],
  providers: [],
  entryComponents: [],
  exports: [
    EduComponent,
    LandingPageComponent,
    CodelabComponent,
  ],
})
export class ComponentsModule {
}
