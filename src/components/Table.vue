<template>
  <div>
    <el-table
      stripe
      ref="multipleTable"
      @sort-change="handleSort"
      @selection-change="handleSelect"
      :data="tableData"
      style="width: 100%;"
    >
      <template slot="empty">
        <img class="data-pic" src="../assets/kong-icon.png"/>
        <p>暂无数据</p>
      </template>
      >
      <!-- <el-table-column
        v-if="checkbox"
        type="selection"
        width="55">
      </el-table-column> -->
      <!--列-->
      <el-table-column
        v-for="(column, index) in columns"
        v-if="column.show"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        align="left"
      >
        <template slot-scope="scope">
          <span @click="handleItemClick(column.handle, scope)">
            <span v-if="column.prop == 'status' && column.label == '状态'">
              <el-switch @change="switchChangeUser(scope)" v-model="scope.row.status == '0'"></el-switch>
            </span>
            <span v-else-if="column.prop == 'expenseType' && column.label == '费用类型'">
              {{
                          scope.row.expenseType === 0
                            ? "国内段"
                            : "国外段"
                        }}
            </span>
             <span v-else-if="column.prop == 'monthNo' && column.label == '有效期'">
              {{
                 scope.row.monthNo

               }}月
            </span>
            <span v-else v-html="getDataName(scope.row, column)"></span>

          </span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        fixed="right"
        v-if="operation.show"
        :label="operation.label"
        :min-width="operation.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <a v-for="(item, index) in operation.options" @click.prevent="handleClick(item.method, scope.row, $event)">
<!--            <span style="color: #2273CE;">{{ item.label }}</span>-->
            <span :style="{'color':(checkEdit(scope.row)||item.method!=='editExpense'?'#2273CE':'#808080')}">{{ item.label }}</span>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="total > 10">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrent"
        @size-change="handleSize"
        style="text-align: right;padding: 19px 30px 18px 0;background: #fff">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // 表格数据源
      tableData: {
        type: Array,
        default: () => []
      },
      //选择
      xuanzhong: {
        type: Array,
        default: () => []
      },
      // 表格的字段展示
      columns: {
        type: Array,
        default: () => []
      },
      // 表格操作
      operation: {
        type: Object,
        default: () => {
        }
      },
      // 总条数
      total: {
        type: Number,
        default: () => 0
      },
      biaoshishu: {
        type: Number,
        default: () => 0
      },
      // 当前页
      currentPage: {
        type: Number,
        default: () => 0
      },
      // 每页条数
      pageSize: {
        type: Number,
        default: () => 0
      }
    },
    data() {
      return {
        seletArr: [],
        userName: '',
        arr: [],
        UserID: ''
      }
    },
    mounted() {
      this.UserID = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserID
      this.userName = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserName
    },
    watch: {
      tableData(idx) {
        var that = this
        this.arr = []
        that.$nextTick(() => {
          if (that.$refs.multipleTable) {
            that.$refs.multipleTable.clearSelection();
          }
          if (!idx) {
            return
          }
          idx.forEach(row => {
            for (var i = 0; i < this.xuanzhong.length; i++) {
              if (this.xuanzhong[i].code == row.code) {
                that.$refs.multipleTable.toggleRowSelection(
                  row,
                  true
                )
              }
            }
          })
        })
      }
    },
    methods: {
/*      checkEdit(row) {
        var today = new Date();
        var date = new Date(row.createTime)
        var oneDay=1000*60*60*24;
        var currentMonth=row.monthNo;
        var start=new Date(new Date(row.yearNo,currentMonth-1,1)-7*oneDay);
        var end=new Date(new Date(row.yearNo,currentMonth,1)-oneDay);
        date.setDate(date.getDate()+1)
        if (today > date) {
          return false;
        }else if(!(today>=start&&today<=end)){
          return false;
        } else {
          return true;
        }
      },*/
      // 排序
      handleSort(column) {
        this.$emit('sortChange', column)
      },
      checkEdit(row) {
        var today = new Date();
        var date = new Date(row.createTime)
        var oneDay=1000*60*60*24;
        var currentMonth=row.monthNo;
        var start=new Date(new Date(row.yearNo,currentMonth-1,1)-7*oneDay);
        var end=new Date(new Date(row.yearNo,currentMonth,1)-oneDay);
        date.setDate(date.getDate()+1)
        if (today > date) {
          return false;
        }else if(!(today>=start&&today<=end)){
          return false;
        } else {
          return true;
        }
      },
      // 操作，将操作类型和当前row数据作为参数传递
      handleClick(method, row, e) {
        // 置灰不可点击
        if (e.target.className === 'gary') {
          return
        }
        let role = JSON.parse(sessionStorage.getItem('userInfo'))
        if(method == 'editExpense' && role && role.roleName != "超级管理员") {
          return this.$message.warning("只有超级管理员权限才能进行编辑")
        }
        this.$emit('handleClick', {
          method: method,
          row: row
        })
      },
      // 某一列点击事件
      handleItemClick(method, scope) {
        if (method) {
          this.$emit(method, scope)
        }
      },
      // 页码跳转
      handleCurrent(val) {
        // this.rowSelect()
        this.$emit('currentChange', val)
      },
      // 展示条数
      handleSize(val) {
        this.$emit('sizeChange', val)
      },
      // 复选框选择
      handleSelect(val) {
        this.$emit('selectChange', val)
      },
      //开关
      switchChangeUser(val) {
        this.$emit('switchChangeUser', val)
      },
      //去重
      unique1(arr) {
        var hash = [];
        for (var i = 0; i < arr.length; i++) {
          if (hash.indexOf(arr[i]) == -1) {
            hash.push(arr[i]);
          }
        }
        return hash;
      },
      getDataName(scope, items) {
        return scope[items.prop]
      }
    }
  }
</script>
<style lang="less" scoped>
  a {
    padding: 0;
  }

  span {
    padding-right: 10px;
  }

  span.cursor {
    cursor: pointer;
    color: #3985ca;
  }

  span.gary {
    color: #bcbcbc;
  }

  .tupian {
    width: 30px;
    height: auto;
  }
</style>
