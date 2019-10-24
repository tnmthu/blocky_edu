import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-content-detail',
  templateUrl: './course-content-detail.component.html',
  styleUrls: ['./course-content-detail.component.scss']
})
export class CourseContentDetailComponent implements OnInit {
  showMenu = false;

  constructor() { }

  ngOnInit() {
    console.log(this.showMenu)
  }

  menuBtnClicked() {
    this.showMenu = !this.showMenu;
    console.log(this.showMenu);
  }
}
