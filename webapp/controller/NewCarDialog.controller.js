sap.ui.define([
			"by/iba/ZAP_AUTOPARK_11/controller/BaseController",
			"sap/ui/model/json/JSONModel",
			"by/iba/ZAP_AUTOPARK_11/model/formatter",
			"sap/m/MessageToast"
		], function(BaseController, JSONModel, formatter, MessageToast) {
			"use strict";

			return BaseController.extend("by.iba.ZAP_AUTOPARK_11.controller.NewCarDialog", {

						formatter: formatter,

						/* =========================================================== */
						/* lifecycle methods                                           */
						/* =========================================================== */

						onInit: function() {
							// Model used to manipulate control states. The chosen values make sure,
							// detail page is busy indication immediately so there is no break in
							// between the busy indication for loading the view's meta data
							var oViewModel = new JSONModel({
								busy: false,
								delay: 0
							});

							this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

							this.setModel(oViewModel, "newCarView");

						},

						onAddCarInfo: function() {
							var oODataModel = this.getModel();

							var sPath = this.getView().getBindingContext().getPath();
							// var oCar = this.getView().getBindingContext().getObject();
							var oCar;

							var formNum = this.byId("numText");
							var formMark = this.byId("markText");
							var formCosts = this.byId("costsText");
							var formRepair = this.byId("repairStatus");

							oCar.NUM = formNum.getValue();
							oCar.MARK = formMark.getValue();
							oCar.COSTS = formCosts.getValue();
							oCar.WAERS = this.getView().byId("waersSelect").getSelectedKey();
							oCar.REPAIR = formatter.repairCheckBoxValue(formRepair.getSelected());
							oCar.DRIVER = this.getView().byId("driverSelect").getSelectedKey();

							oODataModel.create(sPath, oCar, {
								success: function(oResponse) {
									MessageToast.show("Data was create");
									this.byId("NewCarDialog").close();
								},
								error: function(oError) {
									MessageToast.show("Error");	
								}
							});
						},
						
						onCancelCar: function() {
							this.byId("NewCarDialog").close();
						}
		});

	}
);