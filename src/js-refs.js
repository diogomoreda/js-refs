// define the namespace
const JSR = (function() {
    // create an element to temporarily place the markup generated from string templates
    var elementWrapper = document.createElement('div');
    
    /** PUBLIC JSrefs > build(htmlStr)
     * Converts a string containing HTML content into an object containing references to the referenced HTML nodes.
     * Nodes can be referenced by adding an attribute named 'ref' and setting its value to the desired name for the referece in the returned object: 
     * Input HTML string: '<div><ul ref="list"></ul></div>'
     * Output returned object: { root: HTMLnodeRef div, list: HTMLnodeRef ul }
     * Notice that the 'root' property is always returned, without requiring the addition of ref="root" to the HTML template root node.
     * @param {htmlStr} htmlStr a string containing valid html
     * @returns an object containing references to the nodes in the template
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
        elementWrapper.innerHTML = null;
        return referencedNodes;
    }

    /** PRIVATE JSrefs > _getFile(URL)
     * loads the content of a file asynchronously using fetch
     * @param {URL} filePath of the file to be loaded (mus exist in the same domain)
     * @returns contents of the loaded file, or NULL on error
     */
    async function _getFile(filePath) {
        if (!filePath) {
            console.error('a filePath must be passed to _getFile');
            return null;
        } 
        // Does the path name end with a '/'? if not, remove the portion after the last '/'
        var pathname = window.location.pathname;
        pathname = pathname.indexOf('/') === -1 ? '/' : pathname.substring(0, pathname.lastIndexOf('/'));
        // if the given filePath starts with a '/' remove it
        if (filePath.charAt(0) === '/') filePath = filePath.substring(1);
        // if a relative path was provided, compile an absolute path from it
        if (filePath.indexOf('http') !== 0) filePath = window.location.origin + pathname + '/' + filePath;
        // fetch the file
        var response = await fetch(filePath);
        if (!response || (response.ok !== true || response.status !== 200)) {
            console.error('fetch response error')
            return null;
        }
        var responseBody = await response.text();
        return responseBody;
    }

    /** PUBLIC load(filePath)
     * loads and builds node refs from the contents of one or more HTML files asynchronously
     * @param {URL|Array} filePath url as a single string, or an array of strings
     * @returns an object or an object with objects containing node references
     */
    async function _loadTemplate(filePath) {
        if (Array.isArray(filePath)) {
            var output = {};
            for (var i=0; i<filePath.length; i++) {
                output[filePath[i]] = _buildHtmlStringTemplate(await _getFile(filePath[i]))
            }
            return output;
        }
        return _buildHtmlStringTemplate(await _getFile(filePath));
    }


    // export public methods
    return {
        build: _buildHtmlStringTemplate,
        load: _loadTemplate
    }
})()
