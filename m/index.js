const path = require('path')

module.exports = (themeConfig, ctx) => {
  return {
    name: 'vuepress-theme-m',
    extend: '@vuepress/theme-default',
    layouts: path.resolve(__dirname, './layouts'),
  }
}
