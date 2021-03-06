/*global MediumEditor */
'use strict';

angular.module('angular-medium-editor', [])

  .directive('mediumEditor', ['$parse', function($parse) {

    function toInnerText(value) {
      var tempEl = document.createElement('div'),
          text;
      tempEl.innerHTML = value;
      text = tempEl.textContent || '';
      return text.trim();
    }

    return {
      require: 'ngModel',
      restrict: 'AE',
      link: function(scope, iElement, iAttrs, ngModel) {
        angular.element(iElement).addClass('angular-medium-editor');

        // Global MediumEditor
        var mediumEditorOptions = $parse(iAttrs.bindOptions)(scope);
        if (mediumEditorOptions && mediumEditorOptions.relativeToolbar) {
          mediumEditorOptions.toolbar.relativeContainer = angular.element(iElement).next()[0];
        }

        ngModel.editor = new MediumEditor(iElement, mediumEditorOptions);
        ngModel.$render = function() {
          iElement.html(ngModel.$viewValue || "");
          ngModel.editor.getExtensionByName('placeholder').updatePlaceholder(iElement[0]);
        };

        ngModel.$isEmpty = function(value) {
          if (/[<>]/.test(value)) {
            return toInnerText(value).length === 0;
          } else if (value) {
            return value.length === 0;
          } else {
            return true;
          }
        };

        ngModel.editor.subscribe('editableInput', function (event, editable) {
          ngModel.$setViewValue(editable.innerHTML.trim());
        });

      }
    };
  }]);
