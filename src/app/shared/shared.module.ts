import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from './logo/logo.component';
import { CourseComponent } from './course/course.component';
import { CourseContentComponent } from './course-content/course-content.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    LogoComponent,
    CourseComponent,
    CourseContentComponent,
  ],
  imports: [
    RouterModule,
    MatExpansionModule,
  ],
  providers: [],
  entryComponents: [],
  exports: [
    LogoComponent,
    CourseComponent,
    CourseContentComponent,
  ],
})
export class SharedModule {
}
