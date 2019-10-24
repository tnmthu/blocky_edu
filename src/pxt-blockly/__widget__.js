goog.require('Blockly');

var SUPPORTED_WIDGET = [];
var _supported_widget = [
    "BUTTON", "SLIDER", "JOYSTICK",
    "zeRGBa", "STEP", "VALUE DISPLAY",
    "LED", "GAUGE", "TERMINAL", "NOTIFICATION",
    "EMAIL", "WEBHOOK", "TWO_AXIS_JOYSTICK"
];
for (var index = 0; index < _supported_widget.length; index++) {
    SUPPORTED_WIDGET.push([_supported_widget[index], _supported_widget[index]])
}

var __widget_dict_ = {};



function getListWidget(obj) {
    // reference to global channel;
    var listName = [];
    console.log("getlistwidget", obj.widget);
    if (obj.widget != "STREAM") {
        for (let [key, value] of Object.entries(assignedChannel)) {
            // key is the channel , value = [block , widget , name]
            if (value[0].widget == obj.widget) {
                listName.push(value[2]);

            }
        }
    } else {
        for (let [key, value] of Object.entries(assignedChannel)) {
            if (value[0].widget == "CHART") {
                listName.push(value[2]);
            }
        }
    }

    if (listName.length == 0) {
        listName = ["NOT WIDGET CREATED"];
        Blockly.Events.disable();
        obj.setDisabled(true);
        Blockly.Events.enable();
    }

    return generateDropdown(listName);
}

var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    // str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}


function assignWidgetName(obj, change) {
    if (change.type != Blockly.Events.CREATE) return;
    if (change.blockId != obj.id) return;
    console.warn("assigningName", obj, change);

    // get the list of current used widget
    var listBlocks = codelab.workspace.getAllBlocks();
    var block = null;
    var listUsedName = [];
    for (var i = 0; i < listBlocks.length; i++) {
        block = listBlocks[i];
        if (block.blockType != "widget.declare") continue;
        if (block == obj) continue;
        var thisName = Blockly.Python.valueToCode(block, "WIDGETNAME", Blockly.Python.ORDER_ATOMIC).slice(1, -1);
        listUsedName.push(thisName);
    }
    var appoName = "";
    for (var i = 0; i < 50; i++) {
        var tempName = "My " + obj.widget;
        if (i > 0) tempName += " " + String(i);
        if (listUsedName.indexOf(tempName) == -1) {
            appoName = tempName;
            break;
        }
    }

    var textBlock = obj.getInputTargetBlock("WIDGETNAME");
    Blockly.Events.disable();
    textBlock.setFieldValue(appoName, "TEXT");
    Blockly.Events.enable();

    // now we modify the tex block


}


// widget.Input //
/* 
    Supported Input Widgets :
        Button :
            Normal Button , Styled Button
        Slider :
            Horizon and Vertical Slider
        Joystick
        zeRGBa
        Step :
            Horizon and Vertical
    Supported Display Widgets :
        Value :
            Value Display + Labeled Display
        LED
        Gauge
        Terminal

    Supported Network Widgets :
        Notification
        Email 
        #Note that this 2 widgets is triggered when you use blynk.notify and blynk.email blocks
        WebHook
        # Note that webhook will be intergrated for IFTTT in September, please update
*/

/* 
    General Approach for all Blocks
    How to let user choose the position of each block ?
    All of the blocks here are not identical in dimension
    The API will auto sort all the blocks to fill in the blanks
    All blocks will have 3 sizes : SMALL , MEDIUM , BIG
    All blocks will be organized in lines
*/

/*
    Patch  : 8th August 2019
    Need to clarify "widget.declare" block
    "widget.declare" => "channel.declare"

    There are 2 exception cases.
    TABS : Well, tabs don't use channel
    SUPERCHART : You guess it, it use multiple 
*/


/* THE NEW BLOCK API */
// CORE BLOCK
Blockly.Blocks['pxt.widget.tab'] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.blockType = "tab.declare";
        this.appendDummyInput('MAIN')
            .appendField(png("APP"))
            .appendField('setting up tab')
            .appendField(new Blockly.FieldDropdown(generateDropdown(['TAB1', 'TAB2', 'TAB3', 'TAB4'])), "TAB")
            .appendField("with name :");

        this.appendValueInput("NAME");
        this.appendStatementInput('WIDGETCODE');

        this.allowBloodBlock = true; // only allow block which specify the parent to be this block
        this.setOnChange(
            function (change) {
                // When this block is created, set the appropriated name
                // console.warn(codelab.profile);

                if (change.type == Blockly.Events.UI) return;
                if (change.blockId != this.id) return;
                if ((change.type == Blockly.Events.CREATE && change.blockId == this.id) ||
                    (change.type == Blockly.Events.CHANGE && change.element == "field" && change.blockId == this.id)) {
                    for (var i = 0; i < codelab.profile["widgets"].length; i++) {

                        if (codelab.profile["widgets"][i]["type"] == "TABS") {
                            var myId = parseInt(this.getFieldValue("TAB").substring(3, 4)) - 1;
                            var myName = "";
                            if (codelab.profile["widgets"][i]["tabs"].length < myId) {
                                myName = this.getFieldValue("TAB");
                            } else if (codelab.profile["widgets"][i]["tabs"][myId].hasOwnProperty("label")) {
                                myName = codelab.profile["widgets"][i]["tabs"][myId]["label"];
                            } else {
                                myName = this.getFieldValue("TAB");
                            }
                            Blockly.Events.disable();
                            var textBlock = this.getInputTargetBlock("NAME");
                            textBlock.setFieldValue(myName, "TEXT");
                            Blockly.Events.enable();
                            break;
                        }
                    }
                }


                //     // Handle duplicate , TAB dropdown
                //     if (change.type == Blockly.Events.CREATE) return;
                //     // No duplicate Tab ? This is
                //     var listBlocks = codelab.workspace.getAllBlocks();
                //     var listDisabled = [];
                //     for (var i = 0; i < listBlocks.length; i++) {
                //         if (listBlocks[i].type != "pxt.widget.tab") continue;
                //         if (listDisabled.indexOf(listBlocks[i]) > -1) continue;
                //         if (listBlocks[i].getFieldValue("TAB") == this.getFieldValue("TAB") &&
                //             this != listBlocks[i] &&
                //             listBlocks[i].disabled == false) {

                //             listDisabled.push(listBlocks[i]);
                //         }
                //     }
                //     Blockly.Events.disable();
                //     for (var i = 0; i < listDisabled.length; i++) {
                //         listDisabled[i].setDisabled(true);
                //     }
                //     for (var i = 0; i < listBlocks.length; i++) {
                //         if (!listBlocks[i].type == "pxt.widget.tab") continue;
                //         if (listDisabled.indexOf(listBlocks[i]) > -1) continue;
                //         listBlocks[i].setDisabled(false);
                //     }
                //     Blockly.Events.enable();


                //     assignWidgetName(this,change);changeHandle(this, change);;
                // });
                changeHandle(this, change);
            });

    }
}

// GENERAL BLOCK : //
// Blockly.Blocks['pxt.widget.declare'] = {
//     init: function () {
//         this.setColour(Toolbox_App);
//         this.parentBlock = ['pxt.widget.tab'];
//         this.dependencyBlock = ['pxt.widget.tab'];
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//         this.appendDummyInput('MAIN')
//             .appendField(png('APP'))
//             .appendField('create widget')
//             .appendField(new Blockly.FieldDropdown(SUPPORTED_WIDGET), 'WIDGET')
//             .appendField('name');
//         this.appendValueInput("NAME");
//         this.appendValueInput("COLOUR");
//         this.setOnChange(function (change) {
//             if (change.blockId != this.id) return;
//             assignWidgetName(this,change);changeHandle(this, change);;
//         });
//     }
// };


// ======================= BUTTON ======================= //
Blockly.Blocks["pxt.widget.button.declare"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "BUTTON";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.inputsInline = false;
        this.appendValueInput("WIDGETNAME")
            .appendField("create")
            .appendField(png("BUTTON"))
            .appendField('with name');
        this.appendDummyInput("CONFIG1")
            .appendField("Mode : ")
            .appendField(new Blockly.FieldDropdown([
                ["PUSH", "PUSH"],
                ["SWITCH", "SWITCH"]
            ]), "MODE");
        this.appendDummyInput("CONFIG2")
            .appendField("Dimension:")
            .appendField(new Blockly.FieldDropdown([
                ["SMALL", "SMALL"],
                ["MEDIUM", "MEDIUM"],
                ["BIG", "BIG"]
            ]), "DIMENSION");
        this.appendValueInput("COLOUR")
            .appendField("Colour: ");
        this.appendDummyInput("RANGE")
            .appendField("Label:")
            // .appendField("ON: ")
            .appendField(new Blockly.FieldTextInput("ON"), "onLabel")
            // .appendField("OFF:")
            .appendField(new Blockly.FieldTextInput("OFF"), "offLabel");
        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks["pxt.widget.button.onEvent"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "BUTTON";
        this.blockType = "widget.event"
        this.appendDummyInput("MAIN")
            .appendField(png("BUTTON"))
            .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
            .appendField("when")
            .appendField(new Blockly.FieldDropdown([
                ["PRESS", "PRESS"],
                ["RELEASE", "RELEASE"]
            ]), "MODE");
        this.appendStatementInput("CODE");
    }
}

function getCorrespondingChannel(name) {
    for (let [key, value] of Object.entries(assignedChannel)) {
        if (value[2] == name) {
            return key;
        }
    }
    console.error("Where is it ??", name, assignedChannel);
}


// ======================= SLIDER ======================= //
Blockly.Blocks["pxt.widget.slider.declare"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "SLIDER";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.inputsInline = false;
        this.appendValueInput("WIDGETNAME")
            .appendField("create")
            .appendField(png("SLIDER"))
            .appendField('with name');
        this.appendDummyInput("CONFIG1")
            .appendField("Orientation : ")
            .appendField(new Blockly.FieldDropdown([
                ["HORIZONTAL", "HORIZONTAL"],
                ["VERTICAL", "VERTICAL"]
            ]), "ORIENTATION");
        this.appendDummyInput("CONFIG2")
            .appendField("Dimension:")
            .appendField(new Blockly.FieldDropdown([
                ["SMALL", "SMALL"],
                ["MEDIUM", "MEDIUM"],
                ["BIG", "BIG"]
            ]), "DIMENSION");
        this.appendValueInput("COLOUR")
            .appendField("Colour: ");
        this.appendDummyInput("LABEL")
            .appendField("Range:")
            .appendField(new Blockly.FieldNumber(0), "min")
            // .appendField("OFF:")
            .appendField("to")
            .appendField(new Blockly.FieldNumber(100), "max");
        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });
    }
}

Blockly.Blocks["pxt.widget.slider.getValue"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "SLIDER";
        this.blockType = "widget.get";
        this.setOutput(true);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.appendDummyInput("MAIN")
            .appendField(png("SLIDER"))
            .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
            .appendField("'s value");

    }
}

// ======================= JOYSTICK ======================= //
Blockly.Blocks["pxt.widget.joystick.declare"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "JOYSTICK";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.inputsInline = false;
        this.appendValueInput("WIDGETNAME")
            .appendField("create")
            .appendField(png("JOYSTICK"))
            .appendField('with name');
        // this.appendDummyInput("CONFIG1")
        //     .appendField("Orientation : ")
        //     .appendField(new Blockly.FieldDropdown([
        //         ["HORIZONTAL", "HORIZONTAL"],
        //         ["VERTICAL", "VERTICAL"]
        //     ]), "MODE");
        this.appendDummyInput("CONFIG2")
            .appendField("Dimension:")
            .appendField(new Blockly.FieldDropdown([
                ["SMALL", "SMALL"],
                ["MEDIUM", "MEDIUM"],
                ["BIG", "BIG"]
            ]), "DIMENSION");
        // this.appendDummyInput("CONFIG3")
        //     .appendField("Auto Return")
        // .appendField(new Blockly.FieldCheckbox(true),"AUTORETURN");
        this.appendValueInput("COLOUR")
            .appendField("Colour: ");
        this.appendDummyInput("LABEL")
            .appendField("Range:")
            .appendField(new Blockly.FieldNumber(0), "min")
            // .appendField("OFF:")
            .appendField("to")
            .appendField(new Blockly.FieldNumber(100), "max");
        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks["pxt.widget.joystick.getValue"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "JOYSTICK";
        this.blockType = "widget.get";
        this.setOutput(true);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.appendDummyInput("MAIN")
            .appendField(png("JOYSTICK"))
            .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
            .appendField("'s")
            .appendField(new Blockly.FieldDropdown([
                ["X", "X"],
                ["Y", "Y"]
            ]), "AXIS")
            .appendField("value");


    }
}

// ======================= STEPPER ======================= //
Blockly.Blocks["pxt.widget.step.declare"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "STEP";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.inputsInline = false;

        this.appendValueInput("WIDGETNAME")
            .appendField("create")
            .appendField(png("STEP"))
            .appendField('with name');
        this.appendDummyInput("CONFIG1")
            .appendField("Orientation : ")
            .appendField(new Blockly.FieldDropdown([
                ["HORIZONTAL", "HORIZONTAL"],
                ["VERTICAL", "VERTICAL"]
            ]), "ORIENTATION");
        this.appendDummyInput("CONFIG2")
            .appendField("Dimension:")
            .appendField(new Blockly.FieldDropdown([
                ["SMALL", "SMALL"],
                ["MEDIUM", "MEDIUM"],
                ["BIG", "BIG"]
            ]), "DIMENSION");
        // this.setInputsInline(false);
        this.appendValueInput("COLOUR")
            .appendField("Colour: ");
        this.appendDummyInput("LABEL")
            .appendField("Range:")
            .appendField(new Blockly.FieldNumber(0), "min")
            // .appendField("OFF:")
            .appendField("to")
            .appendField(new Blockly.FieldNumber(100), "max")
            .appendField("step:")
            .appendField(new Blockly.FieldNumber(1), "step");

        // this.setCollapsed(true);
        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks["pxt.widget.step.getValue"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "STEP";
        this.setOutput(true);
        this.blockType = "widget.get";
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.appendDummyInput("MAIN")
            .appendField(png("STEP"))
            .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
            .appendField("'s value");

    }
}

// ======================= zeRGBa ======================= //
// Blockly.Blocks["pxt.widget.zergba.onEvent"] = {
//     init: function () {
//         this.setColour(Toolbox_App);
//         this.widget = "zeRGBa";
//         this.appendDummyInput("MAIN")
//             .appendField(png("zeRGBa"))
//             .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
//             .appendField("when change color");
//         this.appendStatementInput("CODE");
//     }
// }

// ======================= NUMBER DISPLAY ======================= //
Blockly.Blocks["pxt.widget.number.declare"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "NUMBER";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.inputsInline = false;
        this.appendValueInput("WIDGETNAME")
            .appendField("create")
            .appendField(png("NUMBER"))
            .appendField('with name');
        // this.appendDummyInput("CONFIG1")
        //     .appendField("Orientation : ")
        //     .appendField(new Blockly.FieldDropdown([
        //         ["HORIZONTAL", "HORIZONTAL"],
        //         ["VERTICAL", "VERTICAL"]
        //     ]), "MODE");
        this.appendDummyInput("CONFIG2")
            .appendField("Dimension:")
            .appendField(new Blockly.FieldDropdown([
                ["SMALL", "SMALL"],
                ["MEDIUM", "MEDIUM"],
                ["BIG", "BIG"]
            ]), "DIMENSION");
        this.appendValueInput("COLOUR")
            .appendField("Colour: ");
        this.appendDummyInput("LABEL")
            .appendField("Range:")
            .appendField(new Blockly.FieldNumber(0), "min")
            // .appendField("OFF:")
            .appendField("to")
            .appendField(new Blockly.FieldNumber(100), "max");
        this.appendValueInput("PREFIX").appendField("Prefix:");
        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks["pxt.widget.number.setValue"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "NUMBER";
        this.blockType = "widget.set";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput("MAIN")
            .appendField(png("NUMBER"))
            .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
            .appendField("display value");
        this.appendValueInput("VALUE");

    }
}

// ======================= LED ======================= //
Blockly.Blocks["pxt.widget.led.declare"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "LED";
        this.blockType = "widget.declare";
        // this.blockType = "widget.set";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.inputsInline = false;
        this.appendValueInput("WIDGETNAME")
            .appendField("create")
            .appendField(png("LED"))
            .appendField('with name');
        // this.appendDummyInput("CONFIG1")
        //     .appendField("Orientation : ")
        //     .appendField(new Blockly.FieldDropdown([
        //         ["HORIZONTAL", "HORIZONTAL"],
        //         ["VERTICAL", "VERTICAL"]
        //     ]), "MODE");
        this.appendDummyInput("CONFIG2")
            .appendField("Dimension:")
            .appendField(new Blockly.FieldDropdown([
                ["SMALL", "SMALL"],
                ["MEDIUM", "MEDIUM"],
                ["BIG", "BIG"]
            ]), "DIMENSION");
        this.appendValueInput("COLOUR")
            .appendField("Colour: ");
        this.appendDummyInput("LABEL")
            .appendField("Range:")
            .appendField(new Blockly.FieldNumber(0), "min")
            // .appendField("OFF:")
            .appendField("to")
            .appendField(new Blockly.FieldNumber(100), "max");
        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks["pxt.widget.led.setValue"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "LED";
        this.blockType = "widget.set";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput("MAIN")
            .appendField(png("LED"))
            .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
            .appendField("turn");
        this.appendValueInput("VALUE");


    }
}

// ======================= GAUGE ======================= //
Blockly.Blocks["pxt.widget.gauge.declare"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "GAUGE";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.inputsInline = false;
        this.appendValueInput("WIDGETNAME")
            .appendField("create")
            .appendField(png("GAUGE"))
            .appendField('with name');
        // this.appendDummyInput("CONFIG1")
        //     .appendField("Orientation : ")
        //     .appendField(new Blockly.FieldDropdown([
        //         ["HORIZONTAL", "HORIZONTAL"],
        //         ["VERTICAL", "VERTICAL"]
        //     ]), "MODE");
        this.appendDummyInput("CONFIG2")
            .appendField("Dimension:")
            .appendField(new Blockly.FieldDropdown([
                ["SMALL", "SMALL"],
                ["MEDIUM", "MEDIUM"],
                ["BIG", "BIG"]
            ]), "DIMENSION");
        this.appendValueInput("COLOUR")
            .appendField("Colour: ");
        this.appendDummyInput("LABEL")
            .appendField("Range:")
            .appendField(new Blockly.FieldNumber(0), "min")
            // .appendField("OFF:")
            .appendField("to")
            .appendField(new Blockly.FieldNumber(100), "max");
        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks["pxt.widget.gauge.setValue"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "GAUGE";
        this.blockType = "widget.set";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput("MAIN")
            .appendField(png("GAUGE"))
            .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
            .appendField("show value");
        this.appendValueInput("VALUE");
    }
}
// ======================= TERMINAL ======================= //
Blockly.Blocks["pxt.widget.terminal.declare"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "TERMINAL";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.inputsInline = false;
        this.appendValueInput("WIDGETNAME")
            .appendField("create")
            .appendField(png("TERMINAL"))
            .appendField('with name');
        // this.appendDummyInput("CONFIG1")
        //     .appendField("Orientation : ")
        //     .appendField(new Blockly.FieldDropdown([
        //         ["HORIZONTAL", "HORIZONTAL"],
        //         ["VERTICAL", "VERTICAL"]
        //     ]), "MODE");
        this.appendDummyInput("CONFIG2")
            .appendField("Dimension:")
            .appendField(new Blockly.FieldDropdown([
                ["SMALL", "SMALL"],
                ["MEDIUM", "MEDIUM"],
                ["BIG", "BIG"]
            ]), "DIMENSION");
        this.appendValueInput("COLOUR")
            .appendField("Colour: ");
        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });
        // this.appendDummyInput("LABEL")
        //     .appendField("Range:")
        //     .appendField(new Blockly.FieldNumber(0), "min")
        //     // .appendField("OFF:")
        //     .appendField("to")
        //     .appendField(new Blockly.FieldNumber(100), "max");
    }
}
Blockly.Blocks["pxt.widget.terminal.setValue"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "TERMINAL";
        this.blockType = "widget.set";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput("MAIN")
            .appendField(png("TERMINAL"))
            .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
            .appendField("show value");
        this.appendValueInput("VALUE");
    }
}
// ======================= SUPERCHART ======================= //
Blockly.Blocks["pxt.widget.superchart.declare"] = {
    init: function () {
        this.setColour("#1a976d");
        this.widget = "CHART";
        this.blockType = "superchart.declare";
        // this.inputsInline = true;
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        // this.appendDummyInput("MAIN");
        this.appendValueInput("WIDGETNAME")
            .appendField("create")
            .appendField(png("CHART"))
            .appendField('with name');
        this.appendDummyInput("D")
            .appendField(new Blockly.FieldDropdown([
                ["SMALL", "SMALL"],
                ["MEDIUM", "MEDIUM"],
                ["BIG", "BIG"]
            ]), "DIMENSION");

        // this.appendDummyInput("CONFIG2")
        //     .appendField("Dimension:")
        // .appendField(new Blockly.FieldDropdown([
        //     ["SMALL", "SMALL"],
        //     ["MEDIUM", "MEDIUM"],
        //     ["BIG", "BIG"]
        // ]), "DIMENSION");
        // this.appendValueInput("COLOUR")
        //     .appendField("Colour: ");
        // this.appendDummyInput("LABEL")
        //     .appendField("Range:")
        //     .appendField(new Blockly.FieldNumber(0), "min")
        //     // .appendField("OFF:")
        //     .appendField("to")
        //     .appendField(new Blockly.FieldNumber(100), "max");
        // this.appendDummyInput("D");
        // this.inputsInline = false;
        this.appendStatementInput("DATA");
        // this.appendDummyInput("TRULYDUMMY");

        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });

    }
}
Blockly.Blocks["pxt.widget.superchart.channel.declare"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "STREAM";
        this.blockType = "widget.declare";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        // this.appendDummyInput("MAIN")
        //     .appendField("create datastream")
        //     .appendField(new Blockly.FieldTextInput("My Stream") , "STREAMNAME")
        //     // .appendField(new Blockly.FieldColour("#ffffff") , "COLOUR")
        //     .appendField(new Blockly.FieldDropdown([
        //         ["LINE" , "LINE"]
        //     ]),"GRAPHLINE")
        //     .appendField(new Blockly.FieldNumber(0) , "MIN")
        //     .appendField(new Blockly.FieldNumber(100) , "MAX") 
        //     ;x`
        this.appendValueInput("WIDGETNAME")
            .appendField("create datastream");
        this.appendDummyInput("GR")
            .appendField(new Blockly.FieldDropdown([
                ["LINE", "LINE"],
                ["FILLED LINE", "FILLED_LINE"],
                ["BAR", "BAR"]
            ]), "GRAPHTYPE")
            .appendField("min:")
            .appendField(new Blockly.FieldNumber(0), "MIN")
            .appendField("max:")
            .appendField(new Blockly.FieldNumber(100), "MAX");
        // this.appendValueInput("MIN")
        //     .appendField("min:");
        // this.appendValueInput("MAX")
        //     .appendField("max:");
        this.appendValueInput("COLOUR");
        this.setOnChange(function (change) {
            assignWidgetName(this, change);
            changeHandle(this, change);
        });

    }
}
Blockly.Blocks["pxt.widget.superchart.setValue"] = {
    init: function () {
        this.setColour(Toolbox_App);
        this.widget = "STREAM";
        this.blockType = "widget.set";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput("MAIN")
            .appendField(png("CHART"))
            .appendField(new Blockly.FieldDropdown(getListWidget(this)), "WIDGETNAME")
            .appendField("plot");
        this.appendValueInput("VALUE");
    }
}

// Blockly.Blocks["pxt.widget.superchart.channel.declare"] = {
//     init: function () {
//         this.setColour(Toolbox_App);
//         this.widget = "SUPERCHART";
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//         this.inputsInline = false;
//         this.appendValueInput("WIDGETNAME")
//             .appendField("create")
//             .appendField(png("CHART"))
//             .appendField('with name');
//         // this.appendDummyInput("CONFIG1")
//         //     .appendField("Orientation : ")
//         //     .appendField(new Blockly.FieldDropdown([
//         //         ["HORIZONTAL", "HORIZONTAL"],
//         //         ["VERTICAL", "VERTICAL"]
//         //     ]), "MODE");
//         this.appendDummyInput("CONFIG2")
//             .appendField("Dimension:")
//             .appendField(new Blockly.FieldDropdown([
//                 ["SMALL", "SMALL"],
//                 ["MEDIUM", "MEDIUM"],
//                 ["BIG", "BIG"]
//             ]), "DIMENSION");
//         this.appendValueInput("COLOUR")
//             .appendField("Colour: ");
//         this.appendDummyInput("LABEL")
//             .appendField("Range:")
//             .appendField(new Blockly.FieldNumber(0), "min")
//             // .appendField("OFF:")
//             .appendField("to")
//             .appendField(new Blockly.FieldNumber(100), "max");
//         this.setOnChange(function (change) {
//             assignWidgetName(this,change);changeHandle(this, change);
//         });
//     }
// }