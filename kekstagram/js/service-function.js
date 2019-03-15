'use strict';

(function () {
  window.serviceFunction = {
    deleteClass: function deleteClass(spaceSearch, className, deletedClass) {
      spaceSearch.querySelector(className).classList.remove(deletedClass);
    },
    addClass: function addClass(spaceSearch, className, addedClass) {
      spaceSearch.querySelector(className).classList.add(addedClass);
    }
  };
})();
