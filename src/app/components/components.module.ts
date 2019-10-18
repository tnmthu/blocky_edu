import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { EduComponent } from './edu/edu.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EduComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    SharedModule,
  ],
  providers: [],
  entryComponents: [],
  exports: [
    EduComponent,
  ],
})
export class ComponentsModule {
}
