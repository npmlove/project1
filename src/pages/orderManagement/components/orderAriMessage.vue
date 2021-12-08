<template>

    <div class="contont">
        <h1 class="title">订舱信息</h1>
        <el-form  inline size="mini" label-width="80px" :model="formLabelAlign">
            <el-form-item  label="品名" >
                <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="品类">
                <el-input v-model="formLabelAlign.region"></el-input>
            </el-form-item>
            <el-form-item label="品类">
                <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item label="单价" >
                <el-input disabled v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item label="航线">
                <el-input disabled v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button><i class="el-icon-download">托书下载</i></el-button>
            </el-form-item>
        </el-form>
        <h1 class="title">订舱数据</h1>
        <div class="bg_dark">
            <div class="flex_center">
                <div>3PCS</div>
                <div>200KGS</div>
                <div>2CBM</div>
                <div>1：100</div>
                <div>1：100</div>
                <div>200KGS</div>
            </div>
            <div class="flex_center mtop_10">
                <div>件数</div>
                <div>毛重</div>
                <div>体积</div>
                <div>比重</div>
                <div>分泡比例</div>
                <div>计费重</div>
            </div> 
        </div>
        <div class="bg_table">
            <div class="flex_center border padding_contont " style="">
                <div>托盘数量</div>
                <div>长（cm）</div>
                <div>宽（cm）</div>
                <div>高（cm）</div>
            </div>
            <div class="flex_center border padding_contont ">
                <div>2</div>
                <div>34</div>
                <div>12</div>
                <div>23</div>
            </div>
        </div>
        <h1 class="title">进仓数据</h1>
        <div class="inData">
            <div class="flex_center">
                <div><el-input size="mini" v-model="input"></el-input></div>
                <div><el-input size="mini" v-model="input"></el-input></div>
                <div><el-input size="mini" v-model="input"></el-input></div>
                <div><el-input size="mini" v-model="input"></el-input></div>
                <div><el-input size="mini" v-model="input"></el-input></div>
                <div><el-input size="mini" v-model="input"></el-input></div>
    
            </div>
            <div class="flex_center mtop_10">
                <div>件数</div>
                <div>毛重</div>
                <div>体积</div>
                <div>比重</div>
                <div>分泡比例</div>
                <div>计费重</div>
            </div>
            <el-table
                class="mtop_10"
                :data="tableData"
                border
                stripe
                size='small'
                max-height="200"
                
                style="width: 100%">
                <el-table-column
                    label="件数 PCS">
                    <template slot-scope="scope">
                        <el-input size="small"  v-model="scope.row.piece" clearable></el-input>    
                    </template>
                </el-table-column>
                <el-table-column
                    label="体积 CBM">
                    <template slot-scope="scope">
                        <el-input size="small"  v-model="scope.row.cbm" clearable></el-input>    
                    </template>
                </el-table-column>
                <el-table-column
                    label="重量 KGS">
                    <template slot-scope="scope">
                        <el-input size="small"  v-model="scope.row.weight" clearable></el-input>    
                    </template>
                </el-table-column>
                <el-table-column
                    label="货物尺寸">
                    <template slot-scope="scope">
                        <el-input size="small"  v-model="scope.row.cargoSize" clearable></el-input>    
                    </template>
                </el-table-column>
                <el-table-column
                    label="包装方式">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.packing"   placeholder="请选择">
                            <el-option
                                v-for="item in packingArray"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>   
                    </template>
                </el-table-column>
                <el-table-column
                    label="外箱情况">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.outerBox"   placeholder="请选择">
                            <el-option
                                v-for="item in outerBoxArray"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>   
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <div >
                            <span v-if="tableData.length - 1 == scope.$index" @click="addOneTableObj(scope)">新增</span>
                            <span @click="deleOneTableObj(scope)" >删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
  
        </div>
        <h1 class="title">其他服务</h1>
        <div class="inData" style="background:rgb(240,240,240);padding-left:20px">
            <div>
                <span class="mr_25">报关服务</span>
                <el-radio v-model="radio"  label="1">自行报关</el-radio>
                <el-radio v-model="radio" label="2">委托报关</el-radio>
            </div>
            <div class="mtop_10">
                <span class="mr_25">国内提货</span>
                <el-radio v-model="radio1"  label="1">不需要</el-radio>
                <el-radio v-model="radio1" label="2">需要</el-radio>
            </div>
            <div class="mtop_10">
                <span class="mr_25">清关服务</span>
                <el-radio v-model="radio2"  label="1">自行清关</el-radio>
                <el-radio v-model="radio2" label="2">DDU</el-radio>
                <el-radio v-model="radio2" label="3">DDP</el-radio>
                <el-radio v-model="radio2" label="4">DAP</el-radio>
            </div>
        </div>
        <h1 class="title">订单备注</h1>
        <div class="inData">
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入备注"
                v-model="textarea">
            </el-input>
        </div>
           
    </div>
</template>
<script>
//     piece: '', 件数 PCS
//     cbm: '',体积 CBM
//     weight: '',重量 KGS
//     cargoSize: '', 货物尺寸
//     packing: '',包装方式
//     outerBox: ''外箱情况
class tempObj {
    constructor(piece,cbm,weight,cargoSize,packing=1,outerBox=1){
        this.piece  = piece
        this.cbm  = cbm
        this.weight = weight
        this.cargoSize = cargoSize
        this.packing = packing
        this.outerBox = outerBox

    }
}
// 订舱信息组件
export default {
    data() {
        return {
            tableData:[], //进仓数据
            packingArray:[
                {
                   value:1,
                   label:'纸箱' 
                },
                {
                   value:2,
                   label:'夹板箱' 
                },
                {
                   value:3,
                   label:'托盘' 
                },
            ], // 包箱方式数组
            outerBoxArray:[
                {
                    value:1,
                    label:'正常'
                },{
                    value:2,
                    label:'异常'
                }
            ],
            formLabelAlign: {
                name:'',
                region:'',
                type:"",
            },
            radio:'1',// 报关服务
            radio1:'1' ,// 国内提货
            radio2:'1',//清关服务
            textarea:''// 备注
        };
    },
    mounted(){
        this.addOneTableObj()
    },
    methods:{
        addOneTableObj(){
            let tempObjs = new tempObj()
            this.tableData.push(tempObjs)
        },
    deleOneTableObj(e){
      let index = e.$index
      console.log(index)
      if(index == 0){
        this.$message({
          message: '第一条数据不能删除',
          type: 'warning'
        });
      }else{
        this.tableData.splice(index,1)
      }
    },
    }
}
</script>

<style  scoped>
.contont{
    height: 60vh;
}
.title{
    font-size: 16px;
    color: rgb(2, 175, 240);
    font-weight: 800;
    margin-bottom: 10px;
}
.bg_dark{
    width: 60%;
    background: rgb(128,128,128);
    padding: 10px 0;
    margin-left: 80px;
    font-weight: 900;

}
.flex_center{
    display: flex;
}
.mtop_10{
    margin-top: 10px;
}
.flex_center>div{
    flex: 1;
    text-align: center;
}
.bg_table,.inData{
    width: 60%;
    padding: 10px 0;
    margin-left: 80px;
    font-weight: 900;
}
.border{
    border: 1px solid black;
    border-bottom:none 
}
.border:nth-last-child(1){
    border: 1px solid black;
}
.padding_contont>div{
    padding: 10px 0;
}
.mr_25{
    margin-right: 25px;
}


</style>