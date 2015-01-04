/* global chai, describe, it, Tree, $ */

var expect = chai.expect;

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

var jquery = $;

describe('Tree', function () {
	it('should have root atribute', function () {
		var tree = new Tree();
		expect(tree.root).to.equal(null);
	});

	describe('#buildTree()', function () {
		it('should call addTree function', function (done) {
			var tree = new Tree();
			
			tree.addTree = function (atr) {
				expect(atr).to.equal('test');
				done();
			};

			tree.buildTree('test');
		});
	});

	describe('#addTree()', function () {
		it('should return null if tree is falsy', function () {
			var tree = new Tree();

			expect(tree.addTree()).to.equal(null);
		});		

		var testParent = null;
		$ = function (val) {
			return {
				val : val, 
				appendTo : function (el) {
					testParent = el;
					return val;
				} 
			};
		};

		$.prototype.appendTo = function (el) {
			this.test = el;
		};

		it('should call addNode function with .tree element if parentEl is not passed', function (done) {
			var tree = new Tree();

			tree.addNode = function (name, parentEl, children, arr) {
				expect(parentEl.val).to.equal('.tree');
				expect(children).to.equal('children');
				expect(arr).to.deep.equal([]);
				done();
			};

			tree.addTree([{name : 'name', children : 'children'}]);
		});

		it('should call addNode function with new ul element if parentEl is passed', function (done) {
			var tree = new Tree();

			tree.addNode = function (name, parentEl, children, arr) {
				expect(parentEl).to.equal('<ul></ul>');
				expect(testParent).to.equal('parent');
				expect(children).to.equal('children');
				expect(arr).to.deep.equal([]);
				done();
			};

			tree.addTree([{name : 'name', children : 'children'}], 'parent');
		});

		it('should call addNode for each node in tree', function (done) {
			var tree = new Tree(),
				counter = 0;

			tree.addNode = function () {
				counter++;

				if (counter === 3) {
					done();
				}
			};

			tree.addTree([{name : 'name', children : 'children'},{name : 'name', children : 'children'},{name : 'name', children : 'children'}], 'parent');
		});

		it('should return array with nodes that addNode function returns', function () {
			var tree = new Tree();

			tree.addNode = function () {
				return 'node';
			};

			expect(tree.addTree([{name : 'name', children : 'children'},{name : 'name', children : 'children'},{name : 'name', children : 'children'}], 'parent')).to.deep.equal(['node', 'node', 'node']);
			$ = jquery;
		});
	});

	describe('#generateId()', function () {
		it('should return string that is atleast 13 characters long', function () {
			var tree = new Tree();

			expect(tree.generateId().length).to.be.above(12);
		});

		it('should not return the same id', function () {
			var tree = new Tree();

			expect(tree.generateId()).to.not.equal(tree.generateId());
		});
	});

	describe('#addNode()', function () {
		it('should append new node to parent element', function () {
			var tree = new Tree(),
				parentEl = $('<div></div>');

			tree.generateId = function () {
				return 'id';
			};

			tree.addNode('name', parentEl, ['test']);

			expect(parentEl.html()).to.equal('<li id="id"><span>name</span><a class="add" href=""><i class="icon-plus-sign"></i></a><a class="remove" href=""><i class="icon-minus-sign"></i></a><a class="edit" href=""><i class="icon-pencil"></i></a><ul><li id="id"><span>undefined</span><a class="add" href=""><i class="icon-plus-sign"></i></a><a class="remove" href=""><i class="icon-minus-sign"></i></a><a class="edit" href=""><i class="icon-pencil"></i></a></li></ul></li>');
		});

		it('should return new node', function () {
			var newNode,
				tree = new Tree(),
				parentEl = $('<div></div>'),
				testNode = new Node('name', 'id', ['parentArr']);

			tree.generateId = function () {
				return 'id';
			};

			tree.addTree = function (children, el) {
				expect(children).to.deep.equal(['test']);
				expect(el.attr('id')).to.equal('id');

				return 'children';
			};

			testNode.children = 'children';

			newNode = tree.addNode('name', parentEl, ['test'], ['parentArr']);

			expect(newNode.name).to.equal(testNode.name);
			expect(newNode.id).to.equal(testNode.id);
			expect(newNode.parentArr).to.deep.equal(testNode.parentArr);
			expect(newNode.children).to.equal(testNode.children);
		});
	});

	describe('#getNode()', function () {
		it('should return null if tree is not passed', function () {
			var tree = new Tree();

			tree.buildTree(defaultTree);

			expect(tree.getNode(tree.root[0].id)).to.equal(null);
		});

		it('should find node by id', function () {
			var tree = new Tree();

			tree.buildTree(defaultTree);

			expect(tree.getNode(tree.root[3].children[0].id, tree.root).name).to.equal('Child Element 1');
		});

		it('should not find anything if id does not exist in the tree', function () {
			var tree = new Tree();

			tree.buildTree(defaultTree);

			expect(tree.getNode('someId', tree.root)).to.equal(null);
		});
	});

	describe('#newNode()', function () {
		it('should get parent node if id is passed in', function (done) {
			var tree = new Tree(),
				node = [{ name : 'test', children : null }];

			tree.root = node;

			tree.getNode = function (id, root) {
				expect(id).to.equal('id');
				expect(root).to.equal(node);

				return { children : null };
			};

			tree.addNode = function (name, parentEl, children, parentArr) {
				expect(name).to.equal('name');
				expect(children).to.equal(null);
				expect(parentArr).to.deep.equal([]);

				done();
			};

			tree.newNode('id', 'name');
		});

		it('should append a new ul element if this first child of parent node', function () {
			var tree = new Tree(),
				node = [{ name : 'test', children : null }],
				parentNode = { children : false },
				counter = 0;

			tree.root = node;

			$ = function (val) {
				counter++;
				if (counter === 1) {
					expect(val).to.equal('#id');
				} else if (counter === 2) {
					expect(val).to.equal('<ul></ul>');
				} if (counter === 3) {
					expect(val).to.equal('#id ul:first');
				}
				
				return {
					append : function () {} 
				};
			};

			tree.getNode = function () {
				return parentNode;
			};

			tree.addNode = function () {
				return 'children';
			};

			tree.newNode('id');

			expect(parentNode.children).to.deep.equal(['children']);
		});

		it('should get parent ul element if parent node already has child nodes', function () {
			var tree = new Tree(),
				node = [{ name : 'test', children : null }],
				parentNode = { children : ['children'] };

			tree.root = node;

			$ = function (val) {
				expect(val).to.equal('#id ul:first');

				return '#id ul:first';
			};

			tree.getNode = function () {
				return parentNode;
			};

			tree.addNode = function (name, parentEl, children, parentArr) {
				expect(name).to.equal('name');
				expect(parentEl).to.equal('#id ul:first');
				expect(children).to.equal(null);
				expect(parentArr).to.deep.equal(['children']);

				return 'children2';
			};

			tree.newNode('id', 'name');

			expect(parentNode.children).to.deep.equal(['children', 'children2']);
		});

		it('should use root as parent element if id is falsy', function (done) {
			var tree = new Tree();

			tree.root = ['root'];

			$ = function (val) {
				expect(val).to.equal('.tree');

				return '.tree';
			};

			tree.getNode = function () {
				return { children : ['children'] };
			};

			tree.addNode = function (name, parentEl, children, parentArr) {
				expect(name).to.equal('name');
				expect(parentEl).to.equal('.tree');
				expect(children).to.equal(null);
				expect(parentArr).to.deep.equal(['root']);

				return 'children2';
			};

			tree.saveTree = function () {
				expect(tree.root).to.deep.equal(['root', 'children2']);

				$ = jquery;

				done();
			};

			tree.newNode(null, 'name');
		});
	});

	describe('#removeNode()', function () {
		it('should get node by id', function (done) {
			var tree = new Tree();

			tree.root = 'root';

			tree.getNode = function (id, root) {
 				expect(id).to.equal('id');
 				expect(root).to.equal('root');

 				done();

 				return { parentArr : [] };
			};

			tree.removeNode('id');
		});

		it('should remove node if it finds it', function (done) {
			var tree = new Tree();

			tree.buildTree([
				{name : 1, children : null}, 
				{name : 2, children : null}, 
				{name : 3, children : null}
			]);

			tree.saveTree = function () {
				expect(tree.root.length).to.equal(2);

				done();
			};

			tree.removeNode(tree.root[0].id);
		});

		it('should not remove node if id is wrong', function () {
			var tree = new Tree();

			tree.buildTree([
				{name : 1, children : null}, 
				{name : 2, children : null}, 
				{name : 3, children : null}
			]);

			tree.saveTree = function () {
				throw new Error('should not save');
			};

			tree.removeNode('id');

			expect(tree.root.length).to.equal(3);
		});
	});

	describe('#editNode()', function () {
		it('should get node by id', function (done) {
			var tree = new Tree();

			tree.root = 'root';

			tree.getNode = function (id, root) {
 				expect(id).to.equal('id');
 				expect(root).to.equal('root');

 				done();

 				return { name : 'name' };
			};

			tree.editNode('id', 'name2');
		});

		it('should change the name of node', function () {
			var tree = new Tree();

			tree.buildTree([{name : 'name', children : null}]);
			tree.editNode(tree.root[0].id, 'name2');

			expect(tree.root[0].name).to.equal('name2');
		});

		it('should change the name in HTML', function (done) {
			var tree = new Tree();

			tree.buildTree([{name : 'name', children : null}]);

			$ = function (val) {
				expect(val).to.equal('#' + tree.root[0].id + ' span:first');

				return {
					text : function (str) {
						expect(str).to.equal('name2');

						$ = jquery;

						done();
					}
				};
			};
			
			tree.editNode(tree.root[0].id, 'name2');
		});

		it('should save tree to localStorage', function (done) {
			var tree = new Tree();

			tree.saveTree = function () {
				done();
			};

			tree.buildTree([{name : 'name', children : null}]);
			tree.editNode(tree.root[0].id, 'name2');
		});
	});

	describe('#returnJSONTree()', function () {
		it('should return null if tree is not passed', function () {
			var tree = new Tree();

			expect(tree.returnJSONTree()).to.equal(null);
		});

		it('should return tree if name and children attributes in nodes', function () {
			var tree = new Tree();

			tree.buildTree([
				{name : 1, children : [{name : 'test', children : null }]}, 
				{name : 2, children : null}, 
				{name : 3, children : null}
			]);

			expect(tree.returnJSONTree(tree.root)).to.deep.equal([
				{name : 1, children : [{name : 'test', children : null}]}, 
				{name : 2, children : null}, 
				{name : 3, children : null}
			]);
		});
	});

	describe('#saveTree()', function () {
		it('should save tree to localStorage', function () {
			var tree = new Tree();

			tree.buildTree([{ name : 'name', children : null }]);
			tree.saveTree();

			expect(localStorage.getItem('tree')).to.equal('[{"name":"name","children":null}]');
		});
	});

	describe('#loadTree()', function () {
		it('should remove previous tree element from DOM', function (done) {
			var tree = new Tree();

			tree.buildTree([{ name : 'name', children : null }]);
			tree.saveTree();

			$ = function (val) {
				expect(val).to.equal('.tree li');

				return {
					remove : function () {
						done();
					}
				};
			};

			tree.loadTree();

			$ = jquery;
		});

		it('should build a new tree from localStorage', function (done) {
			var tree = new Tree();

			localStorage.setItem('tree', '[{"name":"name2","children":null}]');

			tree.buildTree = function (treeObj) {
				expect(treeObj).to.deep.equal([{ name : 'name2', children : null }]);

				done();
			};

			tree.loadTree();
		});
	});
});

describe('Node', function () {
	it('should create new object with accurate attributes', function () {
		var node = new Node('name', 'id', ['parentArr']);

		expect(node.name).to.equal('name');
		expect(node.id).to.equal('id');
		expect(node.parentArr).to.deep.equal(['parentArr']);
		expect(node.children).to.deep.equal([]);
	});
});