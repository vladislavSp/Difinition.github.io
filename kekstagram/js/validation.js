'use strict';

(function () {
  var form = document.querySelector('.img-upload__form');
  var hashtagsField = form.querySelector('.text__hashtags');
  var textDescription = form.querySelector('.text__description');
  var mainContent = document.querySelector('main');
  var errorBlockTemplate = document.querySelector('#error').content.querySelector('.error');
  var successBlockTemplate = document.querySelector('#success').content.querySelector('.success');

  var successBlock = successBlockTemplate.cloneNode(true);
  var successButton = successBlock.querySelector('.success__button');
  var errorBlock = errorBlockTemplate.cloneNode(true);
  var errorButton = errorBlock.querySelector('.error__button');

  var appendMessage = function (parentBlock, childBlock) {
    parentBlock.appendChild(childBlock);
    childBlock.classList.add('visually-hidden');
  };

  appendMessage(mainContent, successBlock);
  appendMessage(mainContent, errorBlock);

  var hashtagInputHandler = function (evt) {
    var target = evt.target;
    var inputText = target.value.toLowerCase();
    var newArrays = inputText.split(' '); // массив коммент-в, разделенных пробелом

    var sortArrays = function (arrays) {
      var dublicate = false;
      for (var i = 0; i < arrays.length - 1; i++) {
        if (arrays[i + 1] === arrays[i]) {
          dublicate = true;
        }
      }
      return dublicate;
    };

    newArrays.forEach(function (hashtag) {
      var simbols = hashtag.split(''); // массив символов
      var newSimbols = simbols.slice();

      if (hashtag.indexOf('#') !== 0 && hashtag) {
        target.setCustomValidity('Вначале слова должен быть знак хэштега #');
        hashtagsField.style.border = '2px solid red';
      } else if (hashtag.length === 0 && hashtag.indexOf('#', 0) === 0) {
        target.setCustomValidity('Хэштег не может состоять из одного знака #');
        hashtagsField.style.border = '2px solid red';
      } else if (newSimbols.sort().indexOf('#', 1) === 1) {
        target.setCustomValidity('Разделите хэштеги пробелом!');
        hashtagsField.style.border = '2px solid red';
      } else if (hashtag.length < window.constant.MIN_LENGTH && hashtag.length > 0) {
        target.setCustomValidity('Хэштег должен быть не меньше 2-х символов');
        hashtagsField.style.border = '2px solid red';
      } else if (simbols.length > window.constant.MAX_LENGTH) {
        target.setCustomValidity('Хэштег должен быть не больше 20 символов');
        hashtagsField.style.border = '2px solid red';
      } else if (newArrays.length > window.constant.AMOUNT_HASHTAGS) {
        target.setCustomValidity('Допускается не более 5 хэштегов в форме');
        hashtagsField.style.border = '2px solid red';
      } else if (sortArrays(newArrays)) {
        target.setCustomValidity('Нельзя использовать одинаковые хэштеги!');
        hashtagsField.style.border = '2px solid red';
      } else {
        target.setCustomValidity('');
        hashtagsField.style.border = '';
      }
    });
  };

  var commentInputHandler = function (evt) {
    var target = evt.target;
    var description = target.value;

    if (description.length > window.constant.DESCRIPTION_MAX_LENGTH) {
      target.setCustomValidity('Комментарий не должен превышать 140 символов!');
      textDescription.style.border = '2px solid red';
      return;
    } else {
      target.setCustomValidity('');
      textDescription.style.border = '';
    }
  };

  // Удачная загрузка
  var formUploadHandler = function () {
    window.serviceFunction.addClass(document, '.img-upload__overlay', 'hidden');
    successBlock.classList.remove('visually-hidden');

    successButton.addEventListener('click', function () {
      successBlock.classList.add('visually-hidden');
      document.removeEventListener('click', successClickHandler);
      document.removeEventListener('keydown', successKeyHandler);
    });

    var successClickHandler = function (evt) {
      if (evt.target !== successBlock.children[0]) {
        successBlock.classList.add('visually-hidden');
        document.removeEventListener('click', successClickHandler);
        document.removeEventListener('keydown', successKeyHandler);
      }
    };

    var successKeyHandler = function (evt) {
      if (evt.keyCode === window.constant.ESC_CODE) {
        successBlock.classList.add('visually-hidden');
        document.removeEventListener('click', successClickHandler);
        document.removeEventListener('keydown', successKeyHandler);
      }
    };

    document.addEventListener('click', successClickHandler);
    document.addEventListener('keydown', successKeyHandler);
  };

  // Неудачная загрузка
  var formErrorHandler = function () {
    window.serviceFunction.addClass(document, '.img-upload__overlay', 'hidden');
    errorBlock.classList.remove('visually-hidden');

    errorButton.addEventListener('click', function () {
      errorBlock.classList.add('visually-hidden');
      document.removeEventListener('click', errorClickHandler);
      document.removeEventListener('keydown', errorClickHandler);
    });

    var errorClickHandler = function (evt) {
      if (evt.target !== errorBlock.children[0]) {
        errorBlock.classList.add('visually-hidden');
        document.removeEventListener('click', errorClickHandler);
        document.removeEventListener('keydown', errorClickHandler);
      }
    };

    var errorKeyHandler = function (evt) {
      if (evt.keyCode === window.constant.ESC_CODE) {
        errorBlock.classList.add('visually-hidden');
        document.removeEventListener('click', errorClickHandler);
        document.removeEventListener('keydown', errorKeyHandler);
      }
    };

    document.addEventListener('click', errorClickHandler);
    document.addEventListener('keydown', errorKeyHandler);
  };

  form.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(form), formUploadHandler, formErrorHandler);
    window.resetAttributes('data-filter-effect', 'class', 'style');
    hashtagsField.removeEventListener('input', hashtagInputHandler);
    textDescription.removeEventListener('input', commentInputHandler);
    form.reset();
    evt.preventDefault();
  });

  window.validation = {
    hashtagsField: hashtagsField,
    textDescription: textDescription,
    hashtagInputHandler: hashtagInputHandler,
    commentInputHandler: commentInputHandler
  };

})();
