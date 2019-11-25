import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent implements OnInit {
  form: FormGroup;
  title: string;
  description: string;
  mail;
  pw;
  organization;
  info;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterModalComponent>,
    private userService: UserService,
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
        organization: new FormControl(''),

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
    this.organization = this.form.controls.organization.value || null;
    this.info = {
      fullName: this.form.controls.fullname.value,
      address: this.form.controls.address.value,
      birthday: this.form.controls.birthday.value,
    };

    this.userService.register(this.mail, this.pw, this.organization, this.info).subscribe(res => {
      if (res.success) {

      }
    })
  }

}
