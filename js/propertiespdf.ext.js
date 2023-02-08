class PdfPropertiesPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(extension, id, title) {
        super(extension.viewer.container, id, title);
        this.extension = extension;
    }

    async update(model) {
        this.removeAllProperties();

        var self = this;
        $.ajax({
            type: "Get",
            url: model.myData.urn + '.props.json',
            dataType: "json",
            success: function (data) {
                for (const group of data.groups) {
                    for (const property of group.properties) {
                        self.addProperty(property.name, property.value, group.name);
                    }
                }
            },
            error: function () {
                alert("json not found");
            }
        });
    }
}

export default class PdfPropertiesExtension extends Autodesk.Viewing.Extension  {
    constructor(viewer, options) {
        super(viewer, options);
        this._button = null;
        this._panel = null;
    }

    load() {
        super.load();
        console.log('PdfPropertiesExtension loaded.');
        return true;
    }

    unload() {
        super.unload();
        if (this._button) {
            this.removeToolbarButton(this._button);
            this._button = null;
        }
        if (this._panel) {
            this._panel.setVisible(false);
            this._panel.uninitialize();
            this._panel = null;
        }
        console.log('PdfPropertiesExtension unloaded.');
        return true;
    }

    onToolbarCreated() {
        this._panel = new PdfPropertiesPanel(this, 'pdf-properties-panel', 'Drawing Properties');
        this._button = this.createToolbarButton('pdf-properties-button', 'Drawing Properties');
        this._button.onClick = () => {
            this._panel.setVisible(!this._panel.isVisible());
            this._button.setState(this._panel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._panel.isVisible()) {
                this.update();
            }
        };
    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        this.update();
    }

    onSelectionChanged(model, dbids) {
        super.onSelectionChanged(model, dbids);
        this.update();
    }

    onIsolationChanged(model, dbids) {
        super.onIsolationChanged(model, dbids);
        this.update();
    }

    async update() {
        if (this._panel) {
            this._panel.update(this.viewer.model);
        }
    }

    createToolbarButton(buttonId, buttonTooltip) {

        this.viewer.loadExtension('Autodesk.PropertiesManager').then(()=>{
            const settingsTools = this.viewer.toolbar.getControl('settingsTools');
            settingsTools.removeControl('toolbar-propertiesTool');
        });

        // let group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        // if (!group) {
        //     group = new Autodesk.Viewing.UI.ControlGroup('dashboard-toolbar-group');
        //     this.viewer.toolbar.addControl(group);
        // }

        let group = this.viewer.toolbar.getControl('settingsTools');
        const button = new Autodesk.Viewing.UI.Button(buttonId);
        button.setToolTip(buttonTooltip);
        group.addControl(button);
        const icon = button.container.querySelector('.adsk-button-icon');
        if (icon) {
            icon.classList.add('adsk-icon-properties')
        }
        return button;
    }

    removeToolbarButton(button) {
        const group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        group.removeControl(button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('propertiesPdf', PdfPropertiesExtension);