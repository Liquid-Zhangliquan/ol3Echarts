/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
const isObject = (value: any): boolean => {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
};

/**
 * merge
 * @param a
 * @param b
 * @returns {*}
 */
const merge = (a: any, b: any): any => {
  for (const key in b) {
    if (isObject(b[key]) && isObject(a[key])) {
      merge(a[key], b[key]);
    } else {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * get parent container
 * @param selector
 * @param doc
 */
const getTarget = (selector, doc = document) => {
  let dom = (function () {
    let found;
    return doc && /^#([\w-]+)$/.test(selector)
      ? (found = doc.getElementById(RegExp.$1)) // eslint-disable-line
        ? [found]
        : [] // eslint-disable-line
      : Array.prototype.slice.call(
        /^\.([\w-]+)$/.test(selector)
          ? doc.getElementsByClassName(RegExp.$1)
          : /^[\w-]+$/.test(selector)
            ? doc.getElementsByTagName(selector)
            : doc.querySelectorAll(selector)
      );
  })();
  return dom;
};

/**
 * map items
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
const map = function (obj: any[], cb: (value: any, index: number, array: any[]) => any, context: any) {
  if (!(obj && cb)) return;
  if (obj.map && obj.map === Array.prototype.map) {
    return obj.map(cb, context);
  } else {
    let result = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      result.push(cb.call(context, obj[i], i, obj));
    }
    return result;
  }
};

/**
 * bind context
 * @param func
 * @param context
 */
const bind = function (func: Function, context: any): Function {
  const args = Array.prototype.slice.call(arguments, 2);
  return function () {
    return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
  };
};

/**
 * add own item
 * @param array
 * @param item
 */
const arrayAdd = function (array: any[], item: any): any[] {
  let i = 0;
  let index;
  const length = array.length;
  for (; i < length; i++) {
    if (array[i]['seriesIndex'] === item['seriesIndex']) {
      index = i;
    }
  }
  if (index === undefined) {
    array.push(item);
  } else {
    array[index] = item;
  }
  return array;
};

export { getTarget, merge, isObject, map, bind, arrayAdd };