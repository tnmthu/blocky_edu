goog.require('Blockly')

Blockly.Python['pxt.dropdown.onoff'] = function (block) {
    // __import__('import constants');
    var state = block.getFieldValue('STATE');
    return [state, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['pxt.dropdown.timeselect'] = function (block) {
    var time = block.getFieldValue('TIME');
    return [time, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['pxt.array.listAttributes'] = function (block) {
    // Create a list with any number of elements of any type.
    var elements = new Array(block.itemCount_);
    for (var i = 0; i < block.itemCount_; i++) {
        elements[i] = Blockly.Python.valueToCode(block, 'ADD' + i,
            Blockly.Python.ORDER_NONE) || 'None';
    }
    var code = '[' + elements.join(', ') + ']';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['pxt.field.angle'] = function (block) {
    return ''
}
Blockly.Python['pxt.onStart'] = function (block) {
    var code = 'async def main():\n';
    var usercode = Blockly.Python.statementToCode(block, 'CODE');
    if (usercode.length == 0) usercode = Blockly.Python.INDENT + 'pass';
    code += usercode;
    __once__(code);
    return '';
}
Blockly.Python['pxt.core.portDeclare'] = function (block) {
    var module = block.getFieldValue('MODULE');

    var port = block.getFieldValue('PORT');
    __import__('import ' + module.toLowerCase());
    __declare__(port + ' = ' + module.toLowerCase() + '.' + module.slice(0, 1) + module.substring(1).toLowerCase() + '(' + 'board.' + port + ')');
    return '';
}

Blockly.Python['pxt.widgetDeclare'] = function (block) {
    return;
}
Blockly.Python['pxt.widget.superchart.declareChannel'] = function (block) {
    return;
}
Blockly.Python['pxt.widget.button.onPress'] = function (block) {
    return;
}
Blockly.Python['pxt.widget.button.onRelease'] = function (block) {
    return;
}

Blockly.Python['pxt.button.onClick'] = function (block) {
    var code = Blockly.Python.statementToCode(block, 'CODE');
    var obj = block.getFieldValue('PORT');
    var times = block.getFieldValue('TIMES');

    var functionName = addFormulae(
        object = obj,
        attributes = ['onClick', times],
        code = code,
        declareParams = [],
        callerParams = [
            ['time', times]
        ],
        callerMethod = 'onClick',
        ref = block
    );

    return "";
}
Blockly.Python['pxt.button.getState'] = function (block) {
    // var port = block.getFieldValue('PORT');
    // var code = port + '.' + 'isPressed()';  
    // return [code,Blockly.Python.ORDER_ATOMIC];
    var port = block.getFieldValue('PORT');
    return [port + '.isPressed()', Blockly.Python.ORDER_ATOMIC]

}
Blockly.Python['pxt.clap.onClap'] = function (block) {
    var code = Blockly.Python.statementToCode(block, 'CODE');
    var obj = block.getFieldValue('PORT');
    var times = block.getFieldValue('TIMES');

    var functionName = addFormulae(
        object = obj,
        attributes = ['onClap', times],
        code = code,
        declareParams = [],
        callerParams = [
            ['time', times]
        ],
        callerMethod = 'onClap',
        ref = block
    );

    return "";
}
Blockly.Python['pxt.slider.getValue'] = function (block) {
    var port = block.getFieldValue('PORT');
    var code = port + '.' + 'getPosition()';
    return [code, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['pxt.weather.getValue'] = function (block) {
    var port = block.getFieldValue('PORT');
    var mode = block.getFieldValue('MODE');
    mode = mode.slice(0, 1).toUpperCase() + mode.slice(1);
    var code = port + '.' + 'get' + mode + '()';
    return [code, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['pxt.light.getValue'] = function (block) {
    var port = block.getFieldValue('PORT');
    var code = port + '.' + 'getLight()';
    return [code, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['pxt.motion.onDetect'] = function (block) {
    var code = Blockly.Python.statementToCode(block, 'CODE');
    var obj = block.getFieldValue('PORT');
    // var times = block.getFieldValue('TIMES');

    var functionName = addFormulae(
        object = obj,
        attributes = ['onDetectMotion'],
        code = code,
        declareParams = [],
        callerParams = [],
        callerMethod = 'onDetectMotion',
        ref = block
    );
    return "";
}
Blockly.Python['pxt.distance.getValue'] = function (block) {
    var port = block.getFieldValue('PORT');
    var code = port + '.' + 'getDistance()';
    return [code, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['pxt.moisture.getValue'] = function (block) {
    var port = block.getFieldValue('PORT');
    var code = port + '.' + 'getMoisture()';
    return [code, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['pxt.remote.onPress'] = function (block) {
    var code = Blockly.Python.statementToCode(block, 'CODE');
    var obj = block.getFieldValue('PORT');
    var mode = block.getFieldValue('MODE');

    var functionName = addFormulae(
        object = obj,
        attributes = ['onPress', mode],
        code = code,
        declareParams = [],
        callerParams = [
            ['mode', '"' + mode + '"']
        ],
        callerMethod = 'onPress',
        ref = block
    );
    return "";
}
Blockly.Python['pxt.relay.setValue'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.turn(' + state + ')' + '\n';
}
Blockly.Python['pxt.buzzer.setValue'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.turn(' + state + ')' + '\n';
}
Blockly.Python['pxt.buzzer.beep'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.beep(' + state + ')' + '\n';
}
Blockly.Python['pxt.buzzer.playMelody'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.play(' + state + ')' + '\n';
}
Blockly.Python['pxt.buzzer.playNote'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
    alert('Play note');
    return port + '.playNote(' + state + ')' + '\n';
}
Blockly.Python['pxt.buzzer.playFrequency'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.playFrequency(' + state + ')' + '\n';
}
Blockly.Python['pxt.pixel.setColour'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.turn(' + state + ')' + '\n';
}
Blockly.Python['pxt.infrared.learn'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.learn(' + state + ')' + '\n';
}
Blockly.Python['pxt.infrared.send'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.send(' + state + ')' + '\n';
}
Blockly.Python['pxt.servo.setAngle'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.angle(' + state + ')' + '\n';
}
Blockly.Python['pxt.lcd.backlight'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return port + '.backlight(' + state + ')' + '\n';
}
Blockly.Python['pxt.lcd.clear'] = function (block) {
    var port = block.getFieldValue('PORT');
    var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
    state = 'lcd.' + state;
    return port + '.clear(' + state + ')' + '\n';
}
Blockly.Python['pxt.lcd.display'] = function (block) {
    var port = block.getFieldValue('PORT');
    var left = Blockly.Python.valueToCode(block, 'LEFT', Blockly.Python.ORDER_ATOMIC);
    var right = Blockly.Python.valueToCode(block, 'RIGHT', Blockly.Python.ORDER_ATOMIC);
    var line = 'lcd.' + block.getFieldValue('LINE');


    var code = port + '.display(' + line + ', left=' + left + ',right=' + right + ')\n';
    return code;
}
Blockly.Python['pxt.blynk.onReceive'] = function (block) {
    var code = Blockly.Python.statementToCode(block, 'CODE');
    var channel = 'V' + block.getFieldValue('CHANNEL');

    // var mode = block.getFieldValue('MODE');

    var functionName = addFormulae(
        object = 'blynk',
        attributes = ['onReceive', channel],
        code = code,
        declareParams = ["message"],
        callerParams = [
            ['channel', '"' + channel + '"']
        ],
        callerMethod = 'onReceive',
        ref = block,
        callbackKeyword = "task"
    );
    __import__("import blynk");
    return "";
}
Blockly.Python['pxt.blynk.onRequest'] = function (block) {
    var code = Blockly.Python.statementToCode(block, 'CODE');
    var channel = 'V' + block.getFieldValue('CHANNEL');

    // var mode = block.getFieldValue('MODE');

    var functionName = addFormulae(
        object = 'blynk',
        attributes = ['onRequest', channel],
        code = code,
        declareParams = [],
        callerParams = [
            ['channel', '"' + channel + '"']
        ],
        callerMethod = 'onRequest',
        ref = block
    );
    __import__("import blynk");
    return "";
}
Blockly.Python['pxt.blynk.virtualWrite'] = function (block) {
    var channel = '"V' + block.getFieldValue('CHANNEL') + '"';
    var data = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
    var target = '"' + block.getFieldValue('DEST') + '"';
    if (data.length == 0) return '';
    var code = 'await blynk.virtualWrite(channel = ' + channel + ', target = ' + target + ', data = ' + data + ')\n';
    return code;
}
Blockly.Python['pxt.blynk.notify'] = function (block) {
    var data = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
    __import__("import blynk");

    return 'await blynk.notify(' + data + ')\n';
}
Blockly.Python['pxt.blynk.email'] = function (block) {
    var email = Blockly.Python.valueToCode(block, 'EMAIL', Blockly.Python.ORDER_ATOMIC);
    var subject = Blockly.Python.valueToCode(block, 'SUBJECT', Blockly.Python.ORDER_ATOMIC);
    var content = Blockly.Python.valueToCode(block, 'CONTENT', Blockly.Python.ORDER_ATOMIC);
    var code = 'await blynk.email(email=' + email + ', subject=' + subject +
        ', content=' + content + ')\n';
    __import__("import blynk");
    return code;
}
Blockly.Python['pxt.blynk.log'] = function (block) {
    var message = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
    __import__("import blynk");
    return "await blynk.log(" + message + ')\n';
}

Blockly.Python['pxt.blynk.getMessage'] = function (block) {
    var code = "";
    code = "message";
    __import__("import blynk");
    return [code, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['pxt.timer.createTask'] = function (block) {
    var time = block.getFieldValue('TIME');
    var code = Blockly.Python.statementToCode(block, "CODE");

    addFormulae(
        object = 'coroutine',
        attributes = ['task', 'every', time],
        code = code,
        declareParams = [],
        callerParams = [
            ['interval', time]
        ],
        callerMethod = 'createTask',
        ref = block,
        callbackKeyword = "task"
    )
    __import__("import coroutine\n");

    return "";
}
Blockly.Python['pxt.timer.wait'] = function (block) {
    var time = Blockly.Python.valueToCode(block, "MAIN", Blockly.Python.ORDER_ATOMIC);
    var code = "await coroutine.wait(" + String(time) + ')\n';
    return code;
}
Blockly.Python['pxt.timer.runtime'] = function (block) {
    var mode = block.getFieldValue('MODE');
    var code = "";
    if (mode == 'ms') {
        code = 'system.runtime()';
    } else if (mode == 's') {
        code = "system.runtime('second')//60";

    } else if (mode == 'm') {
        code = "system.runtime('minute')";
    } else if (mode == 'h') {
        code = "system.runtime('hour')";
    } else {

    }
    __import__("import system");
    return [code, Blockly.Python.ORDER_ATOMIC];
}


Blockly.Python['pxt.core.widgetDeclare'] = function (block) {

}
Blockly.Python['pxt.ifttt.setKey'] = function (block) {
    var key = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);

    return 'ifttt.setKey(' + key + ')\n';
}
Blockly.Python['pxt.ifttt.trigger'] = function (block) {
    var event = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
    return 'await ifttt.trigger(' + event + ')\n';
}
Blockly.Python['pxt.timer.createAlarm'] = function (block) {
    alert('not supported')
}
Blockly.Python['pxt.csv.newData'] = function (block) {
    alert('not supported')
}
Blockly.Python['pxt.csv.setDataField'] = function (block) {
    alert('not supported')
}
Blockly.Python['pxt.csv.createFile'] = function (block) {
    alert('not supported')
}
Blockly.Python['pxt.app.setProjectColour'] = function (block) {
    alert('not supported')
}
Blockly.Python['pxt.app.createWidget'] = function (block) {
    alert('not supported')
}
Blockly.Python['pxt.app.button.setMode'] = function (block) {
    alert('not supported')
}
Blockly.Python['pxt.app.button.onEvent'] = function (block) {
    alert('not supported')
}
Blockly.Python['pxt.xpath.requestData'] = function (block) {
    __import__('import xpath\n');
    var url = Blockly.Python.valueToCode(block, 'URL', Blockly.Python.ORDER_ATOMIC);
    // var xpath = Blockly.Python.valueToCode(block, 'RESULT', Blockly.Python.ORDER_ATOMIC);
    var xpath = block.getFieldValue("RESULT");
    console.warn('xpathaValue', xpath);
    var code = "await xpath.get(url=" + url + ",xpath='" + xpath + "')";
    return [code, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['pxt.gtts.say'] = function (block) {
    var code = 'await speech.say(';
    __import__('import speech\n');
    for (var i = 0; i < 100; i++) {
        if (this.getInput('ADD' + i)) {
            console.log('getInput');
            code += Blockly.Python.valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_ATOMIC);
            code += ','
        } else {
            // delete the last comma :))
            code = code.substring(0, code.length - 1);
            break;
        };
    }


    code += ')\n';

    return code;

}



Blockly.Python["pxt.widget.button.onEvent"] = function (block) {
    var channel = getCorrespondingChannel(block.getFieldValue("WIDGETNAME"));
    var code = Blockly.Python.statementToCode(block, 'CODE');
    var mode = block.getFieldValue("MODE");
    // var channel = 'V' + block.getFieldValue('CHANNEL');
    __import__("import blynk");
    // var mode = block.getFieldValue('MODE');
    var modeValue = "";
    if (mode == "PRESS") modeValue = "1";
    if (mode == "RELEASE") modeValue = "0";
    var functionName = addFormulae(
        object = 'blynk',
        attributes = ['onReceive', channel, mode],
        code = code,
        declareParams = ["value"],
        callerParams = [
            ['channel', '"' + channel + '"'],
            ["filter", "[" + modeValue + "]"]
        ],
        callerMethod = 'onReceive',
        ref = block,
        callbackKeyword = "task"
    );
    return "";

}


/* @ueh-interview 20people result
    This getValue type of block is a bit tricky to implement
    For widget that only output HIGH or LOW , ( Button , Options )
        We should use event shape 
    For widget that has a range of value , use a output block
    BUT:
        That is not how the server work, you can't polling it constantly
        therefore, a simple solution to this is to add argument to blynk
        
        blynk.database["V100"] => this wil store it
        But , you must tell blynk to 

        # Blynk only store data for channel from 0 to 200 , 200 -> 250 is reserved , 250 -> 255 is forbidden

*/
Blockly.Python["pxt.widget.slider.getValue"] = function (block) {
    var channel = getCorrespondingChannel(block.getFieldValue("WIDGETNAME"));
    __import__("import blynk");
    return ['await blynk.getValue("' + channel + '")', Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python["pxt.widget.step.getValue"] = function (block) {
    var channel = getCorrespondingChannel(block.getFieldValue("WIDGETNAME"));
    __import__("import blynk");
    return ['await blynk.getValue("' + channel + '")', Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python["pxt.widget.joystick.getValue"] = function (block) {
    var channel = getCorrespondingChannel(block.getFieldValue("WIDGETNAME"));
    __import__("import blynk");
    var axis = block.getFieldValue("AXIS");
    axis = (axis == "X") ? "0" : "1";
    return ['await blynk.getValue("' + channel + '")[' + axis + ']', Blockly.Python.ORDER_ATOMIC];
}


// Display Widgets Group
Blockly.Python["pxt.widget.number.setValue"] = function (block) {
    var channel = getCorrespondingChannel(block.getFieldValue("WIDGETNAME"));
    var value = Blockly.Python.valueToCode(block, "VALUE", Blockly.Python.ORDER_ATOMIC);
    __import__("import blynk");

    return 'await blynk.send(channel="' + channel + '",value=' + value + ")\n";

}
Blockly.Python["pxt.widget.gauge.setValue"] = function (block) {
    var channel = getCorrespondingChannel(block.getFieldValue("WIDGETNAME"));
    var value = Blockly.Python.valueToCode(block, "VALUE", Blockly.Python.ORDER_ATOMIC);
    __import__("import blynk");

    return 'await blynk.send(channel="' + channel + '",value=' + value + ")\n";

}
Blockly.Python["pxt.widget.terminal.setValue"] = function (block) {
    var channel = getCorrespondingChannel(block.getFieldValue("WIDGETNAME"));
    var value = Blockly.Python.valueToCode(block, "VALUE", Blockly.Python.ORDER_ATOMIC);
    __import__("import blynk");

    return 'await blynk.send(channel="' + channel + '",value=' + value + ")\n";

}

// Still under debate : What is LED : multicolor or fade ?
Blockly.Python["pxt.widget.led.setValue"] = function (block) {
    __import__("import blynk");
    __import__("import color");
    var channel = getCorrespondingChannel(block.getFieldValue("WIDGETNAME"));
    var value = Blockly.Python.valueToCode(block, "VALUE", Blockly.Python.ORDER_ATOMIC);

    return 'await blynk.setProperty(channel="' + channel + '",field="color",value = color.hexToInt(' + value + '))\n';

}

Blockly.Python["pxt.widget.superchart.setValue"] = function (block) {
    var channel = getCorrespondingChannel(block.getFieldValue("WIDGETNAME"));
    var value = Blockly.Python.valueToCode(block, "VALUE", Blockly.Python.ORDER_ATOMIC);
    __import__("import blynk");

    return 'await blynk.send(channel="' + channel + '",value=' + value + ")\n";

}
Blockly.Python["pxt.math.map"] = function (block) {
    __import__("import math");
    var fromlow = Blockly.Python.valueToCode(block, "FROMLOW", Blockly.Python.ORDER_ATOMIC);
    var fromhigh = Blockly.Python.valueToCode(block, "FROMHIGH", Blockly.Python.ORDER_ATOMIC);
    var tolow = Blockly.Python.valueToCode(block, "TOLOW", Blockly.Python.ORDER_ATOMIC);
    var tohigh = Blockly.Python.valueToCode(block, "TOHIGH", Blockly.Python.ORDER_ATOMIC);
    var num = Blockly.Python.valueToCode(block, "NUM", Blockly.Python.ORDER_ATOMIC);

    var code = "math.translate(" + num + ",[" + fromlow + "," + fromhigh + "],[" + tolow + "," + tohigh + "])";
    return [code, Blockly.Python.ORDER_ATOMIC];
}

// consistency check, production 
var listPython = [];
for (let [block, f] of Object.entries(Blockly.Python)) {
    listPython.push(block)
}
for (let [block, f] of Object.entries(Blockly.Blocks)) {
    if (listPython.indexOf(block) == -1) {
        if (block.includes('pxt'))
            console.warn('generator not defined', block);
        Blockly.Python[block] = function (b) {
            return ""
        };
    }
}