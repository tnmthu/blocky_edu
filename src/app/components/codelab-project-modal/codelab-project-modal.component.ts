import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-codelab-project-modal',
  templateUrl: './codelab-project-modal.component.html',
  styleUrls: ['./codelab-project-modal.component.scss']
})
export class CodelabProjectModalComponent implements OnInit {
  form: FormGroup;
  title: string;
  description: string;
  // MatPaginator
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  projects = [
    {
      name: 'A',
      updated: new Date('1/1/16'),
    },
    {
      name: 'B',
      updated: new Date('1/17/16'),
    },
    {
      name: 'C',
      updated: new Date('1/28/16'),
    }
  ];

  @ViewChild('modal') modal: ElementRef;

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CodelabProjectModalComponent>,

    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.description = data.description;
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: this.title,
      description: [this.description, []]
    });
  }

  foo() {
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // dialogConfig.data = {
    //     id: 2,
    //     title: 'Login',
    //     description: '',
    // };

    // this.dialog.open(CodelabProjectImgModalComponent, {
    //   disableClose: false,
    //   autoFocus: true,
    //   data: {
    //     id: 1,
    //     title: 'Projects',
    //     description: '',
    //   },
    //   position: {
    //     top: '0px',
    //   },
    //   restoreFocus: true,
    // });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }

  mouseEnter(event) {
    // console.log(event.srcElement);
    let id = event['srcElement']['id'].split("_")[1]; // Get index

    // Modal Coord
    let coordModal = [this.modal.nativeElement.offsetLeft , this.modal.nativeElement.offsetTop];

    // Image Coord (Some hardcoded padding)
    let imagePos = [coordModal[0] + this.modal.nativeElement.offsetWidth + 24*2, coordModal[1] - 24]; 

    // Get image
    let img = document.getElementById(`img_${id}`);
    img.style.position = 'fixed';
    img.style.left = imagePos[0] + 'px';
    img.style.top = imagePos[1] + 'px';
    img.style.display = 'block';
  }

  mouseLeave(event) {
    // console.log(event);
    let id = event['srcElement']['id'].split("_")[1]; // Get index

    // Get image
    let img = document.getElementById(`img_${id}`);
    img.style.display = 'none';
  }

}
