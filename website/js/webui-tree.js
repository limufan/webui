(function($) {
$.widget( "webui.tree", {
    _selectedNodes: null,
    options: {
        value: null,
        singleSelect: true
    },
    _create: function() {
        this._singleSelect = this.options.singleSelect;
        this._selectedNodes = [];
        this.element.addClass("webui-tree");
        this._render();
    },
    _render: function(){
        var thiz = this;
        var childrenContainer = this._childrenContainer = $("<ul></ul>").appendTo(this.element);
        if(this.options.value && this.options.value.length){
            $.each(this.options.value, function(i, nodeValue){
                nodeValue.showCheckbox = !thiz.options.singleSelect;
                var treenode = $("<li></li>").appendTo(childrenContainer)
                    .treenode(nodeValue)
                    .data("treenode");
                treenode.loading(function(event, node){thiz._onNodeLoading(node);});
                treenode.selected(function(event, node){thiz._onNodeSelected(node);});
                treenode.unselected(function(event, node){thiz._onNodeUnselected((node));});
                treenode.removed(function(event, node){thiz._onNodeRemoved((node));});
            });
        }
    },
    _isShowCheckbox: function(){
        return false;
    },
    _onNodeSelected: function(node){
        if(this._singleSelect){
            $.each(this._selectedNodes, function(){
                this.unselect();
            });
        }
        this._selectedNodes.push(node);
        this._trigger("selected", null, node);
    },
    _onNodeUnselected: function(unselected){
        this._selectedNodes = $.grep(this._selectedNodes, function(node){
            return node != unselected;
        });
        this._trigger("unselected", null, unselected);
    },
    _onNodeLoading: function(node){
        this._trigger("loading", null, node);
    },
    _onNodeRemoved: function(removedNode){
        this._selectedNodes = $.grep(this._selectedNodes, function(node){
            return node != removedNode;
        });
        this._trigger("removed", null, removedNode);
    },
    getTopNodes: function(){
        if(this._childrenContainer.children(".webui-treenode").length){
            return this._childrenContainer.children(".webui-treenode").map(function(){
                return $(this).data("treenode");
            });
        }
        return null;
    },
    getTopNode: function(){
        if(this._childrenContainer.children(".webui-treenode").length){
            return this._childrenContainer.children(".webui-treenode").eq(0).data("treenode");
        }
        return null;
    },
    removeSelectedNodes: function(){
        $.each(this._selectedNodes, function(){
            this.remove();
        });
    },
    getSelectedNodes: function(){
        return this._selectedNodes;
    },
    getSelectedNode: function(){
        if(this._selectedNodes.length){
            return this._selectedNodes[0];
        }
        return null;
    },
    expandTopNode: function(){
        var topNode = this.getTopNode();
        if(topNode){
            topNode.expand();
        }
        return this;
    },
    selectTopNode: function(){
        var topNode = this.getTopNode();
        if(topNode){
            topNode.select();
        }
        return this;
    }
});

}( jQuery ) );

(function($, undefined ){
    $.widget( "webui.treenode", {
        _childrenContainer: null,
        options: {
            text: null,
            iconClass: null,
            showCheckbox: null
        },
        _create: function() {
            this._text = this.options.text;
            this.element.addClass("webui-treenode");
            this._renderSwitchIcon();
            this._renderCheckboxIcon();
            this._renderNodeIcon();
            this._renderNodeLabel();
            this._bindEvent();
        },
        _bindEvent: function(){
            var thiz = this;
            this._nodeLabel.click(function(){
                thiz.toggleSelected();
                thiz._trigger("click", null, thiz);
            });
        },
        toggleSelected: function(){
            if(this.isSelected()){
                this.unselect();
            }else{
                this.select();
            }
        },
        isSelected: function(){
            return this._selected;
        },
        select: function(){
            if(this.options.showCheckbox){
                this._checkboxIcon.removeClass("fa-square-o");
                this._checkboxIcon.addClass("fa-check-square-o");
            }
            this._nodeLabel.addClass("active");
            this._selected = true;
            this.expand();
            this._trigger("selected", null, this);
        },
        unselect: function(){
            if(this.options.showCheckbox){
                this._checkboxIcon.removeClass("fa-check-square-o");
                this._checkboxIcon.addClass("fa-square-o");
            }
            this._nodeLabel.removeClass("active");
            this._selected = false;
            this._trigger("unselected", null, this);
        },
        _renderSwitchIcon: function(){
            var thiz = this, switchIcon ;
        
            switchIcon = thiz._switchIcon = $("<i class='font-icon fa-plus'></i>&nbsp;")
                .appendTo(this.element)
                .click(function(){
                    thiz.toggleExpand();
                });

            if(this.options.expanded){
                this.expand();
            }
        },
        _renderCheckboxIcon: function(){
            var thiz = this;
            if(this.options.showCheckbox){
                this._checkboxIcon = $("<i class='font-icon fa-square-o'></i>&nbsp;")
                    .appendTo(this.element)
                    .click(function(){
                        thiz.toggleSelected();
                    });
            }
        },
        _renderNodeIcon: function(){
            var iconClass = this.options.iconClass;
            if(typeof  iconClass === "function"){
                iconClass = iconClass(this.element);
            }
            if(iconClass){
                $("<i></i>&nbsp;").addClass(iconClass).appendTo(this.element);
            }
        },
        _renderNodeLabel: function(){
            if(this._nodeLabel == null){
                this._nodeLabel = $("<label></label>").appendTo(this.element);
            }
        
            this._nodeLabel.text(this._text);
        },
        toggleExpand: function(){
            if(this._expanded){
                this.collapse();
            }
            else{
                this.expand();
            }
        },
        expand: function(){
            if(this._expanded){
                return this;
            }
            if(!this._loaded){
                this._trigger("loading", null, this);
            }
            this._expanded = true;
            if(this._childrenContainer && this._childrenContainer.children("li").length){
                this._switchIcon.removeClass("fa-plus").addClass("fa-minus");
                this._childrenContainer.show();
            }
            else{
                this._switchIcon.removeClass("fa-plus");
            }
            this._loaded = true;
            return this;
        },
        collapse: function(){
            this._expanded = false;
            this._switchIcon.removeClass("fa-minus").addClass("fa-plus");
            this._childrenContainer.hide();
        },
        append: function(data){
            var treenode;
            if(!this._childrenContainer){
                this._childrenContainer = $("<ul></ul>").appendTo(this.element);
            }
            if(data.element){
                this._childrenContainer.append(data.element);
            }
            else{
                treenode = $("<li></li>").appendTo(this._childrenContainer)
                    .treenode(data)
                    .data("treenode");
                this._trigger("added", null, treenode);
            }
            if(!this._expaned){
                this._switchIcon.addClass("fa-plus");
            }
            this._loaded = true;
        },
        remove: function(){
            this.empty();
            this._trigger("removed", null, this);
            this.element.remove();
        },
        empty: function(){
            $.each(this.getChildren(), function(){
                this.remove();
            });
            this._loaded = false;
        },
        reload: function(){
            this.empty();
            this.expand();
        },
        getParent: function(){
            return this.element.closest(".webui-treenode").data("treenode");
        },
        getChildren: function(){
            var children = this.element.find(".webui-treenode").map(function(){
                return $(this).data("treenode");
            });
            return children;
        },
        setText: function(text){
            this._text = text;
            this._renderNodeLabel();
        },
        getText: function(){
            return this._text;
        }
    });
}( jQuery ));

(function($){
    $.each([$.webui.tree.prototype, $.webui.treenode.prototype], function(){
        $.extend(this, {
            loading: function(callback){
                var eventName = (this.widgetEventPrefix + "loading").toLowerCase();
                this.element.bind(eventName, function(event, node){
                    callback(event, node);
                });
            },
            selected: function(callback){
                var eventName = (this.widgetEventPrefix + "selected").toLowerCase();
                this.element.bind(eventName, function(event, node){
                    callback(event, node);
                });
            },
            unselected: function(callback){
                var eventName = (this.widgetEventPrefix + "unselected").toLowerCase();
                this.element.bind(eventName, function(event, node){
                    callback(event, node);
                });
            },
            removed: function(callback){
                var eventName = (this.widgetEventPrefix + "removed").toLowerCase();
                this.element.bind(eventName, function(event, node){
                    callback(event, node);
                });
            }
        });
    });
    
}(jQuery));