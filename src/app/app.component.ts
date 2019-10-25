import { Component,ViewChild,OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent {
  buttonClicked = false;

  constructor(private router: Router) {}

  onClick() {
    this.buttonClicked = !this.buttonClicked;
    console.log("here", this.buttonClicked);
  }
}




