<template>
  <div class="table-container">
    <div :style="{height:(height + 100 )+'px'}">

    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {

      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {

    },
    beforeDestroy() {},
    mounted() {},
    methods: {

    
 
    }
  }
</script>
<style scoped></style>


