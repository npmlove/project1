<template>
    <div style="position:relative;display:inline-block;margin-left:40px">
    <el-table
      :data="tableData"
      width="700px">
      <el-table-column v-for="(item,index) in columns" :key="index"
        :prop="item.prop"
        :label="item.label"
        width="180">
      </el-table-column>
    </el-table>
      <span 
      @click="shiftShowBill"
      style="padding:3px 6px;fontSize:25px;fontWeight:1000;color:silver;border:3px solid silver;position:absolute;top:-25px;right:-25px;borderRadius:50%">X</span>
    </div>
</template>
<script>
export default {
    props:{
        columns:{
            type:Array,
            default:()=>[{label:"开票抬头",prop:"invoiceTitle"},
            {label:"开票类型",prop:"invoiceType"},
            {label:"开票币种",prop:"applyCurrency"}
            ,{label:"开票方式",prop:"invoiceMethods"},
            {label:"申请开票金额",prop:"invoiceTitle"},
            {label:"已开票金额",prop:"invoiceTitle"}
            ]
        },
        tableData:{
            type:Array,
            default:()=>[]
        }
    },
    methods:{
        shiftShowBill(){
            this.$emit('shiftShowBill')
        }
    }
}
</script>
<style lang="less" scoped>
    .el-table{
        width:1080px!important;
    }
</style>