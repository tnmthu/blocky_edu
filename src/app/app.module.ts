import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPipeModule } from './pipes/main-pipe.module';

import { NgxBlocklyModule } from 'ngx-blockly';
import { ToolboxService } from './services/toolbox.service';
import { CodelabControllerDirective } from './codelab-controller.directive';
import { CodelabHeaderComponent } from './components/codelab-header/codelab-header.component';

// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
@NgModule({
  declarations: [
    AppComponent,
    CodelabControllerDirective,
    CodelabHeaderComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ComponentsModule,
    BrowserAnimationsModule,
    MainPipeModule,
    NgxBlocklyModule,
    // SweetAlert2Module.forRoot()
  ],
  providers: [
    ToolboxService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
