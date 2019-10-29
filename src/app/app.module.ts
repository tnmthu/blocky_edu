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

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BlynkService } from './services/blynk.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import {WebcamModule, WebcamComponent} from 'ngx-webcam';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

const config: SocketIoConfig = { url: 'http://localhost:5000/codelab', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    CodelabControllerDirective,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ComponentsModule,
    BrowserAnimationsModule,
    MainPipeModule,
    NgxBlocklyModule,
    AngularFontAwesomeModule,
    BrowserModule,
    WebcamModule,
    SocketIoModule.forRoot(config),
    // SweetAlert2Module.forRoot()
    
  ],
  providers: [
    ToolboxService,
    BlynkService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
