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
  "ojs/ojmodel",
  "ojs/ojcollectiondataprovider",
  "appController",
  "ojs/ojmodule-element-utils",
  "accUtils",
  "ojs/ojbootstrap",
  "ojs/ojknockout",
  "ojs/ojlistview",
], function (
  ko,
  Model,
  CollectionDataProvider,
  app,
  moduleUtils,
  accUtils,
  Bootstrap
) {
  function CustomerViewModel() {
    var self = this;

    // Header Config
    self.headerConfig = ko.observable({ view: [], viewModel: null });
    moduleUtils
      .createView({ viewPath: "views/header.html" })
      .then(function (view) {
        self.headerConfig({ view: view, viewModel: new app.getHeaderModel() });
      });

    // Master list and detail list observables
    self.customerDataProvider = ko.observable(); //gets data for Activities list
    self.servicesDataProvider = ko.observable(); //gets data for Services list

    self.serviceData = ko.observable(""); //holds data for Service details

    self.pieSeriesValue = ko.observableArray([]); //holds data for pie chart

    // Customer selection observables
    self.customerSelected = ko.observable(false);
    self.selectedCustomer = ko.observable();
    self.firstSelectedCustomer = ko.observable();

    self.serviceSelected = ko.observable(false);
    self.selectedService = ko.observable();
    self.firstSelectedService = ko.observable();

    // REST endpoint
    var RESTurl = "http://localhost:8080/api/v1/customer/";

    var CustomerModel = Model.Model.extend({
      urlRoot: RESTurl,
      idAttribute: "id",
    });

    self.myCustomer = new CustomerModel();
    var CustomerCollection = new Model.Collection.extend({
      url: RESTurl,
      model: self.myCustomer,
      comparator: "id",
    });

    /**
     * Handling customer selection
     */

    self.selectedCustomerChanged = function (event) {
      // Check whether click is a Customer selection or a deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display list
        // Create variable for items list using firstSelectedXxx API from List View
        //var itemsArray = self.firstSelectedCustomer().data.items;
        // Populate items list using DataProvider fetch on key attribute
        // self.itemsDataProvider(new ArrayDataProvider(itemsArray, { keyAttributes: 'id' }))

        var customerId = self.firstSelectedCustomer().data.id;

        // Services REST call
        // console.log(customerId);

        var serviceByCustomerIdURL =
          "http://localhost:8080/api/v1/services/customer?customerId=" +
          customerId;

        var serviceModel = Model.Model.extend({
          urlRoot: serviceByCustomerIdURL,
          idAttribute: 'id'
        });

        self.myService = new serviceModel();
        var ServiceCollection = new Model.Collection.extend({
          url: serviceByCustomerIdURL,
          model: self.myService,
          comparator: 'id'
        });

        self.myServiceCol = new ServiceCollection();
        self.servicesDataProvider(new CollectionDataProvider(self.myServiceCol));

        // set list view properties
        self.customerSelected(true);
        self.serviceSelected(false);

        // clear services selection
        self.selectedService([]);
        self.serviceData();

      } else {
        self.customerSelected(false);
        self.serviceSelected(false);
      }
    };

    self.selectedServiceChanged = function (event) {
    }
    /*
     *An observable called customerDataProvider is already bound in the View file
     *from the JSON example, so you don't need to update dashboard.html
     */
    self.myCustomerCol = new CustomerCollection();
    self.customerDataProvider(new CollectionDataProvider(self.myCustomerCol));

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
    // ko.applyBindings(
    //   new CustomerViewModel(),
    //   document.getElementById("customers")
    // );
  });

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return CustomerViewModel;
});
