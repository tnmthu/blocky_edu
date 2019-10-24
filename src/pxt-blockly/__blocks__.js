goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldString');
goog.require('Blockly');


/*                      HELPER.BLOCKS                        */
Blockly.Blocks['pxt.dropdown.onoff'] = {
    init: function () {
        // this.setColour ( Toolbox_Control );
        this.appendDummyInput('M')
            .appendField(new Blockly.FieldDropdown([
                ['ON', 'ON'],
                ['OFF', 'OFF']
            ]), 'STATE');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
        this.setOutput(true, 'Boolean');
        this.setOnChange(
            function (change) {
                if (true) {
                    Blockly.Events.disable();
                    if (this.getFieldValue('STATE') == 'ON') {
                        this.setColour('#1b976d')

                    } else {
                        this.setColour('#7a776b');
                    }
                    Blockly.Events.enable();
                }
            }
        );
    }
}


Blockly.Blocks['pxt.array.listAttributes'] = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function () {
        Blockly.Extensions.apply('inline-svgs', this, false);
        this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
        this.setColour(Blockly.Msg.LISTS_HUE);
        this.itemCount_ = 1;
        this.updateShape_();
        this.setOutput(true, 'Array');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setInputsInline(true);
        //this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
        this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
    },
    /**
     * Create XML to represent list inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },

    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    // pxtblockly: Removing the cogwheel for array with
    // decompose: function(workspace) {
    //   var containerBlock = workspace.newBlock('lists_create_with_container');
    //   containerBlock.initSvg();
    //   var connection = containerBlock.getInput('STACK').connection;
    //   for (var i = 0; i < this.itemCount_; i++) {
    //     var itemBlock = workspace.newBlock('lists_create_with_item');
    //     itemBlock.initSvg();
    //     connection.connect(itemBlock.previousConnection);
    //     connection = itemBlock.nextConnection;
    //   }
    //   return containerBlock;
    // },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    // pxtblockly: Removing the cogwheel for array with
    // compose: function(containerBlock) {
    //   var itemBlock = containerBlock.getInputTargetBlock('STACK');
    //   // Count number of inputs.
    //   var connections = [];
    //   while (itemBlock) {
    //     connections.push(itemBlock.valueConnection_);
    //     itemBlock = itemBlock.nextConnection &&
    //         itemBlock.nextConnection.targetBlock();
    //   }
    //   // Disconnect any children that don't belong.
    //   for (var i = 0; i < this.itemCount_; i++) {
    //     var connection = this.getInput('ADD' + i).connection.targetConnection;
    //     if (connection && connections.indexOf(connection) == -1) {
    //       connection.disconnect();
    //     }
    //   }
    //   this.itemCount_ = connections.length;
    //   this.updateShape_();
    //   // Reconnect any child blocks.
    //   for (var i = 0; i < this.itemCount_; i++) {
    //     Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    //   }
    // },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    // saveConnections: function(containerBlock) {
    //   var itemBlock = containerBlock.getInputTargetBlock('STACK');
    //   var i = 0;
    //   while (itemBlock) {
    //     var input = this.getInput('ADD' + i);
    //     itemBlock.valueConnection_ = input && input.connection.targetConnection;
    //     i++;
    //     itemBlock = itemBlock.nextConnection &&
    //         itemBlock.nextConnection.targetBlock();
    //   }
    // },
    /**
     * Store pointers to any connected child blocks.
     */
    storeConnections_: function () {
        this.valueConnections_ = [];
        for (var i = 0; i < this.itemCount_; i++) {
            this.valueConnections_.push(this.getInput('ADD' + i).connection.targetConnection);
        }
    },
    restoreConnections_: function () {
        for (var i = 0; i < this.itemCount_; i++) {
            Blockly.Mutator.reconnect(this.valueConnections_[i], this, 'ADD' + i);
        }
    },
    addItem_: function () {
        this.storeConnections_();
        var update = function () {
            this.itemCount_++;
        };
        this.update_(update);
        this.restoreConnections_();
        // Add shadow block
        if (this.itemCount_ > 1) {
            // Find shadow type
            var firstInput = this.getInput('ADD' + 0);
            if (firstInput && firstInput.connection.targetConnection) {
                // Create a new shadow DOM with the same type as the first input
                // but with an empty default value
                var newInput = this.getInput('ADD' + (this.itemCount_ - 1)); // last input
                var shadowInputDom = firstInput.connection.getShadowDom();
                if (shadowInputDom) {
                    var shadowDom = document.createElement('shadow');
                    var shadowInputType = shadowInputDom.getAttribute('type');
                    shadowDom.setAttribute('type', shadowInputType);
                    var shadowDomField = document.createElement('field');
                    shadowDomField.setAttribute('name', 'NUM');
                    shadowDom.appendChild(shadowDomField);
                    if (shadowDom) {
                        shadowDom.setAttribute('id', Blockly.utils.genUid());
                        newInput.connection.setShadowDom(shadowDom);
                        newInput.connection.respawnShadow_();
                    }
                }
            }
        }
    },
    removeItem_: function () {
        this.storeConnections_();
        var update = function () {
            this.itemCount_--;
        };
        this.update_(update);
        this.restoreConnections_();
    },
    update_: function (update) {
        Blockly.Events.setGroup(true);
        var block = this;
        var oldMutationDom = block.mutationToDom();
        var oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);
        // Switch off rendering while the source block is rebuilt.
        var savedRendered = block.rendered;
        block.rendered = false;
        // Update the mutation
        if (update) update.call(this);
        // Allow the source block to rebuild itself.
        this.updateShape_();
        // Restore rendering and show the changes.
        block.rendered = savedRendered;
        // Mutation may have added some elements that need initializing.
        block.initSvg();
        // Ensure that any bump is part of this mutation's event group.
        var group = Blockly.Events.getGroup();
        var newMutationDom = block.mutationToDom();
        var newMutation = newMutationDom && Blockly.Xml.domToText(newMutationDom);
        if (oldMutation != newMutation) {
            Blockly.Events.fire(new Blockly.Events.BlockChange(
                block, 'mutation', null, oldMutation, newMutation));
            setTimeout(function () {
                Blockly.Events.setGroup(group);
                block.bumpNeighbours_();
                Blockly.Events.setGroup(false);
            }, Blockly.BUMP_DELAY);
        }
        if (block.rendered) {
            block.render();
        }
        Blockly.Events.setGroup(false);
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        var that = this;
        var add = function () {
            that.addItem_();
        };
        var remove = function () {
            that.removeItem_();
        };
        if (this.itemCount_) {
            if (this.getInput('EMPTY')) this.removeInput('EMPTY');
            if (!this.getInput('TITLE')) {
                this.appendDummyInput('TITLE')
                    .appendField(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH);
            }
        } else {
            if (this.getInput('TITLE')) this.removeInput('TITLE');
            if (!this.getInput('EMPTY')) {
                this.appendDummyInput('EMPTY')
                    .appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
            }
        }
        var i = 0;
        // Add new inputs.
        for (i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('ADD' + i)) {

                var parentConnection = this.appendValueInput('ADD' + i).connection;

                var newTextBlock = this.workspace.newBlock('text');

                var childConnection = newTextBlock.outputConnection;

                // parentConnection = newTextBlock.nextConnection;
                // newTextBlock.initSvg();
                newTextBlock.initSvg();
                newTextBlock.render();
                parentConnection.connect(childConnection);

            }
        }
        // Remove deleted inputs.
        while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
        }
        if (this.getInput('BUTTONS')) this.removeInput('BUTTONS');
        var buttons = this.appendDummyInput('BUTTONS');
        if (this.itemCount_ > 0) {
            buttons.appendField(new Blockly.FieldImage(this.REMOVE_IMAGE_DATAURI, 24, 24, false, "*", remove));
        }
        buttons.appendField(new Blockly.FieldImage(this.ADD_IMAGE_DATAURI, 24, 24, false, "*", add));

        /* Switch to vertical list when the list is too long */
        var showHorizontalList = this.itemCount_ <= 5;
        this.setInputsInline(showHorizontalList);
        this.setOutputShape(showHorizontalList ?
            Blockly.OUTPUT_SHAPE_ROUND : Blockly.OUTPUT_SHAPE_SQUARE);
    }
};

Blockly.Blocks['lists_create_with_container'] = {
    /**
     * Mutator block for list container.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(Blockly.Msg.LISTS_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD);
        this.appendStatementInput('STACK');
        this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['pxt.dropdown.timeselect'] = {
    init: function () {
        this.setColour('#ffffff');

        this.appendDummyInput('M')
            .appendField(new Blockly.FieldNumberDropdown(1, [
                ['200 ms', '0.2'],
                ['500 ms', '0.5'],
                ['1 second', '1'],
                ['5 seconds', '5'],
                ['1 minutes', '60']
            ]), 'TIME');

        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true, 'Number');
    }
}
Blockly.Blocks['pxt.field.angle'] = {
    init: function () {
        // this.setColour ( Toolbox_Control );
        this.appendDummyInput('M')
            .appendField(new Blockly.FieldAngle(90), 'STATE');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
        this.setOutput(true, 'Number');
    }
}


/*                      CORE                       */
Blockly.Blocks['pxt.onStart'] = {
    init: function () {
        this.setColour(Toolbox_Timer);
        this.appendDummyInput('MAIN')
            .appendField('on start');
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            codelab.workspace = this.workspace;
            // Blockly.Events.disableOrphans(change);

            changeHandle(this, change);
            if (change.blockId == this.id && change.type == Blockly.Events.CREATE) {
                this.workspace.zoomCenter(-1);
                //:: Update the user profile ::/
            }
        });
    }
};
Blockly.Blocks['pxt.core.portDeclare'] = {
    init: function () {
        this.setColour(Toolbox_Blynk);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.parentBlock = ['pxt.onStart'];
        this.blockType = 'set.unique';
        this.contextMenu = false; // #TODO , diabled the dropdown menu when use right click, => can't duplicate
        this.appendDummyInput('MAIN')
            .appendField(png('CONTROLLER'))
            .appendField('connect')
            .appendField(new Blockly.FieldDropdown(SUPPORTED_MODULE), 'MODULE')
            .appendField('to')
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};

/*                      INPUT.BUTTON                        */
Blockly.Blocks['pxt.button.onClick'] = {
    init: function () {
        this.library = "button";
        this.blockType = 'event.unique';
        this.module = 'BUTTON';
        this.setColour(Toolbox_Input);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))

            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('press')
            .appendField(new Blockly.FieldDropdown(CONST_LISTTIMES), 'TIMES');
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};
Blockly.Blocks['pxt.button.getState'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = "button";
        this.module = 'BUTTON';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
        this.setOutput(true, 'Boolean');
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('is')
            .appendField(new Blockly.FieldDropdown(
                [
                    ['pressed', 'pressed'],
                    ['released', 'released']
                ]
            ), 'MODE')
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

/*                      INPUT.SOUND                        */
Blockly.Blocks['pxt.sound.onClap'] = {
    init: function () {
        this.blockType = 'event.unique';
        this.library = "sound";
        this.module = 'SOUND';
        this.setColour(Toolbox_Input);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))

            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('clap')
            .appendField(new Blockly.FieldDropdown(CONST_LISTTIMES), 'TIMES');
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};


/*                      INPUT.SLIDER                        */
Blockly.Blocks['pxt.slider.getValue'] = {
    init: function () {
        this.blockType = 'get.normal';
        this.library = "slider";
        this.module = 'SLIDER';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true, 'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
        // .appendField('get value')
        // .appendField(new Blockly.FieldDropdown(
        //     [
        //         ['percentage' , 'percentage'],
        //         ['analog' , 'analog']
        //     ]
        // ) , 'MODE')
        ;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

/*                      INPUT.POTENTIOMETER                        */
Blockly.Blocks['pxt.weather.getValue'] = {
    init: function () {
        this.blockType = 'get.normal';
        this.library = "weather";
        this.module = 'WEATHER';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true, 'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            // .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            // .appendField('get value')
            .appendField(new Blockly.FieldDropdown(
                [
                    ['temperature', 'temperature'],
                    ['humidity', 'humidity']
                ]
            ), 'MODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

/*                      INPUT.LIGHT                        */
Blockly.Blocks['pxt.light.getValue'] = {
    init: function () {
        this.blockType = 'get.normal';
        this.module = 'LIGHT';
        this.library = "light";
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true, 'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
        // .appendField('get value')
        // .appendField(new Blockly.FieldDropdown(
        //     [
        //         ['temperature' , 'temperature'],
        //         ['humidity' , 'humidity']
        //     ]
        // ) , 'MODE')
        ;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

/*                      INPUT.MOTION                        */
Blockly.Blocks['pxt.motion.onDetect'] = {
    init: function () {
        this.blockType = 'event.unique';
        this.module = 'MOTION';
        this.setColour(Toolbox_Input);
        this.library = "motion";
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('detect motion')
        // .appendField(new Blockly.FieldDropdown(CONST_LISTTIMES) , 'TIMES')
        ;
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};

/*                      INPUT.DISTANCE                        */
Blockly.Blocks['pxt.distance.getValue'] = {
    init: function () {
        this.blockType = 'get.normal';
        this.library = "distance";
        this.module = 'DISTANCE';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true, 'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
        // .appendField('get value')
        // .appendField(new Blockly.FieldDropdown(
        //     [
        //         ['temperature' , 'temperature'],
        //         ['humidity' , 'humidity']
        //     ]
        // ) , 'MODE')
        ;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

/*                      INPUT.MOISTURE                        */
Blockly.Blocks['pxt.moisture.getValue'] = {
    init: function () {
        this.blockType = 'get.normal';
        this.module = 'MOISTURE';
        this.library = "moisture";
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true, 'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
        // .appendField('get value')
        // .appendField(new Blockly.FieldDropdown(
        //     [
        //         ['temperature' , 'temperature'],
        //         ['humidity' , 'humidity']
        //     ]
        // ) , 'MODE')
        ;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}


/*                      INPUT.REMOTE                        */
Blockly.Blocks['pxt.remote.onPress'] = {
    init: function () {
        this.blockType = 'event.unique';
        this.module = 'REMOTE';
        this.library = "remote";
        this.setColour(Toolbox_Input);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('press button')
            // .appendField(new Blockly.FieldDropdown(CONST_LISTTIMES) , 'TIMES')
            .appendField(new Blockly.FieldDropdown([
                ['A', 'A'],
                ['B', 'B'],
                ['C', 'C'],
                ['D', 'D'],
            ]), 'MODE');
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};

/*                      OUTPUT.RELAY                        */
Blockly.Blocks['pxt.relay.setValue'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = "relay";
        this.module = 'RELAY';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('turn')
            .setCheck('Boolean', 'Number');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

/*                      OUTPUT.BUZZER                        */
Blockly.Blocks['pxt.buzzer.setValue'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = "buzzer";
        this.module = 'BUZZER';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('turn')
            .setCheck('Boolean', 'Number');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.buzzer.beep'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = "buzzer";
        this.module = 'BUZZER';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('beep')
            .setCheck('Number');
        this.appendDummyInput('M').appendField('times');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.buzzer.playMelody'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = "buzzer";
        this.module = 'BUZZER';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('play melody')
            // .setCheck('Boolean')
            .appendField(new Blockly.FieldDropdown([
                ['Happy birthday', 'HAPPY_BIRTHDAY'],
                ['SONG1', 'HAPPY_BIRTHDAY'],
                ['SONG2', 'HAPPY_BIRTHDAY'],
                ['SONG3', 'HAPPY_BIRTHDAY'],
            ]), 'MELODY');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.buzzer.playNote'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = "buzzer";
        this.module = 'BUZZER';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('play note')
            // .setCheck('Boolean')
            .appendField(new Blockly.FieldDropdown([
                ["Middle C", "261"],
                ["Middle C#", "277"],
                ["Middle D", "293"],
                ["Middle D#", "311"],
                ["Middle E", "329"],
                ["Middle F", "349"],
                ["Middle F#", "369"],
                ["Middle G", "392"],
                ["Middle G#", "415"],
                ["Middle A", "440"],
                ["Middle A#", "466"],
                ["Middle B", "493"],
                ["High C", "523"],
                ["High C#", "554"],
                ["High D", "587"],
                ["High D#", "622"],
                ["High E", "659"],
                ["High F", "698"],
                ["High F#", "739"],
                ["High G", "783"],
                ["High G#", "830"],
                ["High A", "880"],
                ["High A#", "932"],
                ["High B", "987"],
                ["Silent", "0"]
            ]), 'NOTE')
            .appendField('for')
            .appendField(new Blockly.FieldDropdown([
                ["4", "3200"],
                ["2", "1600"],
                ["1", "800"],
                ["1/2", "400"],
                ["1/4", "200"],
                ["1/8", "100"],
                ["1/16", "50", ]
            ]), 'BEAT')
            .appendField('beats');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.buzzer.playFrequency'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.module = 'BUZZER';
        this.library = "buzzer";
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('play frequency')
            .setCheck('Number');
        this.appendDummyInput('hz');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

/*                      OUTPUT.PIXEL                        */
Blockly.Blocks['pxt.pixel.setColour'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.module = 'PIXEL';
        this.library = "pixel";
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('turn')
            .setCheck(['Colour', 'Number', 'Boolean']);
        this.appendDummyInput('hz');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

/*                      OUTPUT.INFRARED                        */
Blockly.Blocks['pxt.infrared.learn'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.module = 'INFRARED';
        this.library = "infrared";
        this.parentBlock = ['pxt.button.onClick'];
        this.childBlock = ['text'];
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('learn command as')
            .setCheck(['String']);
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.infrared.send'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.module = 'INFRARED';
        // this.parentBlock = ['pxt.button.onClick'];
        this.childBlock = ['text'];
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('send command')
            .setCheck(['String']);
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}


/*                      OUTPUT.SERVO                        */
Blockly.Blocks['pxt.servo.setAngle'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.module = 'SERVO';
        this.library = "servo";
        // this.parentBlock = ['pxt.button.onClick'];
        // this.childBlock = ['text'];
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('set angle to')
            .setCheck(['Number']);
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}


/*                      DISPLAY.LCD                        */
Blockly.Blocks['pxt.lcd.backlight'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.module = 'LCD';
        this.library = "lcd";
        // this.parentBlock = ['pxt.button.onClick'];
        // this.childBlock = ['text'];
        this.setColour(Toolbox_Display)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('turn backlight')
            .setCheck(['Boolean', 'Number']);
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.lcd.clear'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.module = 'LCD';
        this.library = "lcd";
        // this.parentBlock = ['pxt.button.onClick'];
        // this.childBlock = ['text'];
        this.setColour(Toolbox_Display)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('clear')
            // .setCheck(['Boolean'])
            .appendField(new Blockly.FieldDropdown([
                ['LINE1', 'LINE1'],
                ['LINE2', 'LINE2']
            ]));
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.lcd.display'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.module = 'LCD';
        this.library = "lcd";
        // this.parentBlock = ['pxt.button.onClick'];
        // this.childBlock = ['text'];
        this.setColour(Toolbox_Display)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField('display on')
            .appendField(new Blockly.FieldDropdown([
                ['LINE1', 'LINE1'],
                ['LINE2', 'LINE2']
            ]), 'LINE');
        this.appendValueInput('LEFT')
            // .setCheck(['Boolean'])
            .setCheck(['Number', 'Boolean', 'String']);

        this.appendValueInput('RIGHT')
            // .setCheck(['Boolean'])
            .setCheck(['Number', 'Boolean', 'String']);

        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}


/*                      NETWORK                        */
Blockly.Blocks['pxt.ifttt.setKey'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = 'ifttt';
        this.setColour(Toolbox_Network);
        this.childBlock = 'text';
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png('IFTTT'))
            .appendField('set IFTTT key');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.ifttt.trigger'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = 'ifttt';
        this.setColour(Toolbox_Network);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.childBlock = 'text';
        this.appendValueInput('MAIN')
            .appendField(png('IFTTT'))
            .appendField('trigger event');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.xpath.requestData'] = {
    init: function () {

        this.blockType = 'set.normal';
        this.library = 'xpath';
        this.setColour(Toolbox_Network);
        this.setOutput(true, 'String');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.childBlock = 'text';
        this.inputsInline = false;
        this.appendDummyInput('MAIN')
            .appendField(png('XPATH'))
            .appendField('get data from');
        this.appendValueInput('URL')
            .appendField('url   :');
        this.appendValueInput('XPATH')
            .appendField('filter:');
        this.appendDummyInput('RESULT')
            .appendField('Result : ')
            .appendField(new Blockly.FieldDropdown([
                ['EMPTY', 'EMPTY']
            ]), 'RESULT');
        this.__dict__ = {};
        updateResult = function (result) {
            this.setFieldValue(result, 'result');
        };
        this.setOnChange(function (change) {
            changeHandle(this, change);
            if (change.type == Blockly.Events.CREATE) return;
            // if (change.type != Blockly.Events.CHANGE) lzreturn;
            // note that change is made on text block, not this block
            if (change.blockId != this.getInputTargetBlock("URL").id &&
                change.blockId != this.getInputTargetBlock('XPATH').id) return;


            // if this is a new url enter input
            if (change.type == Blockly.Events.UI &&
                change.element == 'saveEdit' &&
                change.blockId == this.getInputTargetBlock('URL').id) {

                var url = Blockly.Python.valueToCode(this, 'URL', Blockly.Python.ORDER_ATOMIC);
                var queryURL = 'https://blynk.getblocky.com:100/scan?url=';
                // queryURL += encodeURI(url); 
                queryURL += url.slice(1, -1);

                function updatePageDictionary(url, targetBlock) {
                    return fetch(url)
                        .then(response => response.text())
                        .then(response => {
                            targetBlock.__dict__ = JSON.parse(response);
                        })
                }

                updatePageDictionary(queryURL, this);

            }

            if (change.type == Blockly.Events.CHANGE &&
                change.element == 'field' &&
                change.blockId == this.getInputTargetBlock('XPATH').id) {
                // two case, xpath or filter
                // xpath start with '/'
                var xpath = Blockly.Python.valueToCode(this, 'XPATH', Blockly.Python.ORDER_ATOMIC).slice(1, -1);
                var newDropdown = [];
                for (let [text, span] of Object.entries(this.__dict__)) {
                    if (text.toUpperCase().includes(xpath.toUpperCase())) {
                        newDropdown.push([text, span.xpath]);
                    }
                }
                if (newDropdown.length == 0) newDropdown = [
                    ['EMPTY', 'EMPTY']
                ];
                var dropdown = new Blockly.FieldDropdown(newDropdown);
                var pos = this.getInput('RESULT').fieldRow.indexOf(this.getField('RESULT'));
                if (pos > 0) {
                    this.getInput('RESULT').removeField('RESULT');
                    this.getInput('RESULT').insertFieldAt(pos, dropdown, 'RESULT');
                }

            }
        });
    }
}

Blockly.Blocks['pxt.blynk.onReceive'] = {
    init: function () {
        this.blockType = 'event.unique';
        this.library = "blynk";
        this.setColour(Toolbox_Blynk);
        this.appendDummyInput('MAIN')
            .appendField(png("NETWORK"))
            .appendField('when receive from ')
            .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS), 'CHANNEL');
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};
Blockly.Blocks['pxt.blynk.onRequest'] = {
    init: function () {
        this.blockType = 'event.unique'
        this.setColour(Toolbox_Blynk);
        this.library = "blynk";
        this.appendDummyInput('MAIN')
            .appendField(png("NETWORK"))
            .appendField('when get request from ')
            .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS), 'CHANNEL');
        this.appendStatementInput('CODE');
        this.appendValueInput('VALUE')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('send back');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};
Blockly.Blocks['pxt.blynk.virtualWrite'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = "blynk";
        this.setColour(Toolbox_Blynk);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png("NETWORK"))
            .appendField('send to')
            .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS), 'CHANNEL')
            .appendField(new Blockly.FieldDropdown([
                ['APP', 'APP']
            ]), 'DEST');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });

    }
};

Blockly.Blocks['pxt.blynk.notify'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.setColour(Toolbox_Blynk);
        this.library = "blynk";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png("NETWORK"))
            .appendField('notify')
        // .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
        // .appendField(new Blockly.FieldDropdown(['APP','APP']) , 'DEST')
        ;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};
Blockly.Blocks['pxt.blynk.email'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = "blynk";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(Toolbox_Blynk);
        this.appendDummyInput('DUMMY')
            .appendField(png("NETWORK"));
        this.appendValueInput('EMAIL')
            .appendField('email to');
        // .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
        // .appendField(new Blockly.FieldDropdown(['APP','APP']) , 'DEST')
        ;
        this.appendValueInput('SUBJECT').appendField('with subject');
        this.appendValueInput('CONTENT')
            .appendField('with content');
        // .appendField(new Blockly.FieldArgumentEditor('My Content') , 'CONTENT');
        this.inputsInline = false;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};
Blockly.Blocks['pxt.blynk.log'] = {
    init: function () {
        this.blockType = 'set.normal';
        this.library = "blynk";
        this.setColour(Toolbox_Blynk);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png("NETWORK"))
            .appendField('log')
        // .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
        // .appendField(new Blockly.FieldDropdown(['APP','APP']) , 'DEST')
        ;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};
Blockly.Blocks['pxt.blynk.getMessage'] = {
    init: function () {
        this.blockType = 'get.normal';
        this.setColour(Toolbox_Blynk);
        this.library = "blynk";
        this.setOutput(true, ['Number', 'String'])
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.parentBlock = ['pxt.blynk.onRequest', 'pxt.blynk.onReceive'];
        this.appendDummyInput('MAIN')
            .appendField(png("NETWORK"))
            .appendField('message')
        // .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
        // .appendField(new Blockly.FieldDropdown(['APP','APP']) , 'DEST')
        ;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
};

/*                      TIMER                        */
// Blockly.Blocks['pxt.timer.createTask'] = {
//     init : function(){
//         this.blockType = 'event.unique';
//         this.setColour(Toolbox_Timer);
//         this.appendValueInput('MAIN')
//             .appendField('Every')
//             ;
//         this.appendStatementInput('CODE');
//         this.setOnChange(function(change){changeHandle(this,change);});
//     }
// };

Blockly.Blocks['pxt.timer.createTask'] = {
    init: function () {
        this.blockType = 'event.unique';
        this.library = "coroutine";
        this.setColour(Toolbox_Timer);
        //this.setOutput(true,'Number')
        // this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);

        this.appendDummyInput('MAIN')
            .appendField('Every')
            .appendField(new Blockly.FieldNumberDropdown(1, [
                ['200 ms', '0.2'],
                ['500 ms', '0.5'],
                ['1 second', '1'],
                ['5 seconds', '5'],
                ['1 minutes', '60'],


            ]), 'TIME')
            .appendField('seconds');
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });

    }
};
Blockly.Blocks['pxt.timer.wait'] = {
    init: function () {
        this.setColour(Toolbox_Timer);
        this.library = "coroutine";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField('wait')
            .setCheck('Number');
        this.appendDummyInput('DUMMY').appendField('ms');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.timer.runtime'] = {
    init: function () {
        this.setColour(Toolbox_Timer);
        this.library = "system";
        this.setOutput(true, 'Number');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.appendDummyInput('MAIN')
            .appendField('runtime in')
            .appendField(new Blockly.FieldDropdown([
                ["miliseconds", "ms"],
                ["seconds", "s"],
                ['minutes', 'm'],
                ['hours', 'h']
            ]), 'MODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.timer.createAlarm'] = {
    init: function () {
        this.setColour(Toolbox_Timer);

        this.appendDummyInput('MAIN')
            .appendField('Every')
            .appendField(new Blockly.FieldDropdown([
                ["Monday", "Monday"],
                ["Tuesday", "Tuesday"],
                ["Wednesday", "Wednesday"],
                ["Thursday", "Thursday"],
                ["Friday", "Friday"],
                ["Saturday", "Saturday"],
                ["Sunday", "Sunday"],

            ]), 'DATE')
            .appendField("at")
            .appendField(new Blockly.FieldTextInput("7:00"), "TIME");
        this.appendStatementInput('CODE');
    }
}
Blockly.Blocks['pxt.timer.ntp.get'] = {
    init: function () {
        this.setColour(Toolbox_Timer);
        this.library = "calendar";
        this.setOutput(true, 'Number');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.appendDummyInput('MAIN')
            .appendField('current')
            .appendField(new Blockly.FieldDropdown([
                ["year", "year"],
                ["month", "month"],
                ['date', 'date'],
                ['hour', 'hour'],
                ['minute', 'minute'],
                ['second', 'second'],
            ]), 'MODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

/*                      CSV                        */
Blockly.Blocks['pxt.csv.newData'] = {
    init: function () {
        this.setColour('#1d6f42');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png('CSV'))
            .appendField('write to file')
            .appendField(new Blockly.FieldDropdown([
                ['myfile', 'myfile']
            ]), 'FILE');
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }

}
Blockly.Blocks['pxt.csv.setDataField'] = {
    init: function () {
        this.setColour('#1d6f42');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png('CSV'))
            .appendField('set')
            .appendField(new Blockly.FieldDropdown([
                ['temperature', 'temperature'],
                ['humidity', 'humidity']
            ]), 'FIELD')
            .appendField('to');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });

    }
}
Blockly.Blocks['pxt.csv.createFile'] = {
    init: function () {
        this.setColour('#1d6f42');
        this.setPreviousStatement(true);
        this.setInputsInline(false);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png('CSV'))
            .appendField('create new file');
        this.appendValueInput('FILENAME')
            .appendField('file name : ');
        this.appendValueInput('ATTRIBUTES')
            .appendField('headers   : ')
        // .appendField('to');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });

    }
}


Blockly.Blocks['pxt.gtts.say'] = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function () {
        Blockly.Extensions.apply('inline-svgs', this, false);
        this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
        this.setColour(Toolbox_Output);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.library = 'speech';
        this.itemCount_ = 1;
        this.updateShape_();
        //   this.setOutput(true, 'Array');
        //   this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setInputsInline(true);
        //this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
        this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
    },
    /**
     * Create XML to represent list inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    // pxtblockly: Removing the cogwheel for array with
    // decompose: function(workspace) {
    //   var containerBlock = workspace.newBlock('lists_create_with_container');
    //   containerBlock.initSvg();
    //   var connection = containerBlock.getInput('STACK').connection;
    //   for (var i = 0; i < this.itemCount_; i++) {
    //     var itemBlock = workspace.newBlock('lists_create_with_item');
    //     itemBlock.initSvg();
    //     connection.connect(itemBlock.previousConnection);
    //     connection = itemBlock.nextConnection;
    //   }
    //   return containerBlock;
    // },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    // pxtblockly: Removing the cogwheel for array with
    // compose: function(containerBlock) {
    //   var itemBlock = containerBlock.getInputTargetBlock('STACK');
    //   // Count number of inputs.
    //   var connections = [];
    //   while (itemBlock) {
    //     connections.push(itemBlock.valueConnection_);
    //     itemBlock = itemBlock.nextConnection &&
    //         itemBlock.nextConnection.targetBlock();
    //   }
    //   // Disconnect any children that don't belong.
    //   for (var i = 0; i < this.itemCount_; i++) {
    //     var connection = this.getInput('ADD' + i).connection.targetConnection;
    //     if (connection && connections.indexOf(connection) == -1) {
    //       connection.disconnect();
    //     }
    //   }
    //   this.itemCount_ = connections.length;
    //   this.updateShape_();
    //   // Reconnect any child blocks.
    //   for (var i = 0; i < this.itemCount_; i++) {
    //     Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    //   }
    // },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    // saveConnections: function(containerBlock) {
    //   var itemBlock = containerBlock.getInputTargetBlock('STACK');
    //   var i = 0;
    //   while (itemBlock) {
    //     var input = this.getInput('ADD' + i);
    //     itemBlock.valueConnection_ = input && input.connection.targetConnection;
    //     i++;
    //     itemBlock = itemBlock.nextConnection &&
    //         itemBlock.nextConnection.targetBlock();
    //   }
    // },
    /**
     * Store pointers to any connected child blocks.
     */
    storeConnections_: function () {
        this.valueConnections_ = [];
        for (var i = 0; i < this.itemCount_; i++) {
            this.valueConnections_.push(this.getInput('ADD' + i).connection.targetConnection);
        }
    },
    restoreConnections_: function () {
        for (var i = 0; i < this.itemCount_; i++) {
            Blockly.Mutator.reconnect(this.valueConnections_[i], this, 'ADD' + i);
        }
    },
    addItem_: function () {
        this.storeConnections_();
        var update = function () {
            this.itemCount_++;
        };
        this.update_(update);
        this.restoreConnections_();
        // Add shadow block
        if (this.itemCount_ > 1) {
            // Find shadow type
            var firstInput = this.getInput('ADD' + 0);
            if (firstInput && firstInput.connection.targetConnection) {
                // Create a new shadow DOM with the same type as the first input
                // but with an empty default value
                var newInput = this.getInput('ADD' + (this.itemCount_ - 1));
                var shadowInputDom = firstInput.connection.getShadowDom();
                if (shadowInputDom) {
                    var shadowDom = document.createElement('shadow');
                    var shadowInputType = shadowInputDom.getAttribute('type');
                    shadowDom.setAttribute('type', shadowInputType);
                    var shadowDomField = document.createElement('field');
                    shadowDomField.setAttribute('name', 'NUM');
                    shadowDom.appendChild(shadowDomField);
                    if (shadowDom) {
                        shadowDom.setAttribute('id', Blockly.utils.genUid());
                        newInput.connection.setShadowDom(shadowDom);
                        newInput.connection.respawnShadow_();
                    }
                }
            }
        }
    },
    removeItem_: function () {
        this.storeConnections_();
        var update = function () {
            this.itemCount_--;
        };
        this.update_(update);
        this.restoreConnections_();
    },
    update_: function (update) {
        Blockly.Events.setGroup(true);
        var block = this;
        var oldMutationDom = block.mutationToDom();
        var oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);
        // Switch off rendering while the source block is rebuilt.
        var savedRendered = block.rendered;
        block.rendered = false;
        // Update the mutation
        if (update) update.call(this);
        // Allow the source block to rebuild itself.
        this.updateShape_();
        // Restore rendering and show the changes.
        block.rendered = savedRendered;
        // Mutation may have added some elements that need initializing.
        block.initSvg();
        // Ensure that any bump is part of this mutation's event group.
        var group = Blockly.Events.getGroup();
        var newMutationDom = block.mutationToDom();
        var newMutation = newMutationDom && Blockly.Xml.domToText(newMutationDom);
        if (oldMutation != newMutation) {
            Blockly.Events.fire(new Blockly.Events.BlockChange(
                block, 'mutation', null, oldMutation, newMutation));
            setTimeout(function () {
                Blockly.Events.setGroup(group);
                block.bumpNeighbours_();
                Blockly.Events.setGroup(false);
            }, Blockly.BUMP_DELAY);
        }
        if (block.rendered) {
            block.render();
        }
        Blockly.Events.setGroup(false);
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        var that = this;
        var add = function () {
            that.addItem_();
        };
        var remove = function () {
            that.removeItem_();
        };
        if (this.itemCount_) {
            if (this.getInput('EMPTY')) this.removeInput('EMPTY');
            if (!this.getInput('TITLE')) {
                this.appendDummyInput('TITLE')
                    .appendField(png('CONTROLLER'))
                    .appendField('say');
            }
        } else {
            if (this.getInput('TITLE')) this.removeInput('TITLE');
            if (!this.getInput('EMPTY')) {
                this.appendDummyInput('EMPTY')
                    .appendField(png('CONTROLLER'))
                    .appendField('say');
            }

        }
        var i = 0;
        // Add new inputs.
        for (i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('ADD' + i)) {
                var newInput = this.appendValueInput('ADD' + i);
                var newblock = this.workspace.newBlock('text');
                newblock.setShadow(true);
                newblock.initSvg();

                var connection = newInput.connection;
                connection.connect(newblock.outputConnection);
                connection = newblock.nextConnection;
                newblock.render();

            }
        }
        // Remove deleted inputs.
        while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
        }
        if (this.getInput('BUTTONS')) this.removeInput('BUTTONS');
        var buttons = this.appendDummyInput('BUTTONS');
        if (this.itemCount_ > 0) {
            buttons.appendField(new Blockly.FieldImage(this.REMOVE_IMAGE_DATAURI, 24, 24, false, "*", remove));
        }
        buttons.appendField(new Blockly.FieldImage(this.ADD_IMAGE_DATAURI, 24, 24, false, "*", add));

        /* Switch to vertical list when the list is too long */
        var showHorizontalList = this.itemCount_ <= 5;
        this.setInputsInline(showHorizontalList);
        this.setOutputShape(showHorizontalList ?
            Blockly.OUTPUT_SHAPE_ROUND : Blockly.OUTPUT_SHAPE_SQUARE);
    }
};




// // O============ OVERWRITE BLOCKS ==================//
// Blockly.Blocks["pxt.math.randomNumber"] = {
//     init: function () {
//         this.setColour(Toolbox_Math);
//         this.setOutput(true);
//         this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
//         this.appendDummyInput("MAIN")
//             .appendField("random number from");
//         this.appendValueInput("FROM");
//         this.appendValueInput("TO")
//             .appendField("to");

//     }
// }
// Blockly.Python["pxt.math.randomNumber"] = function (block) {
//     __import__("import random");
//     var from = Blockly.Python.valueToCode(block, "FROM", Blockly.Python.ORDER_ATOMIC);
//     var to = Blockly.Python.valueToCode(block, "TO", Blockly.Python.ORDER_ATOMIC);
//     var code = "random.randint(" + from + "," + to + ")"
//     return [code, Blockly.Python.ORDER_ATOMIC];

Blockly.Blocks["pxt.math.map"] = {
    init: function () {
        this.setColour(220);
        this.setOutput(true);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.appendValueInput("NUM")
            .appendField("map")
            .setCheck("Number");
        this.appendValueInput("FROMLOW")
            .appendField("from range")
            .setCheck("Number");
        this.appendValueInput("FROMHIGH")
            .setCheck("Number");
        this.appendValueInput("TOLOW")
            .appendField("to range")
            .setCheck("Number");
        this.appendValueInput("TOHIGH").setCheck("Number");


    }
}



// Demo Block
Blockly.Blocks["pxt.demo.voiceRecognition"] = {
    init: function () {
        // this.library = "button";
        // // this.blockType = 'event.unique';
        // this.module = 'BUTTON';
        this.setColour(Toolbox_Input);
        this.appendDummyInput('MAIN')
            .appendField("when I said")

            .appendField(new Blockly.FieldTextInput("Hello Worlds"), 'PORT')
            ;
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks["pxt.codelab.face"] = {
    init: function () {
        // this.library = "button";
        // // this.blockType = 'event.unique';
        // this.module = 'BUTTON';
        this.setColour("#000000");
        this.appendDummyInput('MAIN')
            .appendField(png("CODELAB"))
            .appendField("when seeing")

            .appendField(new Blockly.FieldDropdown([
                ["Thuận","Thuận"]
            ]), 'PORT')
            
            ;
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks["pxt.codelab.voice"] = {
    init: function () {
        // this.library = "button";
        // // this.blockType = 'event.unique';
        // this.module = 'BUTTON';
        this.setColour("#000000");
        this.appendDummyInput('MAIN')
            .appendField(png("CODELAB"))
            .appendField("when I said")

            .appendField(new Blockly.FieldTextInput("Hello Worlds"), 'PORT')
            ;
        this.appendStatementInput('CODE');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

Blockly.Blocks['pxt.codelab.emotion'] = {
    init: function () {
        
        this.setColour("#000000");
        this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
        this.setOutput(true, 'Boolean');
        this.appendDummyInput('MAIN')
            .appendField("the person is")
            .appendField(new Blockly.FieldDropdown([
                ["RELAX","RELAX"]
            ]), 'PORT')
            ;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}


Blockly.Blocks['pxt.codelab.emotion'] = {
    init: function () {
        
        this.setColour("#000000");
        this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
        this.setOutput(true, 'Boolean');
        this.appendDummyInput('MAIN')
            .appendField("the person is")
            .appendField(new Blockly.FieldDropdown([
                ["RELAX","RELAX"]
            ]), 'PORT')
            ;
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}

Blockly.Blocks['pxt.node.trigger'] = {
    init: function () {
        this.setColour(Toolbox_Timer);
        // this.library = "coroutine";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('DUMMY')
            .appendField("trigger device")   
            .appendField(new Blockly.FieldDropdown([
                ["Hương's Controller","a"],
                ["Nguyên's Controller","b"]

            ]),"a") 
            .appendField('');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}
Blockly.Blocks['pxt.node.waitfor'] = {
    init: function () {
        this.setColour(Toolbox_Timer);
        // this.library = "coroutine";
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('DUMMY')
            .appendField("wait for  device")   
            .appendField(new Blockly.FieldDropdown([
                ["Hương's Controller","a"],
                ["Nguyên's Controller","b"]

            ]),"a") 
            .appendField('');
        this.setOnChange(function (change) {
            changeHandle(this, change);
        });
    }
}