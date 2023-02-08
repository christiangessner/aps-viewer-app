import hyperlink from "/js/hyperlinkpdf.ext.js";
import docbrowser from "/js/docbrowsertree.ext.js";
import propertiespdf from "/js/propertiespdf.ext.js";
//import { CustomTreeViewExtension } from '/js/CustomTreeViewExtension.js';


const AV = Autodesk.Viewing;
const dataFolder = "data";	
let viewer = null;

async function startViewer() {
	AV.Initializer({ env: 'AutodeskProduction', accessToken: "1231" }, async function () {
		viewer = new Autodesk.Viewing.GuiViewer3D(
			document.getElementById('Viewer'),
			{ extensions: ["propertiesPdf", "hyperlinksPdf", "docBrowserTree", "Autodesk.PDF", "Autodesk.DWF", "Autodesk.Vault.Markups"] }
		);
		viewer.start();
		viewer.setTheme('light-theme');
		let filename = `data/Metal Container.idw_Sheet_1.pdf`;
		let params;
		if (window.location.search.length > 0) {
			params = Object.fromEntries(new URLSearchParams(location.search))
			if (params.url)
				filename = `${dataFolder}/${params.url}`
		}
		await viewer.unloadModel();
		viewer.loadModel(filename, {keepCurrentModels:false});
		await viewer.waitForLoadDone();
		if (params.partname) {
			viewer.search(params.partname, (results)=>{
				viewer.isolate(results);
				viewer.fitToView(results);
				viewer.select(results);
			}, null, ['Part Number']);
		}
	});
}	

startViewer();

window.saveMarkups = async () => {
	const ext = await viewer.loadExtension("Autodesk.Vault.Markups");
	console.log(ext.markupLayers);
}