/*
* date: 2019-08-21
* desc:
*/

var trim = function (str) {
  //
  var reExtraSpace = /^\s*(.*?)\s+$/;

  return str.replace(reExtraSpace, '$1');
};

/**
 *
 * @param element DOM 元素。
 * @param classNames String 用字符串分割开来。
 */
export function addClass(element, classNames) {

  if (!element || !classNames) {
    return;
  }

  var curClassNames = element.className;
  // 用空格分来
  var classes = (classNames || '').split(' ');

  for (var i = 0, len = classes.length; i < len; i++) {
    var classItem = classes[i];
    if (!classItem) {
      continue;
    }

    if (element.classList) {
      element.classList.add(classItem);
    } else if (!hasClass(element, classItem)) {
      curClassNames += ' ' + classItem;
    }
  }

  if (!element.classList) {
    element.className = curClassNames;
  }
}

/**
 *
 * @param element
 * @param classNames
 */
export function removeClass(element, classNames) {
  if (!element || !classNames) {
    return;
  }

  var curClassNames = ' ' + element.className + ' ';
  // 用空格分来
  var classes = (classNames || '').split(' ');

  for (var i = 0, len = classes.length; i < len; i++) {
    var classItem = classes[i];
    if (!classItem) {
      continue;
    }

    if (element.classList) {
      element.classList.remove(classItem);
    } else if (!hasClass(element, classItem)) {
      curClassNames = curClassNames.replace(' ' + classItem + ' ', ' ');
    }
  }

  if (!element.classList) {
    element.className = trim(curClassNames);
  }
}


/**
 *
 * @param element Element 元素
 * @param className
 * @returns {boolean}
 */
export function hasClass(element, className) {
  if (!element || !className) {
    return false;
  }

  //
  if (className.indexOf(' ') !== -1) {
    throw new Error('classNames should not contain space');
  }


  if (element.classList) {
    return element.classList.contains(className);
  } else {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
  }
}


// 依赖 getStyle
function _getStyle(dom, name) {
  try {
    if (window.getComputedStyle) {
      return window.getComputedStyle(dom, null)[name];
    }
    //
    return dom.currentStyle[name];
  } catch (e) {
    return null;
  }
}

//
export function getWidth(dom) {
  let width = _getStyle(dom, 'width');
  if (width === 'auto') {
    width = dom.offsetWidth;
  }
  return parseFloat(width);
}

//
export function getHeight(dom) {
  let height = _getStyle(dom, 'height');
  if (height === 'auto') {
    height = dom.offsetHeight;
  }
  return parseFloat(height);
}
