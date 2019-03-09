var baseTags = document.getElementsByTagName('base');
if (baseTags.length) {
  // baseTags[0].href is resolved as an absolute URI even when relative. Despite this IE ignores it for loading
  // resources so we need to check the actual attribute value and make it absolute if it's not.
  var attributes = baseTags[0].attributes;
  var hrefAttribute;
  var baseURI = '';

  for (var i = 0; i < attributes.length; i++) {
    if (attributes[i].name === 'href') {
      hrefAttribute = attributes[i];
      break;
    }
  }

  if (hrefAttribute) {
    baseURI = hrefAttribute.value;
  }

  if (!/^http/.test(baseURI)) {
    baseURI = location.protocol + '//' + location.host + baseURI;
    if (hrefAttribute) {
      hrefAttribute.value = baseURI;
    }
  }
  document.baseURI = baseURI;
} else {
  document.baseURI = location.href;
}
