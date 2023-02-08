// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function getAllDbIds(viewer) {
    var instanceTree = viewer.model.getData().instanceTree;
    if (!instanceTree) {
        return null;
    }
    var allDbIds = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
    return allDbIds.map(function(id) { 
        return parseInt(id)
    });
}

async function getDbIdByPartNumber(partNumber) {
    var allDbIds = getAllDbIds(viewer);
    if (allDbIds) {
        viewer.model.getBulkProperties(allDbIds, null, await function (elements) {
            for (const e of elements) {
                var properties = e.properties;
                var property = properties.find(o => o.displayName === 'Part Number');

                if (property !== undefined) {
                    if (property.displayValue === partNumber) {
                        console.log(e.dbId);
                        break;
                    }
                }
            }
        });        
    }
}

function selectByPartNum() {
    const element = document.getElementById('partNumText');
    const partNumber = element.value;

    viewer.search(partNumber, (results)=>{
        viewer.isolate(results);
    }, null, ['Part Number']);
}