$(document).ready(function() {
  var viewModel = function() {
    self = this;

    self.percentage = ko.observable(0);

    self.percentage.subscribe(function () {
      if (self.percentage() === 75) {
        clearTimeout(timer);
      }
    });
  };

  ko.bindingHandlers.progressBar = {
    init: function(element) {
      return { controlsDescendantBindings: true };
    },
    update : function(element, valueAccessor, bindingContext) {
      var options = ko.unwrap(valueAccessor());

      var value = options.value();

      var width = value + "%";
      
      $(element).addClass("progressBar");

      ko.applyBindingsToNode(element, {
        html : '<div data-bind="style: { width: \'' + width + '\' }"></div><div class="progressText" data-bind="text: \'' + value + ' %\'"></div>'
      });

      ko.applyBindingsToDescendants(bindingContext, element);
    }
  };

  var viewModelObj = new viewModel();

  ko.applyBindings(viewModelObj);

  var timer = setInterval(function() { viewModelObj.percentage(viewModelObj.percentage() + 1); }, 50);
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  e.target
  e.relatedTarget
})
