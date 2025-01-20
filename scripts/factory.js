function createElement(tagName, attributes, children) {
    const element = document.createElement(tagName);
  
    for (let key in attributes) {
      if (key === 'class') {
        element.className = attributes[key];
      } else if (key === 'style') {
        element.style.cssText = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    }
  
    if (children && children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        element.appendChild(children[i]);
      }
    }
  
    return element;
  }

  export { createElement };
  