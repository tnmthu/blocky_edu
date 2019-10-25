import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class ProjectErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-codelab-footer',
  templateUrl: './codelab-footer.component.html',
  styleUrls: ['./codelab-footer.component.scss']
})
export class CodelabFooterComponent implements OnInit {
  
  projectFormControl = new FormControl('', [
    Validators.required,
  ]);
  matcher = new ProjectErrorStateMatcher();

  mode: any;
  modes = [
    {
      "icon": "code",
      "text": "Python Mode",
    }, 
    {
      "icon": "layers",
      "text": "Block Mode",
    }
  ];
  isPythonMode = false;

  isSidebarOpen = false;
  sidebarIcon = "keyboard_arrow_left";

  constructor() { }

  ngOnInit() {
    this.mode = this.modes[0]; 
  }

  changeMode() {
    this.isPythonMode = !this.isPythonMode;
    this.mode = this.modes[this.isPythonMode ? 1 : 0];
  }

  openSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarIcon = this.isSidebarOpen ? "keyboard_arrow_right" : "keyboard_arrow_left";
  }

  saveProject() {}
  
  newProject() {}

  openProject() {}

  downloadProject() {}
}
