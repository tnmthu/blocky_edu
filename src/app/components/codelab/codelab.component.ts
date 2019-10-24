import { Component, OnInit } from "@angular/core";
import { NgxBlocklyModule, NgxBlocklyConfig, NgxBlocklyGeneratorConfig } from 'ngx-blockly';
import { Output, Input } from '@angular/core';
@Component({
  selector: "app-codelab",
  templateUrl: "./codelab.component.html",
  styleUrls: ["./codelab.component.scss"]
})

export class CodelabComponent implements OnInit {
  workspace: any;
  constructor() {
  
  }
  public config: NgxBlocklyConfig = {
    toolbox:
      '<xml id="toolbox" style="display: none">' +
      '<block type="controls_if"></block>' +
      '<block type="controls_repeat_ext"></block>' +
      '<block type="logic_compare"></block>' +
      '<block type="math_number"></block>' +
      '<block type="math_arithmetic"></block>' +
      '<block type="text"></block>' +
      '<block type="text_print"></block>' +
      "</xml>",
    scrollbars: true,
    trashcan: true,
  };
  public generatorConfig: NgxBlocklyGeneratorConfig = {
    dart: false,
    javascript: false,
    lua: false,
    php: false,
    python: true,
    xml: true
  };
  //# wordpress
  onCode(code: string) {
    console.log(code);
  }
  onWorkspace(event : any){
    console.log(event);
  }

  
  ngOnInit() {

  }
}

