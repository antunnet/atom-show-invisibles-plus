var CompositeDisposable;

module.exports={
	subscription: null,
	
	config: {
		show: {
			title: "Show Invisibles",
			description: "Render placeholders or borders for invisible characters, such as tabs, spaces and newlines."+
			    "\n\n**Warning: When tree-sitter is enabled (default on since Atom 1.32), the additional placeholders and borders in this package will not work. [No alternative is available yet.](https://github.com/atom/atom/issues/18196#issuecomment-432741331)**"+
			    "\nPlease turn off the setting 'Settings => Core => Use Tree Sitter Parsers' to use this package.",
			type: "boolean",
			default: true,
			order: 1,
			sync: "editor.showInvisibles",
		},
		placeholders: {
			title: "Placeholders",
			type: "object",
			order: 2,
			properties: {
				cr: {
					title: "Cr",
					description: "Character used to render carriage return characters (\\r, CR, for Microsoft-style line endings).",
					type: "string",
					default: "\u00a4",		// ￩←⪪
					order: 1,
					sync: "editor.invisibles.cr",
				},
				eol: {
					title: "Eol",
					description: "Character used to render newline characters (\\n, LF).",
					type: "string",
					default: "\u00ac",		// ￬↓≡
					order: 2,
					sync: "editor.invisibles.eol",
				},
				space: {
					title: "Space",
					description: "Character used to render leading and trailing space characters.",
					type: "string",
					default: "\u00b7",		//  △
					order: 3,
					sync: "editor.invisibles.space",
				},
				tab: {
					title: "Tab",
					description: "Character used to render hard tab characters (\\t).",
					type: "string",
					default: "\u00bb",		// ⪫
					order: 6,
					sync: "editor.invisibles.tab",
				},
				nbsp: {
					title: "No break space",
					description: "Character used to render no break space characters (NBSP).",
					type: "string",
					default: "~",			// ⍽
					order: 4,
					content: "no-break-space",
				},
				ideographicSpace: {
					title: "Ideographic space",
					description: "Character used to render ideographic space characters (和字間隔、全角スペース).",
					type: "string",
					default: "□",			// ⬚
					order: 5,
					content: "ideographic-space",
				},
			},
		},
		borders: {
			title: "Borders",
//			description: ".",
			type: "object",
			order: 3,
			properties: {
				zeroWidthSpace: {
					title: "Zero width space",
					description: "Show border for zero width space.",
					type: "boolean",
					default: true,
					order: 1,
					border: "zero-width-space",
				},
				widthSpace: {
					title: "Whitespace",
					description: "Show border for whitespace which has no placeholders, such as en space (U+2002) and em space (U+2003).",
					type: "boolean",
					default: true,
					order: 2,
					border: "width-space",
				},
				controlCharacter: {
					title: "Control character",
					description: "Show border with error color for control character, such as null, \\a and \\v.",
					type: "boolean",
					default: true,
					order: 3,
					border: "control-character",
				},
				formatCharacter: {
					title: "Format character",
					description: "Show border with warning color for format character, such as zero width joiner (U+200D) and paragraph separator (U+2029).",
					type: "boolean",
					default: true,
					order: 4,
					border: "format-character",
				},
				invisibleOperator: {
					title: "Invisible operator",
					description: "Show border with warning color for invisible operator, such as function application (U+2061) and invisible times (U+2062).",
					type: "boolean",
					default: true,
					order: 5,
					border: "invisible-operator",
				},
			},
		},
	},
	
	activate: function(state) {
		var atomClasses=require("atom");
		CompositeDisposable=atomClasses.CompositeDisposable;
		
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
		
		this.subscription=new CompositeDisposable();
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
				var updater=(event) => {
					updateStyle(config.content+"::before","content","\""+(
						atom.config.get("editor.showInvisibles") ?
						atom.config.get(keyPath).substring(0,1) : " ")+"\"");
				};
				
				if (atom.config.get(keyPath)!=config.default)
				{
					updater();
				}
				this.subscription.add(
				    atom.config.onDidChange(keyPath,(event) => {
					if (event.newValue.length>1)
					{
						atom.config.set(keyPath,event.newValue.substring(0,1));
					}
					else
					{
						updater(event);
					}
				}));
				this.subscription.add(
				    atom.config.onDidChange("editor.showInvisibles",updater));
			}
			if (config.border!=null)
			{
				var updater=(event) => {
					updateStyle(config.border,"borderStyle",
						atom.config.get("editor.showInvisibles") &&
						atom.config.get(keyPath) ? "solid" : "none");
				};
				
				if (atom.config.get(keyPath)!=config.default)
				{
					updater();
				}
				this.subscription.add(
				    atom.config.onDidChange(keyPath,updater));
				this.subscription.add(
				    atom.config.onDidChange("editor.showInvisibles",updater));
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
					    ".syntax--invisibles-plus.syntax--"+clazz)
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
		
		CompositeDisposable=null;
	},
};
