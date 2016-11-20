(function(w) {
  /**
   * [selectorFromDOMElement Find selector from element]
   * @param  {[HTMLElement]} element [The element whose selector you want to find]
   * @return {[String]} [The return selector string]
   */
  var selectorFromDOMElement = function(element) {
    var selectors = [];
    //iterate until we reach the document node
    while (element.parentNode !== null) {
      // ID's have the most priority, if we have the ID we don't need anything else.
      if (element.id) {
        selectors.push('#'+ element.id);
        break;
      } else {
        // if Element is body we need tag name and break out of loop
        if (element.parentNode === element.ownerDocument.documentElement) {
          selectors.push(element.nodeName.toLowerCase());
          break;
        }

       var elementsClassList = Array.from(element.classList);
       var needsClassNames = false;
       var needsNthChild = false;
       var ownIndex = -1;
       var siblings = element.parentNode.children;
       /*
        We are looping over the siblings and determining whether we need to use nth-child or classname
       */
       for (var i = 0; (ownIndex === -1 || !needsNthChild) && i < siblings.length; ++i) {
           var sibling = siblings[i];
           if (sibling === element) {
               ownIndex = i;
               continue;
           }
           if (needsNthChild)
               continue;
           if (sibling.nodeName.toLowerCase() !== element.nodeName.toLowerCase())
               continue;

           needsClassNames = true;
           var ownClassNames = elementsClassList;
           var ownClassNameCount = 0;
           for (var name in ownClassNames)
               ++ownClassNameCount;
           if (ownClassNameCount === 0) {
               needsNthChild = true;
               continue;
           }
           var siblingsClassList = Array.from(sibling.classList);
           for (var j = 0; j < siblingsClassList.length; ++j) {
               var siblingClass = siblingsClassList[j];
               if (ownClassNames.indexOf(siblingClass) !== 0)
                   continue;
               delete ownClassNames[siblingClass];
               if (--ownClassNameCount === 0) {
                   needsNthChild = true;
                   break;
               }
           }
       }
       var toPush = element.nodeName.toLowerCase();
       if (needsNthChild) {
           toPush += ":nth-child(" + (ownIndex + 1) + ")";
       } else if (needsClassNames) {
               elementsClassList.map(function(item) { toPush += "." + item; })
       }
       selectors.push(toPush);
        }
        element = element.parentNode;
      }
      return selectors.reverse().join(" > ");
    };
    w.selectorFromDOMElement = selectorFromDOMElement;
})(this)
