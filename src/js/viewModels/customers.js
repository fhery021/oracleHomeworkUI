/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define([
  "knockout",
  "appController",
  "ojs/ojmodule-element-utils",
  "accUtils",
  "ojs/ojbootstrap",
  "ojs/ojarraydataprovider",
  "ojs/ojknockout",
  "ojs/ojlistview",
], function (ko, app, moduleUtils, accUtils, Bootstrap, ArrayDataProvider) {
  function CustomerViewModel() {
    var self = this;

    // Header Config
    self.headerConfig = ko.observable({ view: [], viewModel: null });
    moduleUtils
      .createView({ viewPath: "views/header.html" })
      .then(function (view) {
        self.headerConfig({ view: view, viewModel: new app.getHeaderModel() });
      });

    var data = [
      { id: 1, name: "Amy Bartlet", title: "Vice President" },
      { id: 10, name: "Andy Jones", title: "Director" },
      { id: 11, name: "Andrew Bugsy", title: "Individual Contributer" },
      { id: 2, name: "Annett Barnes", title: "Individual Contributer" },
      { id: 12, name: "Bob Jones", title: "Salesman" },
      { id: 13, name: "Bart Buckler", title: "Purchasing" },
      { id: 14, name: "Bobby Fisher", title: "Individual Contributer" },
    ];
    this.dataProvider = new ArrayDataProvider(data, { keyAttributes: "id" });

    // Below are a set of the ViewModel methods invoked by the oj-module component.
    // Please reference the oj-module jsDoc for additional information.

    /**
     * Optional ViewModel method invoked after the View is inserted into the
     * document DOM.  The application can put logic that requires the DOM being
     * attached here.
     * This method might be called multiple times - after the View is created
     * and inserted into the DOM and after the View is reconnected
     * after being disconnected.
     */
    self.connected = function () {
      accUtils.announce("Customers page loaded.", "assertive");
      document.title = "Customers";
      // Implement further logic if needed
    };

    /**
     * Optional ViewModel method invoked after the View is disconnected from the DOM.
     */
    self.disconnected = function () {
      // Implement if needed
    };

    /**
     * Optional ViewModel method invoked after transition to the new View is complete.
     * That includes any possible animation between the old and the new View.
     */
    self.transitionCompleted = function () {
      // Implement if needed
    };
  }

  Bootstrap.whenDocumentReady().then(function () {
    ko.applyBindings(new CustomerViewModel(), document.getElementById("listview"));
  });

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return CustomerViewModel;
});
