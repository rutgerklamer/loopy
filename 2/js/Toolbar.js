/**********************************
 
TOOLBAR CODE
 
**********************************/

function Toolbar(loopy){

    const self = this;

    // Tools & Buttons
    const buttons = [];
    const buttonsByID = {};
    self.dom = document.getElementById("toolbar");

    self.addButton = function(options){
        const id       = options.id;
        const tooltip  = options.tooltip;
        const callback = options.callback;

        // Create the button
        const button = new ToolbarButton(self, {
            id       : id,
            icon     : "css/icons/" + id + ".png",
            tooltip  : tooltip,
            callback : callback
        });

        self.dom.appendChild(button.dom);
        buttons.push(button);
        buttonsByID[id] = button;

        // Keyboard shortcut!
        (function(id){
            subscribe("key/" + id, function(){
                loopy.ink.reset(); // also CLEAR INK CANVAS if you need
                buttonsByID[id].callback();
            });
        })(id);
    };

    // Deselect all / select one
    self.selectButton = function(button){
        buttons.forEach(b => b.deselect());
        button.select();
    };

    // Tool switching
    self.currentTool = "ink";
    self.setTool = function(tool){
        self.currentTool = tool;
        loopy.tool = Loopy["TOOL_" + tool.toUpperCase()];
        document.getElementById("canvasses").setAttribute("cursor", tool);
    };

    // Add the four buttons
    ["ink","label","drag","erase"].forEach(id => {
        const tooltipMap = {
            ink:   "PE(N)CIL",
            label: "(T)EXT",
            drag:  "MO(V)E",
            erase: "(E)RASE"
        };
        self.addButton({
            id:       id,
            tooltip:  tooltipMap[id],
            callback: () => self.setTool(id)
        });
    });

    // Default select “ink”
    buttonsByID.ink.callback();

}

function ToolbarButton(toolbar, config){

    const self = this;
    self.id = config.id;

    // Build the div
    self.dom = document.createElement("div");
    self.dom.className = "toolbar_button";
    self.dom.setAttribute("data-tool", config.id);
    self.dom.style.backgroundImage = "url('" + config.icon + "')";

    // Tooltip
    self.dom.setAttribute("data-balloon",    config.tooltip);
    self.dom.setAttribute("data-balloon-pos","right");

    // Select / Deselect
    self.select = () =>   self.dom.setAttribute("selected","yes");
    self.deselect = () => self.dom.setAttribute("selected","no");

    // Click
    self.callback = () => {
        config.callback();
        toolbar.selectButton(self);
    };
    self.dom.onclick = self.callback;

}
