import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CodelabProjectModalComponent } from '../codelab-project-modal/codelab-project-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

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
  @Output() openSidebarEventClicked = new EventEmitter<boolean>();

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

  constructor(private dialog: MatDialog) { }

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

    this.openSidebarEventClicked.emit(this.isSidebarOpen);
    console.log("Event isSidebarOpen " + this.isSidebarOpen);
  }

  openProjectModal() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
        id: 1,
        title: 'Projects',
        description: '',
    };

    this.dialog.open(CodelabProjectModalComponent, dialogConfig);
  }

  @Output() saveProjectEvent = new EventEmitter();
  saveProject() {
    this.saveProjectEvent.next();
  }

  @Output() newProjectEvent = new EventEmitter();
  newProject() {
    this.newProjectEvent.next();
  }

  // Currently using openProjectModal()
  @Output() openProjectEvent = new EventEmitter();
  openProject() {
    this.openProjectEvent.next();
  }

  @Output() downloadProjectEvent = new EventEmitter();
  downloadProject() {
    this.downloadProjectEvent.next();
  }
}
