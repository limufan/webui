$(function(){
		$("#tree").tree({
			data: [
				{text:"1111", iconClass: "ui-treenode-dept-icon"}, 
				{text:"1111", iconClass: "ui-treenode-dept-icon"}
			],
			dblclickOpen: true
		});

		test("tree", 15, function(){
			var topnodes = $("#tree").tree("getTopNodes");
			equal(topnodes.length, 2, "getTopNodes");

			topnodes.eq(0).bind("treenodeadded", function(event, treenode){
				ok(true, "event append");
				equal(true, topnodes.eq(0).treenode("getChildren").eq(0).is(treenode), "added treenode args");
			});
			topnodes.eq(0).treenode("append", {text:"1111", iconClass: "ui-treenode-position-icon"});
			var firstNodeChildren = topnodes.eq(0).treenode("getChildren");
			equal(firstNodeChildren.length, 1, "treenode.getChildren");

			equal(true, topnodes.eq(0).is(firstNodeChildren.eq(0).treenode("getParent")), "treenode.getParent");

			firstNodeChildren.eq(0).treenode("select");
			var selectedNode = $("#tree").tree("getSelectedNode");
			equal(selectedNode.is(firstNodeChildren[0]), true, "tree.getSelectedNode");

			var firstNodeChildren = topnodes.eq(0).treenode("empty").treenode("getChildren");
			equal(firstNodeChildren.length, 0, "treenode.empty");

			$("#tree").tree({
				treenodeFirstExpanding: function(event, treenode){
					ok(true, "event treenodeFirstExpanding");
				},
				treenodeClick: function(event, treenode){
					ok(true, "event treenodeClick");	
				}
			});
			topnodes.eq(1).treenode("expand");
			topnodes.eq(1).find(".ui-treenode-node").click();


			topnodes.eq(1).treenode({
				removed: function(event, treenode){
					ok(true, "event removed");	
					equal(true, topnodes.eq(1).is(treenode), "removed treenode args");
				}
			});
			$("#tree").tree("deleteSelectedNode");

			topnodes = $("#tree").tree("getTopNodes");
			topnodes.eq(0).treenode({
				selected: function(event, treenode){
					ok(true, "event selected");	
					equal(true, topnodes.eq(0).is(treenode), "selected treenode args");
				},
				unselected: function(event, treenode){
					ok(true, "event unselect");	
					equal(true, topnodes.eq(0).is(treenode), "unselect treenode args");
				}
			});
			topnodes.eq(0).treenode("select").treenode("unselect");
		})
	})

$(function(){
		$("#checkboxtree").checkboxTree({
			data: [
				{text:"1111", iconClass: "ui-treenode-dept-icon"}
			],
			dblclickOpen: true
		});

		test("checkboxTree", 2, function(){
			var topnodes = $("#checkboxtree").checkboxTree("getTopNodes");
			topnodes.eq(0).treenode("append", {text:"1111", iconClass: "ui-treenode-position-icon"});
			topnodes.eq(0).treenode("append", {text:"1111", iconClass: "ui-treenode-position-icon"});
			var firstNodeChildren = topnodes.eq(0).treenode("getChildren");
			firstNodeChildren.eq(0).treenode("select");
			firstNodeChildren.eq(1).treenode("select");
			var selectedNodes = $("#checkboxtree").checkboxTree("getSelectedNodes");
			equal(selectedNodes.length, 2, "checkboxTree.getSelectedNodes");

			firstNodeChildren.eq(0).find(".ui-treenode-node").click();
			selectedNodes = $("#checkboxtree").checkboxTree("getSelectedNodes");
			equal(selectedNodes.length, 1, "checkboxTree.getSelectedNodes");
		})
	})