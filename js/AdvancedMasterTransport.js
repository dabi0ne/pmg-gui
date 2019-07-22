Ext.define('pmg-master-tranports', {
    extend: 'Ext.data.Model',
    fields: [ 'service', 'params'],
    idProperty: 'service',
    proxy: {
	type: 'proxmox',
	url: '/api2/json/config/advanced/mtransport'
    },
    sorters: {
		property: 'service',
		order: 'ASC'
    }
});

Ext.define('PMG.MailProxyAdvancedMasterTransport', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pmgMailProxyAdvancedMasterTransport',

    layout: {
		type: 'vbox',
		align: 'stretch'
    },

	scrollable: true,
    bodyPadding: '0 0 10 0',
    defaults: {
	collapsible: true,
	animCollapse: false,
	margin: '10 10 0 10'
    },
    
    

    initComponent: function() {
	var me = this;

	var tlsSettings = Ext.create('PMG.MailProxyTLS', {
	    title: gettext('Settings')
	});

	var store = new Ext.data.Store({
	    model: 'pmg-master-tranports',
	    sorters: {
			property: 'service',
			order: 'ASC'
	    },
	    asynchronousLoad: false
	});
	
	
	function reload() {
		store.load({
		callback: function(records, options, success){
			me.removeAll();
			records.forEach(function(record) {
				 var tmp = Ext.create('PMG.MailProxyAdvancedMasterTransportOptions', {
	    			title: gettext(record.data.service + " " + record.data.params.join(' ')),
	    			transportName: record.data.service
				});
				tmp.relayEvents(me, ['activate', 'deactivate', 'destroy']);
				me.add(tmp);		
			})
		},
		scope: me
		});
	}
	
	
	
	var tbar = [
    	{
			text: gettext('Add Transport'),
			handler: function() {
				    var win = Ext.createWidget('pmgTransportEdit',{});
		
				    win.load();
				    win.on('destroy', me.reload);
				    win.show();
			},
    	},
    	{
    		text: gettext('Reload Postfix'),
			handler: function() {
				    Proxmox.Utils.API2Request({
					    url: '/api2/extjs/config/advanced/mtransport/',
					    params: {},
					    method: 'POST',
					    failure: function(response, opts) {
							Ext.Msg.alert(gettext('Error'), response.htmlStatus);
					    },
					    success: function(response, opts) {
						var win = Ext.create('Ext.window.MessageBox',{
						    closeAction: 'destroy'
						}).show({
						    title: gettext('Info'),
						    message: Ext.String.format("Service Postfix reload : OK"),
						    buttons: Ext.Msg.OK,
						    icon: Ext.MessageBox.INFO
						});
				
					    }
					});
			}
    	}
    ];
	
	reload();
	
	Ext.apply(me, {
		tbar: tbar,
		store: store,
		reload: reload,
	});
	
	me.callParent();
	
    }
    
});

