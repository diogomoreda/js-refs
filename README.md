# JS Refs

A lightweight JS module to facilitate the creation and manipulation of HTML nodes in the browser, using strings containing HTML code as input models.

This module deprecates the usage of 'hard to read' code patterns such as:

```js
function createMarkupObject(name, value)
    var rootNode = document.createElement('div');
    rootNode.className = 'root-node';
    var labelNode = document.createElement('label');
    labelNode.className = 'label-node';
    labelNode.innerHTML = name;
    var valueNode = document.createElement('span');
    valueNode.className = 'value-node';
    valueNode.innerHTML = value;
    rootNode.appendChild(labelNode);
    rootNode.appendChild(valueNode);
    return rootNode
}
document.body.appendChild(createMarkupObject('Code generated', 'hard to read'))
```

In favour of a more elegant approach that allows using strings as 'easy to read' templates for blocks of code:

```js
const template = `
    <div>
        <label ref="name"></label>
        <span ref="value"></span>
    </div>
`;

var refs = JSR.build(template);

refs['name'].innerHTML = 'Template generated';
refs['value'].innerHTML = 'easy to read';
document.body.appendChild(refs['root']);

```
## Description

The working principle is very simple:

the template nodes whose references are to be returned in the output object, must contain a 'special' attribute named **'ref'**;

The **value** assigned to the node's **'ref'** attribute will be the name of the respective reference property in the returned ouptut object.

For this reason, every **'ref'** value should be **unique** to each node in the same template.

When a single root node exists in a HTML template string, one does not need to explicitly assign a **'ref'** attribute to the template root node as this is always included in the returned output object, only child nodes of the template root node should be assigned with **'ref'** attributes with the following exception:

If the template string contains more then 1 root node, only the first root node is returned as 'root' in the output object. The rest of the root nodes in the template string will require the assignment of **'ref'** attributes in order to be returned in the output object.

The returned root reference will be specially usefull to place the resulting markup somewhere in the page body.
The resulting markup won't contain any 'ref' attributes as this would make the resulting markup invalid.


## Benefits

The obvious advantage this feature has to offer, is the ability to work with 'easy to read' blocks of code.

HTML template strings can be directly defined in the code, or imported from other JS files or JSONs from server responses, making it easier to build and organise multiple sets of templates.


## Namespace 
The module takes the global namespace **'JSR'** 

## Methods
**JSR.build(HTMLstr)** main method. Converts a string containing HTML content into an object containing references to the referenced HTML nodes.
