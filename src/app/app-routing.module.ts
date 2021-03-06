import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EduComponent } from './components/edu/edu.component';
import { CourseContentComponent } from './components/course-content/course-content.component';
import { CourseContentDetailComponent } from './components/course-content-detail/course-content-detail.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CodelabComponent } from './components/codelab/codelab.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'edu',
    component: EduComponent,
  },
  {
    path: 'course-content',
    component: CourseContentComponent,
  },
  {
    path: 'course-content-detail',
    component: CourseContentDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
