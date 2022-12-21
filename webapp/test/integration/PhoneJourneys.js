/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"by/iba/ZAP_AUTOPARK_11/test/integration/NavigationJourneyPhone",
		"by/iba/ZAP_AUTOPARK_11/test/integration/NotFoundJourneyPhone",
		"by/iba/ZAP_AUTOPARK_11/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});