// define the namespace
const JSR = (function() {
    // create an element to temporarily place the markup generated from string templates
    var elementWrapper = document.createElement('div');
    // ensure that the element is invisible
    elementWrapper.style.cssText = 'position: absolute; width: 0; height: 0; font-size: 0; line-height: 0; overflow: hidden; z-index: -1';
    // place the element in the document body, when available
    if (document && (document.body)) {
        document.body.appendChild(elementWrapper);
    } else {
        window.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(elementWrapper);
        });
    }
    /** JSrefs > build(htmlStr)
     * Converts a string containing HTML content into an object containing references to the referenced HTML nodes.
     * Nodes can be referenced by adding an attribute named 'ref' and setting its value to the desired name for the referece in the returned object: 
     * Input HTML string: '<div><ul ref="list"></ul></div>'
     * Output returned object: { root: HTMLnodeRef div, list: HTMLnodeRef ul }
     * Notice that the 'root' property is always returned, without requiring the addition of ref="root" to the HTML template root node.
     * @param {htmlStr} htmlStr a string containing valid html
     * @returns an object containing references to the nodes in the 
     */
    function _buildHtmlStringTemplate(htmlStr) {
        elementWrapper.innerHTML = htmlStr;
        var nodeList = elementWrapper.getElementsByTagName('*');
        var referencedNodes = {}; 
        for (var i=0; i<nodeList.length; i++) {
            for (var a=0; a<nodeList[i].attributes.length; a++) {
                if (nodeList[i].attributes[a].nodeName.toLowerCase() === 'ref') {
                    referencedNodes[nodeList[i].attributes[a].nodeValue] = nodeList[i];
                    nodeList[i].removeAttribute('ref');
                    break;
                }
            }
        }
        referencedNodes['root'] = elementWrapper.children[0];
        elementWrapper.removeChild(elementWrapper.children[0]);
        return referencedNodes;
    }
    // export the conversion method as 'build' 
    return {
        build: _buildHtmlStringTemplate
    }
})()
