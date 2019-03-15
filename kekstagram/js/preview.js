'use strict';

(function () {
  var VIEW_COMMENTS = 5;
  var body = document.querySelector('body');
  var bigPicture = body.querySelector('.big-picture'); // Блок полноэкранного большого изображения
  var bigPictureButton = bigPicture.querySelector('.big-picture__cancel'); // кнопка закрытия полноэкранного изображения
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var viewComment = bigPicture.querySelector('.social__comment-count');
  var allCommentCount = viewComment.querySelector('.comments-count');
  var ul = bigPicture.querySelector('.social__comments');

  var makeElement = function (tagName, className, attributes) {
    var element = document.createElement(tagName);
    element.classList.add(className);

    if (attributes) {
      element.setAttribute('alt', attributes.alt);
      element.setAttribute('width', attributes.width);
      element.setAttribute('height', attributes.height);
    }
    return element;
  };

  var createComment = function () {
    var parameters = {
      alt: 'Аватар комментаторов фотографии',
      width: window.constant.WIDTH_IMG,
      height: window.constant.HEIGHT_IMG
    };

    var li = makeElement('li', 'social__comment');
    var img = makeElement('img', 'social__picture', parameters);
    var p = makeElement('p', 'social__text');
    li.appendChild(img);
    li.appendChild(p);

    return li;
  };

  var createOneString = function (comment) {
    var element = createComment().cloneNode(true);
    element.querySelector('.social__picture').setAttribute('src', comment.avatar);
    element.querySelector('.social__text').textContent = comment.message;

    return element;
  };

  var hideComment = function (node) {
    var list = node.childNodes;
    for (var j = VIEW_COMMENTS; j < list.length; j++) {
      list[j].classList.add('visually-hidden');
    }
  };

  var createComments = function (descriptions, index) {
    ul.innerHTML = '';
    allCommentCount.textContent = descriptions[index].comments.length;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < descriptions[index].comments.length; i++) {
      fragment.appendChild(createOneString(descriptions[index].comments[i]));
    }
    ul.appendChild(fragment);
    hideComment(ul);

    var allComments = ul.childNodes;
    if (allComments.length < VIEW_COMMENTS) {
      commentsLoader.classList.add('visually-hidden');
    }

    var commentsLength = VIEW_COMMENTS;

    var loaderClickHandler = function () {
      if (allComments.length > commentsLength - 1) {
        commentsLength += VIEW_COMMENTS;
        if (commentsLength >= allComments.length) {
          commentsLength = allComments.length;
          commentsLoader.classList.add('visually-hidden');
        }
        viewComment.textContent = commentsLength + ' из ' + allComments.length + ' комментариев';
        for (var k = VIEW_COMMENTS; k < commentsLength; k++) {
          allComments[k].classList.remove('visually-hidden');
        }
      }
    };

    commentsLoader.addEventListener('click', loaderClickHandler);
    window.loaderClickHandler = loaderClickHandler;
  };

  // Показ полноэкранного изображения
  var viewBigPicture = function (evt) {
    var target = evt.target;

    if (target.src) {
      var indexPhoto = target.getAttribute('src').match(/\d+/)[0] - 1; // то изображение, на котором щёлкнули

      var picturesLoadHandler = function (desc) {
        if (target.tagName !== 'SECTION' && target.parentNode.tagName === 'A') {
          window.serviceFunction.deleteClass(document, '.big-picture', 'hidden');
          body.classList.add('modal-open');

          bigPicture.querySelector('.big-picture__img').children[0].setAttribute('src', desc[indexPhoto].url);
          bigPicture.querySelector('.likes-count').textContent = desc[indexPhoto].likes;
          bigPicture.querySelector('.social__caption').textContent = desc[indexPhoto].description;
          allCommentCount.textContent = desc[indexPhoto].comments.length;
          viewComment.textContent = desc[indexPhoto].comments.length < VIEW_COMMENTS ? desc[indexPhoto].comments.length + ' из ' + allCommentCount.textContent + ' комментариев' : VIEW_COMMENTS + ' из ' + allCommentCount.textContent + ' комментариев';

          createComments(desc, indexPhoto);
        }
      };

      var picturesSuccessHandler = function (status) {
        return status;
      };

      window.backend.download(picturesLoadHandler, picturesSuccessHandler);
    }

    var closeBigPicture = function () {
      bigPicture.classList.add('hidden');
      body.removeAttribute('class');
      commentsLoader.removeEventListener('click', window.loaderClickHandler);
      commentsLoader.classList.remove('visually-hidden');
    };

    bigPictureButton.addEventListener('click', function () {
      closeBigPicture();
    });

    document.addEventListener('keydown', function (keyEvt) {
      if (keyEvt.keyCode === window.constant.ESC_CODE) {
        closeBigPicture();
      }
    });
  };

  window.picture.pictureList.addEventListener('click', viewBigPicture);
})();
