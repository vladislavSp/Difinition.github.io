'use strict';

(function () {
  var ACTIVE_CLASS = 'img-filters__button--active';
  var imgFilter = document.querySelector('.img-filters');
  var buttonPopular = document.querySelector('#filter-popular');
  var buttonNew = document.querySelector('#filter-new');
  var buttonDiscussed = document.querySelector('#filter-discussed');
  var messagesTemplate = document.querySelector('#messages').content.querySelector('.img-upload__message');
  var messageBlock = messagesTemplate.cloneNode(true);

  var pictures = [];

  var clearPicture = function () {
    var picture = document.querySelectorAll('.picture');

    picture.forEach(function (elem) {
      elem.remove();
    });
  };

  var activatedButton = function (button1, button2, button3, activeClass) {
    button1.classList.add(activeClass);
    button2.classList.remove(activeClass);
    button3.classList.remove(activeClass);
  };

  // Цикл, возвращающий 10 рандомных элементов массива
  var randomNewArray = function (arrays) {
    var newArrays = arrays.slice();
    for (var i = newArrays.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = newArrays[i];
      newArrays[i] = newArrays[j];
      newArrays[j] = temp;
    }
    return newArrays.slice(0, 10);
  };

  var commentsComparator = function (a, b) {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    }
    return 0;
  };

  var discussedArray = function (arrays) {
    var newArrays = arrays.slice();

    newArrays.sort(function (a, b) {
      var rankDiff = commentsComparator(a.comments.length, b.comments.length);
      return rankDiff;
    });
    return newArrays;
  };

  var updatePictures = function (arrays) {
    window.picture.render(arrays);
  };

  var popButtonClickHandler = window.debounce(function () {
    clearPicture();
    updatePictures(pictures);
  });

  var popButtonActiveHandler = function () {
    activatedButton(buttonPopular, buttonDiscussed, buttonNew, ACTIVE_CLASS);
  };

  var newButtonClickHandler = window.debounce(function () {
    clearPicture();
    updatePictures(randomNewArray(pictures));
  });

  var newButtonActiveHandler = function () {
    activatedButton(buttonNew, buttonPopular, buttonDiscussed, ACTIVE_CLASS);
  };

  var discButtonClickHandler = window.debounce(function () {
    clearPicture();
    updatePictures(discussedArray(pictures));
  });

  var discButtonActiveHandler = function () {
    activatedButton(buttonDiscussed, buttonPopular, buttonNew, ACTIVE_CLASS);
  };

  buttonPopular.addEventListener('click', popButtonClickHandler);
  buttonPopular.addEventListener('click', popButtonActiveHandler);
  buttonNew.addEventListener('click', newButtonClickHandler);
  buttonNew.addEventListener('click', newButtonActiveHandler);
  buttonDiscussed.addEventListener('click', discButtonClickHandler);
  buttonDiscussed.addEventListener('click', discButtonActiveHandler);

  var picturesLoadHandler = function (data) {
    pictures = data;
    updatePictures(data);
  };

  var errorLoadHandler = function (message) {
    messageBlock.textContent = message;
    window.picture.pictureList.appendChild(messageBlock);
  };

  var successLoadHandler = function (status) {
    if (status) {
      imgFilter.classList.remove('img-filters--inactive');
    }
  };

  window.backend.download(picturesLoadHandler, successLoadHandler, errorLoadHandler);
})();
