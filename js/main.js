var defaultTree = [{
	name : 'Element 1',
	children : null
}, {
	name : 'Element 2',
	children : null
}, {
	name : 'Element 3',
	children : null
}, {
	name : 'Element 4',
	children : [{
		name : 'Child Element 1',
		children : null
	}, {
		name : 'Child Element 2',
		children : null
	}, {
		name : 'Child Element 3',
		children : [{
			name : 'Last Child Element',
			children : null
		}]
	}]
}, {
	name : 'Element 5',
	children : null
}];

var tree;

$(document).ready(function () {
	tree = new Tree();
	tree.buildTree(defaultTree);
});