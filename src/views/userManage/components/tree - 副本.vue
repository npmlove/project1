<!-- 分类信息 -->
<template>
  <div>
    <div>
      <el-input v-show="shrinkFlag != 0" size="medium" placeholder="输入关键字进行过滤"  v-model="filterText" style="margin-top: -10px;"></el-input>
      <!-- 按钮区域 -->
      <div v-show="shrinkFlag != 0" style="padding:10px 0px;overflow-x:auto;">
        <el-switch v-model="draggable" active-text="开启拖拽" inactive-text="关闭拖拽"></el-switch>
        <span v-if="draggable" @click="batchSave" style="margin-left: 5px; display: inline-block;width: 64px;text-align: center; height: 26px;font-size: 12px;line-height: 26px; background-color: #41b584;color: #fff;border-radius: 5px;margin-top: -5px;cursor: pointer;">批量保存</span>
        <!-- <el-button @click="batchDelete" size="small" type="danger">批量删除</el-button> -->
      </div>
      <div :style="{height: this.$baseTableHeight() + 'px'}"   class="treeArea tree-container">
        <el-tree
          class="tree"
          :data="menus"
          :props="defaultProps"
          :expand-on-click-node="false"
          :default-expanded-keys="expandedkey"
          node-key="orguid"
          :draggable="draggable"
          :allow-drop="allowDrop"
          @node-drop="handleDrop"
          ref="menuTree"
          @node-click="nodeclick"
          :filter-node-method="filterNode"
          :highlight-current="true"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span> <i :class="data.orgicon" style="margin-right: 2px;"></i>{{node.label}}</span>

            <!-- 右侧操作按钮 -->
            <span>
              <!-- <el-button style="color:#41b584" type="text" size="mini" @click="() => append(node,data)">添加</el-button>
              <el-button style="color:#41b584" v-if="node.level !== 1" type="text" size="mini" @click="() => edit(data)">编辑</el-button>
              <el-button style="color:#41b584" v-if="node.childNodes.length == 0" type="text" size="mini" @click="() => remove(node, data)">删除</el-button> -->
             <el-tooltip class="item" effect="dark" content="添加" placement="top">
                <i class="fontColor el-icon-circle-plus-outline" style="font-size: 16px;" type="text" size="mini" @click="() => append(node,data)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <i v-if="node.level !== 1" style="padding:0 10px;font-size: 16px;" class="fontColor el-icon-edit" type="text" size="mini" @click="() => edit(data)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <i v-if="node.childNodes.length == 0" style="color:#f34d37;font-size: 16px;" class="el-icon-delete" type="text" size="mini" @click="() => remove(node, data)"></i>
              </el-tooltip>
            </span>
          </span>
        </el-tree>
      </div>
      <!-- 弹窗 -->
      <el-dialog v-dialogDrag v-if="dialogVisible" :title="title" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="部门名称" prop="orgname">
            <el-input v-model.trim="form.orgname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="部门图标" prop="orgicon">
            <el-input v-model="form.orgicon" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 编辑 选择子级 -->
          <el-form-item v-if="dialogType == 'edit' " label="选择子级" prop="">
            <div style="height: 300px;overflow-y: auto;">
              <!-- check-strictly -->
                <el-tree ref="tree" :data="orgTreeArr" :check-strictly = true :default-checked-keys="defaultCheck" show-checkbox node-key="orguid" default-expand-all>
                  <span class="custom-tree" slot-scope="{ data }">
                    <span class="label"> {{data.orgname}} </span>
                  </span>
                </el-tree>
            </div>
          </el-form-item>
          <el-form-item label="描述" prop="orgdesc">
            <el-input v-model="form.orgdesc" autocomplete="off" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="submitData">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
 import { getCompanyOrgList, companyOrgUpdate } from '@/api/user'
export default {
  props: {
    shrinkFlag: {
      type: Number,
      default: () => 1,
    }
   },
  data() {
    return {
      parentCid: [],
      updateNodes: [],
      maxLevel: 1,

      filterText:'',  //树形过滤
      dialogVisible: false,
      draggable: false,
      title: "",
      dialogType: "", //edit，add，del
      form:{
        orgname:'',
        orgicon:'',
        orgdesc:''
      },
      rules: {
        orgname: [
          { required: true, trigger: 'blur', message: '请填写部门名称' },
        ],
        orgicon: [
          { required: false, trigger: 'blur', message: '请填写部门图标' },
        ],
      },
      menus:[],
      currentItem:null, //当前操作的数据（添加、编辑、删除）
      // expandedkey: [ "e54fe2cb-8d3f-46c7-af12-44126924c87a"],
      expandedkey: [],
      defaultProps: {
        children: "children",
        label: "orgname",
      },
      orgTreeArr:[],
      defaultCheck: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    },
  },

  mounted() {
    this.getMenus();
  },

  methods: {
    getGuid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      return ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() )
    },
    async getCompanyLevel(id) {
      let params = {
        CallType: 'all',
        UserID: sessionStorage.getItem('UserID'),
      }
      const result = await getCompanyOrgList(params)
      if(result.Status == 0){
        this.orgTreeArr = []
        this.orgTreeArr.push(result.Data)
      } else {
        this.$baseMessage(result.Message, 'error')
      }
    },
    //点击末级节点，给父组件传参，查询对应员工
    nodeclick(data, node, component) {
      //向父组件发送事件；
      if(this.dialogVisible == true){
        return  //点击的是分配按钮就不给查询列表数据
      }
      this.$emit("tree-node-click", data, node, component);
    },
    //树节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.orgname.indexOf(value) !== -1;
    },
    //添加 、 修改、删除 接口
    async addMenus(opaItem) {
      let arr = []
      if(this.dialogType == 'edit'){
        var checkedTree = this.$refs.tree.getCheckedNodes()
        console.log(checkedTree)
        for(let i=0;i<checkedTree.length;i++){
          if(checkedTree[i].level < opaItem.level || checkedTree[i].orgname == opaItem.orgname){
            this.$baseMessage(opaItem.orgname + '不可选择自己和自己的上级组织作为下级组织！', 'info')
            return
          } else if(checkedTree[i].children.length == 0) {
            this.$refs.tree.setCheckedNodes(checkedTree[i])
          }
          arr.push(checkedTree[i].orguid)
        }
      }
      let params = {
        CallType: this.dialogType == 'add' ? 'new' : (this.dialogType == 'edit' ? 'edit' : 'del'),
        UserID: sessionStorage.getItem('UserID'),
        orguid: this.dialogType == 'add' ? this.getGuid() :  opaItem.orguid,
        porguid: this.dialogType == 'add' ? opaItem.orguid :  opaItem.porguid,

        orgname: this.dialogType == 'del' ? opaItem.orgname : this.form.orgname,
        orgdesc: this.dialogType == 'del' ? opaItem.orgdesc : this.form.orgdesc,
        orgicon: this.dialogType == 'del' ? opaItem.orgicon : this.form.orgicon,
        sortindex:'',
        downorguids: this.dialogType == 'edit' ? arr.join(',') : ''
      }
      console.log('参数：')
      console.log(params)
      // let result = await companyOrgUpdate(params)
      // if(result.Status == 0){
      //   this.$baseMessage('操作成功', 'success')
      //   this.dialogType = ""
      //   this.dialogVisible = false
      //   this.currentItem = null
      //   this.expandedkey = [opaItem.orguid];
      //   this.getMenus();
      // }
    },
    //查询 接口
    async getMenus() {
      this.listLoading = true
      let params = {
        CallType: 'all',
        UserID: sessionStorage.getItem('UserID'),
        SearchKey: '',
        PageSize: '',
        CurrentPage: ''
      }
      const { Data, Count } = await getCompanyOrgList(params)
      this.menus = []
      this.menus.push(Data)
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    //弹窗确定
    submitData(data) {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let opaItem = this.currentItem
          this.addMenus(opaItem)
        } else {
          return false
        }
      })
    },
    //添加部门
    append(node,data) {
      // console.log(node)
      // console.log(data)
      this.title = "添加部门";
      this.dialogType = "add";
      this.dialogVisible = true;

      this.currentItem = data  //当前操作的数据

      //初始化输入框数据
      this.form.orgname = ''
      this.form.orgicon = ''
      this.form.orgdesc = ''
    },
    //修改部门
    edit(data) {
      this.getCompanyLevel(data.orguid)

      this.title = "修改部门";
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.currentItem = data  //当前操作的数据
      //表单 数据回显
      this.form.orgname = data.orgname
      this.form.orgicon = data.orgicon
      this.form.orgdesc = data.orgdesc
    },
    //删除部门
    remove(node, data) {
      this.$confirm(`是否删除【${data.orgname}】部门？`, "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.currentItem = data  //当前操作的数据
          this.dialogType = "del";
          let opaItem = this.currentItem
          this.addMenus(opaItem)
        })
        .catch(() => {});
    },
    //点击取消 关闭弹窗
    close() {
      this.$refs['form'].resetFields()
      // this.form = this.$options.data().form
      this.dialogVisible = false
      // this.$emit('fetch-data')
      this.dialogType = ""
      this.currentItem = null
    },

    //是否允许拖拽
    allowDrop(draggingNode, dropNode, type) {
      //前提约束：菜单总层数不能大于三层
      //判断：被拖动的当前节点层数+父节点层数 <= 3

      //获取当前节点总层数
      this.countNodeLevel(draggingNode);
      let deep = Math.abs(this.maxLevel - draggingNode.level) + 1;
      // console.log(deep)
      if (type == "inner") {
        // return deep + dropNode.level <= 3;
        return deep + dropNode.level <= 4;
      } else {
        // return deep + dropNode.parent.level <= 3;
        return deep + dropNode.parent.level <= 4;
      }
    },
    //获取当前节点层数
    countNodeLevel(node) {
      // console.log('获取当前节点层数')
      // console.log(node.level)
      if (node.childNodes != null && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (node.childNodes[i].level > this.maxLevel) {
            this.maxLevel = node.childNodes[i].level;
          }
          this.countNodeLevel(node.childNodes[i]);
        }
      } else {
        this.maxLevel = node.level;
      }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // console.log(draggingNode)
      // console.log(dropNode)
      // console.log(dropType)
      // console.log(ev)
      // 1.当前节点的父节点id
      let parentCid = 0;
      let siblings = null;
      if (dropType == "before" || dropType == "after") {
        parentCid =
          dropNode.parent.data.catId == undefined
            ? 0
            : dropNode.parent.data.catId;
        siblings = dropNode.parent.childNodes;
      } else {
        parentCid = dropNode.data.catId;
        siblings = dropNode.childNodes;
      }
      this.parentCid.push(parentCid);
      // 2.当前节点的排序
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].data.catId == draggingNode.data.catId) {
          // 如果遍历的是当前正在拖拽的节点，得更新它的父节点id值
          let catLevel = draggingNode.level;
          // 如果当前节点的层级与正在拖拽的节点的层级不一样
          if (siblings[i].level != draggingNode.level) {
            // 当前节点层级发生变化
            catLevel = siblings[i].level;
            // 修改子节点层级
            this.updateChildNodeLevel(siblings[i]);
          }
          this.updateNodes.push({
            catId: siblings[i].data.catId,
            sort: i,
            parentCid: parentCid,
          });
        } else {
          this.updateNodes.push({ catId: siblings[i].data.catId, sort: i });
        }
      }
      this.maxLevel = 0;
    },
    updateChildNodeLevel(node) {
      if (node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          var cNode = node.childNodes[i].data;
          this.updateNodes.push({
            catId: cNode.catId,
            catLevel: node.childNodes[i].level,
          });
          this.updateChildNodeLevel(node.childNodes[i]);
        }
      }
    },
    //点击批量保存
    batchSave() {
      console.log('拖拽后的树形:')
      console.log(this.menus)
    },
    //点击批量删除
    // batchDelete() {
    //   let catIds = [];
    //   let catNames = [];
    //   let checkedNodes = this.$refs.menuTree.getCheckedNodes();
    //   checkedNodes.forEach((element) => {
    //     catIds.push(element.catId);
    //     catNames.push(element.name);
    //   });

    //   this.$confirm(`是否确定批量删除【${catNames}】菜单？`, "提示", {
    //     confirmButtonText: "确定",
    //     cancleButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //         //确定删除的操作
    //     })
    //     .catch(() => {});
    // },
  },
};
</script>
<style lang="scss" scoped>
  .content-wrapper {
		width: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }
  .content {
    background-color: #fff;
  }
  /deep/.el-dialog{
    width: 300px;
    min-width: 500px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 5px;
  }
  .treeArea {
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    margin-left: -10px;
   /* position: absolute; */
    /* left: -10px; */
  }

  /* 树形结构节点添加连线 */
  .tree /deep/ .el-tree-node {
    position: relative;
    /* padding-left: 16px; */
  }

  .tree /deep/ .el-tree-node__children {
    /* padding-left: 10px; */
    padding-left: 26px;
  }

  .tree /deep/ .el-tree-node :last-child:before {
    height: 38px;
  }

  .tree /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .tree-container /deep/ .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .tree /deep/ .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree /deep/ .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  .tree /deep/ .el-tree-node:before {
    border-left: 1px dashed #b8b9bb;
    /* border-left: 1px dashed red; */
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .tree /deep/ .el-tree-node:after {
    border-top: 1px dashed #b8b9bb;
    /* border-top: 1px dashed blue; */
    height: 20px;
    top: 12px;
    /* width: 18px; */
    width: 12px;
  }

  .tree /deep/ .el-tree-node__content {
    /* padding-left: 18px !important; */
    padding-left: 12px !important;
  }

  .tree /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 0px !important;
  }
  .fontColor {
    color: $base-color-blue;
  }


</style>
