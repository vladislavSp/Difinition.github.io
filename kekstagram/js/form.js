'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var START_VALUE = 100; // Начальное значение value в поле ввода
  var sectionImg = document.querySelector('.img-upload'); // основной сектор поиска
  var fileChooser = sectionImg.querySelector('.img-upload__start input[type=file]'); // значок загрузки
  var imgUpload = sectionImg.querySelector('.img-upload__preview'); // Загруженное изображение
  var uploadCancel = sectionImg.querySelector('.img-upload__cancel'); // иконка закрытия окна редактирования

  var scale = sectionImg.querySelector('.img-upload__scale');
  var scaleDown = scale.querySelector('.scale__control--smaller'); // Дальше находим элементы шкалы масштаба
  var scaleUp = scale.querySelector('.scale__control--bigger');
  var scaleValue = scale.querySelector('.scale__control--value');

  var sliderAll = sectionImg.querySelector('.img-upload__effect-level'); // Весь слайдер с пином
  var linePine = sliderAll.querySelector('.effect-level__line'); // Линия перемещения пина
  var effectPin = linePine.querySelector('.effect-level__pin'); // Пин изм-я глубины эффекта
  var effectDepth = linePine.querySelector('.effect-level__depth'); // Послоса глубины эфф-та
  var effectLevel = sliderAll.querySelector('.effect-level__value'); // поле value

  var sizeLinePin = {};
  var effects = sectionImg.querySelector('.effects'); // Выбор всех эффектов фото
  var effectsRadio = effects.querySelector('.effects__radio'); // первый эффект

  // Открытие формы редактирования изображения при наступлении события change
  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imgUpload.children[0].src = reader.result;
      });
      reader.readAsDataURL(file);
    }

    scaleValue.value = START_VALUE + '%';
    window.serviceFunction.deleteClass(document, '.img-upload__overlay', 'hidden');
    sliderAll.classList.add('hidden');
    init();
  });

  // Добавление логики масштабирования +/-
  var scaleFunction = function (increaseValue) {
    scaleValue.value = increaseValue === true ? parseInt(scaleValue.value, 0) - window.constant.SCALE_UNIT + '%' : parseInt(scaleValue.value, 0) + window.constant.SCALE_UNIT + '%';
    if (increaseValue === true ? parseInt(scaleValue.value, 0) < window.constant.SCALE_UNIT : parseInt(scaleValue.value, 0) > window.constant.MAX_LENGTH_SCALE) {
      scaleValue.value = increaseValue === true ? window.constant.SCALE_UNIT + '%' : window.constant.MAX_LENGTH_SCALE + '%';
    }
    imgUpload.style.transform = 'scale(' + parseInt(scaleValue.value, 0) / window.constant.MAX_LENGTH_SCALE + ')';
  };

  var scaleDecreaseHandler = function () {
    scaleFunction(false);
  };

  var scaleIncreaseHandler = function () {
    scaleFunction(true);
  };

  // Функция для установки начальной позиции слайдера
  var setPinPosition = function (e, value) {
    sizeLinePin = linePine.getBoundingClientRect();
    var pinPos = typeof value === 'number' ? value : e.clientX - sizeLinePin.left; // сбрасывает начальное положение

    if (pinPos <= 0) {
      pinPos = 0;
    } else if (pinPos >= sizeLinePin.width) {
      pinPos = sizeLinePin.width;
    }

    var percentPos = Math.round(pinPos / (sizeLinePin.width / 100));
    effectPin.style.left = pinPos + 'px';
    effectDepth.style.width = percentPos + '%';

    effectLevel.value = percentPos; // записывает уровень эффекта в инпут
    setFilterQuality(percentPos);
  };

  // Функция для установки фильтров для фотографии
  var setFilterQuality = function (value) {
    var quality = '';
    if (value < 10) {
      quality = '0.0' + value;
    } else if (value < 100) {
      quality = '0.' + value;
    } else {
      quality = 1;
    }

    var saturation = '';
    switch (imgUpload.children[0].dataset['filterEffect']) {
      case 'chrome':
        saturation = 'grayscale(' + quality + ')';
        break;
      case 'sepia':
        saturation = 'sepia(' + quality + ')';
        break;
      case 'marvin':
        saturation = 'invert(' + value + '%)';
        break;
      case 'phobos':
        saturation = 'blur(' + ((value * window.constant.BLUR_MAX) / 100) + 'px)';
        break;
      case 'heat':
        saturation = 'brightness(' + (window.constant.BRIGHTNESS_MIN + ((value * 2) / 100)) + ')';
        break;
      default:
        saturation = '';
        break;
    }

    imgUpload.children[0].style.filter = saturation;
  };

  var resetAttributes = function (attr1, attr2, attr3) {
    imgUpload.children[0].removeAttribute(attr1);
    imgUpload.children[0].removeAttribute(attr2);
    imgUpload.children[0].removeAttribute(attr3);
  };

  var resetFormValues = function (param1, param2, param3) {
    resetAttributes(param1, param2, param3);
    window.serviceFunction.addClass(document, '.img-upload__overlay', 'hidden');
    fileChooser.value = '';
    effectsRadio.checked = true;
    imgUpload.style.transform = 'scale(' + START_VALUE / window.constant.MAX_LENGTH_SCALE + ')';

    scaleUp.removeEventListener('click', scaleDecreaseHandler);
    scaleDown.removeEventListener('click', scaleIncreaseHandler);
    window.validation.hashtagsField.removeEventListener('input', window.validation.hashtagInputHandler);
    window.validation.textDescription.removeEventListener('input', window.validation.commentInputHandler);
  };

  var init = function () {
    imgUpload.style.transform = 'scale(' + START_VALUE / window.constant.MAX_LENGTH_SCALE + ')'; // начальный масштаб изображения

    // Закрытие формы редактирования изображения при помощи кнопки закрытия
    uploadCancel.addEventListener('click', function () {
      resetFormValues('data-filter-effect', 'class', 'style');
    });
    // Закрытие формы редактирования изображения при помощи ESC (также происходит reset при нажатии на ESC)
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.constant.ESC_CODE && evt.target !== window.validation.hashtagsField && evt.target !== window.validation.textDescription) {
        resetFormValues('data-filter-effect', 'class', 'style');
      }
    });

    scaleUp.addEventListener('click', scaleDecreaseHandler);
    scaleDown.addEventListener('click', scaleIncreaseHandler);

    window.validation.hashtagsField.addEventListener('input', window.validation.hashtagInputHandler);
    window.validation.textDescription.addEventListener('input', window.validation.commentInputHandler);

    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', setPinPosition);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    effectPin.addEventListener('mousedown', function () {
      document.addEventListener('mousemove', setPinPosition);
      document.addEventListener('mouseup', mouseUpHandler);
    });

    linePine.addEventListener('mouseup', setPinPosition);

    effects.addEventListener('change', function (e) {
      var filter = e.target.value;

      imgUpload.children[0].setAttribute('data-filter-effect', filter);
      imgUpload.children[0].className = 'effects__preview--' + filter;

      sliderAll.classList[filter === 'none' ? 'add' : 'remove']('hidden');

      setPinPosition(false, linePine.getBoundingClientRect().width);
    });
  };

  window.resetAttributes = resetAttributes;

})();
