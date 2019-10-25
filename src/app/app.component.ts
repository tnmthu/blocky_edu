import { Component,ViewChild,OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {  NgxBlocklyComponent,NgxBlocklyConfig, NgxBlocklyGeneratorConfig,CustomBlock, BlockMutator } from "ngx-blockly";

import {ToolboxService} from './toolbox.service';

// import 'src/pxt-blockly/blockly_compressed.js';
// import 'src/pxt-blockly/blocks_compressed.js';
// import 'src/pxt-blockly/__blocks__.js';
// import 'src/pxt-blockly/Global.js';


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})







export class AppComponent {
  buttonClicked = false;

  constructor(private router: Router, private toolboxService: ToolboxService) {}

  public config: NgxBlocklyConfig = {
    toolbox : this.toolboxService.ToolBoxXml ,
    scrollbars: true,
    trashcan: true,
    horizontalLayout : false,
    collapse : true,
    comments : true,
    // css : false,
    grid : {
      spacing : 1,
      length : 10,
      colour : "#00ffff",
      snap : true
    },
    zoom : {
      controls : true,
      wheel : true ,
      startScale : 1,
      maxScale : 100,
      minScale : 1,
      scaleSpeed : 2
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


  public customBlocks: CustomBlock[] = [
  
  ];
  

  onCode(code: string) {
    console.log(code);
  }
  @ViewChild(NgxBlocklyComponent) workspace;
  ngOnInit (){
    console.warn(this.workspace);
    console.warn(this.workspace.workspace);
  }
}





//# Custom Blocks generation 
declare var Blockly: any;
 
export class TestBlock extends CustomBlock {
    
 
    constructor(type: string, block: any, blockMutator: BlockMutator) {
        super(type, block, blockMutator);
        this.class = TestBlock;
    }
 
    defineBlock() {
        this.block.appendDummyInput()
            .appendField(this.type)
            .appendField(new Blockly.FieldImage('assets/testblock.png', 50, 50, '*'))
            .appendField(new Blockly.FieldImage("this.args[0]", 50, 50, '*'));
        this.block.setOutput(true, 'Input');
        this.block.setColour(30);
        this.block.setTooltip('');
        this.block.setHelpUrl('');
    }
 
    toXML() {
        return '<block type="test"></block>';
    }
 
 
    onChange(changeEvent: any) {
        console.log(changeEvent);
    }
}