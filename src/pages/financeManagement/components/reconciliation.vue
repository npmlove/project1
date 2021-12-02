<template>
<div>
    <el-dialog
        title="应付对账信息"
        :visible.sync="dialogVisible"
        top="20vh"
        width="50%">
            <el-dialog
                width="50%"
                title="匹配结果"
                :visible.sync="innerVisible"
                append-to-body>
                <el-table
                    :data="tableData"
                    border
                    stripe
                    :cell-style='backStyle'
                    style="width: 100%;margin-top:20px">
                    <el-table-column
                        prop="waybillNumber"
                        label="对账单运单号" >
                    </el-table-column>
                    <el-table-column
                        prop="sysWaybillNumber"
                        label="系统运单号" >
                    </el-table-column>
                    <el-table-column
                     
                        label="对账单金额">
                        <template slot-scope="scope">
                            <span  v-if="scope.row.difference =='R'">已对账，不能重复对账</span>
     
                            <span  v-if="scope.row.difference > 0 ">{{scope.row.cost}}</span>
                            <span  v-if="scope.row.difference < 0 ">{{scope.row.cost}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sysCost"
                        label="未对账金额" >
                    </el-table-column>
                    <el-table-column
                        label="差异" >
                        <template slot-scope="scope">
                           <span class="text_color_blue" v-if="scope.row.difference =='R'">已对账，不能重复对账</span>
                           <span v-if="scope.row.difference =='N'">未找到</span>
                           <span class="text_color_red" v-if="scope.row.difference > 0 ">+{{scope.row.difference}}</span>
                           <span class="text_color_yellow" v-if="scope.row.difference < 0 ">-{{scope.row.difference}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="customer"
                        label="应付对象">
                    </el-table-column>
                    <el-table-column
                        prop="orderNo"
                        label="订单号" >
                    </el-table-column>
                    <el-table-column
                        prop="mscsName"
                        label="操作">
                    </el-table-column>
                </el-table>
                <div class="cont">
                    <div>对账单费用总额：{{dialogData.expenseTotal}}</div>
                    <div>匹配成功{{dialogData.count}}条，金额：{{dialogData.expenseTotalSuccess}}</div>
                    <div>匹配失败{{dialogData.countErr}}条，金额：{{dialogData.expenseTotalError}} </div>
                    <div class="text_color_blue" @click="exportErrExcel">导出全部对账单</div>
                </div>
                <div class="footer"  slot="footer" >
                    <el-button type="primary" style="width:210px" @click="btnInsert">确认对账并导出全部对账单</el-button>
                    <el-button  @click="btnInsert">取消</el-button>
                </div>
                 
            </el-dialog>
        <div class="cont">
            <div class="flex_line">
                <div> <span style="color:red">*</span><span>对账金额：</span></div>
                <div>  
                    <el-input
                        size="small"
                        type="number"
                        placeholder="请输入数字"
                        v-model="input3">
                    </el-input> 
                </div>
            </div>
            <div class="flex_line">
                <div>
                    <span style="color:red">*</span><span>币种：</span>
                </div>
                <div>
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="cont">
            <div class="flex_line">
                <div> <span style="color:red">*</span><span>应付对象：</span></div>
                <div>  
                    <el-input
                        size="small"
                        placeholder="请输入内容"
                        v-model="expenseUnitName">
                    </el-input> 
                </div>
            </div>
            <div class="flex_line">

               <el-upload
                      class="upload-demo"
                      ref="uploadExcle"
                      :before-upload="beforeAvatarUpload"
                      :limit="1"
                    >
                    <el-button slot="trigger" size="small" type="primary">导入对账单</el-button>
                </el-upload>
                 
            </div>
        </div>
        <div class="cont">
            <div>订单应付总金额：{{totalApCny}}  </div>
            <div>未对账金额：{{unreconciledAmount}}    </div>
            <div>已对账金额：{{payCheckAmount}}   </div>
        </div>
        <div class=" footer"  slot="footer">
            <el-button type="primary" @click="comfire">确认对账</el-button>
            <el-button @click="cancle">取 消</el-button>
            
        </div>
  
    </el-dialog>
</div>
    
</template>

<script>
import { postImage ,exportFile} from '../../../util/util'
export default {
    name:'reconciliation',
    props:['multipleselection'],
    data() {
        return {
            dialogVisible: false,
            input3:'', //对账金额
            expenseUnitName:'上海美凯航空服务有限公司', //应付对象 测试数据
            value: '1', // 默认选择CNY
            totalApCny:0,// 应付总金额
            unreconciledAmount:0,// 未对账金额
            payCheckAmount:0,// 已对账金额
            options: [{
                value: '1',
                label: 'CNY'
                }, {
                value: '2',
                label: '港币'
                }, {
                value: '3',
                label: '美元'
                }, {
                value: '4',
                label: '欧元'
                }, {
                value: '5',
                label: '英镑'
                }
            ],
            file:'',//附件
            innerVisible: false,// 内层模态框
            tableData:[],//
            dialogData:{},//
            opIds:[] ,// 确认对账的参数 
        };
    },
    watch:{
        multipleselection(newValue,oldValue){
            let { totalApCny ,unreconciledAmount, payCheckAmount, opIds} = this;
            for(let i in newValue){
                 totalApCny =   newValue[i].totalApCny + totalApCny
                 unreconciledAmount = newValue[i].unreconciledAmount + unreconciledAmount
                 payCheckAmount = newValue[i].payCheckAmount + payCheckAmount
                 opIds.push(newValue[i].ids)
            }
            this.payCheckAmount = payCheckAmount
            this.totalApCny = totalApCny
            this.unreconciledAmount = unreconciledAmount
        
        }
    },

    methods: {
        showModal(){
            this.dialogVisible = true
        },
        beforeAvatarUpload(file){
            console.log(file)
            this.file = file
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let that = this;
            reader.onload = function() {
                that.upLoad()
            };
        },
        upLoad(){
            let fileFormData = new FormData();
            fileFormData.append('excel', this.file)
            fileFormData.append('expenseUnitName', this.expenseUnitName)
            postImage(this.$service.importExcel,fileFormData).then((res)=>{     
                if(res.code == 200){
                    this.tableData = res.data.orderPaymentBillList
                    this.dialogData = res.data
                    this.innerVisible = true
                }
            })
        },
        async cancle(){
                this.dialogVisible = false
                this.$emit('farhersearch');
        },
        comfire(){
            let { input3 , unreconciledAmount } = this 
            if(input3 > unreconciledAmount){
                this.$message({
                        message: '对账金额> 未对账金额，请重新输入',
                        type: 'warning'
                    });
                this.input3 = ''    
            }else{
                let params ={
                    currency:this.value,
                    expenseUnitName:this.expenseUnitName,
                    inputCheck:input3,
                    opIds:this.opIds,
                    
                }
                console.log(params)
                this.$http.post(this.$service.toEnterReconciliation,params).then((res)=>{
                    console.log(res)
                    if(res.code == 200){
                        this.$message({
                            message: '对账成功',
                            type: 'success'
                        });
                        this.cancle()
                    }
                })
            }
        },
        btnInsert(){
            let res = this.$http.post(this.$service.toReconciliation,this.tableData)
            exportFile(res,"application/vnd.ms-excel",'全部对账单')
            this.innerVisible = false
        },
        backStyle({row, columnIndex}){
 
            if(columnIndex == 2 || columnIndex == 3){
                if(row.difference == 'R'){
                    console.log(row.difference)
                    return 'background: #62a0ed'
                }else if(row.difference > 0){
                    return 'background: #e55f5f '
                }else if(row.difference < 0){
                    return 'background: #eddc62'
                }   
            }
        },
        async exportErrExcel(){
            let res =  this.$http.post(this.$service.exportErrExcel,this.tableData)
            exportFile(res,"application/vnd.ms-excel",'全部对账单')
        },
        

    },
}
</script>
<style scoped>
.cont{
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
}
.flex_line{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.footer{
    margin: 40px 0 0 0;
    display: flex;
    justify-content: space-around;
}
.text_color_yellow{
    color: #eddc62;
}
.text_color_red{
    color: #e55f5f;
}
.text_color_blue{
    color: #62a0ed;
}
</style>