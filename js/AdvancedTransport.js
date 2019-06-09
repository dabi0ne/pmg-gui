/*global Proxmox*/
Ext.define('pmg-advanced-transport', {
    extend: 'Ext.data.Model',
    fields: [ 'domain', 'transport', 'host', 'port', 'comment' ],
    proxy: {
        type: 'proxmox',
	url: "/api2/json/config/advanced/transport"
    },
    idProperty: 'domain'
});

Ext.define('PMG.AdvancedTransport', {
    extend: 'Ext.grid.GridPanel',
    alias: ['widget.pmgAdvancedTransport'],

    initComponent : function() {
	var me = this;

	var store = new Ext.data.Store({
	    model: 'pmg-advanced-transport',
	    sorters: {
		property: 'domain',
		order: 'DESC'
	    }
	});

        var reload = function() {
            store.load();
        };

	me.selModel = Ext.create('Ext.selection.RowModel', {});

	var remove_btn =  Ext.createWidget('proxmoxStdRemoveButton', {
	    selModel: me.selModel,
	    baseurl: '/config/advanced/transport',
	    callback: reload,
	    waitMsgTarget: me
	});

	var common_properties = [
	    {
		xtype: 'textfield',
		name: 'transport',
		fieldLabel: gettext("Transport")
	    },
	    {
		xtype: 'textfield',
		name: 'host',
		fieldLabel: gettext("Host")
	    },
	    {
		xtype: 'textfield',
		name: 'port',
		fieldLabel: gettext("Port")
	    },
	    {
		xtype: 'textfield',
		name: 'comment',
		fieldLabel: gettext("Comment")
	    }
	];

	var edit_properties = common_properties.slice();
	edit_properties.unshift({
	    xtype: 'displayfield',
	    name: 'domain',
	    fieldLabel: gettext("Relay Domain")
	});

	var create_properties = common_properties.slice();
	create_properties.unshift({
	    xtype: 'proxmoxtextfield',
	    name: 'domain',
	    fieldLabel: gettext("Relay Domain")
	});

	var run_editor = function() {
	    var rec = me.selModel.getSelection()[0];
	    if (!rec) {
		return;
	    }

	    var config = {
		url: "/api2/extjs/config/advanced/transport/" + rec.data.domain,
		onlineHelp: 'pmgconfig_mailproxy_transports',
		method: 'PUT',
		subject: gettext("Transport"),
		items: edit_properties
	    };

	    var win = Ext.createWidget('proxmoxWindowEdit', config);

	    win.load();
	    win.on('destroy', reload);
	    win.show();
	};

	var tbar = [
            {
		xtype: 'proxmoxButton',
		text: gettext('Edit'),
		disabled: true,
		selModel: me.selModel,
		handler: run_editor
            },
            {
		text: gettext('Create'),
		handler: function() {
		    var config = {
			method: 'POST',
			url: "/api2/extjs/config/advanced/transport",
			onlineHelp: 'pmgconfig_mailproxy_transports',
			isCreate: true,
			subject: gettext("Transport"),
			items: create_properties
		    };

		    var win = Ext.createWidget('proxmoxWindowEdit', config);

		    win.on('destroy', reload);
		    win.show();
		}
            },
	    remove_btn
        ];

	Proxmox.Utils.monStoreErrors(me, store, true);

	Ext.apply(me, {
	    store: store,
	    tbar: tbar,
	    run_editor: run_editor,
	    viewConfig: {
		trackOver: false
	    },
	    columns: [
		{
		    header: gettext('Relay Domain'),
		    width: 200,
		    sortable: true,
		    dataIndex: 'domain'
		},
		{
		    header: gettext('Transport'),
		    width: 200,
		    sortable: true,
		    dataIndex: 'transport'
		},
		{
		    header: gettext('Host'),
		    width: 200,
		    sortable: true,
		    dataIndex: 'host'
		},
		{
		    header: gettext('Port'),
		    width: 80,
		    sortable: false,
		    dataIndex: 'port'
		},
		{
		    header: gettext('Comment'),
		    sortable: false,
		    renderer: Ext.String.htmlEncode,
		    dataIndex: 'comment',
		    flex: 1
		}
	    ],
	    listeners: {
		itemdblclick: run_editor,
		activate: reload
	    }
	});

	me.callParent();
    }
});
