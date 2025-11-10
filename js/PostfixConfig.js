/*global Proxmox*/
Ext.define('PMG.PostfixConfig', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.pmgPostfixConfig',

    title: gettext('Postfix Configuration'),

    border: false,

    nodename: undefined,

    store: {
	fields: ['parameter', 'value'],
	sorters: 'parameter'
    },

    controller: {
	xclass: 'Ext.app.ViewController',

	init: function(view) {
	    if (view.nodename) {
		view.setNodename(view.nodename);
	    }
	},

	control: {
	    '#': {
		activate: function() {
		    this.view.store.load(); // reload
		}
	    }
	}
    },

    columns: [
	{
	    text: gettext('Parameter'),
	    dataIndex: 'parameter',
	    flex: 1,
	    sortable: true
	},
	{
	    text: gettext('Value'),
	    dataIndex: 'value',
	    flex: 2,
	    sortable: false
	}
    ],

    setNodename: function(nodename) {
	var me = this;

	me.nodename = nodename;

	me.store.setProxy({
	    type: 'proxmox',
	    url: "/api2/json/nodes/" + me.nodename + "/postfix/main"
	});

	me.store.load();
    }
});
