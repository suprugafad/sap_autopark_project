/*global location */
sap.ui.define([
		"by/iba/ZAP_AUTOPARK_11/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"by/iba/ZAP_AUTOPARK_11/model/formatter",
		"sap/m/MessageToast"
	], function (BaseController, JSONModel, formatter, MessageToast) {
		"use strict";

		return BaseController.extend("by.iba.ZAP_AUTOPARK_11.controller.Detail", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0
				});
				
				var oCarFormModel = new JSONModel({
					editMode : false
				});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "detailView");
				this.setModel(oCarFormModel, "carFormModel");

				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},
			
			onChangeFormPress : function() {
				var oCarModel = this.getModel("carFormModel");
				
				oCarModel.setProperty("/editMode", true);
			},
			
			onSaveFormPress : function() {
				var oCarModel = this.getModel("carFormModel");
				
				var oODataModel = this.getModel();
				var sPath = this.getView().getBindingContext().getPath();
				var oCar = this.getView().getBindingContext().getObject();
				
				var formCosts = this.byId("costsText");
				var formRepair = this.byId("repairStatus");
				
				oCar.COSTS = formCosts.getValue();
				oCar.REPAIR = formatter.repairCheckBoxValue(formRepair.getSelected());
				
				oCar.DRIVER = this.getView().byId("driverSelect").getSelectedKey();
				
				oODataModel.update(sPath, oCar, {
					success: function(oResponse) {
						oCarModel.setProperty("/editMode", false);
						MessageToast.show("Data was update");
					},
					error: function(oError) {}
				});
				
			},
			
			onCancelFormPress : function() {
				var oCarModel = this.getModel("carFormModel");
				oCarModel.setProperty("/editMode", false);
				
				this.getView().getModel().refresh(true);
			},
			
			onDriverNumPress : function(oEvent) {
				this.getRouter().navTo("driver", {
					driverId: oEvent.getSource().getBindingContext().getProperty("DRIVER")}, true);
			},
			
			onMoveToGarageFormPress : function() {
				var oODataModel = this.getModel();
				var oURLParams = {
					NUM: this.getView().getBindingContext().getObject("NUM")
				};
				
				oODataModel.callFunction("/MoveCarToGarage", {
					method: "POST",
					urlParameters: oURLParams,
					success: function(response) {
						sap.m.MessageToast.show("Автомобиль перемещён в гараж");
					},
					error: function(oError) {}
				});
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = this.getModel("detailView");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("detailView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name : "sap.collaboration.components.fiori.sharing.dialog",
						settings : {
							object :{
								id : location.href,
								share : oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});

				oShareDialog.open();
			},


			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("CarSet", {
						NUM :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath(),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.NUM,
					sObjectName = oObject.MARK,
					oViewModel = this.getModel("detailView");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView");

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			}

		});

	}
);