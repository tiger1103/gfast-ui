// needed js files
var js = {
  ace: 'ace.js',
  aceExtWhitespace: 'ext-whitespace.js',
  pbSyntaxHighlighter: CKEDITOR.plugins.getPath('pbckcode') + 'dialogs/PBSyntaxHighlighter.js'
};

var commandName = 'pbckcode';

/**
 * Plugin definition
 */
CKEDITOR.plugins.add('pbckcode', {
  icons: 'pbckcode',
  hidpi: true,
  lang: ['fr', 'en', 'ru'],
  init: function(editor) {
    // if there is no user settings
    // create an empty object
    if (editor.config.pbckcode === undefined) {
      editor.config.pbckcode = {};
    }

    // default settings object
    var DEFAULT_SETTINGS = {
      cls: 'ace-code',
      modes: [
        ['C/C++'        , 'c_cpp'],
        ['C9Search'     , 'c9search'],
        ['Clojure'      , 'clojure'],
        ['CoffeeScript' , 'coffee'],
        ['ColdFusion'   , 'coldfusion'],
        ['C#'           , 'csharp'],
        ['CSS'          , 'css'],
        ['Diff'         , 'diff'],
        ['Glsl'         , 'glsl'],
        ['Go'           , 'golang'],
        ['Groovy'       , 'groovy'],
        ['haXe'         , 'haxe'],
        ['HTML'         , 'html'],
        ['Jade'         , 'jade'],
        ['Java'         , 'java'],
        ['JavaScript'   , 'javascript'],
        ['JSON'         , 'json'],
        ['JSP'          , 'jsp'],
        ['JSX'          , 'jsx'],
        ['LaTeX'        , 'latex'],
        ['LESS'         , 'less'],
        ['Liquid'       , 'liquid'],
        ['Lua'          , 'lua'],
        ['LuaPage'      , 'luapage'],
        ['Markdown'     , 'markdown'],
        ['OCaml'        , 'ocaml'],
        ['Perl'         , 'perl'],
        ['pgSQL'        , 'pgsql'],
        ['PHP'          , 'php'],
        ['Powershell'   , 'powershel1'],
        ['Python'       , 'python'],
        ['R'            , 'ruby'],
        ['OpenSCAD'     , 'scad'],
        ['Scala'        , 'scala'],
        ['SCSS/Sass'    , 'scss'],
        ['SH'           , 'sh'],
        ['SQL'          , 'sql'],
        ['SVG'          , 'svg'],
        ['Tcl'          , 'tcl'],
        ['Text'         , 'text'],
        ['Textile'      , 'textile'],
        ['XML'          , 'xml'],
        ['XQuery'       , 'xq'],
        ['YAML'         , 'yaml']
      ],
      // The syntax highlighter you will use in the output view
      highlighter: 'PRETTIFY',
      theme: 'twilight',
      tab_size: 4,
      js: CKEDITOR.plugins.getPath('pbckcode')+'ace'
    };

    // merge user settings with default settings
    editor.settings = CKEDITOR.tools.extend(DEFAULT_SETTINGS, editor.config.pbckcode, true);
    editor.settings.js = normalizeJsUrl(editor.settings.js);

    // load CSS for the dialog
    editor.on('instanceReady', function() {
      CKEDITOR.document.appendStyleSheet(this.path + 'dialogs/style.css');
    }.bind(this));

    // add the button in the toolbar
    editor.ui.addButton('pbckcode', {
      label: editor.lang.pbckcode.addCode,
      command: commandName,
      toolbar: 'pbckcode'
    });

    // link the button to the command
    editor.addCommand(commandName, new CKEDITOR.dialogCommand('pbckcodeDialog', {
        allowedContent: 'pre[*]{*}(*)'
      })
    );

    // disable the button while the required js files are not loaded
    editor.getCommand(commandName).disable();

    // add the plugin dialog element to the plugin
    CKEDITOR.dialog.add('pbckcodeDialog', this.path + 'dialogs/pbckcode.js');

    // add the context menu
    if (editor.contextMenu) {
      editor.addMenuGroup('pbckcodeGroup');
      editor.addMenuItem('pbckcodeItem', {
        label: editor.lang.pbckcode.editCode,
        icon: this.path + 'icons/pbckcode.png',
        command: commandName,
        group: 'pbckcodeGroup'
      });

      editor.contextMenu.addListener(function(element) {
        if (element.getAscendant('pre', true)) {
          return {pbckcodeItem: CKEDITOR.TRISTATE_OFF};
        }
      });
    }

    var scripts = [
      getScriptUrl(editor.settings.js, js.ace),
      js.pbSyntaxHighlighter
    ];

    // Load the required js files
    // enable the button when loaded
    CKEDITOR.scriptLoader.load(scripts, function() {
      editor.getCommand(commandName).enable();

      // need ace to be loaded
      CKEDITOR.scriptLoader.load([
        getScriptUrl(editor.settings.js, js.aceExtWhitespace)
      ]);
    });
  }
});

function normalizeJsUrl(js) {
  return js.concat('/')
    .replace(new RegExp('([^:]\/)\/+', 'g'), '$1');
}

function getScriptUrl(prefix, scriptName) {
  return prefix + scriptName;
}
