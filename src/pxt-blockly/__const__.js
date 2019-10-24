var Toolbox_Input = '#d65cd6';
var Toolbox_Sensor = "#d65cd6";
var Toolbox_Control = "#f55d3e";
var Toolbox_Output = '#f55d3e';
var Toolbox_Display = '#4c97ff';
var Toolbox_Network = '#e3008c';
var Toolbox_Timer = '#107c10';
var Toolbox_Loops = '#40bf4a';
var Toolbox_Logic = '#4cbfe6';
var Toolbox_Variables = '#ff6680';
var Toolbox_Math = 230; //'#9966ff';
var Toolbox_Text = '#ffab19';
var Toolbox_List = '#8a1c7c';
var Toolbox_Function = '#005a9e';
var Toolbox_Blynk = Toolbox_Network; //'#22bd89';
var Toolbox_Advanced = '#00272b';
var Toolbox_Warning = '#000000';
var Toolbox_App = '#22bd89';

var CONST_LISTTIMES = [
   ['1 time', '1'],
   ['2 times', '2'],
   ['3 times', '3'],
   ['4 times', '4'],
   ['5 times', '5'],
];

var _supported_port = ['PORT1', 'PORT2', 'PORT3', 'PORT4', 'PORT5', 'PORT6', 'PORT7', 'PORT8', ]

var BLYNK_SUPPORTED_CHANNELS = [];
for (var index = 0; index < 128; index++) {
   BLYNK_SUPPORTED_CHANNELS.push(['V' + String(index), String(index)]);
}

var SUPPORTED_MODULE = [];
var _supported_module = ["BUTTON", "SOUND", "POTENTIOMETER", "WEATHER", "LIGHT", "MOTION", "DISTANCE", "MOISTURE", "REMOTE",
   "PIXEL", "RELAY", "BUZZER", "INFRARED", "SERVO", "LCD"
];
for (var index = 0; index < _supported_module.length; index++) {
   SUPPORTED_MODULE.push([_supported_module[index], _supported_module[index]])
}

// BUZZER
var buzzer_notelist = {
   "c": 1915,
   "d": 1700,
   "e": 1519,
   "f": 1432,
   "g": 1275,
   "a": 1136,
   "b": 1014,
   "C": 956,
   "D": 850,
   "E": 759,
   "F": 716,
   "G": 637,
   "A": 568
};
var buzzer_note = [
   ["DO", "523"],
   ["RE", "587"],
   ["MI", "659"],
   ["FA", "698"],
   ["SON", "783"],
   ["LA", "880"],
   ["SI", "987"]
];


goog.require('Blockly.Msg')
Blockly.Msg['TOOLBOX_INPUT'] = '#922492';
Blockly.Msg['TOOLBOX_OUTPUT'] = '#911f07';
Blockly.Msg['TOOLBOX_DISPLAY'] = '#0045a5';
Blockly.Msg['TOOLBOX_INPUT_SOURCE'] = Toolbox_Input;
Blockly.Msg['TOOLBOX_OUTPUT_SOURCE'] = Toolbox_Output;
Blockly.Msg['TOOLBOX_DISPLAY_SOURCE'] = Toolbox_Display;
Blockly.Msg['TOOLBOX_APP'] = Toolbox_App;
Blockly.Msg['TOOLBOX_TIMER'] = Toolbox_Timer;
Blockly.Msg['TOOLBOX_NETWORK'] = Toolbox_Network;
Blockly.Msg['TOOLBOX_NETWORK_DARK'] = '#9e0062';
Blockly.Msg['TOOLBOX_APP_DARK'] = '#17845f';
Blockly.Msg['TOOLBOX_APP_DARKER'] = '#0b422f';
Blockly.Msg['TOOLBOX_APP'] = '#22bd89';



var controller_port_assign = {};
for (var index = 0; index < _supported_port.length; index++) {
   controller_port_assign[_supported_port[index]] = null;
}