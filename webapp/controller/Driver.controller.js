sap.ui.define([
	"by/iba/ZAP_AUTOPARK_11/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"by/iba/ZAP_AUTOPARK_11/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("by.iba.ZAP_AUTOPARK_11.controller.Driver", {

		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf by.iba.ZAP_AUTOPARK_11.view.Driver
		 */
		onInit: function() {
			var oDriverModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.setModel(oDriverModel, "driverView");

			this.getRouter().getRoute("driver").attachPatternMatched(this._onObjectMatched, this);

			// this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf by.iba.ZAP_AUTOPARK_11.view.Driver
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf by.iba.ZAP_AUTOPARK_11.view.Driver
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf by.iba.ZAP_AUTOPARK_11.view.Driver
		 */
		//	onExit: function() {
		//
		//	}

		onDriverInfo: function() {
			var context = this;
			var dialog = new sap.m.Dialog({
				title: "Сменить фамилию",
				type: "Message",
				content: [
					new sap.m.Input("driverNewName", {
						width: "100%",
						placeholder: "Введите фамилию",
						valueState: "Error",
						liveChange: function(oEvent) {
							context.onInputCheck(oEvent);
						}
					})
				],
				beginButton: new sap.m.Button({
					type: sap.m.ButtonType.Emphasized,
					text: "Изменить",
					enabled: false,
					press: function() {
						context._changeDriver();
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: "Отмена",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();

		},
		
		onInputCheck: function(oEvent) {
			var value = oEvent.getParameter("value");
			
			if (value.trim().length > 3) {
				oEvent.getSource().setValueState("Success");
				oEvent.getSource().getParent()._getToolbar().getContent()[1].setEnabled(true);
			} else {
				oEvent.getSource().getParent()._getToolbar().getContent()[1].setEnabled(false);
			}
		},

		_changeDriver: function() {
			var oODataModel = this.getModel();
			var sPath = this.getView().getBindingContext().getPath();
			var oDriver = this.getView().getBindingContext().getObject();

			oDriver.FIO = sap.ui.getCore().byId("driverNewName").getValue();

			oODataModel.update(sPath, oDriver, {
				success: function(oResponse) {
					sap.m.MessageToast.show("Новая фамилия:" + oDriver.FIO);
				},
				error: function(oError) {}
			});
		},

		_onMetadataLoaded: function() {
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("driverView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		_onObjectMatched: function(oEvent) {
			var sDriverId = oEvent.getParameter("arguments").driverId;

			var sObjectPath = this.getModel().createKey("DriverSet", {
				TABNUM: sDriverId
			});
			this._bindView("/" + sObjectPath);
		},

		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("driverView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		}

	});

});