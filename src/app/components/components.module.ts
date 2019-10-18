import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EduComponent } from './edu/edu.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [
    EduComponent,
    LandingPageComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    CommonModule
  ],
  providers: [],
  entryComponents: [],
  exports: [
    EduComponent,
    LandingPageComponent
  ],
})
export class ComponentsModule {
}
