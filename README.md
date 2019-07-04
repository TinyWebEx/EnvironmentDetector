# EnvironmentDetector

## Example EnvironmentDetector popup

The `manifest.json` here contains an example for an add-on with a popup, you can use for testing.

To access it as a normal browser site, click the "Manifest address" link and change the URL to look like this one:
```
moz-extension://<ADDON-ID>/examples/popup/popup.html
```

You can adjust the [`popup.css`](./examples/popup/popup.css) file to change the size of the popup for testing.

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
