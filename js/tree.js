/* global $ */

function Tree() {
	this.root = null; // root of all tree nodes
}

/**
 * Sets root to point to a new tre structure
 * @param  array tree
 * @return 
 */
Tree.prototype.buildTree = function (tree) {
	this.root = this.addTree(tree);
};

/**
 * Adds tree structure to parentEl
 * @param array tree
 * @param object parentEl
 */
Tree.prototype.addTree = function (tree, parentEl) {
	var nodesArr = [],
		self = this;

	if (!tree) {
		return null;
	}

	if (!parentEl) { // if there is no parent element this is the first level array
		parentEl = $('.tree');
	} else {
		parentEl = $('<ul></ul>').appendTo(parentEl); // new list for children
	}

	tree.forEach(function (node) {
		var newNode = self.addNode(node.name, parentEl, node.children, nodesArr);
		nodesArr.push(newNode);
	});

	return nodesArr;
};

/**
 * Generates id for node
 * @return string
 */
Tree.prototype.generateId = function () {
	return Date.now() + Math.random().toString(36).substring(13);
};

/**
 * Adds single node to tree
 * @param string name - name of the node
 * @param object parentEl - parent DOM element of node
 * @param array children - children of new node
 * @param array parentArr - array of sibling elements for the new node
 */
Tree.prototype.addNode = function (name, parentEl, children, parentArr) {
	var id = this.generateId(),
		newNode = new Node(name, id, parentArr),
		el = $('<li></li>', { id : id, html: '<span>' + name + '</span><a class="add" href=""><i class="icon-plus-sign"></i></a><a class="remove" href=""><i class="icon-minus-sign"></i></a><a class="edit" href=""><i class="icon-pencil"></i></a>'});

	el.appendTo(parentEl);
	newNode.children = this.addTree(children, el);

	return newNode;
};

/**
 * Returns node from tree by given id
 * @param  string id - id of node
 * @param  array tree - part of the tree that needs to be traversed
 * @return object - returns node or null if node was not found
 */
Tree.prototype.getNode = function (id, tree) {
	var i, l, node;

	if (!tree) {
		return null;
	}
	
	for (i = 0, l = tree.length; i < l; i++) {
		if (node) {// stop if node has been found
			break;
		}

		if (tree[i].id == id) {// stop when this is the node that we are looking for
			node = tree[i];
			break;
		}

		node = this.getNode(id, tree[i].children);
	}

	return node;
};

/**
 * Ands single node to tree from user input
 * @param  string id
 * @param  string name
 */
Tree.prototype.newNode = function (id, name) {
	var parentEl, parentNode, children;

	if (id) {
		parentNode = this.getNode(id, this.root);

		if (!parentNode.children) { // if parent has no children
			$('#' + id).append($('<ul></ul>'));
			parentNode.children = [];
		}

		parentEl = $('#' + id + ' ul:first');
		children = parentNode.children;
	} else { // if no id this is the 1st level node
		parentEl = $('.tree');
		children = this.root;
	}

	children.push(this.addNode(name, parentEl, null, children));
	this.saveTree();
};

/**
 * Removes node from tree
 * @param  string id
 */
Tree.prototype.removeNode = function (id) {
	var index,
		node = this.getNode(id, this.root);

	if (!node) {
		return;
	}

	index = node.parentArr.indexOf(node);

	if (index > -1) {
		node.parentArr.splice(index, 1);
	}

	$('#' + id).remove();
	this.saveTree();
};

/**
 * Edits the name of node
 * @param  string id
 * @param  string name - new name of node
 */
Tree.prototype.editNode = function (id, name) {
	var node = this.getNode(id, this.root);

	if (node) {
		node.name = name;
		$('#' + id + ' span:first').text(name);
		this.saveTree();
	}	
};

/**
 * Returns tree stucture as object that is going to be parsed as JSON
 * @param  Object tree
 * @return Object
 */
Tree.prototype.returnJSONTree = function (tree) {
	var treeArr = [],
		self = this;

	if (!tree) {
		return null;
	}

	tree.forEach(function (node) {
		treeArr.push({
			name : node.name,
			children : self.returnJSONTree(node.children)
		});
	});

	return treeArr;
};

/**
 * Saves tree to local storage
 */
Tree.prototype.saveTree = function () {
	localStorage.setItem('tree', JSON.stringify(this.returnJSONTree(this.root)));
};

/**
 * Loads tree from local storage
 */
Tree.prototype.loadTree = function () {
	var treeObject = localStorage.getItem('tree');

	if (!treeObject) {
		return;
	}

	treeObject = JSON.parse(treeObject);
	$('.tree li').remove();
	this.buildTree(treeObject);
};

/**
 * Class that describes nodes in tree
 * @param string name
 * @param string id
 * @param string parentArr - reference to array that contains sibling elements of this node in parent node
 */
function Node(name, id, parentArr) {
	this.name = name;
	this.id = id;
	this.parentArr = parentArr; // this reference is needed to remove node from tree
	this.children = [];
}