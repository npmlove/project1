<template>
    <div>
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
</template>

<script>
//     piece: '', 件数 PCS
//     cbm: '',体积 CBM
//     weight: '',重量 KGS
//     cargoSize: '', 货物尺寸
//     packing: '',包装方式
//     outerBox: ''外箱情况
class tempObj {
    constructor(id,orderId,piece,cbm,weight,cargoSize,packing=1,outerBox=1){
        this.piece  = piece
        this.id = id
        this.orderId = orderId
        this.cbm  = cbm
        this.weight = weight
        this.cargoSize = cargoSize
        this.packing = packing
        this.outerBox = outerBox

    }
}
export default {

    props:['childData'],
    data() {
        return {
            id:'',
            orderId:'',
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
        };
    },

    mounted() {
        let {id , orderId} = this.childData[0]
        console.log(this.childData  )
        this.id = id
        this.orderId = orderId
        let tempIndata = this.childData
        for(let i in tempIndata){
            delete tempIndata[i].createTime
            delete tempIndata[i].updateTime
        }
        this.tableData = tempIndata
        // this.addOneTableObj()
    },

    methods: {
        addOneTableObj(){
            let tempObjs = new tempObj(this.id,this.orderId)
            this.tableData.push(tempObjs)
        },
        deleOneTableObj(e){
            let index = e.$index
            if(index == 0){
                this.$message({
                message: '第一条数据不能删除',
                type: 'warning'
                });
            }else{
                this.tableData.splice(index,1)
            }
        },
    },
};
</script>

<style  scoped>
    
</style>