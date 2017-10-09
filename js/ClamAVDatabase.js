Ext.define('PMG.ClamAVDatabaseConfig', {
    extend: 'Proxmox.grid.ObjectGrid',
    alias: ['widget.pmgClamAVDatabaseConfig'],

    monStoreErrors: true,

    initComponent : function() {
	var me = this;

	me.add_text_row('dbmirror', gettext('Database Mirror'),
			{ deleteEmpty: true, defaultValue: 'database.clamav.net' });

	me.add_boolean_row('safebrowsing', gettext('Google Safe Browsing'),
			   { defaultValue: 1 });

	var baseurl = '/config/clamav';

	Ext.apply(me, {
	    url: '/api2/json' + baseurl,
	    editorConfig: {
		url: '/api2/extjs' + baseurl,
	    },
	    interval: 5000,
	    cwidth1: 200,
	    listeners: {
		itemdblclick: me.run_editor
	    }
	});

	me.callParent();

	me.on('activate', me.rstore.startUpdate);
	me.on('destroy', me.rstore.stopUpdate);
	me.on('deactivate', me.rstore.stopUpdate);
    }
});

Ext.define('pmg-clamav-database', {
    extend: 'Ext.data.Model',
    fields: [ 'name', 'type', 'build_time', 'version',
	      { name: 'nsigs', type: 'integer' }],
    idProperty: 'name'
});

Ext.define('PMG.ClamAVDatabaseStatus', {
    extend: 'Ext.grid.GridPanel',
    alias: ['widget.pmgClamAVDatabaseStatus'],

    title: gettext('Status'),

    reload: function() {
	var me = this;

        me.store.load();
    },

    initComponent : function() {
	var me = this;

	me.store = new Ext.data.Store({
	    model: 'pmg-clamav-database',
	    proxy: {
		type: 'proxmox',
		url: "/api2/json/nodes/" + Proxmox.NodeName + "/clamav/database"
	    },
	    sorters: {
		property: 'name',
		order: 'DESC'
	    }
	});

	Proxmox.Utils.monStoreErrors(me, me.store);

	Ext.apply(me, {
	    viewConfig: {
		trackOver: false
	    },
	    columns: [
		{
		    header: gettext('Name'),
		    sortable: true,
		    flex: 1,
		    dataIndex: 'name'
		},
		{
		    header: gettext('Build time'),
		    sortable: true,
		    flex: 2,
		    dataIndex: 'build_time'
		},
		{
		    header: gettext('Version'),
		    flex: 1,
		    sortable: true,
		    dataIndex: 'version'
		},
		{
		    header: gettext('Signatures'),
		    flex: 1,
		    sortable: true,
		    dataIndex: 'nsigs'
		},
	    ]
	});
	me.callParent();

	me.reload();
    }
});

Ext.define('PMG.ClamAVDatabase', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.pmgClamAVDatabase'],

    layout: { type: 'vbox', align: 'stretch' },

    initComponent : function() {
	var me = this;

	var selModel = Ext.create('Ext.selection.RowModel', {});
	var editPanel = Ext.create('PMG.ClamAVDatabaseConfig', {
	    border: false,
	    xtype: 'pmgClamAVDatabaseConfig',
	    selModel: selModel
	});

	var statusPanel = Ext.create('PMG.ClamAVDatabaseStatus', {
	    border: false
	});

	var update_command = function(){
	    Proxmox.Utils.API2Request({
		url: '/nodes/' + Proxmox.NodeName + '/clamav/database',
		method: 'POST',
		failure: function(response, opts) {
		    Ext.Msg.alert(gettext('Error'), response.htmlStatus);
		},
		success: function(response, opts) {
		    var upid = response.result.data;

		    var win = Ext.create('Proxmox.window.TaskViewer', {
			upid: upid
		    });
		    win.show();
		    me.mon(win, 'close', function() { statusPanel.reload() });
		}
	    });
	};

	me.tbar = [
	    {
		text: gettext('Edit'),
		xtype: 'proxmoxButton',
		disabled: true,
		handler: function() { editPanel.run_editor() },
		selModel: selModel
            },
	    {
		text: gettext('Update now'),
		handler: update_command
	    }
	];

	me.items = [ editPanel, statusPanel ];

	me.callParent();

    }
});
