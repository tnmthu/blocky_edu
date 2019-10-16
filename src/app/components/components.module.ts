import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EduComponent } from './edu/edu.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EduComponent,
  ],
  imports: [
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
