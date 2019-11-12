import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  form: FormGroup;
  title: string;
  description: string;
  mail;
  pw;
  toastr = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.description = data.description;
  }

  ngOnInit() {
      this.form = this.fb.group({
          title: this.title,
          description: [this.description, []],
          mail: new FormControl(''),
          password: new FormControl(''),
          code: new FormControl(''),
      });
  }

  save() {
    this.onSubmit();
    this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }

  onSubmit() {
    this.mail = this.form.controls.mail.value;
    this.pw = this.form.controls.password.value;
    this.userService.attemptAuth('login', { login: this.mail, password: this.pw }).subscribe(res => {
      // if (res.success === false) {
      //   this.toastr = true;
      // }
    });
  }

  join() {
    this.dialogRef.close(this.form.value);
  }

}
