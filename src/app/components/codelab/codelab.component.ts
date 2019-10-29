import { Component, OnInit, ViewChild, AfterContentInit } from "@angular/core";
import { saveAs } from "file-saver";
import {
  NgxBlocklyComponent,
  NgxBlocklyConfig,
  NgxBlocklyGeneratorConfig,
  NgxBlocklyModule,
  NgxToolboxBuilderService
} from "ngx-blockly";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToolboxService } from "src/app/services/toolbox.service";
// import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from "sweetalert2";
import * as JSZip from "jszip";
import { Socket } from "ngx-socket-io";
import * as EmailValidator from "email-validator";
import {
  WebcamModule,
  WebcamComponent,
  WebcamImage,
  WebcamInitError,
  WebcamMirrorProperties,
  WebcamUtil
} from "ngx-webcam";
import { map } from "rxjs/operators";

@Component({
  selector: "app-codelab",
  templateUrl: "./codelab.component.html",
  styleUrls: ["./codelab.component.scss"]
})
export class CodelabComponent implements OnInit {
  // Customize Toast
  Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000
  });

  constructor(
    private toolboxService: ToolboxService,
    private socket: Socket,
    private httpClient: HttpClient,
    private webcam: WebcamModule
  ) {}

  isUserLoggedIn: boolean = false;
  thisUsername: string;
  thisPassword: string;
  loginProfile: any;
  isWebcamEnable: boolean = false;
  Blockly: any;

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

  onButtonNewProject() {
    console.log("Click");
    Swal.fire({
      title: "Hey, let's name your new project",
      input: "text",
      type: "info"
    });
    // window.Blockly.Events.disable();
    // window.Blockly.Events.enable();
  }

  onWorkspace(event: any) {
    console.log("Event", event);
    console.log("Workspace", this.workspace.workspace);
    console.log(window);
    window["codelab"] = this.workspace;
  }

  onButtonProjectUpload() {}

  onButtonLoadProject() {}

  async onButtonLogin() {
    var username = await Swal.fire({
      title: "Login in",
      type: "info",
      input: "text",
      inputPlaceholder: "ahihi@gmail.com",
      background:
        "#22bf89 no-repeat url(http://66.media.tumblr.com/8210fd413c5ce209678ef82d65731443/tumblr_mjphnqLpNy1s5jjtzo1_400.gif)",
      width: 600,
      padding: "3em",
      backdrop: `
                rgba(0,0,123,0.4)
                url("/images/nyan-cat.gif")
                center left
                no-repeat
            `,
      inputValidator: value => {
        if (!EmailValidator.validate(value)) {
          return "Dude, this is not an email :v";
        }
      }
      
    });

    var password = await Swal.fire({
      title: "Type in your password",
      type: "info",
      input: "password",
      inputValidator: value => {
        if (!value) {
          return "Please type in your password";
        }
      }
    });
    this.thisUsername = username.value;
    this.thisPassword = password.value;
    this.loginProfile = {
      username: this.thisUsername,
      password: this.thisPassword
    };
    localStorage.setItem("loginSession", this.loginProfile);
    var payload = { username: this.thisUsername, password: this.thisPassword };
    const data = await this.httpClient
      .post("http://localhost:5000/api/v1/login", JSON.stringify(payload), {
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })
      .toPromise();

    if (data["success"] === false) {
      this.Toast.fire({
        type: "error",
        title: "Wrong password",
        background: "#ee6500"
      });
      this.isUserLoggedIn = false;
    } else {
      this.Toast.fire({
        type: "success",
        title: "Signed in successfully",
        background: "#22bf89"
      });

      this.isUserLoggedIn = true;
      // Save the JWT key for later auto
      localStorage.setItem(
        "loginJWT",
        JSON.stringify({
          username: this.thisUsername,
          token: data["message"]
        })
      );
      console.log("Saved Token : ", localStorage.getItem("loginJWT"));
    }
  }
  async onSignOutButton() {
    (this.thisPassword = ""),
      (this.thisUsername = ""),
      (this.loginProfile = this.isUserLoggedIn = false);
    this.Toast.fire({
      type: "success",
      title: "You have signed out",
      background: "#22bf89"
    });
  }
  async onSignUpButton() {
    var _username = await Swal.fire({
      title: "Create new account",
      text: "username ?",
      input: "text",
      type: "info",
      inputValidator: value => {
        if (!EmailValidator.validate(value)) {
          return "Dude, this is not an email :v";
        }
      }
    });

    var _password = await Swal.fire({
      title: "The password",
      text: "password ?",
      input: "password",
      type: "info",
      inputValidator: value => {
        if (!value) {
          return "Please type in your password";
        }
      }
    });

    // const data = await http("localhost/create-account",{
    //   method : "POST",
    //   body: JSON.stringify({ title: "my post", body: "some content" })
    // });
    var payload = { username: _username.value, password: _password.value };
    const data = await this.httpClient
      .post(
        "http://localhost:5000/api/v1/create-account",
        JSON.stringify(payload),
        {
          headers: new HttpHeaders().set("Content-Type", "application/json")
        }
      )
      .toPromise();

    console.log("Data: " + JSON.stringify(data));

    // const response = await http<{ id: number }>(
    //   new Request("https://jsonplaceholder.typicode.com/posts", {
    //     method: "post",
    //     body: JSON.stringify({ title: "my post", body: "some content" })
    //   })
    // );
  }

  onButtonDownload() {
    console.log("Current Id", this.workspace.workspace.id);
    var code = new Blob(
      [window.Blockly.Python.workspaceToCode(this.workspace.workspace)],
      { type: "text/plain;charset=utf-8" }
    );
    var xml = new Blob(
      [
        new XMLSerializer().serializeToString(
          window.Blockly.Xml.workspaceToDom(this.workspace.workspace)
        )
      ],
      { type: "text/plain;charset=utf-8" }
    );
    console.log("Strunct", xml);
    // saveAs(code, "myCode.py");
    // saveAs(xml, "myCode.xml");
    this.downloadFileExample(code, xml);
    // saveAs(xml, "myCode.xml");
    // console.log("UserCode" , window.Blockly.Python.workspaceToCode(this.workspace.workspace));
  }

  downloadFileExample(code, xml) {
    const jszip = new JSZip();
    // jszip.file('Hello.txt', 'Hello World\n');
    var files = jszip.folder("My Project");
    files.file("MyProject.py", code);
    files.file("MyProject.xml", xml);

    jszip.generateAsync({ type: "blob" }).then(function(content) {
      // see FileSaver.js
      saveAs(content, "My Project.zip");
    });
  }

  // ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗██╗ ██████╗
  // ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██║██╔═══██╗
  // ███████╗██║   ██║██║     █████╔╝ █████╗     ██║   ██║██║   ██║
  // ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   ██║██║   ██║
  // ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   ██║╚██████╔╝
  // ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝
  sendMessage(msg: string) {
    this.socket.emit("message", msg);
  }
  // getMessage() {
  //   return this.socket
  //       .fromEvent("message")
  //       .map( data => data.msg );
  // }

  socketTrigger() {
    this.sendMessage("Hello Worls");
    localStorage.setItem("key", String(new Date().getTime() / 1000));
    console.log(localStorage.getItem("key"));
  }

  ngOnInit() {
    console.warn(this.workspace);
    console.warn(this.workspace.workspace);
  }
  async ngAfterViewInit() {
    this.workspace.fromXml(
      '<xml id="workspaceBlocks" style="display:none"><variables></variables><block type="pxt.onStart" x="50" y="50"><value name="CODE"></value></block></xml>'
    );

    //# Auto Login in using JWT token
    if (localStorage.getItem("loginJWT") != null) {
      const decision = await Swal.fire({
        type : "info",
        title: "Logging in as ",
        text: JSON.parse(localStorage.getItem("loginJWT")).username,
        showCancelButton: true,
        showConfirmButton : true ,
        confirmButtonText: 'Login',  
        focusConfirm: false,
        animation : true ,
        showLoaderOnConfirm: true,
        preConfirm :  (value) => async function(){
            const data = await this.httpClient
            .post("http://localhost:5000/api/v1/login", JSON.stringify({}), {
                headers: new HttpHeaders().set("Content-Type", "application/json")
            })
            .toPromise();
            if (data["success"] == true){
                Swal.insertQueueStep({
                    type : "success",
                    title : "Welcome back :D"
                    
                })
            }
        }

      });
    }
  }


  public sidebarClicked = false;
  sidebarEvent(isSidebarOpen: boolean) {
    this.sidebarClicked = isSidebarOpen;
  }


}
