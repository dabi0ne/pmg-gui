/*global Proxmox*/
Ext.define('pmg-master-transport-options', {
    extend: 'Ext.data.Model',
    fields: [ 'option', 'value' ],
    idProperty: 'option',
    sorters: {
	property: 'option',
	order: 'DESC'
    }
});

Ext.define('PMG.TransportOptionEdit', {
    extend: 'Proxmox.window.Edit',
    xtype: 'pmgTransportOptionEdit',
    onlineHelp: 'pmgconfig_mailproxy_tls',

    subject: gettext('Transport Option'),
    initComponent : function() {
	var me = this;

	var isCreate = ! Ext.isDefined(me.option);

	var url = '/api2/extjs/config/advanced/mtransport/' + me.transportName + '/option' + (isCreate ? '' : '/' + me.option);
	var method = isCreate ? 'POST' : 'PUT';
	var text = isCreate ? 'Create' : 'Edit';

	var items = [
	    {
		xtype: isCreate ? 'proxmoxtextfield' : 'displayfield',
		name: 'option',
		fieldLabel: gettext('Option')
	    },
	    {
		xtype: 'proxmoxtextfield',
		name: 'value',
		fieldLabel: gettext('Value')
	    },
	];

	Ext.apply(me, {
	    url: url,
	    method: method,
	    items: items,
	    text: text,
	});

	me.callParent();
    }
});

Ext.define('PMG.TransportEdit', {
    extend: 'Proxmox.window.Edit',
    xtype: 'pmgTransportEdit',
    onlineHelp: 'pmgconfig_mailproxy_tls',

    subject: gettext('Transport params'),
    initComponent : function() {
	var me = this;

	var isCreate = ! Ext.isDefined(me.transportName);

	var url = '/api2/extjs/config/advanced/mtransport' + (isCreate ? '/service/create' : '/' + me.transportName + '/object' )
	var method = isCreate ? 'POST' : 'PUT';
	var text = isCreate ? 'Create' : 'Edit';

	var items = [
	    {
		xtype: 'proxmoxtextfield',
		name: 'service',
		fieldLabel: gettext('Service')
	    },
	    {
		xtype: 'proxmoxKVComboBox',
		name: 'type',
		fieldLabel: gettext('Type'),
		deleteEmpty: true,
		comboItems: [
			[ 'inet', 'inet' ],
		    [ 'unix', 'unix' ],
		    [ 'unix-dgram', 'unix-dgram' ],
		    [ 'fifo', 'fifo' ],
		    [ 'pass', 'pass' ],
		],
		allowBlank: false,
	    },
	    {
		xtype: 'proxmoxKVComboBox',
		name: 'private',
		fieldLabel: gettext('Private'),
		deleteEmpty: true,
		comboItems: [
			[ '-', 'default' ],
		    [ 'n', 'no' ],
		    [ 'y', 'yes' ],
		],
		allowBlank: false,
	    },
	    {
		xtype: 'proxmoxKVComboBox',
		name: 'unpriv',
		fieldLabel: gettext('unpriv'),
		deleteEmpty: true,
		comboItems: [
			[ '-', 'default' ],
		    [ 'n', 'no' ],
		    [ 'y', 'yes' ],
		],
		allowBlank: false,
	    },
	    {
		xtype: 'proxmoxKVComboBox',
		name: 'chroot',
		fieldLabel: gettext('chroot'),
		deleteEmpty: true,
		comboItems: [
			[ '-', 'default' ],
		    [ 'n', 'no' ],
		    [ 'y', 'yes' ],
		],
		allowBlank: false,
	    },
	    {
		xtype: 'proxmoxintegerfield',
		name: 'wakeup',
		minValue: 0,
		maxValue: 65535,
		fieldLabel: gettext("Wake up time (default: 0)")
	    },
	    {
		xtype: 'proxmoxintegerfield',
		name: 'maxproc',
		minValue: 1,
		maxValue: 65535,
		fieldLabel: gettext("Process limit")
	    },
	    {
		xtype: 'proxmoxtextfield',
		name: 'command',
		fieldLabel: gettext('Command + args')
	    },
	];
	
	Ext.apply(me, {
	    url: url,
	    method: method,
	    items: items,
	    text: text
	});

	me.callParent();
    
    }
});

Ext.define('PMG.MailProxyAdvancedMasterTransportOptions', {
    extend: 'Ext.grid.GridPanel',
    alias: ['widget.pmgMailProxyAdvancedMasterTransportOptions'],

    viewConfig: {
	trackOver: false
    },
    columns: [
	{
	    header: gettext('Option'),
	    width: 200,
	    sortable: true,
	    dataIndex: 'option'
	},
	{
	    header: gettext('Value'),
	    sortable: false,
	    dataIndex: 'value',
	    flex: 1
	}
    ],

    initComponent : function() {
	var me = this;

	var rstore = Ext.create('Proxmox.data.UpdateStore', {
	    model: 'pmg-master-transport-options',
	    storeid: 'pmg-master-transport-options-store-' + (++Ext.idSeed),
	    proxy: {
			type: 'proxmox',
			url: '/api2/json/config/advanced/mtransport/' + me.transportName
	    },
	});

	var store = Ext.create('Proxmox.data.DiffStore', { rstore: rstore});

        var reload = function() {
            rstore.load();
        };

	me.selModel = Ext.create('Ext.selection.RowModel', {});

	var run_editor = function() {
	    var rec = me.selModel.getSelection()[0];
	    if (!rec) {
		return;
	    }

	    var win = Ext.createWidget('pmgTransportOptionEdit', {
	    transportName: me.transportName,
		option: rec.data.option
	    });

	    win.load();
	    win.on('destroy', reload);
	    win.show();
	};

	var tbar = [
		{
			text: gettext('Edit Transport'),
			handler: function() {
				    var win = Ext.createWidget('pmgTransportEdit',{
				        transportName: me.transportName,
				    });
		
				    win.load();
				    win.on('destroy', reload);
				    win.show();
				}
        },
		{
			text: gettext('Delete Transport'),
			baseurl: '/config/advanced/mtransport/' + this.transportName,
			confirmMsg: "Are you sure you want to remove " + this.transportName + " service ?",
			handler: function() {
				
				var realHandler = this.realHandler;
				var me = this;
				
				Ext.Msg.show({
					title: gettext('Confirm'),
					icon: Ext.Msg.QUESTION,
					msg: this.confirmMsg,
					buttons: Ext.Msg.YESNO,
					defaultFocus: 'no',
					callback: function(btn) {
					    if (btn !== 'yes') {
							return;
					    }
					    Ext.callback(realHandler, me.scope, [], 0, me);
					}
				    });
			},
			realHandler: function() {
				
				me.destroy();
				
				Proxmox.Utils.API2Request({
				    url: this.baseurl,
				    method: 'DELETE',
				    waitMsgTarget: me,
				    callback: function(options, success, response) {
						console.log("Transport service deleted.")
				    },
				    failure: function (response, opts) {
						Ext.Msg.alert(gettext('Error'), response.htmlStatus);
				    }
				});
			},
			disabled: false
        },
        {
			xtype: 'proxmoxButton',
			disabled: true,
			text: gettext('Edit'),
			handler: run_editor
		},
	    {
		text: gettext('Create'),
		handler: function() {
		    var win = Ext.createWidget('pmgTransportOptionEdit',{
		        transportName: me.transportName,
		    });

		    win.load();
		    win.on('destroy', reload);
		    win.show();
		}
            },
	    {
		xtype: 'proxmoxStdRemoveButton',
		baseurl: '/config/advanced/mtransport/' + this.transportName + '/option',
		callback: reload,
		waitMsgTarget: me
	    }
        ];

	Proxmox.Utils.monStoreErrors(me, store, true);
	
	reload();
	
	Ext.apply(me, {
	    store: store,
	    tbar: tbar,
	    run_editor: run_editor,
	    listeners: {
		itemdblclick: run_editor,
		activate: reload
	    }
	});
	
	me.on('activate', rstore.startUpdate);
	me.on('destroy', rstore.stopUpdate);
	me.on('deactivate', rstore.stopUpdate);
	me.callParent();
    }
});
