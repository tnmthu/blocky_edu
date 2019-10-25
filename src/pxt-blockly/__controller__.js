goog.require("Blockly.Blocks");
goog.require("Blockly.constants");
goog.require("Blockly.Python");
goog.require("Blockly.Variables");
goog.require("Blockly.Workspace");
goog.require("Blockly.Generator");

Blockly.Python.addReservedWords("machine");
Blockly.Python.addReservedWords("blocky");

// patch , add definitions_ , no idea why is missing
Blockly.Python.codeSections = Object.create(null);
Blockly.Python.codeSections["import"] = "";
Blockly.Python.codeSections["variable"] = "";
Blockly.Python.codeSections["declare"] = "";
Blockly.Python.codeSections["function"] = "";
Blockly.Python.codeSections["event"] = "";
Blockly.Python.codeSections["once"] = "";
Blockly.Python.codeSections["async"] = "";
/*
    pxt.portDeclare
    pxt.widgetDeclare
    
    pxt.button.onPush


    pxt_getListPort(MODULE_TYPE , obj ( optional ))
    pxt_getListWidget(WIDGET_TYPE , obj , optional))


    API :
        Please follow this api to make life easier for you.

    1. Block attribute.
    this.blockType = 
        'event' -> this block will be unique, it will be disabled if the same block exist elsewhere.
        

*/
var POLICY_DISABLE_ORPHANS = true;
var POLICY_PORT_CONTROLLER = true;
var POLICY_DISABLE_PARENTBLOCK = true;
var POLICY_DISABLE_UNIQUE = true;
var POLICY_DISABLE_WIDGET = true;
var POLICY_UPDATE_WIDGETNAME = true;
var POLICY_WIDGET_CONTROLLER = true;

Blockly.Python.addReservedWords(_supported_module.join(","));
Blockly.Python.addReservedWords(_supported_port.join(","));

// can't use font awesome, must use svg, too lazy, let's use github cdn :))
function png(name) {
  name = name.replace(" ", "_");
  var field = new Blockly.FieldImage(
    "https://raw.githubusercontent.com/curlyz/codelab-esp-pngelement/master/png/" +
      name +
      ".png",
    name.length * 16,
    40
  );
  return field;
}

function generateDropdown(content) {
  var dropdown = [];

  // if (content.length == 0) dropdown = ['NOT CONNECTED', 'NOT CONNECTED'];
  for (var index = 0; index < content.length; index++) {
    dropdown.push([content[index], content[index]]);
  }

  //LEVEL=1 console.info('generateDropdown' , dropdown);
  return dropdown;
}

function isEqual(value, other) {
  // Get the value type
  var type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  var valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  var otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  var compare = function(item1, item2) {
    // Get the object type
    var itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === "[object Function]") {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  // Compare properties
  if (type === "[object Array]") {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }
  // If nothing failed, return true
  return true;
}

function __import__(content) {
  if (Blockly.Python.codeSections["import"].indexOf(content) == -1) {
    Blockly.Python.codeSections["import"] += content + "\n";
  }
}
function __variable__(content) {
  if (Blockly.Python.codeSections["variable"].indexOf(content) == -1) {
    Blockly.Python.codeSections["variable"] += content + "\n";
  }
}
function __declare__(content) {
  if (Blockly.Python.codeSections["declare"].indexOf(content) == -1) {
    Blockly.Python.codeSections["declare"] += content + "\n";
  }
}
function __function__(content) {
  if (Blockly.Python.codeSections["function"].indexOf(content) == -1) {
    Blockly.Python.codeSections["function"] += content + "\n";
  }
}
function __event__(content) {
  if (Blockly.Python.codeSections["event"].indexOf(content) == -1) {
    Blockly.Python.codeSections["event"] += content + "\n";
  }
}
function __once__(content) {
  if (Blockly.Python.codeSections["once"].indexOf(content) == -1) {
    Blockly.Python.codeSections["once"] += content + "\n";
  }
}
function __async__(content) {
  if (Blockly.Python.codeSections["async"].indexOf(content) == -1) {
    Blockly.Python.codeSections["async"] += content + "\n";
  }
}

function addFormulae(
  object,
  attributes,
  code,
  declareParams,
  callerParams,
  callerMethod,
  ref,
  callbackKeyword = "callback"
) {
  if (code == undefined || code.length == 0) {
    //1 //LEVEL=1 console.log('Block', ref.type, 'has not statement !', code);
    code = Blockly.Python.INDENT + "pass";
    // return;
  }
  /*
        object : object name for calling : PORT1 , PORT2
        attributes : unique attribute to generate function name : PORT1_onClick_1
        declareParams : parameter to put inside function declare : async def PORT1_onClick_1( someVariabe )
        callerParams : attribute of caller , PORT1.onClick( times = 1 , )
        // extendedParams : PORT1.onClick( times = 1 , params = [1,2,3,])
    */
  // generate funciton name
  var functionName = ""; // add to section.
  functionName = String(object);
  for (var index = 0; index < attributes.length; index++) {
    functionName += "_" + String(attributes[index]);
  }
  // assign this funciton name TODO
  // codelab['functionName'][functionName] = ref;

  // generate declarer
  var declareFunction = "async def " + functionName + "(";
  for (var index = 0; index < declareParams.length; index++) {
    declareFunction += declareParams[index];
    // if (!index == declareParams.length -1) declareFunction += ',';
    declareFunction += ",";
  }
  if (declareParams.length) declareFunction = declareFunction.slice(0, -1);
  declareFunction += "):\n";
  // get variable used in this top block
  var listblock = ref.getDescendants();
  var listvar = [];
  for (var index = 0; index < listblock.length; index++) {
    var b = listblock[index];
    var name = "";
    if (b.type == "variables_set" || b.type == "math_change") {
      // console.warn(b);
      name = b.inputList[0].fieldRow[1].text_;
    } else if (b.type == "variables_get") {
      name = b.inputList[0].fieldRow[0].text_;
    }

    if (name.length != 0) {
      name = Blockly.Python.variableDB_.getName(
        name,
        Blockly.Variables.NAME_TYPE
      );
      if (listvar.indexOf(name) == -1) {
        listvar.push(name);
      }
      //LEVEL=1 console.log(listblock);
    }
  }
  if (listvar.length) {
    declareFunction += Blockly.Python.INDENT;
    declareFunction += "global ";
    for (var index = 0; index < listvar.length; index++) {
      declareFunction += listvar[index] + ",";
    }
    declareFunction = declareFunction.slice(0, -1);
    declareFunction += "\n";
    //LEVEL=1 console.log('listvar', ref.type, listvar);
  }
  declareFunction += code;

  // generate caller string
  var callerString = String(object) + "." + String(callerMethod) + "(";
  for (var index = 0; index < callerParams.length; index++) {
    if (callerParams[index][1] == "$functionName") {
      callerParams[index][1] = functionName;
    }
    if (callerParams[index][0].length == 0) {
      callerString += callerParams[index][1];
    } else {
      callerString += callerParams[index][0] + "=" + callerParams[index][1];
    }

    callerString += ",";
  }

  callerString += callbackKeyword + "= " + functionName;
  // callerString += 'callback = ' + functionName;
  callerString += ")";

  //1 //LEVEL=1 console.log('block' , ref);

  // import required module
  if (ref.hasOwnProperty("library")) {
    var importString = "import " + ref.library;
    Blockly.Python.addReservedWords(ref.library);
    __import__(importString);
  }

  // declare the object
  if (ref.hasOwnProperty("module")) {
    var declareString =
      ref.getFieldValue("PORT") +
      " = " +
      ref.library +
      "." +
      ref.module.slice(0, 1) +
      ref.module.substring(1).toLowerCase() +
      "(board." +
      ref.getFieldValue("PORT") +
      ")";

    __declare__(declareString);
  }
  __function__(declareFunction);
  __event__(callerString);
}



// Variable use for PORT assign
// var controller
function updateAllPortDropdown () {
  //LEVEL=1 console.info('updateAll Dropdown', __port__);
  // the fun part :)) update all the dropdown
  Blockly.Events.disable();
  var tempsListBlock = codelab.workspace.getAllBlocks();
  // patch , sort blocks, port declare come first
  var listBlocks = [];
  for (var i = 0; i < tempsListBlock.length; i++) {
    if (tempsListBlock[i].type == "pxt.core.onStart") {
      listBlocks.push(tempsListBlock[i]);
    }
  }
  for (var i = 0; i < tempsListBlock.length; i++) {
    if (tempsListBlock[i].type != "pxt.core.onStart") {
      listBlocks.push(tempsListBlock[i]);
    }
  }

  // first, disable death block
  for (var index = 0; index < listBlocks.length; index++) {
    var block = listBlocks[index];
    if (block.module != null && !block.disabled) {
      if (__port__[block.getFieldValue("PORT")] != block.module) {
        Blockly.Events.disable();
        block.setDisabled(true);
        Blockly.Events.enable();
        //LEVEL=1 console.log('disabled beacuse deatch block')
      }
    }
  }

  // first, update others portDeclare

  for (var index = 0; index < listBlocks.length; index++) {
    var block = listBlocks[index];
    if (block.getField("PORT") != null) {
      if (block.type == "pxt.core.portDeclare") {
        // if (block.disabled) continue;

        // var selectedModule = block.getFieldValue('MODULE');
        var selectedPort = block.getFieldValue("PORT");
        var listPort = [selectedPort];
        for (let [port, module] of Object.entries(__port__)) {
          //LEVEL=1 console.log('port', port, module);
          if (port != selectedPort && module == null) {
            listPort.push(port);
          }
        }
        var portDropdown = generateDropdown(listPort);
        //LEVEL=1 console.log('dropdown', block, portDropdown)
        var pos = block
          .getInput("MAIN")
          .fieldRow.indexOf(block.getField("PORT"));
        if (pos > 0) {
          block.getInput("MAIN").removeField("PORT");
          block
            .getInput("MAIN")
            .insertFieldAt(
              pos,
              new Blockly.FieldDropdown(portDropdown),
              "PORT"
            );
          block.getField("PORT").setValue(selectedPort);
        }
      } else if (block.module != null) {
        var selectedPort = block.getFieldValue("PORT");
        var listPort = [];
        if (__port__[block.getFieldValue("PORT")] == block.module) {
          listPort.push(block.getFieldValue("PORT"));
        }
        for (let [port, module] of Object.entries(__port__)) {
          if (port != selectedPort && module == block.module) {
            listPort.push(port);
          }
        }
        // if the port deaclare is delted -> change it to NOT CONNECTED
        // if (listPort.length == 1 && __port__[selectedPort] == null){
        //     listPort = ['NOT CONNECTED'];
        // }
        var portDropdown = generateDropdown(listPort);
        if (portDropdown.length > 0) {
          var pos = block
            .getInput("MAIN")
            .fieldRow.indexOf(block.getField("PORT"));
          if (pos > 0) {
            block.getInput("MAIN").removeField("PORT");
            block
              .getInput("MAIN")
              .insertFieldAt(
                pos,
                new Blockly.FieldDropdown(portDropdown),
                "PORT"
              );
            block.getField("PORT").setValue(selectedPort);
          }
        }
      }
    }
  }
  Blockly.Events.enable();
};
var previousChange = null;
// setInterval(function () {
//     if (!isUserInteracting) checkWorkspace();
// }, 1000);

// function complement(hex) {
//     if (hex.indexOf('#') === 0) {
//         hex = hex.slice(1);
//     }
//     // convert 3-digit hex to 6-digits.
//     if (hex.length === 3) {
//         hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
//     }
//     if (hex.length !== 6) {
//         throw new Error('Invalid HEX color.');
//     }
//     // invert color components
//     var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
//         g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
//         b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
//     // pad each with zeros and return
//     return '#' + padZero(r) + padZero(g) + padZero(b);
// }

function complement(hex) {
  var bw = true;
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    console.error("Invalid", hex, hex.length);
    throw new Error("   Invalid HEX color.");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

function hex2rgba(hex) {
  hex = hex.replace("'", "").replace('"', "");
  // return  ; // color conversion is on server side
  var r = parseInt(hex.substring(1, 3), 16);
  var g = parseInt(hex.substring(3, 5), 16);
  var b = parseInt(hex.substring(5, 7), 16);
  var a = 0xff;

  return (r << 24) | (g << 16) | (b << 8) | (a & 0xff);
}

function translateWidgetDemand(block) {
  console.log("translating", block.type);
  // console.info("translate", block.type);
  var template = {};

  var hexColor = Blockly.Python.valueToCode(
    block,
    "COLOUR",
    Blockly.Python.ORDER_ATOMIC
  ).slice(1, -1);
  if (hexColor.length == 0) {
    hexColor = "#ffffff";
  }
  var color = hex2rgba(hexColor);
  var complementColor = hex2rgba(complement(hexColor));

  if (block.getRootBlock().type != "pxt.widget.tab") return;

  switch (block.widget) {
    // Input Widgets //
    case "BUTTON":
      template = LOAD_TEMPLATE("STYLED_BUTTON");
      // Mode of operation
      template["pushMode"] =
        block.getFieldValue("MODE") == "PUSH" ? true : false;
      // Size of button
      if (block.getFieldValue("DIMENSION") == "SMALL") {
        template["width"] = 2;
        template["height"] = 2;
      } else if (block.getFieldValue("DIMENSION") == "MEDIUM") {
        template["width"] = 3;
        template["height"] = 3;
      } else if (block.getFieldValue("DIMENSION") == "BIG") {
        template["width"] = 4;
        template["height"] = 4;
      }
      template["offButtonState"]["text"] = block.getFieldValue("offLabel");
      template["offButtonState"]["textColor"] = color;
      template["onButtonState"]["text"] = block.getFieldValue("onLabel");
      template["onButtonState"]["textColor"] = complementColor;
      template["onButtonState"]["backgroundColor"] = color;
      template["offButtonState"]["backgroundColor"] = color;
      // template["color"] = color;
      break;
    case "SLIDER":
      var orientatation = block.getFieldValue("ORIENTATION");
      var size = block.getFieldValue("DIMENSION");
      if (orientatation == "HORIZONTAL") {
        template = LOAD_TEMPLATE("SLIDER");
        if (size == "SMALL") {
          template["width"] = 3;
          template["height"] = 1;
        }
        if (size == "MEDIUM") {
          template["width"] = 5;
          template["height"] = 1;
        }
        if (size == "BIG") {
          template["width"] = 8;
          template["height"] = 1;
        }
      } else if (orientatation == "VERTICAL") {
        template = LOAD_TEMPLATE("VERTICAL_SLIDER");
        if (size == "SMALL") {
          template["width"] = 1;
          template["height"] = 3;
        }
        if (size == "MEDIUM") {
          template["width"] = 1;
          template["height"] = 5;
        }
        if (size == "BIG") {
          template["width"] = 1;
          template["height"] = 8;
        }
      }
      template["min"] = block.getFieldValue("min");
      template["max"] = block.getFieldValue("max");
      template["color"] = color;

      break;
    case "STEP":
      var orientatation = block.getFieldValue("ORIENTATION");
      var size = block.getFieldValue("DIMENSION");
      if (orientatation == "HORIZONTAL") {
        template = LOAD_TEMPLATE("STEP");
        if (size == "SMALL") {
          template["width"] = 3;
          template["height"] = 1;
        }
        if (size == "MEDIUM") {
          template["width"] = 5;
          template["height"] = 1;
        }
        if (size == "BIG") {
          template["width"] = 8;
          template["height"] = 1;
        }
      } else if (orientatation == "VERTICAL") {
        template = LOAD_TEMPLATE("VERTICAL_STEP");
        if (size == "SMALL") {
          template["width"] = 1;
          template["height"] = 3;
        }
        if (size == "MEDIUM") {
          template["width"] = 1;
          template["height"] = 5;
        }
        if (size == "BIG") {
          template["width"] = 1;
          template["height"] = 8;
        }
      }

      template["min"] = block.getFieldValue("min");
      template["max"] = block.getFieldValue("max");
      template["step"] = block.getFieldValue("step");
      template["color"] = color;
      break;
    case "JOYSTICK":
      template = LOAD_TEMPLATE("JOYSTICK");
      var size = block.getFieldValue("DIMENSION");
      if (size == "SMALL") {
        template["width"] = 4;
        template["height"] = 3;
      }
      if (size == "MEDIUM") {
        template["width"] = 5;
        template["height"] = 4;
      }
      if (size == "BIG") {
        template["width"] = 6;
        template["height"] = 5;
      }
      template["pins"][0]["min"] = block.getFieldValue("min");
      template["pins"][1]["min"] = block.getFieldValue("min");
      template["pins"][0]["max"] = block.getFieldValue("max");
      template["pins"][1]["max"] = block.getFieldValue("max");
      template["color"] = color;
      break;
    case "zeRGBa":
      break;

    // Display Widgets //
    case "NUMBER":
      template = LOAD_TEMPLATE("LABELED_VALUE_DISPLAY");
      var prefix = Blockly.Python.valueToCode(
        block,
        "PREFIX",
        Blockly.Python.ORDER_ATOMIC
      ).slice(1, -1);
      var size = block.getFieldValue("DIMENSION");

      if (size == "SMALL") {
        template["width"] = 3;
        template["height"] = 1;
      }
      if (size == "MEDIUM") {
        template["width"] = 4;
        template["height"] = 1;
      }
      if (size == "BIG") {
        template["width"] = 5;
        template["height"] = 2;
      }
      template["min"] = block.getFieldValue("min");
      template["max"] = block.getFieldValue("max");
      template["valueFormatting"] = "/pin/" + prefix;
      template["color"] = color;
      break;
    case "LED":
      template = LOAD_TEMPLATE("LED");
      var size = block.getFieldValue("DIMENSION");
      if (size == "SMALL") {
        template["width"] = 1;
        template["height"] = 1;
      }
      if (size == "MEDIUM") {
        template["width"] = 2;
        template["height"] = 2;
      }
      if (size == "BIG") {
        template["width"] = 3;
        template["height"] = 3;
      }
      template["color"] = color;
      break;
    case "GAUGE":
      template = LOAD_TEMPLATE("GAUGE");
      var size = block.getFieldValue("DIMENSION");

      if (size == "SMALL") {
        template["width"] = 4;
        template["height"] = 3;
      }
      if (size == "MEDIUM") {
        template["width"] = 5;
        template["height"] = 4;
      }
      if (size == "BIG") {
        template["width"] = 6;
        template["height"] = 5;
      }
      template["min"] = block.getFieldValue("min");
      template["max"] = block.getFieldValue("max");
      template["color"] = color;
      break;
    case "TERMINAL":
      template = LOAD_TEMPLATE("TERMINAL");
      var size = block.getFieldValue("DIMENSION");

      if (size == "SMALL") {
        template["width"] = 5;
        template["height"] = 3;
      }
      if (size == "MEDIUM") {
        template["width"] = 8;
        template["height"] = 3;
      }
      if (size == "BIG") {
        template["width"] = 8;
        template["height"] = 5;
      }
      template["min"] = block.getFieldValue("min");
      template["max"] = block.getFieldValue("max");
      template["color"] = color;
      break;
    case "LEVEL":
      var orientatation = block.getFieldValue("ORIENTATION");
      var size = block.getFieldValue("DIMENSION");
      if (orientatation == "HORIZONTAL") {
        template = LOAD_TEMPLATE("STEP");
        if (size == "SMALL") {
          template["width"] = 3;
          template["height"] = 1;
        }
        if (size == "MEDIUM") {
          template["width"] = 5;
          template["height"] = 1;
        }
        if (size == "BIG") {
          template["width"] = 8;
          template["height"] = 1;
        }
      } else if (orientatation == "VERTICAL") {
        template = LOAD_TEMPLATE("VERTICAL_LEVEL_DISPLAY");
        if (size == "SMALL") {
          template["width"] = 1;
          template["height"] = 3;
        }
        if (size == "MEDIUM") {
          template["width"] = 1;
          template["height"] = 5;
        }
        if (size == "BIG") {
          template["width"] = 1;
          template["height"] = 8;
        }
      }
      template["min"] = block.getFieldValue("min");
      template["max"] = block.getFieldValue("max");
      template["color"] = color;
      break;
    case "CHART":
      // alert("CHART HERE");
      template = LOAD_TEMPLATE("CHART");
      // template["label"] = Blockly.Python.valueToCode(block,"WIDGETNAME",Blockly.Python.ORDER_ATOMIC).slice(1,-1);
      // scan through the children block
      var listChildBlock = block.getDescendants(true);
      console.warn("listChild", listChildBlock);

      // Lowest of min and highest of max , that is yAxisMax and yAxisMin
      // Find this first

      for (var u = 0; u < listChildBlock.length; u++) {
        var childBlock = listChildBlock[u];
        if (childBlock.type != "pxt.widget.superchart.channel.declare")
          continue;

        var stream = LOAD_TEMPLATE("STREAM");
        stream["title"] = Blockly.Python.valueToCode(
          childBlock,
          "WIDGETNAME",
          Blockly.Python.ORDER_ATOMIC
        ).slice(1, -1);
        stream["graphType"] = childBlock.getFieldValue("GRAPHTYPE");
        // alert(Blockly.Python.valueToCode(childBlock,"MIN",Blockly.Python.ORDER_ATOMIC));
        // console.warn("PASE THIS " , Blockly.Python.valueToCode(childBlock,"MIN",Blockly.Python.ORDER_ATOMIC);
        stream["pin"]["min"] = parseInt(childBlock.getFieldValue("MIN"));
        stream["yAxisMin"] = parseInt(childBlock.getFieldValue("MIN"));
        stream["yAxisMax"] = parseInt(childBlock.getFieldValue("MAX"));
        stream["pin"]["max"] = parseInt(childBlock.getFieldValue("MAX"));
        var streamHexColor = Blockly.Python.valueToCode(
          childBlock,
          "COLOUR",
          Blockly.Python.ORDER_ATOMIC
        ).slice(1, -1);
        stream["color"] = hex2rgba(streamHexColor);

        template["dataStreams"].push(stream);
      }

      break;

    case "ENHANCED_GRAPH_CHANNEL":
      break;

    case "STREAM":
      // This block only stay inside CHART, therefore, no need to interprete
      return;
      break;
    default:
      alert("What is missing ?");
      console.log("block", block);
  }
  // Colour of wodget
  // template["color"] = hex2rgba(Blockly.Python.valueToCode(block, "COLOUR", Blockly.Python.ORDER_ATOMIC).replace("'", ''));
  // Name of widget
  template["label"] = Blockly.Python.valueToCode(block, "WIDGETNAME").slice(
    1,
    -1
  );
  template["tabId"] =
    parseInt(
      block
        .getRootBlock()
        .getFieldValue("TAB")
        .substring(3, 4)
    ) - 1;

  return template;
}

function getWidgetDemand() {
  var widgetDemand = {
    project: {},
    widgets: []
  };
  var listBlock = codelab.workspace.getAllBlocks();
  var block = null;
  // create the tabs widget
  var tabWidget = LOAD_TEMPLATE("TABS");
  for (var i = 0; i < listBlock.length; i++) {
    var block = listBlock[i];
    if (block.type != "pxt.widget.tab") continue;
    if (block.disabled) continue;

    var tabId = parseInt(block.getFieldValue("TAB").substring(3, 4)) - 1;
    // console.warn("abid", tabId, tabWidget);
    tabWidget["tabs"][tabId]["label"] = Blockly.Python.valueToCode(
      block,
      "NAME",
      Blockly.Python.ORDER_ATOMIC
    );
    // Remove the double quote
    tabWidget["tabs"][tabId]["label"] = tabWidget["tabs"][tabId][
      "label"
    ].substring(1, tabWidget["tabs"][tabId]["label"].length - 1);
  }
  widgetDemand["widgets"].push(tabWidget);

  // get the demand widget
  var currentChannel = 100;
  for (var i = 0; i < listBlock.length; i++) {
    block = listBlock[i];
    if (!block.hasOwnProperty("blockType")) continue;
    // if (block.blockType != "widget.declare") continue;
    // exception , tab have no color
    if (block.type == "pxt.widget.tab") continue;
    if (block.disabled) continue;

    var widget = translateWidgetDemand(block);
    if (widget) {
      if (widget["type"] != "ENHANCED_GRAPH") {
        widgetDemand["widgets"].push(widget);

        currentChannel += 1;
        assignedChannel["V" + String(currentChannel)] = [
          block,
          widget,
          widget["label"]
        ];
        widget["pin"] = currentChannel;
        widget["pinType"] = "VIRTUAL";
      } else {
        widgetDemand["widgets"].push(widget);

        for (var u = 0; u < widget["dataStreams"].length; u++) {
          currentChannel += 1;
          assignedChannel["V" + String(currentChannel)] = [
            block,
            widget,
            widget["dataStreams"][u]["title"]
          ];
          widget["dataStreams"][u]["pin"] = currentChannel;
          widget["dataStreams"][u]["pinType"] = "VIRTUAL";
        }
      }
    }
  }
  console.warn("channel", assignedChannel);

  return JSON.stringify(widgetDemand, undefined, 2);
}

function requestsWidget(demand) {
  return; // #ANGULAR
  // console.warn("requestsingWidget", demand);
  var url = "https://blynk.getblocky.com:100/api/v1/interface";
  var currentUser = codelab.userService.getCurrentUser();
  if (currentUser == null) {
    console.warn("User not logged in");
    return;
  }
  url += "?type=email";
  url += "&email=" + encodeURIComponent(currentUser.name);
  url += "&password=" + encodeURIComponent(codelab.store.get("jwt_token"));
  // url += '&password=' + encodeURIComponent(codelab.store.get('jwt_token'));

  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: demand
  }).then(function(response) {
    console.log("THis is the response", response);
  });
}

var prevDemand = "";
var widgetEventTimeoutObj = null;

function checkRequestWidget() {
  clearTimeout(widgetEventTimeoutObj);
  widgetEventTimeoutObj = setTimeout(function() {
    exec_checkRequestWidget();
  }, 1000);
}

var assignedChannel = {};

function exec_checkRequestWidget() {
  assignedChannel = {};
  var nowDemand = getWidgetDemand();

  console.error("Assigned Channel", assignedChannel);

  if (JSON.stringify(nowDemand) != prevDemand) {
    if (codelab.isWidgetChanged == false && prevDemand.length != 0) {
      codelab.isWidgetChanged = true;
      // Swal.fire({
      //     title: "You have just made a change to your project",
      //     text: "Make sure that you re-upload the script to the controller",
      //     type: "info"
      // })
      codelab.toast.showSuccess(
        "You have made changes to to your widgets, remember to press the UPLOAD button after you are done!"
      );

      // Swal.fire({
      //     title : "You have just made a change to your project",
      //     text : "Make sure that you re-upload the script to the controller",
      //     type : "info",
      //     timer: 2000,
      //     onBeforeOpen: () => {
      //       Swal.showLoading()
      //       timerInterval = setInterval(() => {

      //       }, 100)
      //     },
      //     onClose: () => {
      //       clearInterval(timerInterval)
      //     }
      //   }).then((result) => {
      //     if (
      //       // Read more about handling dismissals
      //       result.dismiss === Swal.DismissReason.timer
      //     ) {
      //     }
      //   })
    }

    prevDemand = JSON.stringify(nowDemand);
    requestsWidget(nowDemand);
  } else {
    console.warn("Change Trigger but not different");
  }
}
// var isUserInteracting = false; // global flag to tell routine not to execute while user is still interacting
function changeHandle(targetBlock, change) {
  // console.info("route" , targetBlock , change);
  // if (change.type == Blockly.Events.MOVE) {
  //     isUserInteracting = true;
  // }
  // if (change.type == Blockly.Events.END_DRAG) {
  //     isUserInteracting = false;
  // }
  // console.warn(change);

  // Widget Change Hook;
  // if (change.blockId == targetBlock.id) {
  //     if (change.type == Blockly.Events.CHANGE ||
  //         change.type == Blockly.Events.CREATE ||
  //         change.type == Blockly.Events.DELETE ||
  //         change.type == Blockly.Events.UI) {

  //         if (change.workspaceId == codelab.workspace.id) {
  //             if (change.type == Blockly.Events.DELETE) {
  //                 Blockly.Events.disable();
  //                 var workspace = new Blockly.Workspace();
  //                 try {
  //                     var block = Blockly.Xml.domToBlock(change.oldXml, workspace);
  //                 } catch (err) {
  //                     return false
  //                 }
  //                 if (!block.isInFlyout) {
  //                     Blockly.Events.enable();
  //                     if (block.hasOwnProperty("blockType") && block.blockType == "widget.declare") {
  //                         requestsWidget();
  //                         console.warn("widget.declare", change);
  //                     }
  //                 }
  //             } else if (change.type == Blockly.Events.UI) {
  //                 if (change.element != "click") {
  //                     console.warn("widget.declare", change);
  //                     requestsWidget();
  //                 }
  //             } else {

  //                 console.log("COnsider", targetBlock.blockType, targetBlock.type);
  //                 if (targetBlock.blockType == "widget.declare" && targetBlock.workspace==codelab.workspace) {
  //                     requestsWidget();
  //                     console.warn("widget.declare", change);
  //                 }
  //             }
  //         }
  //     }
  // }
  // if (change.type == Blockly.Events.CHANGE ||
  //     change.type == Blockly.Events.CREATE ||
  //     change.type == Blockly.Events.DELETE ||
  //     (change.type == Blockly.Events.UI && change.element == "saveEdit")) {
  //     checkRequestWidget();
  // }
  // checkRequestWidget();

  if (change == previousChange) return;
  previousChange = change;

  if (true) {
    if (change.type == Blockly.Events.UI) {
      var b = codelab.workspace.getBlockById(change.blockId);
      console.warn("inspect", b);
    }
  }
  // filter execution
  console.error(change.type, change);
  // filter block change action that is still in flyout
  if (change.workspaceId != codelab.workspace.id) return;

  checkRequestWidget();

  if (change.type != Blockly.Events.UI) {
    // if (change.type != Blockly.Events.UI) {
    checkWorkspace();
  }

  // This might be a source of bug, namely happen when portdeclare is enabled the
  // same time as module block, which make module block still be disable
  // the routine will fix this :(

  // if (change.type == Blockly.Events.END_DRAG) return;

  // // if (change.type == Blockly.Events.CREATE) return;
  // // if (targetBlock.isInFlyout) return;
  // // if (targetBlock.workspace != codelab.workspace) return;

  // Route for updating the widget in realtime;
  // if (change.workspace == codelab.workspace.id && (
  //         change.type == Blockly.Evens.CHANGE ||
  //         change.type == Blockly.Events.CREATE ||
  //         change.type == Blockly.Events.DELETE)) {
  //     // recreate the block
  //     // var block = null;
  //     if (change.type == Blockly.Events.DELETE) {
  //         Blockly.Events.disable();
  //         var workspace = new Blockly.Workspace();
  //         try {
  //             var block = Blockly.Xml.domToBlock(change.oldXml, workspace);
  //         } catch (err) {
  //             return false
  //         }
  //         Blockly.Events.enable();
  //     } else {
  //         var block = codelab.workspace.getBlockById(change.blockId);
  //     }
  //     if (!block.hasOwnProperty("blockType")) return;
  //     if (block.blockType != "widget.declare") return;
  //     requestsWidget();
  // }
};


var controller_port_assign = {};

function getListBlockType (type, workspace) {
  var listBlock = [];
  var allblock = workspace.getAllBlocks();
  for (var index = 0; index < allblock.length; index++) {
    if (allblock[index].type != type) continue;
    listBlock.push(allblock[index]);
  }
  // //LEVEL=1 console.log('list' , listBlock);
  return listBlock;
};

function getListAvailablePort(module) {
  var listPort = [];
  for (let [key, value] of Object.entries(controller_port_assign)) {
    if (module == value) listPort.push(key);
  }
  if (listPort.length == 0) {
    listPort = ["NOT DEFINED"];
  }
  return listPort;
};

function __argumentList__(targetBlock) {
  var myInputList = [];
  // //LEVEL=1 console.log(targetBlock);
  for (
    var inputIndex = 0;
    inputIndex < targetBlock.inputList.length;
    inputIndex++
  ) {
    for (
      var fieldIndex = 0;
      fieldIndex < targetBlock.inputList[inputIndex].fieldRow.length;
      fieldIndex++
    ) {
      myInputList.push(
        targetBlock.inputList[inputIndex].fieldRow[fieldIndex].text_
      );
    }
  }
  myInputList.push(targetBlock.workspace.id);
  return myInputList;
};

function __updatePortService__  () {};

function debugEvent(msg) {
  console.warn(
    "%c" + msg,
    'color : #000 ;font-size : 10px ;font-family:"Comic Sans MS"'
  );
  console.info("PORT", __port__);
}

function isUniqueBlockDelete(block, change) {
  if (change.type != Blockly.Events.DELETE) return false;
  // if (block.isInFlyout!=false) return false ;
  // if (block.blockType==undefined) return false ;
  // if (block.blockType.includes('unique')) return false ;
  Blockly.Events.disable();
  var workspace = new Blockly.Workspace();
  try {
    var block = Blockly.Xml.domToBlock(change.oldXml, workspace);
  } catch (err) {
    return false;
  }
  Blockly.Events.enable();

  if (change.workspaceId != codelab.workspace.id) return false; // workaround for isInFlyout
  if (block.blockType == undefined) return false;
  if (block.blockType.includes("unique")) return false;
  if (_previous_block_delete == block.id) return false;
  _previous_block_delete = block.id;
  //LEVEL=1 console.log('isUniqueBlockDelete', change, block);
  return true;
}

function isUniqueBlockCreate(block, change) {
  if (change.type != Blockly.Events.CREATE) return false;
  if (block.isInFlyout != false) return false;
  if (block.blockType == undefined) return false;
  if (!block.blockType.includes("unique")) return false;
  if (block.id != change.blockId) return false;

  debugEvent("isUniqueBlockCreate"); //, block, change);
  return true;
}

function isUniqueBlockChange(block, change) {
  if (change.type != Blockly.Events.CHANGE) return false;
  if (block.isInFlyout != false) return false;
  if (block.blockType == undefined) return false;
  if (!block.blockType.includes("unique")) return false;
  if (block.id != change.blockId) return false;

  debugEvent("isUniqueBlockChange");
  return true;
}
var _previous_block_delete = "";

function isPortDeclareDelete(block, change) {
  if (change.type != Blockly.Events.DELETE) return false;

  Blockly.Events.disable();
  var workspace = new Blockly.Workspace();
  try {
    var block = Blockly.Xml.domToBlock(change.oldXml, workspace);
  } catch (err) {
    return false;
  }
  Blockly.Events.enable();

  if (change.workspaceId != codelab.workspace.id) return false;

  if (change.blockId == _previous_block_delete) return false;
  _previous_block_delete = change.blockId;
  debugEvent("isPortDeclareDelete"); //, block, change);
  return true;
}

function isPortDeclareCreate(block, change) {
  if (change.type != Blockly.Events.CREATE) return false;
  if (block.type != "pxt.core.portDeclare") return false;
  if (block.id != change.blockId) return false;
  if (block.isInFlyout != false) return false;
  debugEvent("isPortDeclareCreate"); //, block, change);
  return true;
}

function isPortDeclareMove(block, change) {
  if (change.type != Blockly.Events.MOVE) return false;
  if (change.newParentId == change.oldParentId) return false;
  if (change.blockId != block.id) return false;
  if (block.type != "pxt.core.portDeclare") return false;
  debugEvent("isPortDeclareMove"); //, block, change);
  return true;
}

function isModuleBlockCreate(block, change) {
  if (change.type != Blockly.Events.CREATE) return false;
  if (block.getField("PORT") == undefined) return false;
  if (change.blockId != block.id) return false;
  if (block.isInFlyout != false) return false;
  debugEvent("isModuleBlockCreate"); //, block, change);
  return true;
}

function isPortDeclareChange(block, change) {
  if (change.type != Blockly.Events.CHANGE) return false;
  if (block.type != "pxt.core.portDeclare") return false;
  if (block.isInFlyout != false) return false;
  if (block.id != change.blockId) return false;
  if (change.element != "field" && change.element != "disabled") return false;

  debugEvent("isPortDeclareChange");
  return true;
}

function isModuleBlockChange(block, change) {
  if (change.type != Blockly.Events.CHANGE) return false;
  if (change.name != "PORT") return false;
  // if (block.getField('PORT') == undefined) return false;
  if (change.blockId != block.id) return false;
  if (block.isInFlyout != false) return false;
  debugEvent("isModuleBlockChange"); //, block, change);
  return true;
}

var __port__ = {};
var __widget__ = {};

for (var i = 0; i < _supported_port.length; i++)
  __port__[_supported_port[i]] = null;

function getListPort(obj) {
  // get list available port for module
  var module = "";
  var availablePort = [];
  if (obj.type == "pxt.core.portDeclare") {
    module = obj.getFieldValue("MODULE");
    for (let [port, portModule] of Object.entries(__port__)) {
      if (portModule == null) availablePort.push(port);
    }
  } else {
    // built in button  #TODO

    // module = obj.module;
    for (let [port, module] of Object.entries(__port__)) {
      if (module == obj.module) availablePort.push(port);
    }
  }

  // console.warn('list', module, availablePort, __port__);
  if (availablePort.length == 0) {
    if (obj.type == "pxt.core.portDeclare") {
      availablePort = ["OUT OF PORT"];
    } else {
      availablePort = ["NOT CONNECTED"];
    }
    Blockly.Events.disable();
    obj.setDisabled(true);
    console.warn("disabled because not connected", availablePort);
    Blockly.Events.enable();
  }
  return generateDropdown(availablePort);
};

function objectName(name) {
  return name.slice(1, 1).toUpperCase() + name.slice(1, 0);
}

function getListBlock(type) {
  if (type == null) {
    return codelab.workspace.getAllBlocks();
  } else {
    var listBlocks = codelab.workspace.getAllBlocks();
    var returnList = [];

    for (var i = 0; i < type.length; i++) {
      if (type[i] === "*") {
        for (var u = 0; u, listBlocks.length; u++) {
          if (returnList.indexOf(listBlocks[u]) == -1) {
            returnList.push(listBlocks[u]);
          }
        }
      } else {
        for (var u = 0; u < listBlocks.length; u++) {
          if (listBlocks[u].type === type[i]) returnList.push(listBlocks[u]);
        }
      }
    }
    return returnList;
  }
}

function checkWorkspace() {
  // console.log('workspace check ');

  var t0 = performance.now();
  /*
        To disable a block, it can be ANY condition match
        To enable a block, it must be ALL condition match
        That's why you shouldn't use setDisabled to disable it, instead , just add it to this list
        To check if a block is disable, you must check if it is inside this list
    */
  var listDisabled = [];

  // Reset the __port__
  for (let [port, _] of Object.entries(__port__)) {
    __port__[port] = null;
  }

  // Check all the portDeclare Port

  // var list_portDeclare = getListBlock(['pxt.core.portDeclare']);
  // for (const block of list_portDeclare) {
  //     console.log(block);
  //     if (block.getRootBlock().type != 'pxt.onStart') {
  //         Blockly.Events.disable();
  //         block.setDisabled(true);
  //         block.setWarningText('This block should be put inside "on start" block');
  //         Blockly.Events.enable();
  //     }
  // }
  var blocks = codelab.workspace.getAllBlocks(true);
  var block = null;

  // WORK WITH ORPHANS BLOCKS
  if (POLICY_DISABLE_ORPHANS) {
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (listDisabled.indexOf(block) > -1) continue;
      if (
        block.getRootBlock() == block &&
        block.previousConnection != null &&
        block.outputConnection == null
      ) {
        console.log("orphan", block);
        var childs = block.getDescendants();

        for (var u = 0; u < childs.length; u++) {
          // childs[u].setDisabled(true);
          listDisabled.push(childs[u]);

          console.info("disableOrphan", childs[u]);
        }
        listDisabled.push(block);
        console.info("disableOrphan", block);
        // blocks[i].setDisabled(true);
        // Blockly.Events.enable();
      }

      // output block will have different property, need to define clearly
      else if (
        block.getRootBlock() == block &&
        block.outputConnection != null &&
        block.previousConnection == null
      ) {
        if (true) {
          // if (block.rendered == true && block.isSelectingBlock_ == true) {
          console.info("disableOrphanOutput", block);

          listDisabled.push(block);
        }
      }
    }
  }

  if (POLICY_DISABLE_UNIQUE) {
    // WORK WITH UNIQUE BLOCKS
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (!block.hasOwnProperty("blockType")) continue;
      if (!block.blockType.includes("unique")) continue;
      if (listDisabled.indexOf(block) > -1) continue;
      var thisArgument = __argumentList__(block);
      for (var u = 0; u < blocks.length; u++) {
        if (block.type != blocks[u].type) continue;
        if (u == i) continue;
        if (listDisabled.indexOf(blocks[u]) > -1) continue;
        // Patch ? blocks[i].workspace == null ??
        if (blocks[i].workspace == blocks[u].workspace) continue;
        if (isEqual(__argumentList__(blocks[u]), thisArgument) == true) {
          listDisabled.push(blocks[u]);
          blocks[u].setWarningText("This block is duplicated");
          console.info("disableUnique", blocks[u], blocks[i]);
        }
        // console.info('compare', __argumentList__(blocks[u]), thisArgument);
      }
    }
  }
  if (POLICY_DISABLE_PARENTBLOCK) {
    // WORK WITH PARENT BLOCK , parentBlock , only allow this block to be inside that block
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (!block.hasOwnProperty("parentBlock")) continue;
      if (listDisabled.indexOf(block) > -1) continue;

      if (block.parentBlock.indexOf(block.getRootBlock().type) == -1) {
        listDisabled.push(block);
        block.setWarningText("This block shouldn't be here");
        var childs = block.getDescendants();
        for (var u = 0; u < childs.length; u++) {
          listDisabled.push(childs[u]);
        }
      }
    }
  }
  if (POLICY_PORT_CONTROLLER) {
    /* WORK WITH PORT DECLARE  s*/
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (block.type != "pxt.core.portDeclare") continue;
      if (listDisabled.indexOf(block) > -1 || block.disabled) continue;
      if (__port__[block.getFieldValue("PORT")] != null) {
        listDisabled.push(block);
        block.setWarningText(
          block.getFieldValue("PORT") +
            " has been connected to " +
            __port__[block.getFieldValue("PORT")]
        );
        // consolf.infor('disablePortDeclareSame', block)
        continue;
      }
      __port__[block.getFieldValue("PORT")] = block.getFieldValue("MODULE");
    }

    /* WORK WITH WIDGET DECLARE */
    var __listWidgetName = [];
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (!block.hasOwnProperty("blockType")) continue;
      if (block.blockType != "widget.declare") continue;
      if (listDisabled.indexOf(block) > -1 || block.disabled) continue;
      /*
                Basic Rules :
                For most widgets , a channel is binded to the "label"
                For SuperChart , a channel is binded to each of its datastreams
                Sooo, no duplicate, this is a unique name
            */
      var myName = "";
      if (block.type != "pxt.widget.superchart.declare") {
        console.info("consider", block.type);
        myName = Blockly.Python.valueToCode(
          block,
          "WIDGETNAME",
          Blockly.Python.ORDER_ATOMIC
        ).slice(1, -1);
        if (__listWidgetName.indexOf(myName) > -1) {
          listDisabled.push(block);
          console.warn("disabledDuplicateChannelName", myName, block.type);
        } else {
          __listWidgetName.push(myName);
          console.warn("addChannelName: ", myName, __listWidgetName);
        }
      }
    }
    Blockly.Events.disable();
    // First , update portDeclare block
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (block.type != "pxt.core.portDeclare") continue;

      var dropdown = [];
      // var dropdown = [block.getFieldValue('PORT')];
      for (let [port, module] of Object.entries(__port__)) {
        if (__port__[port] == null) {
          dropdown.push(port);
        }
      }
      var dropdownObject = new Blockly.FieldDropdown(
        generateDropdown(dropdown)
      );
      var pos = block.getInput("MAIN").fieldRow.indexOf(block.getField("PORT"));
      var selectedPort = block.getFieldValue("PORT");
      if (pos > 0) {
        block.getInput("MAIN").removeField("PORT");
        block.getInput("MAIN").insertFieldAt(pos, dropdownObject, "PORT");
        block.getField("PORT").setValue(selectedPort);
      }
    }
    // update module block that has the "PORT" field
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (!block.hasOwnProperty("module")) continue;
      // update the dropdown
      var dropdown = [];
      for (let [port, module] of Object.entries(__port__)) {
        if (module == block.module) {
          dropdown.push(port);
        }
      }
      // dropdown is the list of valid port that this block should be using
      // two case, what if it is no longer usable because portDeclare change
      var currentPort = block.getFieldValue("PORT");
      if (dropdown.indexOf(currentPort) == -1) {
        listDisabled.push(block);
        block.setWarningText(
          block.module + " is no longer connected to " + currentPort
        );
        // dropdown.unshift(currentPort);
      }
      // if there is no usable block, this rarely happen
      if (dropdown.length == 0) {
        // this block is no longer conencted
        listDisabled.push(block);
        dropdown = ["NOT CONNECTED"];
      }
      var dropdownObject = new Blockly.FieldDropdown(
        generateDropdown(dropdown)
      );
      var pos = block.getInput("MAIN").fieldRow.indexOf(block.getField("PORT"));
      var selectedPort = block.getFieldValue("PORT");
      if (pos > 0) {
        block.getInput("MAIN").removeField("PORT");
        block.getInput("MAIN").insertFieldAt(pos, dropdownObject, "PORT");
        block.getField("PORT").setValue(selectedPort);
      }
    }
    Blockly.Events.enable();
  }

  if (false) {
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (block.blockType != "widget.declare") continue;
      if (listDisabled.indexOf(block) > -1) continue;

      // what are the others widget name ?
      var listUsedName = [];
      for (var u = 0; u < blocks.length; u++) {
        if (u == i) continue;
        if (blocks[u].blockType != "widget.declare") continue;
        if (listDisabled.indexOf(blocks[u]) > -1) continue;

        if (blocks[u].disabled) continue;

        var thisName = Blockly.Python.valueToCode(
          blocks[u],
          "WIDGETNAME",
          Blockly.Python.ORDER_ATOMIC
        ).slice(1, -1);
        listUsedName.push(thisName);
      }

      var myName = Blockly.Python.valueToCode(
        block,
        "WIDGETNAME",
        Blockly.Python.ORDER_ATOMIC
      ).slice(1, -1);
      console.log("ListUsedName", listUsedName);
      if (listUsedName.indexOf(myName) > -1) {
        listDisabled.push(block);
      }
    }
  }

  if (POLICY_WIDGET_CONTROLLER) {
    //  Gathering all the widget name based on category

    // First, controll the TABS
    var listUsedTab = [];
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (listDisabled.indexOf(block) > -1) continue;
      if (block.type != "pxt.widget.tab") continue;
      var thisTab = block.getFieldValue("TAB");
      if (listUsedTab.indexOf(thisTab) > -1) {
        listDisabled.push(block);
        block.setWarningText("This Tab is duplicated");
      } else {
        listUsedTab.push(thisTab);
      }
    }

    // Then, controll the "widget.declare"
    var widgetChannel = {};
    var listUsedName = [];
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (listDisabled.indexOf(block) > -1) continue;
      if (block.blockType != "widget.declare") continue;

      // no duplicate name , name are associated with channel
      var thisName = Blockly.Python.valueToCode(
        block,
        "WIDGETNAME",
        Blockly.Python.ORDER_ATOMIC
      ).slice(1, -1);
      if (listUsedName.indexOf(thisName) > -1) {
        listDisabled.push(block);
        block.setWarningText("The Name has been used by other widgets");
      } else {
        listUsedName.push(thisName);
        if (widgetChannel[block.widget] == undefined) {
          widgetChannel[block.widget] = [];
        }
        widgetChannel[block.widget].push(thisName);
      }
    }
    console.log("widgetChannelInfo", JSON.stringify(widgetChannel));

    // Then, modify the "widget.event","widget.set","widget.get"
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (
        ["widget.set", "widget.get", "widget.event"].indexOf(block.blockType) ==
        -1
      )
        continue;

      var currentWidgetName = block.getFieldValue("WIDGETNAME");
      var channelDropdown = [];
      if (
        widgetChannel[block.widget] == undefined ||
        widgetChannel[block.widget].length == 0
      ) {
        channelDropdown = [["NO WIDGET", "NO WIDGET"]];
        listDisabled.push(block);
      } else if (widgetChannel[block.widget].indexOf(currentWidgetName) == -1) {
        listDisabled.push(block);

        channelDropdown = generateDropdown(widgetChannel[block.widget]);
      } else {
        channelDropdown = generateDropdown(widgetChannel[block.widget]);
      }
      Blockly.Events.disable();

      //LEVEL=1 console.log('dropdown', block, portDropdown)
      console.log(block);
      var pos = block
        .getInput("MAIN")
        .fieldRow.indexOf(block.getField("WIDGETNAME"));
      if (pos > 0) {
        block.getInput("MAIN").removeField("WIDGETNAME");
        block
          .getInput("MAIN")
          .insertFieldAt(
            pos,
            new Blockly.FieldDropdown(channelDropdown),
            "WIDGETNAME"
          );
        block.getField("WIDGETNAME").setValue(currentWidgetName);
      }
      Blockly.Events.enable();
    }
  }

  if (false) {
    var channelName = {};
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (listDisabled.indexOf(block) > -1) continue;
      if (block.disabled) continue;
      if (block.blockType != "widget.declare") continue;

      if (!(block.widget in channelName)) channelName[block.widget] = [];

      var myChannelName = Blockly.Python.valueToCode(
        block,
        "WIDGETNAME",
        Blockly.Python.ORDER_ATOMIC
      ).slice(1, -1);
      channelName[block.widget].push(myChannelName);
    }
    console.warn("channelMapping", channelName);

    Blockly.Events.disable();
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (listDisabled.indexOf(block) > -1) continue;
      // if (block.disabled) continue;
      if (
        block.blockType != "widget.set" &&
        block.blockType != "widget.get" &&
        block.blockType != "widget.event"
      )
        continue;

      if (
        !(block.widget in channelName) ||
        channelName[block.widget].length == 0
      ) {
        listDisabled.push(block);
        console.warn("disabledMissingChannle", block, channelName);
        block.setDisabled(true);
      } else {
        var selectedWidgetName = block.getFieldValue("WIDGETNAME");

        var portDropdown = generateDropdown(channelName[block.widget]);
        //LEVEL=1 console.log('dropdown', block, portDropdown)
        var pos = block
          .getInput("MAIN")
          .fieldRow.indexOf(block.getField("WIDGETNAME"));
        if (pos > 0) {
          block.getInput("MAIN").removeField("WIDGETNAME");
          block
            .getInput("MAIN")
            .insertFieldAt(
              pos,
              new Blockly.FieldDropdown(portDropdown),
              "WIDGETNAME"
            );
          block.getField("WIDGETNAME").setValue(selectedWidgetName);
        }
        if (!(channelName[block.widget].indexOf(selectedWidgetName) > -1)) {
          listDisabled.push(block);
          console.warn("DisableBlock", block);
        }
      }
    }
    Blockly.Events.enable();
  }

  // Finally disable these blocks.
  Blockly.Events.disable();
  for (var i = 0; i < listDisabled.length; i++) {
    listDisabled[i].setDisabled(true);
    console.log("disableBlock", listDisabled[i].type, listDisabled[i].disabled);
  }
  Blockly.Events.enable();

  // From this point, blocks that is not in listDisabled MAY be enable again

  // ----------------- SEPERATION ( ENABLE SECTION ) ------------------------
  // Enable non orphans block
  Blockly.Events.disable();
  for (var i = 0; i < blocks.length; i++) {
    block = blocks[i];
    if (block.disabled == false) continue;
    // if (block.previousConnection != null && block.getRootBlock)
    if (listDisabled.indexOf(block) > -1) continue;
    if (
      (block.previousConnection != null && block.getRootBlock() != block) ||
      block.previousConnection == null
    ) {
      console.warn("reEnableBlock", block);
      var childs = block.getDescendants();
      for (var u = 0; u < childs.length; u++) {
        if (listDisabled.indexOf(childs[u]) > -1) continue;
        // console.log('enable' , bloc.type , block.id)
        // childs[u].setDisabled(false);
        childs[u].setDisabled(false);
        childs[u].setWarningText(null);
      }
      block.setDisabled(false);
      block.setWarningText(null);
    }
  }
  Blockly.Events.enable();

  // /* WORK WITH WIDGET DECLARE BLOCK */
  // Blockly.Events.disable();
  // for (var i = 0; i < blocks.length; i++) {
  //     block = blocks[i];
  //     if (listDisabled.indexOf(block) > -1 ) continue;
  //     if (block.hasOwnProperty("blockType") == false) continue;
  //     if (block.blockType != "widget.declare") continue;

  //     // gather list of name
  //     var listName = [];
  //     for (u =0;u<blocks.length;u++){
  //         if (u==i) continue ;
  //         if (blocks[u].hasOwnProperty("blockType") == false ) continue;
  //         if (blocks[u].blockType != "widget.declare") continue ;
  //         var name = Blockly.Python.valueToCode(blocks[u],"WIDGETNAME",Blockly.Python.ORDER_ATOMIC).slice(1,-1);
  //         listName.push(name);
  //     }

  //     var thisName = Blockly.Python.valueToCode(block,"WIDGETNAME",Blockly.Python.ORDER_ATOMIC).slice(1,-1);
  //     if (listName.indexOf(thisName) == -1){
  //         console.info("enableBlock. Not conflict channel binding"  ,block.type , listName ,"thisname" , thisName);
  //         block.setDisabled(false)
  //         block.setWarningText(null);
  //     }
  // }
  // Blockly.Events.enable();

  var t1 = performance.now();
  // console.warn("took " + (t1 - t0) + " milliseconds.")
  // console.warn(__port__);
  // if (t1 - t0 > 100) {
  //     alert('100 miliseconds barrier');
  // }
}
