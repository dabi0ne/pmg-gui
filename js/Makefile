JSSRC=							\
	Utils.js					\
	FilterProxy.js					\
	LoginView.js					\
	RoleSelector.js					\
	ServerStatus.js					\
	ServerAdministration.js				\
	LDAPProfileSelector.js				\
	LDAPGroupSelector.js				\
	LDAPGroupEditor.js				\
	LDAPUserSelector.js				\
	LDAPUserEditor.js				\
	RegexTester.js					\
	ObjectGroupList.js				\
	ObjectGroup.js					\
	ObjectGroupSelector.js				\
	ObjectGroupConfiguration.js			\
	ActionList.js					\
	RuleInfo.js					\
	RuleEditor.js					\
	Logo.js						\
	MainView.js					\
	QuarantineList.js				\
	SpamInfoGrid.js					\
	SpamQuarantine.js				\
	UserBlackWhiteList.js				\
	QuarantineView.js				\
	Dashboard.js					\
	dashboard/MailProcessing.js			\
	dashboard/SubscriptionInfo.js			\
	dashboard/MiniGraph.js				\
	VersionInfo.js					\
	MailTracker.js					\
	NavigationTree.js				\
	RuleConfiguration.js				\
	SystemOptions.js				\
	Subscription.js					\
	BackupRestore.js				\
	SystemConfiguration.js				\
	MailProxyRelaying.js				\
	MailProxyPorts.js				\
	MailProxyOptions.js				\
	MailProxyTLS.js					\
	MailProxyTLSPanel.js				\
	MailProxyTLSDomains.js				\
	Transport.js					\
	AdvancedTransport.js					\
	MailProxyAdvancedMainConfiguration.js	\
	AdvancedMasterTransport.js		\
	AdvancedMasterTransportOptions.js \
	MailProxyAdvancedMasterConfiguration.js \
	MyNetworks.js					\
	RelayDomains.js					\
	MailProxyConfiguration.js			\
	SpamDetectorLanguages.js			\
	SpamDetectorOptions.js				\
	SpamQuarantineOptions.js			\
	SpamDetectorStatus.js				\
	SpamDetectorConfiguration.js			\
	VirusDetectorOptions.js				\
	VirusQuarantineOptions.js			\
	VirusQuarantine.js				\
	ClamAVDatabase.js				\
	VirusDetectorConfiguration.js			\
	LDAPConfig.js					\
	UserEdit.js					\
	UserView.js					\
	FetchmailEdit.js				\
	FetchmailView.js				\
	UserManagement.js				\
	ViewMailHeaders.js				\
	PostfixQShape.js				\
	PostfixMailQueue.js				\
	QueueAdministration.js				\
	ClusterAdministration.js			\
	ConfigPanel.js					\
	StatTimeSelector.js				\
	StatStore.js					\
	MailStatGrid.js					\
	VirusCharts.js					\
	SpamScoreDistribution.js 			\
	GeneralMailStatistics.js			\
	RBLStatistics.js				\
	DomainStatistics.js				\
	SenderStatistics.js				\
	ReceiverStatistics.js				\
	ContactStatistics.js				\
	HourlyMailDistribution.js			\
	SpamContextMenu.js				\
	Application.js

# caution: order is important
MOBILESRC=				\
	  mobile/component.js		\
	  mobile/loginscreen.js		\
	  mobile/mailview.js		\
	  mobile/quarantineview.js	\
	  mobile/utils.js		\
	  mobile/app.js			\

OnlineHelpInfo.js: /usr/bin/asciidoc-pmg
	/usr/bin/asciidoc-pmg scan-extjs ${JSSRC} >$@.tmp
	mv $@.tmp $@

lint: ${JSSRC}
	jslint ${JSSRC} 

pmgmanagerlib.js: OnlineHelpInfo.js ${JSSRC}
	cat OnlineHelpInfo.js ${JSSRC} >$@.tmp
	mv $@.tmp $@

pmgmanagerlib-mobile.js: ${MOBILESRC}
	cat ${MOBILESRC} >$@.tmp
	mv $@.tmp $@

all: pmgmanagerlib.js pmgmanagerlib-mobile.js

.PHONY: clean
clean:
	find . -name '*~' -exec rm {} ';'	
	rm -rf pmgmanagerlib.js pmgmanagerlib-mobile.js OnlineHelpInfo.js



