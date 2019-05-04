/*global Proxmox */
Ext.ns('PMG');

console.log("Starting PMG Manager");


Ext.define('PMG.Utils', {
    singleton: true,

    // this singleton contains miscellaneous utilities

    senderText: gettext('Sender'),
    receiverText: gettext('Receiver'),
    scoreText: gettext('Score'),

    user_role_text: {
	root: gettext('Superuser'),
	admin: gettext('Administrator'),
	helpdesk: gettext('Help Desk'),
	qmanager: gettext('Quarantine Manager'),
	audit: gettext('Auditor')
    },

    format_user_role: function(role) {
	return PMG.Utils.user_role_text[role] || role;
    },

    oclass_text: {
	who: gettext('Who Objects'),
	what: gettext('What Objects'),
	when: gettext('When Objects'),
	action: gettext('Action Objects'),
	from: gettext('From'),
	to: gettext('To')
    },

    oclass_icon: {
	who: '<span class="fa fa-fw fa-user-circle"></span> ',
	what: '<span class="fa fa-fw fa-cube"></span> ',
	when: '<span class="fa fa-fw fa-clock-o"></span> ',
	action: '<span class="fa fa-fw fa-flag"></span> ',
	from: '<span class="fa fa-fw fa-user-circle"></span> ',
	to: '<span class="fa fa-fw fa-user-circle"></span> '
    },

    mail_status_map: {
	2: 'delivered',
	4: 'deferred',
	5: 'bounced',
	N: 'rejected',
	G: 'greylisted',
	A: 'accepted',
	B: 'blocked',
	Q: 'quarantine'
    },

    icon_status_map_class: {
	2: 'check-circle',
	4: 'clock-o',
	5: 'mail-reply',
	N: 'times-circle',
	G: 'list',
	A: 'check',
	B: 'ban',
	Q: 'cube'
    },

    icon_status_map_color: {
	2: 'green',
	5: 'gray',
	A: 'green',
	B: 'red'
    },

    format_status_icon: function(status) {
	var icon = PMG.Utils.icon_status_map_class[status] || 'question-circle';
	var color = PMG.Utils.icon_status_map_color[status] || '';
	return '<i class="fa fa-' + icon + ' ' + color + '"></i> ';
    },

    format_oclass: function(oclass) {
	var icon = PMG.Utils.oclass_icon[oclass] || '';
	var text = PMG.Utils.oclass_text[oclass] || oclass;
	return icon + text;
    },

    rule_direction_text: {
	0: gettext('In'),
	1: gettext('Out'),
	2: gettext('In & Out')
    },

    rule_direction_icon: {
	0: '<span class="fa fa-fw fa-long-arrow-left"></span> ',
	1: '<span class="fa fa-fw fa-long-arrow-right"></span> ',
	2: '<span class="fa fa-fw fa-exchange"></span> '
    },

    format_rule_direction: function(dir) {
	var icon = PMG.Utils.rule_direction_icon[dir] || '';
	var text = PMG.Utils.rule_direction_text[dir] || dir;
	return icon + text;
    },

    format_otype: function(otype) {
	var editor = PMG.Utils.object_editors[otype];
	var iconCls = 'fa fa-question-circle';
	if (editor) {
	    var icon = '<span class="fa-fw ' + (editor.iconCls || iconCls) + '"></span> ';
	    return icon + editor.subject;
	}

	return '<span class="fa-fw ' + iconCls + '"></span> unknown';
    },

    format_ldap_protocol: function(p) {
	if (p === undefined) { return 'LDAP'; }
	if (p === 'ldap') { return 'LDAP'; }
	if (p === 'ldaps') { return 'LDAPS'; }
	if (p === 'ldap+starttls') { return 'LDAP+STARTTLS'; }
	return 'unknown';
    },

    convert_field_to_per_min: function(value, record) {
	return (value/(record.data.timespan/60));
    },

    object_editors: {
	1000: {
	    onlineHelp: 'pmg_mailfilter_regex',
	    iconCls: 'fa fa-filter',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'regex',
	    subject: gettext("Regular Expression"),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'regex',
		    labelWidth: 150,
		    reference: 'regex',
		    fieldLabel: gettext("Regular Expression")
		},
		{
		    labelWidth: 150,
		    fieldLabel: gettext('Test String'),
		    xtype: 'pmgRegexTester',
		    wholeMatch: true,
		    regexFieldReference: 'regex'
		}
	    ]
	},
	1005: {
	    onlineHelp: 'pmgconfig_ldap',
	    iconCls: 'fa fa-users',
	    xtype: 'pmgLDAPGroupEditor',
	    subdir: 'ldap',
	    subject: gettext("LDAP Group")
	},
	1006: {
	    onlineHelp: 'pmgconfig_ldap',
	    iconCls: 'fa fa-user',
	    xtype: 'pmgLDAPUserEditor',
	    subdir: 'ldapuser',
	    subject: gettext("LDAP User")
	},
	1009: {
	    onlineHelp: 'pmg_mailfilter_regex',
	    iconCls: 'fa fa-filter',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'receiver_regex',
	    subject: gettext("Regular Expression"),
	    receivertest: true,
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'regex',
		    labelWidth: 150,
		    fieldLabel: gettext("Regular Expression")
		}
	    ]
	},
	1001: {
	    onlineHelp: 'pmg_mailfilter_who',
	    iconCls: 'fa fa-envelope-o',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'email',
	    subject: gettext("E-Mail"),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'email',
		    fieldLabel: gettext("E-Mail")
		}
	    ]
	},
	1007: {
	    onlineHelp: 'pmg_mailfilter_who',
	    iconCls: 'fa fa-envelope-o',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'receiver',
	    subject: gettext("E-Mail"),
	    receivertest: true,
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'email',
		    fieldLabel: gettext("E-Mail")
		}
	    ]
	},
	1002: {
	    onlineHelp: 'pmg_mailfilter_who',
	    iconCls: 'fa fa-globe',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'domain',
	    subject: gettext("Domain"),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'domain',
		    fieldLabel: gettext("Domain")
		}
	    ]
	},
	1008: {
	    onlineHelp: 'pmg_mailfilter_who',
	    iconCls: 'fa fa-globe',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'receiver_domain',
	    subject: gettext("Domain"),
	    receivertest: true,
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'domain',
		    fieldLabel: gettext("Domain")
		}
	    ]
	},
	1003: {
	    onlineHelp: 'pmg_mailfilter_who',
	    iconCls: 'fa fa-globe',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'ip',
	    subject: gettext("IP Address"),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'ip',
		    fieldLabel: gettext("IP Address")
		}
	    ]
	},
	1004: {
	    onlineHelp: 'pmg_mailfilter_who',
	    iconCls: 'fa fa-globe',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'network',
	    subject: gettext("IP Network"),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'cidr',
		    fieldLabel: gettext("IP Network")
		}
	    ]
	},
	2000: {
	    onlineHelp: 'pmg_mailfilter_when',
	    iconCls: 'fa fa-clock-o',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'timeframe',
	    subject: gettext("TimeFrame"),
	    items: [
		{
		    xtype: 'timefield',
		    name: 'start',
		    format: 'H:i',
		    fieldLabel: gettext("Start Time")
		},
		{
		    xtype: 'timefield',
		    name: 'end',
		    format: 'H:i',
		    fieldLabel: gettext("End Time")
		}
	    ]
	},
	3000: {
	    onlineHelp: 'pmg_mailfilter_what',
	    iconCls: 'fa fa-bullhorn',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'spamfilter',
	    subject: gettext('Spam Filter'),
	    items: [
		{
		    xtype: 'proxmoxintegerfield',
		    name: 'spamlevel',
		    allowBlank: false,
		    minValue: 0,
		    fieldLabel: gettext('Level')
		}
	    ]
	},
	3001: {
	    onlineHelp: 'pmg_mailfilter_what',
	    iconCls: 'fa fa-bug',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'virusfilter',
	    subject: gettext('Virus Filter'),
	    uneditable: true,
	    // there are no parameters to give, so we simply submit it
	    listeners: {
		show: function(win) {
		    win.submit();
		}
	    }
	},
	3002: {
	    onlineHelp: 'pmg_mailfilter_regex',
	    iconCls: 'fa fa-code',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'matchfield',
	    subject: gettext('Match Field'),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'field',
		    labelWidth: 150,
		    allowBlank: false,
		    fieldLabel: gettext('Field')
		},
		{
		    xtype: 'textfield',
		    reference: 'value',
		    name: 'value',
		    labelWidth: 150,
		    allowBlank: false,
		    fieldLabel: gettext('Value')
		},
		{
		    labelWidth: 150,
		    fieldLabel: gettext('Test String'),
		    xtype: 'pmgRegexTester',
		    regexFieldReference: 'value'
		}
	    ]
	},
	3003: {
	    onlineHelp: 'pmg_mailfilter_what',
	    iconCls: 'fa fa-file-image-o',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'contenttype',
	    width: 400,
	    subject: gettext('Content Type Filter'),
	    items: [
		{
		    xtype: 'combobox',
		    displayField: 'text',
		    labelWidth: 150,
		    valueField: 'mimetype',
		    name: 'contenttype',
		    editable: true,
		    queryMode: 'local',
		    store: {
			autoLoad: true,
			proxy: {
			    type: 'proxmox',
			    url: '/api2/json/config/mimetypes'
			}
		    },
		    fieldLabel: gettext('Content Type'),
		    anyMatch: true,
		    matchFieldWidth: false,
		    listeners: {
			change: function(cb, value) {
			    var me = this;
			    me.up().down('displayfield').setValue(value);
			}
		    }
		},
		{
		    xtype: 'displayfield',
		    fieldLabel: gettext('Value'),
		    labelWidth: 150,
		    allowBlank: false,
		    reset: Ext.emptyFn
		}
	    ]
	},
	3004: {
	    onlineHelp: 'pmg_mailfilter_regex',
	    iconCls: 'fa fa-file-o',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'filenamefilter',
	    width: 400,
	    subject: gettext('Match Filename'),
	    items: [
		{
		    xtype: 'textfield',
		    name: 'filename',
		    reference: 'filename',
		    fieldLabel: gettext('Filename'),
		    labelWidth: 150,
		    allowBlank: false
		},
		{
		    labelWidth: 150,
		    fieldLabel: gettext('Test String'),
		    wholeMatch: true,
		    xtype: 'pmgRegexTester',
		    regexFieldReference: 'filename'
		}
	    ]
	},
	3005: {
	    onlineHelp: 'pmg_mailfilter_what',
	    iconCls: 'fa fa-file-archive-o',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'archivefilter',
	    width: 400,
	    subject: gettext('Archive Filter'),
	    items: [
		{
		    xtype: 'combobox',
		    displayField: 'text',
		    labelWidth: 150,
		    valueField: 'mimetype',
		    name: 'contenttype',
		    editable: true,
		    queryMode: 'local',
		    store: {
			autoLoad: true,
			proxy: {
			    type: 'proxmox',
			    url: '/api2/json/config/mimetypes'
			}
		    },
		    fieldLabel: gettext('Content Type'),
		    anyMatch: true,
		    matchFieldWidth: false,
		    listeners: {
			change: function(cb, value) {
			    var me = this;
			    me.up().down('displayfield').setValue(value);
			}
		    }
		},
		{
		    xtype: 'displayfield',
		    fieldLabel: gettext('Value'),
		    labelWidth: 150,
		    allowBlank: false,
		    reset: Ext.emptyFn
		}
	    ]
	},
	3006: {
	    onlineHelp: 'pmg_mailfilter_what',
	    iconCls: 'fa fa-pause',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'quotafilter',
	    width: 400,
	    subject: gettext('Quota Filter'),
	    items: [
			{
		    xtype: 'combobox',
		    displayField: 'text',
		    labelWidth: 150,
		    valueField: 'mimetype',
		    name: 'quotatype',
		    editable: true,
		    queryMode: 'local',
		    store: ['user','anyuser','domain','anydomain'],
		    fieldLabel: gettext('Quota Type'),
		    anyMatch: true,
		    matchFieldWidth: false,
		    listeners: {
				change: function(cb, value) {
					var me = this;
					if (value.startsWith('any')){
						me.up().down('field[name=quotatarget]').hide().setValue('');
					} else {
						me.up().down('field[name=quotatarget]').show();
					}
				}
			}
		},
		{
		    xtype: 'numberfield',
		    name: 'quotalimit',
		    reference: 'quotalimit',
		    fieldLabel: gettext('Max mails'),
		    labelWidth: 150,
		    allowBlank: false,
		    minValue: 0
		},
		{
		    xtype: 'numberfield',
		    name: 'quotaframe',
		    reference: 'quotaframe',
		    fieldLabel: gettext('Time frame (in seconds)'),
		    labelWidth: 150,
		    allowBlank: false,
		    minValue: 0
		},
		{
		    xtype: 'textfield',
		    name: 'quotatarget',
		    reference: 'quotatarget',
		    fieldLabel: gettext('Target'),
		    labelWidth: 150,
		    allowBlank: true,
		}
	    ]
	},
	4002: {
	    onlineHelp: 'pmg_mailfilter_action',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'notification',
	    subject: gettext('Notification'),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'name',
		    allowBlank: false,
		    fieldLabel: gettext('Name')
		},
		{
		    xtype: 'textareafield',
		    name: 'info',
		    fieldLabel: gettext("Description")
		},
		{
		    xtype: 'textfield',
		    name: 'to',
		    allowBlank: false,
		    value: '__ADMIN__',
		    fieldLabel: gettext('Receiver')
		},
		{
		    xtype: 'textfield',
		    name: 'subject',
		    allowBlank: false,
		    value: 'Notification: __SUBJECT__',
		    fieldLabel: gettext('Subject')
		},
		{
		    xtype: 'textarea',
		    name: 'body',
		    allowBlank: false,
		    grow: true,
		    growMax: 250,
		    value:
			"Proxmox Notifcation:\n\n" +
			"Sender:   __SENDER__\n" +
			"Receiver: __RECEIVERS__\n" +
			"Targets:  __TARGETS__\n\n" +
			"Subject:  __SUBJECT__\n\n" +
			"Matching Rule: __RULE__\n\n" +
			"__RULE_INFO__\n\n" +
			"__VIRUS_INFO__\n" +
			"__SPAM_INFO__\n",
		    fieldLabel: gettext('Body')
		},
		{
		    xtype: 'proxmoxcheckbox',
		    name: 'attach',
		    fieldLabel: gettext("Attach orig. Mail")
		}
	    ]
	},
	4003: {
	    onlineHelp: 'pmg_mailfilter_action',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'field',
	    subject: gettext('Header Attribute'),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'name',
		    allowBlank: false,
		    fieldLabel: gettext('Name')
		},
		{
		    xtype: 'textareafield',
		    name: 'info',
		    fieldLabel: gettext("Description")
		},
		{
		    xtype: 'textfield',
		    name: 'field',
		    allowBlank: false,
		    fieldLabel: gettext('Field')
		},
		{
		    xtype: 'textfield',
		    reference: 'value',
		    name: 'value',
		    allowBlank: false,
		    fieldLabel: gettext('Value')
		}
	    ]
	},
	4005: {
	    onlineHelp: 'pmg_mailfilter_action',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'bcc',
	    subject: gettext('BCC'),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'name',
		    allowBlank: false,
		    fieldLabel: gettext('Name')
		},
		{
		    xtype: 'textareafield',
		    name: 'info',
		    fieldLabel: gettext("Description")
		},
		{
		    xtype: 'textfield',
		    name: 'target',
		    allowBlank: false,
		    fieldLabel: gettext("Target")
		},
		{
		    xtype: 'proxmoxcheckbox',
		    checked: true,
		    name: 'original',
		    fieldLabel: gettext("send orig. Mail")
		}
	    ]

	},
	4007: {
	    onlineHelp: 'pmg_mailfilter_action',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'removeattachments',
	    subject: gettext('Remove Attachments'),
	    width: 500,
	    fieldDefaults: {
		labelWidth: 150
	    },
	    items: [
		{
		    xtype: 'textfield',
		    name: 'name',
		    allowBlank: false,
		    fieldLabel: gettext('Name')
		},
		{
		    xtype: 'textareafield',
		    name: 'info',
		    fieldLabel: gettext("Description")
		},
		{
		    xtype: 'textareafield',
		    name: 'text',
		    grow: true,
		    growMax: 250,
		    fieldLabel: gettext("Text Replacement")
		},
		{
		    xtype: 'proxmoxcheckbox',
		    checked: true,
		    name: 'all',
		    fieldLabel: gettext("Remove all attachments")
		}
	    ]
	},
	4009: {
	    onlineHelp: 'pmg_mailfilter_action',
	    xtype: 'proxmoxWindowEdit',
	    subdir: 'disclaimer',
	    subject: gettext('Disclaimer'),
	    width: 400,
	    items: [
		{
		    xtype: 'textfield',
		    name: 'name',
		    allowBlank: false,
		    fieldLabel: gettext('Name')
		},
		{
		    xtype: 'textareafield',
		    name: 'info',
		    fieldLabel: gettext("Description")
		},
		{
		    xtype: 'textareafield',
		    name: 'disclaimer',
		    grow: true,
		    growMax: 250,
		    fieldLabel: gettext("Disclaimer")
		}
	    ]
	}
    },

    updateLoginData: function(data) {
	Proxmox.CSRFPreventionToken = data.CSRFPreventionToken;
	Proxmox.UserName = data.username;
	Ext.util.Cookies.set('PMGAuthCookie', data.ticket, null, '/', null, true );
    },

    quarantineActionExtracted: false,

    extractQuarantineAction: function() {

	if (PMG.Utils.quarantineActionExtracted) { return; }

	PMG.Utils.quarantineActionExtracted = true;

	var qs = Ext.Object.fromQueryString(location.search);

	var cselect = qs.cselect;
	var action = qs.action;
	var ticket = qs.ticket;
	var dateString = qs.date;

	if (dateString) {
	    var date = new Date(dateString).getTime()/1000;

	    // set from date for QuarantineList
	    /*jslint confusion: true*/
	    /*from is a string above and number here */
	    PMG.QuarantineList.from = date;
	    /*jslint confusion: false*/
	}

	delete qs.cselect;
	delete qs.action;
	delete qs.ticket;
	delete qs.date;

	var newsearch = Ext.Object.toQueryString(qs);

	var newurl = location.protocol + "//" + location.host + location.pathname;
	if (newsearch) { newurl += '?' + newsearch; }
	newurl += location.hash;

	if (window.history) {
	    window.history.pushState({ path:newurl }, '', newurl);
	}

	if (action || cselect) {
	    return { action: action, cselect: cselect };
	}
    },

    doQuarantineAction: function(action, id, callback) {
	var count = id.split(';').length;
	var successMessage = "Action '{0}'";
	if (count > 1) {
	    successMessage += " for '{1}' items";
	}
	successMessage += " successful";

	/*jslint confusion: true*/
	/*format is string and function*/
	Proxmox.Utils.API2Request({
	    url: '/quarantine/content/',
	    params: {
		action: action,
		id: id
	    },
	    method: 'POST',
	    failure: function(response, opts) {
		Ext.Msg.alert(gettext('Error'), response.htmlStatus);
	    },
	    success: function(response, opts) {
		var win = Ext.create('Ext.window.MessageBox',{
		    closeAction: 'destroy'
		}).show({
		    title: gettext('Info'),
		    message: Ext.String.format(successMessage, action, count),
		    buttons: Ext.Msg.OK,
		    icon: Ext.MessageBox.INFO
		});

		if (Ext.isFunction(callback)) {
		    callback();
		}
	    }
	});
	/*jslint confusion: false*/
    },

    sender_renderer: function(value, metaData, rec) {
	var subject = Ext.htmlEncode(value);
	var from = Ext.htmlEncode(rec.data.from);
	var sender = Ext.htmlEncode(rec.data.sender);
	if (sender) {
	    /*jslint confusion: true*/
	    /*format is a string above*/
	    from = Ext.String.format(gettext("{0} on behalf of {1}"),
				     sender, from);
	    /*jslint confusion: false*/
	}
	return '<small>' + from + '</small><br>' + subject;
    },

    constructor: function() {
	var me = this;

	// do whatever you want here
    }
});
