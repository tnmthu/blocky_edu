import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EduComponent } from './edu/edu.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    EduComponent,
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
  ],
})
export class ComponentsModule {
}
