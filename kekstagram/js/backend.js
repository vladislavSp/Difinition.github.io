'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram';
  var URL_DATA = 'https://js.dump.academy/kekstagram/data';

  var requestFunction = function (request, param, url, error) {
    request.addEventListener('error', function () {
      error('Произошла ошибка соединения, подключитесь к интернету');
    });
    request.open(param, url);
  };

  var requestInit = function () {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    return xhr;
  };

  window.backend = {
    download: function (onLoad, onSuccess, onError) {
      var xhr = requestInit();
      xhr.addEventListener('load', function () {
        if (xhr.status === window.constant.GOOD_STATUS) {
          var status = true;
          onLoad(xhr.response);
          onSuccess(status);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      requestFunction(xhr, 'GET', URL_DATA, onError);
      xhr.send();
    },

    upload: function (data, onLoad, onError) {
      var xhr = requestInit();
      xhr.addEventListener('load', function () {
        if (xhr.status === window.constant.GOOD_STATUS) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      requestFunction(xhr, 'POST', URL, onError);
      xhr.send(data);
    }
  };
})();
