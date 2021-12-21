var CompositeDisposable;

module.exports={
	subscription: null,
	
	invisibles: {},
	eolInvisibles: {},
	classes: [],
	enable: true,
	
	activate: function(state) {
		var atomClasses=require("atom");
		CompositeDisposable=atomClasses.CompositeDisposable;
		this.subscription=new CompositeDisposable();
		
		var patterns=require("./show-invisibles-plus.json").patterns;
		for (var i=0;i<=patterns.length-1;i++)
		{
			var characters=[];
			var matched;
			if (matched=patterns[i].match.match(/^\[([^\]]+)\]$/))
			{
				for (var j=0;j<=matched[1].length-1;j++)
				{
					if (matched[1].charAt(j)=="\\")
					{
						characters.push(String.fromCharCode(
						    parseInt("0"+matched[1].substring(j+1,j+4),16)));
						
						j=j+3;
					}
					else if (matched[1].charAt(j+1)=="-")
					{
						for (var k=matched[1].charCodeAt(j);
						    k<=matched[1].charCodeAt(j+2);k++)
						{
							characters.push(String.fromCharCode(k));
						}
						j=j+2;
					}
					else
					{
						characters.push(matched[1].charAt(j));
					}
				}
			}
			else if (patterns[i].match.charAt(0)=="\\")
			{
				characters.push(String.fromCharCode(
				    parseInt("0"+patterns[i].match.substring(1,4),16)));
			}
			else
			{
				characters.push(patterns[i].match);
			}
			
			for (var j=0;j<=characters.length-1;j++)
			{
				var classes=patterns[i].name.split(".")
				    .filter((className) => className!="invisibles-plus");
				
				if (this.invisibles[characters[j]]==null)
				{
					this.invisibles[characters[j]]={
					    code: characters[j].charCodeAt(0),
					    placeholder: null,
					    classes: [],
					};
				}
				this.invisibles[characters[j]].classes.push(...
				    classes.filter((className) =>
				    this.invisibles[characters[j]].classes
				    .indexOf(className)==-1));
			}
		}
		for (var character in this.invisibles)
		{
			this.invisibles[character].classes.sort();
			var classes=this.invisibles[character].classes
			    .filter((className) => className.indexOf(
			    "control-character-")!=0).join(" ");
			var index=this.classes.length;
			for (var i=0;i<=this.classes.length-1;i++)
			{
				if (this.classes[i]==classes)
				{
					index=i;
					
					break;
				}
			}
			this.invisibles[character].id=index;
			this.classes[index]=classes;
		}
		
		var refresher=() => {};
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
					
					for (var character in this.invisibles)
					{
						if (this.invisibles[character].classes.indexOf(
						    config.content)!=-1)
						{
							this.invisibles[character].placeholder=
							    (placeholder!=character && placeholder!=" "
							    ? placeholder : null);
						}
					}
					
					refresher();
				};
				
				this.subscription.add(
				    atom.config.observe(keyPath,(value) => {
					if (value.length>1)
					{
						atom.config.set(keyPath,value.substring(0,1));
					}
					else
					{
						updater(value);
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
						
						for (var character in this.invisibles)
						{
							if (this.invisibles[character].classes.indexOf(
							    config.contents[i])!=-1)
							{
								this.invisibles[character].placeholder=
								    (placeholder!=character && placeholder!=" "
								    ? placeholder : null);
							}
						}
					}
					
					refresher();
				};
				
				this.subscription.add(
				    atom.config.observe(keyPath,updater));
				this.subscription.add(
				    atom.config.onDidChange("editor.showInvisibles",updater));
			}
			if (config.eol!=null)
			{
				var updating=false;
				var updater=() => {
					if (updating) return;
					updating=true;
					
					var character=config.eol;
					var placeholder=atom.config.get(keyPath);
					
					var eolInvisible0=this.eolInvisibles[character];
					if (placeholder!=character && placeholder!=config.title &&
					    atom.config.get("editor.showInvisibles"))
					{
						this.eolInvisibles[character]=placeholder;
					}
					else
					{
						delete this.eolInvisibles[character];
					}
					
					if (this.eolInvisibles[character]!=eolInvisible0)
					{
						atom.config.set("editor.showInvisibles",
						    !atom.config.get("editor.showInvisibles"));
						atom.config.set("editor.showInvisibles",
						    !atom.config.get("editor.showInvisibles"));
					}
					
					updating=false;
				};
				
				this.subscription.add(
				    atom.config.observe(keyPath,updater));
				this.subscription.add(
				    atom.config.onDidChange("editor.showInvisibles",updater));
			}
			if (config.border!=null)
			{
				var updater=() => {
					for (var i=document.styleSheets.length-1;i>=0;i--)
					{
						for (var j=0;j<=document.styleSheets[i]
						                        .cssRules.length-1;j++)
						{
							var cssRule=document.styleSheets[i].cssRules[j];
							if (cssRule.selectorText=="atom-text-editor.editor "+
							    ".invisible-character."+config.border)
							{
								cssRule.style["borderStyle"]=
								    (atom.config.get(keyPath) ? "solid" : "none");
								
								return;
							}
						}
					}
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
		this.subscription.add(
		    atom.config.observe("editor.showInvisibles",(value) => {
			this.enable=value;
		}));
		refresher=() => {
			atom.grammars.getGrammars({ includeTreeSitter: true })
			    .forEach((grammar) =>
			    atom.grammars.grammarAddedOrUpdated(grammar));
		};
		
		var stylePath=require.resolve(
		    "./text-buffer-patch-method.less");
		this.subscription.add(
		    atom.styles.addStyleSheet(
		    atom.themes.loadStylesheet(stylePath,true),{ sourcePath: stylePath })
		);
		
		var showInvisiblesPlus=this;
		this.subscription.add(
		    atom.workspace.observeTextEditors((textEditor) => {
			var screenLineBuilder=textEditor.getBuffer()
			    .getDisplayLayer(0).screenLineBuilder;
			
			screenLineBuilder.emitText=function(text,reopenTags=true) {
				if (showInvisiblesPlus.enable &&
				    showInvisiblesPlus.invisibles[text]!=null &&
				    showInvisiblesPlus.invisibles[text].placeholder!=null)
				{
					text=showInvisiblesPlus.invisibles[text].placeholder;
				}
				
				this.__proto__.emitText.call(this,text,reopenTags);
			};
			screenLineBuilder.updateCurrentTokenFlags=function(nextCharacter) {
				this.__proto__.updateCurrentTokenFlags.call(this,nextCharacter);
				
				if (showInvisiblesPlus.enable &&
				    showInvisiblesPlus.invisibles[nextCharacter]!=null)
				{
					// INVISIBLE_CHARACTER
//					this.currentBuiltInClassNameFlags|=(1 << 4);
					this.emitBuiltInTagBoundary=true;
					
//					this.currentBuiltInClassNameFlags|=(1 << 1);
					this.currentBuiltInClassNameFlags=(1 << 1);
					if (showInvisiblesPlus.invisibles[nextCharacter]
					    .placeholder==null)
					{
						this.currentBuiltInClassNameFlags|=(1 << 2);
					}
					this.currentBuiltInClassNameFlags|=(
					    showInvisiblesPlus.invisibles[nextCharacter].id << 3);
				}
			};
			screenLineBuilder.getBuiltInScopeId=function(flags) {
				if (flags & (1 << 1))
				{
					let scopeId=this.displayLayer.getBuiltInScopeId(flags);
					if (scopeId===-1)
					{
						let className="invisible-character "+
						    showInvisiblesPlus.classes[flags >> 3];
						if (flags & (1 << 2))
						{
							className=className+" no-placeholder";
						}
						scopeId=this.displayLayer.registerBuiltInScope(
						    flags,className);
					}
					return scopeId;
				}
				else
				{
					return this.__proto__.getBuiltInScopeId.call(this,flags);
				}
			};
			
			var displayLayer=textEditor.getBuffer().getDisplayLayer(0);
			Object.assign(displayLayer.eolInvisibles,
			    showInvisiblesPlus.eolInvisibles);
			this.subscription.add(displayLayer.onDidReset(() => {
				Object.assign(displayLayer.eolInvisibles,
				    showInvisiblesPlus.eolInvisibles);
			}));
		}));
	},
	
	deactivate: function() {
		atom.workspace.getTextEditors().forEach((textEditor) => {
			var screenLineBuilder=textEditor.getBuffer()
			    .getDisplayLayer(0).screenLineBuilder;
			
			delete screenLineBuilder.emitText;
			delete screenLineBuilder.updateCurrentTokenFlags;
			delete screenLineBuilder.getBuiltInScopeId;
		});
		
		this.subscription.dispose();
		this.subscription=null;
		
		atom.config.set("editor.showInvisibles",
		    !atom.config.get("editor.showInvisibles"));
		atom.config.set("editor.showInvisibles",
		    !atom.config.get("editor.showInvisibles"));
		
		CompositeDisposable=null;
	},
};
