<template>
  <div class="m_guide-wrapper">
    <div class="m_guide-greeting">{{ getGreeting() }}</div>
    <div class="m_guide-menus">
      <template v-for="(item, idx) of menus">
        <div :key="idx" class="m_guide-menu-list">
          <template v-for="(menu, menuIdx) of item">
            <div :key="menuIdx" ref="menu" class="m_guide-menu" :style="{ width: menuWidth, height: `${menuHeight}px` }">
              <div class="m_guid-menu-inner" @click="onMenuClick(menu)" :style="getMenuInnerStyles(idx, menuIdx)">
                <div class="m_guide-menu-icon">
                  <img :src="menu.icon" />
                </div>
                <div class="m_guide-menu-label">{{ menu.title }}</div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const greetings = [
  '午夜时分，你可要注意身体呢！',
  '凌晨1点了！该休息了！',
  '工作狂，还在忙吗？',
  '午夜3点！你决定不睡觉了吗？？',
  '凌晨4点了，您的工作精神一定要上报党中央！',
  '5点多了，您是刚起床还是还没睡啊？',
  '早上好！新一天又开始啦！有什么打算呢？',
  '吃早饭了吗？',
  '吃早饭了吗？',
  '上午好！',
  '上午好！',
  '快中午啦，准备开饭啦！',
  '中午好！你吃饭了吗？',
  '下午好！午休了吗？',
  '下午好！',
  '下午好！',
  '下午好！',
  '下午好！',
  '该看新闻联播了！',
  '该看新闻联播了！',
  '休息下，找个电影看看睡觉吧？',
  '休息下，找个电影看看睡觉吧？',
  '休息下，找个电影看看睡觉吧？',
  '不早了，快休息吧？',
]
const menuWidth = [0, 0, '50%', '33.3333%', '25%', 0, '20%']
export default {
  name: 'Guide',
  data () {
    return {
      menuHeight: 0,
      menuWidth: '20%',
      sliceMenuNum: 0,
      menus: [],
    }
  },
  computed: {
    frontmatter () {
      const { frontmatter } = this.$page
      return frontmatter
    },
  },
  watch: {
    sliceMenuNum (val, oldVal) {
      if (val !== oldVal) {
        this.menus = this.sliceMenus(this.frontmatter.menus || [], val)
        this.menuWidth = menuWidth[val]
      }
    },
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.responsive, false)
  },
  mounted () {
    this.responsive()
    window.addEventListener('resize', this.responsive, false)
  },
  methods: {
    responsive () {
      this.setSliceMenuNum()
      this.$nextTick(() => {
        this.setMenuHeight()
      })
    },
    setSliceMenuNum () {
      let num = 6
      const bodyRect = document.body.getBoundingClientRect()
      if (bodyRect.width < 360) {
        num = 2
      } else if (bodyRect.width < 640) {
        num = 3
      } else if (bodyRect < 960) {
        num = 4
      }
      this.sliceMenuNum = num
    },
    setMenuHeight () {
      const $menus = this.$refs.menu
      const $firstMenu = $menus[0]
      const menuRect = $firstMenu.getBoundingClientRect()
      this.menuHeight = menuRect.width
    },
    getGreeting () {
      const date = new Date()
      const h = date.getHours()
      return greetings[h]
    },
    sliceMenus (array, size) {
      const result = []
      for (let x = 0; x < Math.ceil(array.length / size); x++) {
        var start = x * size
        var end = start + size
        result.push(array.slice(start, end))
      }
      return result
    },
    onMenuClick (item) {
      this.$router.push(item.path)
    },
    getMenuInnerStyles (l1Idx, l2Idx) {
      // 1,1 1,2 1,3 1,4 1,5
      // 2,1 2,2 2,3 2,4 2,5
      const rowNum = l1Idx + 1
      const colNum = l2Idx + 1
      let d = 0
      if (!(rowNum === 1 && colNum === 1)) {
        d = (((rowNum * colNum) - 1) * 0.05).toFixed(2)
      }
      return {
        'animation-delay': `${d}s`,
        '-webkit-animation-delay': `${d}s`,
        '-mz-animation-delay': `${d}s`,
        '-o-animation-delay': `${d}s`,
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.m_guide-wrapper
  height: 100%
  display: flex
  flex-direction: column
  justify-content: center
  align-content: center
.m_guide-greeting
  font-size: 36px
  font-weight: 600;
  color: rgb(51, 51, 51);
  text-align: center
.m_guide-menus
  width: 80%;
  max-width: 1080px
  margin: 30px auto 0;
.m_guide-menu-list
  width: 100%
  clear: both
.m_guide-menu
  width: 20%
  float left
  display: flex;
  align-items: center
  justify-content: center
.m_guid-menu-inner
  height: 80%
  width: 80%
  cursor: pointer
  animation: fadeIn .4s linear
  animation-fill-mode: both
  .m_guide-menu-icon
    position relative
    width: 70%
    height: 70%
    box-shadow: 0 2px 24px 0 rgba(0, 0, 0, .22)
    background-color: #fff
    border-radius: 23%
    display: flex
    align-items: center
    justify-content: center
    margin: 0 auto
    padding: 10%
    > img {
      height: 100%
    }
    &:after
      content: "";
      z-index: 100;
      position: absolute;
      left: 0;
      inline-size: 100%;
      block-size: 100%;
      background-color: hsla(0, 0%, 50.2%, 0);
      transition: background-color .15s;
      border-radius: 23%
  .m_guide-menu-label
    height: 30%
    width: 100%
    padding-top: 6%
    font-weight: 0
    text-align: center
  &:active
    .m_guide-menu-icon
      &:after
        background-color: rgba(0, 0, 0, .3);
        transition: none;
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
