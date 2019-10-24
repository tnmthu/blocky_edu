import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPipeModule } from './pipes/main-pipe.module';

import { NgxBlocklyModule } from 'ngx-blockly';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ComponentsModule,
    BrowserAnimationsModule,
    MainPipeModule,
    NgxBlocklyModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
