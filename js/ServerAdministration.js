/*global Proxmox*/
Ext.define('PMG.ServerAdministration', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pmgServerAdministration',

    title: gettext('Server Administration'),

    border: false,
    defaults: { border: false },

    controller: {
	xclass: 'Ext.app.ViewController',

        init: function(view) {
	    var upgradeBtn = view.lookupReference('upgradeBtn');
	    upgradeBtn.setDisabled(!(Proxmox.UserName && Proxmox.UserName === 'root@pam'));
	}
    },

    items: [
	{
	    xtype: 'pmgServerStatus',
	    itemId: 'status'
	},
	{
	    xtype: 'proxmoxNodeServiceView',
            title: gettext('Services'),
	    itemId: 'services',
	    startOnlyServices: {
		syslog: true,
		pmgproxy: true,
		pmgdaemon: true
	    },
	    nodename: Proxmox.NodeName
	},
	{
	    xtype: 'proxmoxNodeAPT',
            title: gettext('Updates'),
	    upgradeBtn: {
		xtype: 'button',
		reference: 'upgradeBtn',
		disabled: true,
		text: gettext('Upgrade'),
		handler: function() {
		    Proxmox.Utils.openXtermJsViewer('upgrade', 0, Proxmox.NodeName);
		}
	    },
	    itemId: 'updates',
	    nodename: Proxmox.NodeName
	},
	{
	    xtype: 'proxmoxLogView',
	    itemId: 'logs',
	    title: gettext('Syslog'),
	    url: "/api2/extjs/nodes/" + Proxmox.NodeName + "/syslog",
	    log_select_timespan: 1
	},
	{
	    xtype: 'pmgPostfixConfig',
	    itemId: 'postfixconfig',
	    nodename: Proxmox.NodeName
	},
	{
	    xtype: 'proxmoxNodeTasks',
	    itemId: 'tasks',
	    title: gettext('Tasks'),
	    height: 'auto',
	    nodename: Proxmox.NodeName
	}
    ]
});


