var CompositeDisposable;

module.exports={
	subscription: null,
	
	activate: function(state) {
		var atomClasses=require("atom");
		CompositeDisposable=atomClasses.CompositeDisposable;
		this.subscription=new CompositeDisposable();
		
		atom.grammars.readGrammar(
		    require.resolve("./show-invisibles-plus.json"),(error, grammar) => {
			if (error!=null)
			{
				atom.notifications.addError(error.message);
			}
			else
			{
				grammar.path="";	// Hack to hide from grammar settings
				atom.grammars.addGrammar(grammar);
				
				// Hack to hide from grammar selector
				atom.grammars.getGrammars=function(...params) {
					return this.__proto__.getGrammars.call(this,...params)
					    .filter((grammar) => grammar.path!="");
				};
			}
		});
		
		var stylePath=require.resolve(
		    "./text-mate-grammar-injection-method.less");
		this.subscription.add(
		    atom.styles.addStyleSheet(
		    atom.themes.loadStylesheet(stylePath,true),{ sourcePath: stylePath })
		);
		
		(function(keyPath,config,callback) {
			for (var key in config)
			{
				if (config[key].type=="object")
				{
					arguments.callee(
					    keyPath+"."+key,config[key].properties,callback);
				}
				else
				{
					callback(keyPath+"."+key,config[key]);
				}
			}
		})("show-invisibles-plus",this.config,(keyPath,config) => {
			if (config.sync!=null)
			{
				this.subscription.add(
				    atom.config.observe(config.sync,(value) => {
					if (atom.config.get(keyPath)!=value)
					{
						atom.config.set(keyPath,value);
					}
				}));
				this.subscription.add(
				    atom.config.onDidChange(keyPath,(event) => {
					atom.config.set(config.sync,event.newValue);
				}));
			}
			if (config.content!=null)
			{
				var updater=() => {
					var placeholder=atom.config.get(keyPath).substring(0,1);
					
					updateStyle(config.content+"::before","content",
					    "\""+(atom.config.get("editor.showInvisibles") ?
					    placeholder : "")+"\"");
				};
				
				this.subscription.add(
				    atom.config.observe(keyPath,(value) => {
					if (value.length>1)
					{
						atom.config.set(keyPath,value.substring(0,1));
					}
					else
					{
						updater();
					}
				}));
				this.subscription.add(
				    atom.config.onDidChange("editor.showInvisibles",updater));
			}
			if (config.contents!=null)
			{
				var updater=() => {
					for (var i=0;i<=config.contents.length-1;i++)
					{
						var placeholder=atom.config.get(keyPath)
						    .split(/, /g)[i];
						
						updateStyle(config.contents[i]+"::before","content",
						    "\""+(atom.config.get("editor.showInvisibles") &&
						    !placeholder.match(/^\p{Control}+$/gu) ?
						    placeholder : "")+"\"");
					}
				};
				
				this.subscription.add(
				    atom.config.observe(keyPath,updater));
				this.subscription.add(
				    atom.config.onDidChange("editor.showInvisibles",updater));
			}
			if (config.border!=null)
			{
				var updater=() => {
					updateStyle(config.border,"borderStyle",
					    atom.config.get("editor.showInvisibles") &&
					    atom.config.get(keyPath) ? "solid" : "none");
				};
				
				this.subscription.add(
				    atom.config.observe(keyPath,updater));
				this.subscription.add(
				    atom.config.onDidChange("editor.showInvisibles",updater));
			}
			if (config.data!=null)
			{
				var updater=(textEditor) => {
					if (atom.config.get("editor.showInvisibles"))
					{
						textEditor.getElement().setAttribute(
						    "data-"+config.data,
						    atom.config.get(keyPath));
					}
					else
					{
						textEditor.getElement().removeAttribute(
						    "data-"+config.data);
					}
				};
				
				this.subscription.add(
				    atom.workspace.observeTextEditors(updater));
				this.subscription.add(
				    atom.config.onDidChange(keyPath,(event) => {
				    atom.workspace.getTextEditors().forEach(
				    (textEditor) => updater(textEditor)) }));
				this.subscription.add(
				    atom.config.onDidChange("editor.showInvisibles",(event) => {
				    atom.workspace.getTextEditors().forEach(
				    (textEditor) => updater(textEditor)) }));
			}
		});
		
		function updateStyle(clazz,style,value)
		{
			for (var i=document.styleSheets.length-1;i>=0;i--)
			{
				for (var j=0;j<=document.styleSheets[i].cssRules.length-1;j++)
				{
					var cssRule=document.styleSheets[i].cssRules[j];
					if (cssRule.selectorText=="atom-text-editor.editor "+
					    ".syntax--invisibles-plus."+
					    clazz.replace(/(?=^|\\.)/g,"syntax--"))
					{
						cssRule.style[style]=value;
						
						return;
					}
				}
			}
		}
	},
	
	deactivate: function() {
		this.subscription.dispose();
		this.subscription=null;
		
		atom.grammars.removeGrammarForScopeName("invisibles-plus");
		// Countermeasure for bug that is not reflected
		var grammars=atom.grammars.getGrammars();
		for (var i=0;i<=grammars.length-1;i++)
		{
			atom.grammars.grammarAddedOrUpdated(grammars[i]);
		}
		
		CompositeDisposable=null;
	},
};
