<template>
  <div :class="'logo-container-' + layout">
    <router-link to="/" >
        <img :class="collapse == true ? 'collapseTrue' : 'collapseFalse' " src="../../../assets/ic_launcher_round@2x.png" />
        <span class="title" :class="{ 'hidden-xs-only': layout === 'horizontal' }" :title="title" >
          {{ collapse == false ? title : '' }}
        </span>
    </router-link>

  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabLogo',
    data() {
      return {
        title: this.$baseTitle,
      }
    },
    computed: {
      ...mapGetters({
        logo: 'settings/logo',
        layout: 'settings/layout',
        collapse: 'settings/collapse',   //05-26添加
      }),
    },
  }
</script>
<style lang="scss" scoped>
  .collapseTrue {
    width: 40px;height: 40px;margin-right: 10px;margin-top: 10px;
  }
  .collapseFalse {
    width: 40px;height: 40px;margin-right: 10px;margin-top: -10px;
  }
  .router-link-active{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0;
  }
  @mixin container {
    position: relative;
    height: $base-top-bar-height;
    overflow: hidden;
    line-height: $base-top-bar-height;
    background: $base-menu-background;
  }

  @mixin logo {
    display: inline-block;
    width: 28px;
    height: 28px;
    margin-right: 3px;
    color: $base-title-color;
    vertical-align: middle;
  }

  @mixin title {
    font-size: 18px;
    color: $base-title-color;
  }

  .logo-container-horizontal {
    @include container;

    .logo {
      @include logo;
    }

    .title {
      @include title;
    }
  }

  .logo-container-vertical {
    @include container;

    height: $base-logo-height;
    line-height: $base-logo-height;
    text-align: center;

    .logo {
      @include logo;
    }

    .title {
      @include title;

      max-width: calc(#{$base-left-menu-width} - 60px);
    }
  }
</style>
