import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-codelab-footer',
  templateUrl: './codelab-footer.component.html',
  styleUrls: ['./codelab-footer.component.scss']
})
export class CodelabFooterComponent implements OnInit {
  
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

  
  constructor() { }

  ngOnInit() {
    this.mode = this.modes[0]; 
  }

  changeMode() {
    this.isPythonMode = !this.isPythonMode;
    this.mode = this.modes[this.isPythonMode ? 1 : 0];
  }

}
