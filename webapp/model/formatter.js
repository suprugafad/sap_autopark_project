sap.ui.define([
	], function () {
		"use strict";

		return {
			/**
			 * Rounds the currency value to 2 digits
			 *
			 * @public
			 * @param {string} sValue value to be formatted
			 * @returns {string} formatted currency value with 2 digits
			 */
			currencyValue : function (sValue) {
				if (!sValue) {
					return "";
				}

				return parseFloat(sValue).toFixed(1);
			},
			
			repairStatus : function (sStatus) {
				if (sStatus === "X") {
					return "Success";
				} else {
					return "Error";
				}
			},
			repairValue : function (sValue) {
				if (sValue === "X") {
					return true;
				} else {
					return false;
				}
			},
			
			repairCheckBoxValue : function (sValue) {
				if (sValue === true) {
					return "X";
				} else {
					return "";
				}
			},
			
			dateValue : function (sValue) {
				var d = new Date(sValue);
				var options = {
					year: "numeric",
					month: "long",
					day: "numeric"
				};
				
				return d.toLocaleDateString("ru-RU", options);
				
			}
			
		};

	}
);