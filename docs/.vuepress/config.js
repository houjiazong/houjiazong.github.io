const { resolve } = require('path')

module.exports = {
  theme: resolve(__dirname, '../../m'),
  title: `M's blog`,
  description: '专注前端领域',
  base: '/',
  themeConfig: {
    nav: [
      { text: 'Blog', link: 'https://houjiazong.com' },
      { text: 'Github', link: 'https://github.com/houjiazong/houjiazong.github.io' },
    ],
    docsRepo: 'houjiazong/houjiazong.github.io',
    docsDir: '/',
    lastUpdated: '上次更新',
  },
  plugins: ['permalink-pinyin', ['autobar', {'pinyinNav': true}], 'rpurl'],
  head: [
    [
      'script',
      {},
      `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?d1715e0ce00105f0993f66bf4312b22c";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      `,
    ],
  ],
}
