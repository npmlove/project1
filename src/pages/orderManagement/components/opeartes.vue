<template>
    <div>
        <el-dialog
            :visible.sync="dialogVisible"
            width="60%"
            
            title="账单操作记录"
            :before-close="handleClose">
                <el-table
                    :data="tableData"
                    border
                    class="metion"
                   >
                    <el-table-column
                        prop="operationType"
                        label="操作类型"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="操作时间"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="operationInfo"
                        label="说明">
                    </el-table-column>
                    <el-table-column
                        prop="operator"
                        label="操作人">
                    </el-table-column>
                </el-table>
                <div style="height:15px"></div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:['oplist'],
    data() {
        return {
           dialogVisible: false,
           tableData:this.oplist,
        };
    },
    methods:{
        show(){
            this.dialogVisible = true
        },
        handleClose(done) {
             this.dialogVisible = false
        }
    },
    
}
</script>
<style scoped>
.metion{
    padding-top: 15px;
}
</style>

