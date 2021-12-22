<template>
    <div>
        <el-dialog
            title="应付核销信息"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width="50%">
            <div class="contont">
                <div class="cont">
                    <div class="flex_line">
                        <div><span style="color:red">*</span><span>核销金额:</span></div>
                        <div><el-input v-model="writeOffAmount"  size="small" placeholder="请输入核销金额"></el-input></div>
                    </div>
                    <div class="flex_line">
                        <div><span style="color:red">*</span><span>付款账户信息:</span></div>
                        <div>
                            <el-select
                                v-model="bankAccount"
                                filterable
                                remote
                                size="small"
                                reserve-keyword
                                placeholder="请输入订舱代理上家"
                                :remote-method="remoteMethod">
                                <el-option
                                    v-for="item in tempArray"
                                    :key="item"
                                    :label="item.userName"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="cont">
                    <div class="flex_line">
                        <div><span style="color:red">*</span><span>币种:</span></div>
                        <div>
                            <el-select v-model="currency" size="small" placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="flex_line">
                        <div><span style="color:red">*</span><span>付款方式:</span></div>
                        <div>
                            <el-select v-model="writeOffWay" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in writeOffWayArray"
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
                        <div><span style="color:red">*</span><span>付款时间:</span></div>
                        <div>
                            <el-date-picker
                                v-model="paymentTime"
                                type="date"
                                size="small"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="flex_line">
                        <div><span style="color:red">*</span><span>结算方式:</span></div>
                        <div>
                            <el-select v-model="payWay" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in payWayArray"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="flex_line"> 
                    <span>订单应付总金额：{{totalApCny}}</span>
                    <span>未核销金额：{{unwrittenOffAmountRmb}}
                            <span v-if="currency == 1">￥</span>
                            <span v-if="currency == 2">HK$</span>
                            <span v-if="currency == 3">$</span>
                            <span v-if="currency == 4">€</span>
                            <span v-if="currency == 5">￡</span>    
                    </span>
                    <span>已核销金额：{{payWriteOffAmountRmb}} 
                            <span v-if="currency == 1">￥</span>
                            <span v-if="currency == 2">HK$</span>
                            <span v-if="currency == 3">$</span>
                            <span v-if="currency == 4">€</span>
                            <span v-if="currency == 5">￡</span>    
                    </span>
                </div>
                <div class="fo" >
                    <el-button type="primary" size="small" @click="onSubmit">确认核销</el-button>
                    <el-button  size="small" @click="cancle">取消</el-button>
                </div>
                
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { moneyList} from '../../../util/util'
export default {
    props:['childPropsObj','verificationArr'],
    data() {
        return {
            dialogVisible: false,
            bankAccount: {}, // 付款账户信息
            currency:'1',// 默认选择CNY
            writeOffAmount:0,//输入的核销金额
            writeOffWay:'1', //核销方式 0=银行转账 1=应付对冲
            paymentTime:'',
            payWay:'1', //0=付款买单 1=月结
            totalApCny:0,// 应付总金额
            unwrittenOffAmountRmb:0,// 未核销金额
            unwrittenOffAmountRmbString:0,// 未核销金额 jsonArray
            payWriteOffAmountRmb:0,// 已核销金额
            payWriteOffAmountRmbString:0,// 已核销金额jsonArray
            payWayArray:[{
                    value:'0',
                    label:"付款买单"
                },{
                    value:"1",
                    label:'月结'
                }
            ],
            writeOffWayArray:[
                {
                    value:'0',
                    label:'银行转账'
                },{
                    value:'1',
                    label:"应付对冲"
                }
            ],
            options: [],
            tempArray:[],
            allData:this.getArray(),
        };
    },


    watch:{
        currency(newValue){
            this.unwrittenOffAmountRmb = this.setOne( this.unwrittenOffAmountRmb)
            this.payWriteOffAmountRmb  = this.setOne(this.payWriteOffAmountRmb)
        },
        childPropsObj:{
            deep:true,
            immediate:true,
            handler(newValue,oldValue){
                let {totalApCny,totalApUnwoOrgn,totalApWoOrgn} = newValue
                if(totalApCny){
                    
                    this.totalApCny = totalApCny
                    this.unwrittenOffAmountRmbString = totalApWoOrgn
                    this.payWriteOffAmountRmbString = totalApUnwoOrgn
                    this.options = this.setOptionArray(totalApUnwoOrgn)
                    this.unwrittenOffAmountRmb = this.setOne(totalApWoOrgn)
                    this.payWriteOffAmountRmb  = this.setOne(totalApUnwoOrgn)
                }
                

            }
        }

    },
    methods:{
        getArray(){
            return this.verificationArr
        },
        async handleClose(){
            await this.cancle()
        },
        setOne(t){
            // 获取 当前币种下的金额
            let tempArray = JSON.parse(t)
            let a = ''
            for(let u in tempArray){
                if(tempArray[u].currency == this.currency){
                    a = tempArray[u].amount  
                }
            }
            return a
        },
        setOptionArray(tempJsonArray){
            let tempArray = JSON.parse(tempJsonArray)
            let temp = []
            for(let i in tempArray){
                for(let j in moneyList){
                    if(tempArray[i].currency == moneyList[j].value){
                        temp.push(moneyList[j])
                    }
                }
            }
            return temp
        },
        // 输入收款账户信息的返回值
        async remoteMethod(e){
            if (e !== '') {
                let res =  await this.$http.post(this.$service.searchBankAccount + `?userName=${e}`)
                console.log(res)
                this.tempArray = res.data
            } else {
                this.tempArray = [];
            }
        },
        showModal(){
            this.dialogVisible = true
        },
        async cancle(){
            this.dialogVisible = false
            this.$emit('farhersearch2');
        },
        async onSubmit(){
            let { bankAccount, currency ,writeOffAmount , unwrittenOffAmountRmb , writeOffWay ,paymentTime,payWay} = this;
            if(bankAccount == ''){
                this.$message({ showClose: true, message: '请输入付款账户信息',type: 'error',duration:2})
                return ;
            }
            if(paymentTime == ''){
                this.$message({ showClose: true,message: '请选择付款时间', type: 'error',duration:2})
                return ;
            }
            if(writeOffAmount > unwrittenOffAmountRmb ){
                this.$message({ showClose: true,message: '核销金额>未核销金额,请重新输入', type: 'error',duration:2})
                return ;
            }
            let params ={
                bankAccount:bankAccount,
                currency:currency,
                payWay:payWay,
                paymentTime:paymentTime,
                writeOffAmount:writeOffAmount,
                writeOffWay:writeOffWay,
                orderPaymentVOS:this.verificationArr
            }
            let res = await this.$http.post(this.$service.writeOff,params);
            if(res.code == 200){
                this.$message({ showClose: true, message: '成功',type: 'success',duration:2})
                await this.cancle()
            }
        }
    }
}
</script>

<style scoped>
.contont{
    width: 80%;
    margin-left: 10%;
    margin-top: 15px;
}
.fo{
display: flex;
justify-content: space-around;
padding-bottom: 20px;

}
.cont{
    display: flex;
    justify-content: space-between;
}
.flex_line{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.flex_line>span{
    flex: 1;
}
</style>