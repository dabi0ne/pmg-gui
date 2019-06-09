Ext.define('PMG.MailProxyAdvancedMasterConfiguration', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pmgMailProxyAdvancedMasterConfiguration',

    title: gettext('Configuration') + ': ' +
	gettext('Mail Proxy master.cf'),

    border: false,
    defaults: { border: false },

    items: [
		{
	    itemId: 'mtransport',
            title: gettext('Transports'),
	    xtype: 'pmgMailProxyAdvancedMasterTransport'
	    },
   ]
});


