import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  buttonClicked = false;

  onClick() {
    this.buttonClicked = !this.buttonClicked;
  }
}
