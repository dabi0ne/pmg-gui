Ext.define('PMG.ObjectGroup', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.pmgObjectGroup',

    baseurl: undefined,

    otype_list: [],

    hideGroupInfo: false,
    showDirection: false, // only important for SMTP Whitelist

    ogdata: undefined,

    setBaseUrl: function(baseurl) {
	var me = this;

	me.baseurl = baseurl;

	me.store.setProxy({
	    type: 'proxmox',
	    url: '/api2/json' + me.baseurl + '/objects'
	});

	me.store.load(function() {
	    me.down('#addMenuButton').setDisabled(false);
	});
    },

    setObjectInfo: function(ogdata) {
	var me = this;

	me.ogdata = ogdata;

	var html = '<b>' + Ext.String.htmlEncode(me.ogdata.name) + '</b>';
	html += "<br><br>";
	html += Ext.String.htmlEncode(Ext.String.trim(me.ogdata.info));

	me.down('#oginfo').update(html);
	me.down('#ogdata').setHidden(false);
    },

    initComponent : function() {
	var me = this;

	me.store = new Ext.data.Store({
	    model: 'pmg-object-list',
	    sorters: [
		{
		    property : 'receivertest',
		},
		{
		    property : 'otype',
		    direction: 'ASC'
		}
	    ]
	});

	me.columns = [{
	    header: gettext('Type'),
	    dataIndex: 'otype',
	    renderer: PMG.Utils.format_otype,
	    width: 200
	}];

	if (me.showDirection) {
	    me.columns.push({
		header: gettext('Direction'),
		dataIndex: 'receivertest',
		renderer: function(value) {
		    return value ? PMG.Utils.receiverText : PMG.Utils.senderText;
		}
	    });
	}

	me.columns.push({
	    header: gettext('Value'),
	    dataIndex: 'descr',
	    renderer: Ext.String.htmlEncode,
	    flex: 1
	})

	var reload = function() {
            me.store.load();
        };

	me.selModel = Ext.create('Ext.selection.RowModel', {});

	var remove_btn = Ext.createWidget('proxmoxButton', {
	    text: gettext('Remove'),
	    disabled: true,
	    selModel: me.selModel,
	    confirmMsg: function (rec) {
		return Ext.String.format(
		    gettext('Are you sure you want to remove entry {0}'),
		    "'" +  PMG.Utils.format_otype(rec.data.otype) +
			': ' + rec.data.descr + "'");
	    },
	    handler: function(btn, event, rec) {
		Proxmox.Utils.API2Request({
		    url: me.baseurl + '/objects/'+ rec.data.id,
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

	var full_subject = function(subject, receivertest) {
	    if (me.showDirection) {
		var direction = receivertest ?
		    PMG.Utils.receiverText : PMG.Utils.senderText;

		return subject + ' (' + direction + ')';
	    } else {
		return subject;
	    }
	};

	var run_editor = function() {
	    var rec = me.selModel.getSelection()[0];
	    if (!rec) {
		return;
	    }

	    var editor = PMG.Utils.object_editors[rec.data.otype];
	    if (!editor) {
		return;
	    }

	    var config = Ext.apply({ method: 'PUT' }, editor);
	    config.subject = full_subject(editor.subject, rec.data.receivertest);
	    config.url = me.baseurl + '/' + editor.subdir + '/' + rec.data.id;

	    var win = Ext.createWidget('proxmoxWindowEdit', config);

	    win.load();
	    win.on('destroy', reload);
	    win.show();
	};

	var menu_items = [];

	Ext.Array.each(me.otype_list, function(otype) {

	    var editor = PMG.Utils.object_editors[otype];

	    var config = Ext.apply({ method: 'POST' }, editor);
	    config.subject = full_subject(editor.subject, editor.receivertest);

	    menu_items.push({
		text: config.subject,
		handler: function() {
		    if (me.baseurl == undefined) {
			return;
		    }
		    config.url = me.baseurl + '/' + editor.subdir;
		    var win = Ext.createWidget('proxmoxWindowEdit', config);
		    win.on('destroy', reload);
		    win.show();
		}
	    });
	});

	me.dockedItems = [];

	me.dockedItems.push({
	    xtype: 'toolbar',
	    dock: 'top',
	    items: [
		{
		    text: gettext('Add'),
		    disabled: true,
		    itemId: 'addMenuButton',
		    menu: new Ext.menu.Menu({
			items: menu_items
		    })
		},
		{
		    xtype: 'proxmoxButton',
		    text: gettext('Edit'),
		    disabled: true,
		    selModel: me.selModel,
		    handler: run_editor
		},
 		remove_btn
	    ]
	});

	me.dockedItems.push({
	    dock: 'top',
	    border: 1,
	    layout: 'anchor',
	    hidden: me.hideGroupInfo ? true : false,
	    itemId: 'ogdata',
	    items: [
		{
		    xtype: 'component',
		    anchor: '100%',
		    itemId: 'oginfo',
		    style: { 'white-space': 'pre' },
		    padding: 10,
		    html: gettext('Please select an object.'),
		    listeners: {
			dblclick: {
			    fn: function(e, t) {
				if (me.ogdata === undefined) { return; }
				me.fireEvent('dblclickOGInfo', me, e, t, me.ogdata);
			    },
			    element: 'el',
			    scope: this,
			}
		    }
		}
	    ]
	});

	Ext.apply(me, {
	    listeners: {
		itemdblclick: run_editor,
		activate: reload
	    }
	});

	me.callParent();

	if (me.baseurl) {
	    me.setBaseUrl(me.baseurl); // configure store, load()
	}
    }
});
