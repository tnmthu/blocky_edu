import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edu',
  templateUrl: './edu.component.html',
  styleUrls: ['./edu.component.scss']
})
export class EduComponent implements OnInit {

  mylist: any[];

  constructor() {
    this.mylist = [1, 2, 3];
  }

  ngOnInit() {

  }

}
