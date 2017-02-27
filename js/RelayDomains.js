Ext.define('pmg-domains', {
    extend: 'Ext.data.Model',
    fields: [ 'domain', 'comment' ],
    proxy: {
        type: 'proxmox',
	url: "/api2/json/config/domains"
    },
    idProperty: 'domain'
});

Ext.define('PMG.RelayDomains', {
    extend: 'Ext.grid.GridPanel',
    alias: ['widget.pmgRelayDomains'],

    initComponent : function() {
	var me = this;

	var store = new Ext.data.Store({
	    model: 'pmg-domains',
	    sorters: {
		property: 'domain',
		order: 'DESC'
	    }
	});

        var reload = function() {
            store.load();
        };

	me.selModel = Ext.create('Ext.selection.RowModel', {});

	var remove_btn = Ext.createWidget('proxmoxButton', {
	    text: gettext('Remove'),
	    disabled: true,
	    selModel: me.selModel,
	    confirmMsg: function (rec) {
		return Ext.String.format(
		    gettext('Are you sure you want to remove entry {0}'),
		    "'" + rec.data.domain + "'");
	    },
	    handler: function(btn, event, rec) {
		Proxmox.Utils.API2Request({
		    url: '/config/domains/' + rec.data.domain,
		    method: 'DELETE',
		    waitMsgTarget: me,
		    callback: function() {
			reload();
		    },
		    failure: function (response, opts) {
			Ext.Msg.alert(gettext('Error'), response.htmlStatus);
		    }
		});
	    }
	});

	var run_editor = function() {
	    var rec = me.selModel.getSelection()[0];
	    if (!rec) {
		return;
	    }

	    var config = {
		url: "/api2/extjs/config/domains/" + rec.data.domain,
		method: 'PUT',
		subject: gettext("Relay Domain"),
		items: [
		    {
			xtype: 'displayfield',
			name: 'domain',
			fieldLabel: gettext("Relay Domain")
		    },
		    {
			xtype: 'textfield',
			name: 'comment',
			fieldLabel: gettext("Comment")
		    }
		]
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
			url: "/api2/extjs/config/domains",
			create: true,
			subject: gettext("Relay Domain"),
			items: [
			    {
				xtype: 'proxmoxtextfield',
				name: 'domain',
				fieldLabel: gettext("Relay Domain")
			    },
			    {
				xtype: 'proxmoxtextfield',
				name: 'comment',
				fieldLabel: gettext("Comment")
			    }
			]
		    };

		    var win = Ext.createWidget('proxmoxWindowEdit', config);

		    win.on('destroy', reload);
		    win.show();
		}
            },
	    remove_btn
        ];

	Proxmox.Utils.monStoreErrors(me, store);

	Ext.apply(me, {
	    store: store,
	    tbar: tbar,
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