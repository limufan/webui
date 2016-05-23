$(function(){
	var addedRowEventTriggered = false;
	var deletedRowEventTriggered = false;
	var cellRenderTriggered = false;
	var selectedRowEventTriggered = false;
	var unselectedRowEventTriggered = false;

	var datagrid = $("<div></div>")
	 .appendTo(document.body)
	 .datagrid({
		columns:[
			{
				name:"c1", 
				title: "t1", 
				width: 220, 
				field:"f1", 
				sortBy: "desc", 
				render: function(row, args){
					cellRenderTriggered = true;
					return "<a>"+args.value+"</a>";
				}
			},
			{name:"c2", title: "t2", field:"f2"},
			{name:"c3", title: "t3", field:"f3"},
			{name:"c4", title: "t4", field:"id"}
		],
		canSort: true,
		singleSelect: false,
		width: 590,
		height: 200, 
		data:[{id: 1, f1: "t122222222222222222222222444", "f2": "t2"},{id: 2, f1: "dsfsd", "f2": "t2"},{id: 3, f1: "dsf11sd", "f2": "t2"}],
		selectedRow: function(evt, row){
			selectedRowEventTriggered = true;
		},
		unselectedRow: function(evt, row){
			ok( true, "unselected event" );
		},
		updatedRow: function(evt, row){
			ok( true, "updatedRow event" );
		},
		deletedRow: function(evt, row){
			if(!deletedRowEventTriggered){
				deletedRowEventTriggered = true;
				ok( true, "deletedRow event" );
			}
		},
		showNumberRow: true
	});

	// test("datagrid", function(){
	// 	datagrid.datagrid({addedRow: function(){ 
	// 		if(!addedRowEventTriggered){
	// 			ok( true, "addedRow event" );
	// 		addedRowEventTriggered = true;}}});
		
		 
	// 	datagrid.datagrid("selectRow", 1);
	// 	datagrid.datagrid("unselectRow", 1);
	// 	datagrid.datagrid("deleteRow", 1);
		
	// 	datagrid.datagrid("appendRow", {f1: "new1", "f2": "new12"});
	// 	datagrid.datagrid("updateRow", 0, {f1: "update1", "f2": "update2"});
	// 	datagrid.datagrid("deleteSelectedRow");
	// 	datagrid.datagrid("option", "width", 800);
	// 	datagrid.datagrid("option", "width", 500);
	// 	datagrid.datagrid("option", "height", 300);
	// 	datagrid.datagrid("option", "height", 100);
	// 	datagrid.datagrid("option", "data", [{id: 1, f1: "123", "f2": "t2"},{id: 2, f1: "123", "f2": "t2"},{id: 3, f1: "123213", "f2": "t2"}]);
	// 	datagrid.datagrid("option", "columns", [
	// 		{name:"c1", title: "t2", field:"f2"},
	// 		{name:"c2", title: "t3", field:"f3"},
	// 		{name:"c3", title: "t4", field:"id", render: function(row, args){ 
	// 			return $("<a></a>").text("edit").attr("href", "#").click(function(){
	// 				row.datarow("option", "data", {id: args.data.id, f1: "update1", "f2": "update2"});
	// 				return false;
	// 			});
	// 		}}
	// 	]);
	// 	datagrid.datagrid("option", "columns", [
	// 		{name:"c1", title: "t1", field:"f1"},
	// 		{name:"c2", title: "t2", field:"f2"},
	// 		{name:"c3", title: "t3", field:"f3"},
	// 		{name:"c4", title: "t4", field:"id", render: function(row, args){ 
	// 			return $("<a></a>").text("edit").attr("href", "#").click(function(){
	// 				row.datarow("option", "data", {id: args.data.id, f1: "update1", "f2": "update2"});
	// 				return false;
	// 			});
	// 		}},
	// 		{name:"c5", title: "t5", field:"f3"},
	// 		{name:"c6", title: "t6", field:"f3"}
	// 	]);
		
	// 	ok( true, "test end" );
	// });
})