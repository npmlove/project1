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
                        label="操作类型"
                       >
                       <template slot-scope="scope">
                           <span v-if="scope.row.operationType == 0">交单</span>
                           <span v-if="scope.row.operationType == 1">解锁申请</span>
                           <span v-if="scope.row.operationType == 2">解锁通过</span>
                           <span v-if="scope.row.operationType == 3">解锁驳回</span>
                           <span v-if="scope.row.operationType == 4">审核通过</span>
                           <span v-if="scope.row.operationType == 5">审核驳回</span>
                       </template>
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

