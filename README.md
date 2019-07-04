# EnvironmentDetector

## Bug reporting data

```js
function getDocumentElement(element) {
  return {
    clientRects: element.getClientRects(),
    boundingClientRects: element.getBoundingClientRect(),
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
    offsetWidth: element.offsetWidth,
    offsetHeight: element.offsetHeight,
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight
  }
}

var sizeCollection = {
    inner: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    },
    outer: {
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    },
    body: getDocumentElement(document.body),
    html: getDocumentElement(document.documentElement),
    scroll: getDocumentElement(document.scrollingElement),
    screen: window.screen
};
console.log(sizeCollection);
```
