const jiife = require('jiife');
const base = ['node_modules/xtal-latx/define.js', 'node_modules/xtal-latx/getHost.js', 'node_modules/xtal-latx/observeCssSelector.js'];
const litterg = base.concat('litter-g.js');
const destruct = base.concat('node_modules/xtal-latx/debounce.js', 'node_modules/xtal-latx/destruct.js')
const littergz = destruct.concat('litter-g.js', 'litter-gz.js');
jiife.processFiles(litterg, 'litter-g.iife.js');
jiife.processFiles(littergz, 'litter-gz.iife.js');