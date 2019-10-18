import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  section_1_txt_1 = "We simplified Internet of Things";
  section_1_txt_2 = "For students";
  section_1_txt_3 = "And for you !";

  section_3_txt_1 = "Intergrated with Blynk.";
  section_3_txt_2 = "World's most popular app for IoT devices.";
  section_3_txt_3 = "\"Blynk enable you to create the control interface easily. Since it is integrated, you only need to drag and drop blocks to create the interface. !\"";
  
  constructor() { }

  ngOnInit() {
  }

}
