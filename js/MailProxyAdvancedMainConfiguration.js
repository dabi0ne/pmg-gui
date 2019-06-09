Ext.define('PMG.MailProxyAdvancedMainConfiguration', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pmgMailProxyAdvancedMainConfiguration',

    title: gettext('Configuration') + ': ' +
	gettext('Mail Proxy main.cf'),

    border: false,
    defaults: { border: false },

    items: [
	{
	    itemId: 'transports',
            title: gettext('Transports'),
	    xtype: 'pmgAdvancedTransport'
	},
	
   ]
});


