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

  section_2_txt_1 = "CODE";
  section_2_txt_2 = "LAB";
  section_2_txt_3 = "This is where you can experiment with your idea, just DRAG n DROP.";
  section_2_txt_4 = ["Program the Controller", "​Create the IoT controll interface."];
  section_2_txt_5 = "TRY NOW";

  section_3_txt_1 = "Intergrated with Blynk.";
  section_3_txt_2 = "World's most popular app for IoT devices.";
  section_3_txt_3 = "\"Blynk enable you to create the control interface easily. Since it is integrated, you only need to drag and drop blocks to create the interface. !\"";
  
  section_4_txt_1 = "Controller";
  section_4_txt_2 = ['Built for Internet of Things.', 'Can connect to 8 Modules', 'Simplified design. *'];

  section_5_txt_1 = "Modules";
  section_5_txt_2 = "\"Every modules will add another features to the Controller. We have a shared ecosystem of over 200 modules.\"";

  constructor() { }

  ngOnInit() {
  }

}
