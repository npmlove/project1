<template>
    <div>
        <el-table
            class="mtop_10"
            :data="tableData"
            border
            stripe
            size='small'>
            <el-table-column
                label="件数 PCS" width="100px">
                <template slot-scope="scope" >
                    <el-input size="small" :disabled="list_B"  v-model="scope.row.piece" clearable
                     @input="val => { scope.row.piece = $utils.getNumber(val, true) }" @change="errclick(scope.row.cargoSize,scope.$index)" :min="1"
                     :ref="'a_'+scope.$index" @keyup.enter.native="nextInput($event,'b',scope.$index)"></el-input>    
                </template>
            </el-table-column>
            <el-table-column
                label="重量 KGS" width="100px">
                <template slot-scope="scope" >
                    <el-input size="small"  :disabled="list_B"  v-model="scope.row.weight" clearable @input="val => { scope.row.weight = $utils.getNumber(val) }" 
                        :ref="'b_'+scope.$index" @keyup.enter.native="nextInput($event,'c',scope.$index)"></el-input>    
                </template>
            </el-table-column>
            <el-table-column
                label="体积 CBM(m³)"  width="100px">
                <template slot-scope="scope">
                    <el-input size="small"  :disabled="list_B" v-model="scope.row.cbm" clearable @input="val => { scope.row.cbm = $utils.getNumber(val) }" 
                        :ref="'c_'+scope.$index" @keyup.enter.native="nextInput($event,'d',scope.$index)"></el-input>    
                </template>
            </el-table-column>
            <el-table-column
                label="长(cm)"  width="100px">
                <template slot-scope="scope">
                    <el-input :disabled="list_B"  size="small" @change="errclick(scope.row.cargoSize,scope.$index)"  v-model="scope.row.cargoSize" clearable 
                    :ref="'d_'+scope.$index" @keyup.enter.native="nextInput($event,'e',scope.$index)"></el-input>    
                </template>
            </el-table-column>
             <el-table-column
                label="宽(cm)" width="100px">
                <template slot-scope="scope">
                    <el-input size="small"  :disabled="list_B"  v-model="scope.row.weight" clearable @input="val => { scope.row.weight = $utils.getNumber(val) }"
                     :ref="'e_'+scope.$index" @keyup.enter.native="nextInput($event,'f',scope.$index)"></el-input>    
                </template>
            </el-table-column>
            <el-table-column 
                label="高(cm)" width="100px">
                <template slot-scope="scope">
                    <el-input :disabled="list_B"  size="small" @change="errclick(scope.row.cargoSize,scope.$index)"  v-model="scope.row.cargoSize" clearable
                     :ref="'f_'+scope.$index" @keyup.enter.native="nextInput($event,'a',scope.$index)"></el-input>    
                </template>
            </el-table-column>
            <el-table-column
                label="包装方式" width="90px">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.packing"  :disabled="list_B"   placeholder="请选择">
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
                label="外箱情况" width="90px">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.outerBox"  :disabled="list_B"   placeholder="请选择">
                        <el-option
                            v-for="item in outerBoxArray"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>   
                </template>
            </el-table-column>
            <el-table-column  width="160px"
              label="进仓图片" class="tupian">
                <template slot-scope="scope">
                    <div class="sctp_h">
                        <div class="tps">
                            <img class="tpxx" :src='item.url' v-for="(item,index) in imgArr" :key="index">
                            
                        </div>
                        <el-upload 
                         action="#" clsaa="upLoad" :show-file-list="false"
                         :limit="6" :before-upload="beforeAvatarUpload">
                         <button class="sctp" @click="addImg(scope.$index)"></button>
                         </el-upload>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"  width="70px">
                <template slot-scope="scope">
                    <div >
                        <span class="tips" v-if="tableData.length - 1 == scope.$index && !list_B && tableData.length !== 50" 
                        @click="addOneTableObj(scope)">新增</span>
                        <span v-if="(scope.$index != 0)  && (!list_B)" @click="deleOneTableObj(scope)" >删除</span>
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

    props:['childData','orderId','number'],
    data() {
        return {
            orderId:this.orderId,
            number:this.number,
            Oindex:'',
            list_B:'',
            id:'',
            file:'',
            imgArr:[],
            bannerArr:[],
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
                {
                   value:4,
                   label:'木箱' 
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
        if(this.number == 3){
            this.list_B = false
        }else{
            this.list_B = true
        }
        if(this.childData.length > 0){
            let {id , orderId} = this.childData[0]
            this.id = id
            this.orderId = orderId
            let tempIndata = this.childData
            for(let i in tempIndata){
                delete tempIndata[i].createTime
                delete tempIndata[i].updateTime
            }
            this.tableData = tempIndata
        }else{
            this.addOneTableObj()
        }
    },

    methods: {
        //图片上传
        beforeAvatarUpload(file) {
            console.log(file);
            const isJPG = file.type;
            const isLt300K = 300;
            if (file.size > (isLt300K * 1024)) {
            this.$message.error('图片文件大小不能大于300KB!');
            return
            }
            if (isJPG == 'image/jpeg' || isJPG == 'image/png') {
            this.$message.success('上传图片成功');
            } else {
            this.$message.error('上传图片只能是 JPG 格式或 PNG 格式!');
            return
            }
            this.file = file;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            console.log(reader);
            let that = this;
            reader.onload = function() {
            that.upLoadpdf()
            };
        },
        upLoadpdf() {
            const vm = this
            let a
            let fileFormData = new FormData();
            fileFormData.append('file', vm.file)
            console.log(fileFormData.get('file'));
            vm.$http.post(vm.$service.attachmentUpload+"?attachType=1&orderId="+this.orderId ,fileFormData).then(res => {
                if (res.code == 200) {
                    this.bannerArr[this.Oindex].push(res.data)
                    // this.imgArr[this.Oindex][0]=res.data.xpath
                    console.log(res.data.xpath);
                }
            })
        },
        addImg(index){
            this.Oindex = index
            console.log(index);
            this.imgArr[index]={bannerPath:''}
        },
        // 聚焦换位
        nextInput(event,num,index){
            console.log(234)
            if(num == 'a' && index == this.tableData.length-1){
                return console.log("last");
            }else if(num == 'a'){
                index = Number(index)+1
            }
            console.log(event,num,index);
            event.target.blur()
            this.$refs[num+"_"+index].focus()
        },
        errclick(e,index){
            // 验证输入数字与*S
            let zz = /\d+([.]?\d)*\*\d+([.]?\d)*\*\d+([.]?\d)*/
            let V,num=this.tableData[index].piece
            if(num == null || this.tableData[index].cargoSize == null){
                // console.log('件数或尺寸为空');
                return 
            }
            if(!zz.test(String(e))){
                this.$message("输入形式为：长*宽*高")
                this.$refs.hwleng.value=""
                this.$refs.hwCBM.value=""
            }else{
                let a = String(e).indexOf("*")
                let b = String(e).lastIndexOf("*")
                let l = String(e).substr(0,a)
                let c = String(e).substr(a+1,b-a-1)
                let h = String(e).substr(b+1)
                // console.log(a,b,l,c,h);
                // 加个限制 最小0.01立方米，后面四舍五入
                V=(Number(l)*Number(c)*Number(h)*num)/1000000
                V=Math.max(Math.round(V*100) / 100, 0.01)
                this.tableData[index].cbm=""+V
            }
        },
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
    .tips{
        color: rgb(2, 175, 240);
    }
    .sctp_h{
        width: 100%;
        height: 40px;
        position: relative;
    }
    .tps{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content:space-between;
        width: 100px;
        height: 40px;
        background: rgb(98, 155, 24);
    }
    .tpxx{

        width: 30px;
        height: 20px;
        background: palevioletred;
    }
    .sctp{
        width: 40px;
        height: 40px;
        position: absolute;
        right: 0;
        top: 0;
        background-size: 100% 100%;
        background-image:url('../../../assets/shangchaun.png') ;
        /* background-image: url(../../); */
    }
</style>
