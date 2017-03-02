Ext.define('PMG.ObjectGroupConfiguration', {
    extend: 'Ext.panel.Panel',

    ogclass: undefined, // who, when, what
    otype_list: [],
    
    layout: { type: 'hbox', align: 'stretch' },
    border: false,
    
    initComponent : function() {
	var me = this;

	if (me.ogclass === undefined) {
	    throw "undefined object group class"
	}
	
	if (!(me.title = PMG.Utils.oclass_text[me.ogclass])) {
	    throw "unknown object group class";
	}

	var left = Ext.create('PMG.ObjectGroupList', {
	    width: 250,
	    ogclass: me.ogclass,
	    subject: me.title,
	    border: false
	});
	
	var right = Ext.create('PMG.ObjectGroup', {
	    otype_list: me.otype_list,
	    border: false,
	    flex: 1,
	    listeners: {
		dblclickOGInfo: function(w, e, t, ogdata) {
		    // test if the correct groups is selected (just to be sure)
		    var rec = left.selModel.getSelection()[0];
		    if (rec && rec.data && rec.data.id === ogdata.id) {
			left.run_editor();
			return;
		    }
		}
	    }
	});

	me.mon(left.selModel, "selectionchange", function() {
	    var rec = left.selModel.getSelection()[0];
	    if (!(rec && rec.data && rec.data.id)) {
		return;
	    }
	    right.setObjectInfo(rec.data);
	    var baseurl = '/config/ruledb/' + me.ogclass + '/' + rec.data.id;
	    right.setBaseUrl(baseurl);
	});
	
	me.items = [ left, { xtype: 'splitter' }, right ];

	me.callParent();
    }
});

Ext.define('PMG.WhoConfiguration', {
    extend: 'PMG.ObjectGroupConfiguration',
    alias: 'widget.pmgWhoConfiguration',

    ogclass: 'who',
    otype_list: [1000, 1001, 1002, 1003, 1004]
});

Ext.define('PMG.WhenConfiguration', {
    extend: 'PMG.ObjectGroupConfiguration',
    alias: 'widget.pmgWhenConfiguration',

    ogclass: 'when',
    otype_list: [2000]
});

Ext.define('PMG.WhatConfiguration', {
    extend: 'PMG.ObjectGroupConfiguration',
    alias: 'widget.pmgWhatConfiguration',

    ogclass: 'what',
    otype_list: []
});

Ext.define('PMG.ActionConfiguration', {
    extend: 'PMG.ObjectGroupConfiguration',
    alias: 'widget.pmgActionConfiguration',

    ogclass: 'action',
    otype_list: []
});
