<template>
  <a class="m_link" v-bind="$attrs"><slot /></a>
</template>

<script>
export default {
  name: 'Link',
}
</script>

<style lang="stylus" scoped>
.m_link {
  text-decoration: none;
  color: #121314;
  position: relative;
  padding: 0 .2em;
  z-index: 1;
  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 60%;
    left: 0;
    right: 0;
    bottom: 0;
    transition: top 200ms cubic-bezier(0, 0.8, 0.13, 1);
    background-color: rgba(79, 192, 141, 0.5);
  }
  &:hover {
    &:after {
      top: 0%
    }
  }
  a {
    color: #121314;
  }
}
</style>
