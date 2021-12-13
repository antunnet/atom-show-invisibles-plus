var CompositeDisposable;

module.exports={
	subscription: null,
	
	config: {
		show: {
			title: "Show Invisibles",
			description: "Render placeholders or borders for invisible characters, such as tabs, spaces and newlines."+
			    "\n<br/>**Warning: When tree-sitter is enabled (default on since Atom 1.32), the additional placeholders and borders in this package will not work. [No alternative is available yet.](https://github.com/atom/atom/issues/18196#issuecomment-432741331)** "+
			    "Please turn off the setting 'Settings => Core => Use Tree Sitter Parsers' to use this package.",
			type: "boolean",
			default: true,
			order: 1,
			sync: "editor.showInvisibles",
		},
		placeholders: {
			title: "Placeholders",
			description: "If you want to hide a specific invisible character, enter a space character in the placeholder field.",
			type: "object",
			order: 2,
			properties: {
				range: {
					title: "Limit the range",
					description: "Limit the range of invisible characters to be displayed.",
					type: "string",
					default: "",
					order: 1,
					enum: [
						{
							value: "",
							description: "Always",
						},
						{
							value: "selection cursor-line",
							description: "Only selections and cursor lines",
						},
						{
							value: "selection",
							description: "Only selections",
						},
					],
					data: "show-invisible",
				},
				cr: {
					title: "Cr",
					description: "Character used to render carriage return characters (\\r, CR, for Microsoft-style line endings).",
					type: "string",
					default: "¤",			// ￩←⪪␍
					order: 2,
					sync: "editor.invisibles.cr",
				},
				eol: {
					title: "Eol",
					description: "Character used to render newline characters (\\n, LF).",
					type: "string",
					default: "¬",			// ￬↓≡␊
					order: 3,
					sync: "editor.invisibles.eol",
				},
/*
				crlf: {
					title: "Cr+Eol",
					description: "Character used to render Cr+Eol characters.",
					type: "string",
					default: "↵",			// ⏎⮐⤶↲↩
//					order: 4,
//					sync: "editor.invisibles.crlf",
				},
*/
				space: {
					title: "Space",
					description: "Character used to render leading and trailing space characters.",
					type: "string",
					default: "·",			// △␠␣
					maximumLength: 1,
					order: 5,
					sync: "editor.invisibles.space",
				},
				tab: {
					title: "Tab",
					description: "Character used to render hard tab characters (\\t).",
					type: "string",
					default: "»",			// ⪫␉
					maximumLength: 1,
					order: 8,
					sync: "editor.invisibles.tab",
				},
				nbsp: {
					title: "No break space",
					description: "Character used to render no break space characters (NBSP).",
					type: "string",
					default: "~",			// ⍽
					maximumLength: 1,
					order: 6,
					content: "no-break-space",
				},
				ideographicSpace: {
					title: "Ideographic space",
					description: "Character used to render ideographic space characters (和字間隔、全角スペース).",
					type: "string",
					default: "□",			// ⬚
					maximumLength: 1,
					order: 7,
					content: "ideographic-space",
				},
				controlCharacters: {
					title: "Control characters",	// C0 controls+DEL
					description: "Characters used to render control character, such as null, \\v and \\f.",
//					type: "array",		// array+enum has bug
					type: "string",
					default: [
						"␀","␁","␂","␃","␄","␅","␆","␇",
						"␈","␉","␊","␋","␌","␍","␎","␏",
						"␐","␑","␒","␓","␔","␕","␖","␗",
						"␘","␙","␚","␛","␜","␝","␞","␟",
						"␡"].join(", "),
/*
					items: {
						type: "string",
					},
*/
					enum: [
						{
							value: [
								"\u0000","\u0001","\u0002","\u0003",
								"\u0004","\u0005","\u0006","\u0007",
								"\u0008","\u0009","\u000A","\u000B",
								"\u000C","\u000D","\u000E","\u000F",
								"\u0010","\u0011","\u0012","\u0013",
								"\u0014","\u0015","\u0016","\u0017",
								"\u0018","\u0019","\u001A","\u001B",
								"\u001C","\u001D","\u001E","\u001F",
								"\u007F"].join(", "),
							description: "As is (no placeholder)",
						},
/*
						{
							value: [
								" "," "," "," "," "," "," "," ",
								" "," "," "," "," "," "," "," ",
								" "," "," "," "," "," "," "," ",
								" "," "," "," "," "," "," "," ",
								" "].join(", "),
							description: "No placeholder",
						},
*/
						{
							value: [
								"␀","␁","␂","␃","␄","␅","␆","␇",
								"␈","␉","␊","␋","␌","␍","␎","␏",
								"␐","␑","␒","␓","␔","␕","␖","␗",
								"␘","␙","␚","␛","␜","␝","␞","␟",
								"␡"].join(", "),
							description: "The Unicode Standard Control Pictures (e.g. ␀ ␈)",
						},
/*
						{
							value: [
								"NUL","SOH","STX","ETX","EOT","ENQ","ACK","BEL",
								"BS ","HT ","LF ","VT ","FF ","CR ","SO ","SI ",
								"DLE","DC1","DC2","DC3","DC4","NAK","SYN","ETB",
								"CAN","EM ","SUB","ESC","FS ","GS ","RS ","US ",
								"DEL"].join(", "),
							description: "Control character code (e.g. NUL BS)",
						},
*/
						{
							value: [
								"⎕","⌈","⊥","⌋","⌁","⊠","✓","⍾",
								"⌫","⪫","≡","⩛","↡","⪪","⊗","⊙",
								"⊟","◴","◵","◶","◷","⍻","⎍","⊣",
								"⧖","⍿","␦","⊖","◰","◱","◲","◳",
								"␥"].join(", "),
							description: "ISO 2047 (Graphical representations) (e.g. ⎕ ⌫)",
						},
/*
						{
							value: [
								"^@","^A","^B","^C","^D","^E","^F","^G",
								"^H","^I","^J","^K","^L","^M","^N","^O",
								"^P","^Q","^R","^S","^T","^U","^V","^W",
								"^X","^Y","^Z","^[","^\\","^]","^^","^_",
								"^?"].join(", "),
							description: "Caret notation (e.g. ^@ ^H)",
						},
*/
/*
						{
							value: [
								"\\0","\\x01","\\x02","\\x03",
								"\\x04","\\x05","\\x06","\\x07",
								"\\b","\\t","\\n","\\v",
								"\\f","\\r","\\x0E","\\x0F",
								"\\x10","\\x11","\\x12","\\x13",
								"\\x14","\\x15","\\x16","\\x17",
								"\\x18","\\x19","\\x1A","\\x1B",
								"\\x1C","\\x1D","\\x1E","\\x1F",
								"\\x7F"].join(", "),
							description: "C language style (e.g. \\0 \\b)",
						},
*/
						// U+0000
					],
//					radio: true,
					order: 9,
					contents: [
						"control-character-nul","control-character-soh",
						"control-character-stx","control-character-etx",
						"control-character-eot","control-character-enq",
						"control-character-ack","control-character-bel",
						"control-character-bs" ,"control-character-ht" ,
						"control-character-lf" ,"control-character-vt" ,
						"control-character-ff" ,"control-character-cr" ,
						"control-character-so" ,"control-character-si" ,
						"control-character-dle","control-character-dc1",
						"control-character-dc2","control-character-dc3",
						"control-character-dc4","control-character-nak",
						"control-character-syn","control-character-etb",
						"control-character-can","control-character-em" ,
						"control-character-sub","control-character-esc",
						"control-character-fs" ,"control-character-gs" ,
						"control-character-rs" ,"control-character-us" ,
						"control-character-del"],
				},
			},
		},
		borders: {
			title: "Borders",
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
		
		CompositeDisposable=null;
	},
};
