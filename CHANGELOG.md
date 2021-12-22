## 0.5.1 - 2021/12/22
* Optimize of startup time.
* Remove invisible characters sample from README.
* Fixed an issue where border disable was not reflected at startup.

## 0.5.0 - 2021/12/21
* New implementation by patching text-buffer, when tree-sitter is enabled.
* New option to set placeholders for Cr+Eol(CRLF).
* Exclude NARROW NO-BREAK SPACE from format-character.

## 0.4.0 - 2021/12/13
* New option to show only the selected area.
* New option to set placeholders for control characters.
* Supports hangul filler as format character.

## 0.3.2 - 2021/12/6
* Warning text in readme and settings: When tree-sitter is enabled (default on since Atom 1.32), the additional placeholders and borders in this package will not work. [No alternative is available yet.](https://github.com/atom/atom/issues/18196#issuecomment-432741331) Please turn off the setting 'Settings => Core => Use Tree Sitter Parsers' to use this package.
* Fixed an issue where changes to placeholders were not reflected immediately.
* Fixed an issue where prevented grammar selector from displaying tree-sitter.

## 0.3.1 - 2017/1/11
* Fixed for Atom v1.13.0: the contents of atom-text-editor elements are no longer encapsulated within a shadow DOM boundary.

## 0.3.0 - 2016/5/24
* Supports soft hyphen as zero width space.
* Hide internal grammar from grammar selector.

## 0.2.0 - 2016/5/17
* Performance improvements at package loading and activation.

## 0.1.0 - 2016/5/15 (First Release)
* Every feature added
* Every bug fixed
