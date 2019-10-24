import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgxBlocklyConfig, NgxBlocklyGeneratorConfig } from "ngx-blockly";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  buttonClicked = false;

  constructor(private router: Router) {}

  //# ngx-blockly
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
    trashcan: true
  };

  public generatorConfig: NgxBlocklyGeneratorConfig = {
    dart: false,
    javascript: false,
    lua: false,
    php: false,
    python: true,
    xml: true
  };

  onCode(code: string) {
    console.log(code);
  }
}
