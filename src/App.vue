<template>
  <div id="vue-admin-beautiful">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {},
  }
</script>


<style>
  .table-icon{
    position: absolute;
    top: 0;
    right: 0;
    width: 38px;
    height: 38px;
    text-align: center;
    line-height: 38px;
    cursor: pointer;
  }
  .checkbox-block .el-checkbox{
    display: block;
    margin-right: 0;
  }
</style>
