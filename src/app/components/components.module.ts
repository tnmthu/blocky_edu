import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { EduComponent } from './edu/edu.component';
import { SharedModule } from '../shared/shared.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { WordpressComponent } from './wordpress/wordpress.component';
import { MainPipeModule } from '../pipes/main-pipe.module';

@NgModule({
  declarations: [
    EduComponent,
    LandingPageComponent,
    WordpressComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    SharedModule,
    CommonModule,
    HttpClientModule,
    MainPipeModule
  ],
  providers: [],
  entryComponents: [],
  exports: [
    EduComponent,
    LandingPageComponent,
    WordpressComponent
  ],
})
export class ComponentsModule {
}
