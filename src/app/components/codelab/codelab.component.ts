import { Component, OnInit, ViewChild, AfterContentInit } from "@angular/core";
import { saveAs } from 'file-saver';
import {
  NgxBlocklyComponent,
  NgxBlocklyConfig,
  NgxBlocklyGeneratorConfig,
  NgxBlocklyModule,
  NgxToolboxBuilderService
} from "ngx-blockly";
import { ToolboxService } from "src/app/services/toolbox.service";
// import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from "sweetalert2";
import { encodeBase64 } from '@progress/kendo-file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: "app-codelab",
  templateUrl: "./codelab.component.html",
  styleUrls: ["./codelab.component.scss"]
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
      colour: "#eeeeee",
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
    // console.log(code);
  }
  @ViewChild(NgxBlocklyComponent) workspace;
  
  ngOnInit() {
    console.warn(this.workspace);
    console.warn(this.workspace.workspace);
    
  }

  
  onButtonNewProject() {
    console.log("Click");
     Swal.fire({ title: "Hey, let's name your new project",input : "text", type: "info" });
    // window.Blockly.Events.disable();
    // window.Blockly.Events.enable();
  }

  onWorkspace(event: any) {
    console.log("Event", event);
    console.log("Workspace" , this.workspace.workspace);
    console.log(window);
    window["codelab"] = this.workspace;
  }

  onButtonProjectUpload(){

  }

  onButtonLoadProject(){

  }

  async onButtonLogin(){

    // Swal.fire({
    //   title: 'Custom width, padding, background.',
    //   width: 600,
    //   padding: '3em',
    //   background: '#fff url(/images/trees.png)',
    //   backdrop: `
    //     rgba(0,0,123,0.4)
    //     url("/images/nyan-cat.gif")
    //     center left
    //     no-repeat
    //   `
    // })


    var username = await Swal.fire({
      title : "Login in",
      type : "info",
      input : "text",
      inputPlaceholder : "ahihi@gmail.com",
      background: '#22bf89 no-repeat left top url(http://66.media.tumblr.com/8210fd413c5ce209678ef82d65731443/tumblr_mjphnqLpNy1s5jjtzo1_400.gif)',
      width: 600,
      padding: '3em',
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        center left
        no-repeat
      `,

    });

    console.log("username" , username);

    // var password = await Swal.fire({
    //   title : "Hello" ,
    //   type : "info" , 
    //   input : "password",
    //   html : "<>"
    // })

    console.log("password" , password);





  }
  onButtonDownload (){
    console.log("Current Id" , this.workspace.workspace.id);
    var code = new Blob([window.Blockly.Python.workspaceToCode(this.workspace.workspace)], {type: "text/plain;charset=utf-8"});
    var xml = new Blob([(new XMLSerializer()).serializeToString((window.Blockly.Xml.workspaceToDom(this.workspace.workspace)))], {type: "text/plain;charset=utf-8"});
    console.log("Strunct" , xml);
    // saveAs(code, "myCode.py");
    // saveAs(xml, "myCode.xml");
    this.downloadFileExample(code,xml);
    // saveAs(xml, "myCode.xml");
    // console.log("UserCode" , window.Blockly.Python.workspaceToCode(this.workspace.workspace));
  }

  downloadFileExample(code,xml) {
    const jszip = new JSZip();
    // jszip.file('Hello.txt', 'Hello World\n');
    var files = jszip.folder("My Project");
    files.file("MyProject.py",code);
    files.file("MyProject.xml",xml);

    jszip.generateAsync({ type: 'blob' }).then(function(content) {
      // see FileSaver.js
      saveAs(content, 'My Project.zip');
    });
  }
  ngAfterViewInit (){
    this.workspace.fromXml('<xml id="workspaceBlocks" style="display:none"><variables></variables><block type="pxt.onStart" x="50" y="50"><value name="CODE"></value></block></xml>');

  }
}
