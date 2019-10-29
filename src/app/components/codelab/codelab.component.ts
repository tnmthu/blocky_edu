import { Component, OnInit, ViewChild } from "@angular/core";
import { NgxBlocklyConfig, NgxBlocklyGeneratorConfig } from "ngx-blockly";
import { NgxBlocklyComponent } from "ngx-blockly";
import { ToolboxService } from "src/app/services/toolbox.service";

@Component({
  selector: "app-codelab",
  templateUrl: "./codelab.component.html",
  styleUrls: ["./codelab.component.scss"],

})

export class CodelabComponent implements OnInit {
  constructor(private toolboxService: ToolboxService) {}

  public config: NgxBlocklyConfig = {
    toolbox: this.toolboxService.ToolBoxXml,
    scrollbars: true,
    trashcan: true,
    horizontalLayout: false,
    collapse: true,
    comments: true,
    grid: {
      spacing: 1,
      length: 10,
      colour: "#00ffff",
      snap: true
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 100,
      minScale: 1,
      scaleSpeed: 2
    }
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
  @ViewChild(NgxBlocklyComponent) workspace;

  ngOnInit() {
    console.warn(this.workspace);
    console.warn(this.workspace.workspace);
  }


  public sidebarClicked = false;
  sidebarEvent(isSidebarOpen: boolean) {
    this.sidebarClicked = isSidebarOpen;
  }


}
