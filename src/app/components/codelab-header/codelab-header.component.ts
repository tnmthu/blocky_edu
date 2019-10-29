import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
@Component({
  selector: 'app-codelab-header',
  templateUrl: './codelab-header.component.html',
  styleUrls: ['./codelab-header.component.scss']
})
export class CodelabHeaderComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openLoginDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
        id: 1,
        title: 'Login',
        description: '',
    };

    this.dialog.open(LoginModalComponent, dialogConfig);
  }

  openRegisterDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
        id: 2,
        title: 'Register',
        description: '',
    };

    this.dialog.open(RegisterModalComponent, dialogConfig);
  }

}
