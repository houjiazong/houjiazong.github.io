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
}
