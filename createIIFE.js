const jiife = require('jiife');
const base = ['node_modules/xtal-latx/define.js', 'node_modules/xtal-latx/debounce.js', 'node_modules/xtal-latx/destruct.js', 'node_modules/xtal-latx/getHost.js', 'node_modules/xtal-latx/observeCssSelector.js'];
const litterg = base.concat('litter-g.js');
const littergz = litterg.concat('litter-gz.js');
jiife.processFiles(litterg, 'litter-g.iife.js');
jiife.processFiles(littergz, 'litter-gz.iife.js');