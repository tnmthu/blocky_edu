import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  form: FormGroup;
  title: string;
  description: string;

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<LoginModalComponent>,
      @Inject(MAT_DIALOG_DATA) data) {

      this.title = data.title;
      this.description = data.description;
  }

  ngOnInit() {
      this.form = this.fb.group({
          title: this.title,
          description: [this.description, []]
      });
  }

  save() {
      this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }

}
