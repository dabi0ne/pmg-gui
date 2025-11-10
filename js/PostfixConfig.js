/*global Proxmox*/
Ext.define('PMG.PostfixConfig', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pmgPostfixConfig',

    title: gettext('Postfix Configuration'),

    border: false,
    scrollable: true,

    layout: {
	type: 'vbox',
	align: 'stretch'
    },

    bodyPadding: 10,

    initComponent: function() {
	var me = this;

	var store = Ext.create('Ext.data.Store', {
	    fields: ['parameter', 'value'],
	    proxy: {
		type: 'proxmox',
		url: '/api2/json/nodes/' + me.nodename + '/postfix/main'
	    },
	    autoLoad: true
	});

	var grid = Ext.create('Ext.grid.Panel', {
	    store: store,
	    stateful: false,
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
	    flex: 1
	});

	Ext.apply(me, {
	    items: [grid],
	    tbar: [
		{
		    text: gettext('Reload'),
		    handler: function() {
			store.reload();
		    }
		}
	    ]
	});

	me.callParent();

	me.on('activate', function() {
	    store.reload();
	});
    }
});
