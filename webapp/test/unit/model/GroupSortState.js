/*global QUnit*/

sap.ui.define([
	"by/iba/ZAP_AUTOPARK_11/model/GroupSortState",
	"sap/ui/model/json/JSONModel"
], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function() {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("COSTS").length, 1, "The sorting by COSTS returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("MARK").length, 1, "The sorting by MARK returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("COSTS").length, 1, "The group by COSTS returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to COSTS if the user groupes by COSTS", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("COSTS");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "COSTS", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by MARK and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "COSTS");

		this.oGroupSortState.sort("MARK");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});