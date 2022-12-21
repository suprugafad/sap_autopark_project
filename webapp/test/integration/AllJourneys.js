/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 CarSet in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"by/iba/ZAP_AUTOPARK_11/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"by/iba/ZAP_AUTOPARK_11/test/integration/pages/App",
	"by/iba/ZAP_AUTOPARK_11/test/integration/pages/Browser",
	"by/iba/ZAP_AUTOPARK_11/test/integration/pages/Master",
	"by/iba/ZAP_AUTOPARK_11/test/integration/pages/Detail",
	"by/iba/ZAP_AUTOPARK_11/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "by.iba.ZAP_AUTOPARK_11.view."
	});

	sap.ui.require([
		"by/iba/ZAP_AUTOPARK_11/test/integration/MasterJourney",
		"by/iba/ZAP_AUTOPARK_11/test/integration/NavigationJourney",
		"by/iba/ZAP_AUTOPARK_11/test/integration/NotFoundJourney",
		"by/iba/ZAP_AUTOPARK_11/test/integration/BusyJourney",
		"by/iba/ZAP_AUTOPARK_11/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});