/* global $, tree */

$(document).ready(function () {
	var curentNodeId = null;

	$('.tree').on('click', '.add', function () {
		$('#new-node-modal').modal('show');
		curentNodeId = $(this).parent().attr('id');

		return false;
	});

	$('.tree').on('click', '.edit', function () {
		$('#edit-node-modal').modal('show');
		curentNodeId = $(this).parent().attr('id');
		$('#edit-node-name').val($('#' + curentNodeId + ' span:first').text());

		return false;
	});

	$('.tree').on('click', '.remove', function () {
		tree.removeNode($(this).parent().attr('id'));

		return false;
	});

	$('#new-node-button').click(function () {
		var input = $('#new-node-name'),
			val = input.val() || 'No name';

		tree.newNode(curentNodeId, val);
		input.val('');
		$('#new-node-modal').modal('hide');

		return false;
	});

	$('#edit-node-button').click(function () {
		var input = $('#edit-node-name'),
			val = input.val() || 'No name';

		tree.editNode(curentNodeId, val);

		$('#edit-node-modal').modal('hide');

		return false;
	});

	$('#load-button').click(function () {
		tree.loadTree();
	});
});