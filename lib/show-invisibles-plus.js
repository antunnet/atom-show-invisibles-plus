module.exports={
	config: {
		show: {
			title: "Show Invisibles",
			description: "Render placeholders or borders for invisible characters, such as tabs, spaces and newlines.",
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
					description: "Character used to render carriage return characters (\\r, CR, U+000D).",
											// for MacOS 9-style line endings
					type: "string",
					default: "¤",			// ￩←⪪␍
					order: 2,
					sync: "editor.invisibles.cr",
				},
				eol: {
					title: "Eol",
					description: "Character used to render newline characters (for Mac/Linux-style line endings, \\n, LF, U+000A).",
					type: "string",
					default: "¬",			// ￬↓≡␊
					order: 3,
					sync: "editor.invisibles.eol",
				},
				crlf: {
					title: "Cr+Eol",
					description: "Character used to render Cr+Eol characters (for Windows-style line endings, \\r\\n, CRLF). By default, the Cr and Eol characters are joined together. This option is only effective when `Use Tree Sitter Parsers` is enabled.",
					type: "string",
					default: "Cr+Eol",		// ↵⏎⮐⤶↲↩
					order: 4,
//					depends: ["editor.invisibles.cr","editor.invisibles.eol"],
					eol: "\r\n",
				},
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
/*
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
*/
						{
							value: [
								" "," "," "," "," "," "," "," ",
								" "," "," "," "," "," "," "," ",
								" "," "," "," "," "," "," "," ",
								" "," "," "," "," "," "," "," ",
								" "].join(", "),
							description: "As is (no placeholder)",
						},
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
	
	textMateGrammarInjectionMethod:
	    require("./text-mate-grammar-injection-method"),
	textBufferPatchMethod:
	    require("./text-buffer-patch-method"),
	currentMethod: null,
	useTreeSitterParsersObserver: null,
	
	activate: function(state) {
		this.useTreeSitterParsersObserver=
		    atom.config.observe("core.useTreeSitterParsers",(treeSitter) => {
			if (this.currentMethod!=null)
			{
				this.currentMethod.deactivate();
				this.currentMethod=null;
			}
			
			if (treeSitter)
			{
				this.currentMethod=this.textBufferPatchMethod;
			}
			else
			{
				this.currentMethod=this.textMateGrammarInjectionMethod;
			}
			this.currentMethod.config=this.config;
			this.currentMethod.activate(state);
		});
	},
	
	deactivate: function() {
		if (this.currentMethod!=null)
		{
			this.currentMethod.deactivate();
			this.currentMethod=null;
		}
		
		this.useTreeSitterParsersObserver.dispose();
	},
};
