const jiife = require('jiife');
const xtal = 'node_modules/xtal-latx/';
const base = [xtal + 'define.js', xtal + 'getHost.js', xtal + 'observeCssSelector.js', xtal + 'attachScriptFn.js'];
const litterg = base.concat('litter-g.js');
const destruct = base.concat('node_modules/xtal-latx/debounce.js', 'node_modules/xtal-latx/destruct.js')
const littergz = destruct.concat('litter-g.js', 'litter-gz.js');
jiife.processFiles(litterg, 'litter-g.iife.js');
jiife.processFiles(littergz, 'litter-gz.iife.js');