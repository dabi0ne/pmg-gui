/*global Proxmox*/
Ext.define('PMG.SystemOptions', {
    extend: 'Proxmox.grid.ObjectGrid',
    xtype: 'pmgSystemOptions',

    monStoreErrors: true,
    interval: 5000,
    cwidth1: 200,

    url: '/api2/json/config/admin',
    editorConfig: {
	url: '/api2/extjs/config/admin',
	onlineHelp: 'pmgconfig_systemconfig'
    },

    controller: {
	xclass: 'Ext.app.ViewController',

	onEdit: function() {
	    var me = this.getView();
	    me.run_editor();
	}
    },

    tbar: [{
	text: gettext('Edit'),
	xtype: 'proxmoxButton',
	disabled: true,
	handler: 'onEdit'
    }],

    listeners: {
	itemdblclick: 'onEdit'
    },

    add_proxy_row: function(name, text, opts) {
	var me = this;

	opts = opts || {};
	me.rows = me.rows || {};

	me.rows[name] = {
	    required: true,
	    defaultValue: Proxmox.Utils.noneText,
	    header: text,
	    editor: {
		xtype: 'proxmoxWindowEdit',
		onlineHelp: 'pmgconfig_systemconfig',
		subject: text,
		items: {
		    xtype: 'proxmoxtextfield',
		    vtype: 'HttpProxy',
		    name: name,
		    deleteEmpty: true,
		    emptyText: Proxmox.Utils.noneText,
		    labelWidth: Proxmox.Utils.compute_min_label_width(
			text, opts.labelWidth),
		    fieldLabel: text
		}
	    }
	};
    },

    initComponent : function() {
	var me = this;

	me.add_boolean_row('dailyreport', gettext('Send daily reports'),
			   { defaultValue: 1});

	me.add_boolean_row('advfilter', gettext('Use advanced statistic filters'),
			   { defaultValue: 1});

	me.add_integer_row('statlifetime', gettext('User statistic lifetime (days)'),
			   { minValue: 1, defaultValue: 7, deleteEmpty: true });

	me.add_text_row('email', gettext("Administrator EMail"),
			{ deleteEmpty: true, defaultValue: Proxmox.Utils.noneText });

	me.add_proxy_row('http_proxy', gettext("HTTP proxy"));

	me.callParent();

	me.on('activate', me.rstore.startUpdate);
	me.on('deactivate', me.rstore.stopUpdate);
	me.on('destroy', me.rstore.stopUpdate);
    }
});
