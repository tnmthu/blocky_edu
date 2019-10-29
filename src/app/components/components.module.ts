import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


// Angular Materail Imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';

import { EduComponent } from './edu/edu.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CourseComponent } from './course/course.component';
import { CourseContentComponent } from './course-content/course-content.component';
import { CourseContentDetailComponent } from './course-content-detail/course-content-detail.component';
import { LogoComponent } from './logo/logo.component';
import { WordpressComponent } from './wordpress/wordpress.component';
import { MainPipeModule } from '../pipes/main-pipe.module';
import { CodelabComponent } from './codelab/codelab.component';
import { NgxBlocklyModule } from 'ngx-blockly';
import { CodelabHeaderComponent } from './codelab-header/codelab-header.component';
import { CodelabFooterComponent } from './codelab-footer/codelab-footer.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { CodelabSidebarComponent } from './codelab-sidebar/codelab-sidebar.component';
@NgModule({
  declarations: [
    EduComponent,
    LandingPageComponent,
    CourseComponent,
    CourseContentComponent,
    CourseContentDetailComponent,
    LogoComponent,
    WordpressComponent,
    CodelabComponent,
    CodelabFooterComponent,
    CodelabHeaderComponent,
    LoginModalComponent,
    RegisterModalComponent,
    CodelabSidebarComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    RouterModule,
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MainPipeModule,
    NgxBlocklyModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  entryComponents: [
    LoginModalComponent,
    RegisterModalComponent
  ],
  exports: [
    EduComponent,
    LandingPageComponent,
    CourseComponent,
    CourseContentComponent,
    CourseContentDetailComponent,
    LogoComponent,
    WordpressComponent,
    CodelabComponent,
    CodelabHeaderComponent,
    LoginModalComponent,
    RegisterModalComponent,
    CodelabFooterComponent,
    CodelabSidebarComponent
  ]
})
export class ComponentsModule {}
