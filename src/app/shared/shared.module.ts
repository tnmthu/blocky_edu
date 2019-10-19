import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from './logo/logo.component';
import { CourseComponent } from './course/course.component';
import { CourseContentComponent } from './course-content/course-content.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CourseContentDetailComponent } from './course-content-detail/course-content-detail.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    LogoComponent,
    CourseComponent,
    CourseContentComponent,
    CourseContentDetailComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    MatExpansionModule,
  ],
  providers: [],
  entryComponents: [],
  exports: [
    LogoComponent,
    CourseComponent,
    CourseContentComponent,
    CourseContentDetailComponent,
  ],
})
export class SharedModule {
}
