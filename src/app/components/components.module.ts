import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { EduComponent } from "./edu/edu.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { CourseComponent } from "./course/course.component";
import { CourseContentComponent } from "./course-content/course-content.component";
import { CourseContentDetailComponent } from "./course-content-detail/course-content-detail.component";
import { LogoComponent } from "./logo/logo.component";
import { MatExpansionModule } from "@angular/material/expansion";
import {MatInputModule} from '@angular/material/input';

import { WordpressComponent } from "./wordpress/wordpress.component";
import { MainPipeModule } from "../pipes/main-pipe.module";
import { CodelabComponent } from "./codelab/codelab.component";
import {
  NgxBlocklyModule
} from "ngx-blockly";
import { CodelabFooterComponent } from './codelab-footer/codelab-footer.component';
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
    CodelabFooterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    RouterModule,
    MatExpansionModule,
    MainPipeModule,
    NgxBlocklyModule,
    MatInputModule
  ],
  providers: [],
  entryComponents: [],
  exports: [
    EduComponent,
    LandingPageComponent,
    CourseComponent,
    CourseContentComponent,
    CourseContentDetailComponent,
    LogoComponent,
    WordpressComponent,
    CodelabComponent,
    CodelabFooterComponent
  ]
})
export class ComponentsModule {}
