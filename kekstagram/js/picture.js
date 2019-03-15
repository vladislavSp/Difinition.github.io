'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture'); // содержимое шаблона
  var pictureList = document.querySelector('.pictures'); // space для добавления фото пользователей

  // Заполнение шаблона одним из объектов
  var renderPicture = function (description) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').setAttribute('src', description.url);
    pictureElement.querySelector('.picture__likes').textContent = description.likes;
    pictureElement.querySelector('.picture__comments').textContent = description.comments.length;

    return pictureElement;
  };


  window.picture = {
    render: function (data) {
      data.forEach(function (elem) {
        pictureList.appendChild(renderPicture(elem));
      });
    },
    pictureList: pictureList
  };
})();
