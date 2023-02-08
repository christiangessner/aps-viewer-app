const MY_FOLDER_DATA = {
    path: '/home',
    name: 'Home',
    entries: [
        {
            path: '/home/docs',
            name: 'Documents',
            entries: [
                {
                    path: '/home/docs/drawing1.pdf',
                    name: 'drawing1.pdf'
                }
            ]
        },
        {
            path: '/home/images',
            name: 'Images',
            entries: [
                {
                    path: '/home/images/image1.png',
                    name: 'image1.png'
                },
                {
                    path: '/home/images/old',
                    name: 'Old',
                    entries: [
                        {
                            path: '/home/images/old/image1.png',
                            name: 'image1.png'
                        },
                        {
                            path: '/home/images/old/image2.png',
                            name: 'image2.png'
                        }                        
                    ]
                }
            ]
        }
    ]
};

class CustomTreeDelegate extends Autodesk.Viewing.UI.TreeDelegate {
    isTreeNodeGroup(node) {
        return node.entries && node.entries.length > 0;
    }

    getTreeNodeId(node) {
        return node.path;
    }

    getTreeNodeLabel(node) {
        return node.name;
    }

    getTreeNodeClass(node) {
        node.children && node.children.length > 0 ? 'group' : 'leaf';
    }

    forEachChild(node, callback) {
        for (const child of node?.entries) {
            callback(child);
        }
    }

    onTreeNodeClick(tree, node, event) {
        console.log('click', tree, node, event);
    }

    onTreeNodeDoubleClick(tree, node, event) {
        console.log('double-click', tree, node, event);
    }

    onTreeNodeRightClick(tree, node, event) {
        console.log('right-click', tree, node, event);
    }

    createTreeNode(node, parent, options, type, depth) {
        const label = super.createTreeNode(node, parent, options, type, depth);
        const icon = label.previousSibling;
        const row = label.parentNode;

       var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute('style', 'border: 1px solid black; margin:0px; padding:0px');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

        var svg = document.createElement("span");
            svg.setAttribute('class', 'adsk-icon-measure-area-new');
            svg.style.paddingRight = '2px';
            
        //const _document = this.getDocument();
        //var geomTypeIcon = _document.createElement('test'); // Refer to the CSS property
        // Insert after the existing <icon>
        label.parentElement.insertBefore(/*geomTypeIcon*/svg, label.parentElement.children[1]);
        // Reset for geometry elements.
        //parent.style.paddingTop = '0';

        label.parentElement.style.verticalAlign = 'middle';

        // Center arrow icon
        if (svg) {
            svg.backgroundPositionX = '0px';
            svg.backgroundPositionY = '0px';
        }

        // Center arrow icon
        if (icon) {
            icon.style.backgroundPositionX = '5px';
            icon.style.backgroundPositionY = '5px';
        }
        // Offset rows depending on their tree depth
        row.style.padding = `5px`;
        row.style.paddingLeft = `${5 + (type === 'leaf' ? 20 : 0) + depth * 20}px`;
        return label;
    }
}

export class CustomTreeViewPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, id, title) {
        super(viewer.container, id, title);
        this.container.classList.add('property-panel'); // Re-use some handy defaults
        this.container.dockRight = true;
        this.createScrollContainer({ left: false, heightAdjustment: 70, marginTop: 0 });
        this.delegate = new CustomTreeDelegate();
        this.tree = new Autodesk.Viewing.UI.Tree(this.delegate, MY_FOLDER_DATA, this.scrollContainer);
    }
}