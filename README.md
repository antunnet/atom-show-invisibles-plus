# show-invisibles-plus package

More show invisibles.

![A screenshot of rectangle-selection package](https://raw.githubusercontent.com/antunnet/atom-show-invisibles-plus/master/demo.png)

### Features

- Show customizable placeholders for ideographic-space, nbsp and control characters.
- Show borders for various whitespace, zero width characters and control characters.
- Option to show only the selected area.
- Better performance independent of file size.

### About the two types of implementation

This package runs two different implementations depending on whether tree-sitter is enabled or not.

Tree-sitter is enabled by default since Atom editor 1.32. You can switch tree-sitter from '`Settings` => `Core` => `Use Tree Sitter Parsers`'.

When tree-sitter is disabled, It works with text-mate's grammer-injection feature. It is highly stable because most of the processing is done using only the API. This implementation cannot be made to work when tree-sitter is enabled, because tree-sitter breaks compatibility and [no alternative is yet available](https://github.com/atom/atom/issues/18196#issuecomment-432741331).

When tree-sitter is enabled, It works by applying a patch to text-buffer. It is faster, but may stop working if there are changes in the code of the Atom editor itself. Please disable tree-sitter if you encounter any problems with the Atom editor version upgrade.
