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
        <img class="data-pic" src="../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      >
      <el-table-column
        v-if="checkbox"
        type="selection"
        width="55">
      </el-table-column>
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
            <span v-if="column.prop == 'state' && column.label == '状态'">
              <el-switch v-model="scope.row.state == '0'" disabled></el-switch>
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
            <span v-if="scope.row.state == 1 && item.method == 'del'">启用</span>
            <span v-else-if="scope.row.state == 0 && item.method == 'del'">禁用</span>
            <span v-else style="color: #00a06e;">{{item.label}}</span>
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
    // 复选框
    checkbox: {
      type: Boolean,
      default: () => false
    },
    // 表格的字段展示
    columns: {
      type: Array,
      default: () => []
    },
    // 表格操作
    operation: {
      type: Object,
      default: () => {}
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
        if(!idx){
          return
        }
        idx.forEach(row => {
          for(var i = 0; i < this.xuanzhong.length; i++){
            if(this.xuanzhong[i].code == row.code){
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
    // 排序
    handleSort (column) {
      this.$emit('sortChange', column)
    },
    // 操作，将操作类型和当前row数据作为参数传递
    handleClick (method, row, e) {
      // 置灰不可点击
      if (e.target.className === 'gary') {
        return
      }
      this.$emit('handleClick', {
        method: method,
        row: row
      })
    },
    // 某一列点击事件
    handleItemClick (method, scope) {
      if (method) {
        this.$emit(method, scope)
      }
    },
    // 页码跳转
    handleCurrent (val) {
      // this.rowSelect()
      this.$emit('currentChange', val)
    },
    // 展示条数
    handleSize (val) {
      this.$emit('sizeChange', val)
    },
    // 复选框选择
    handleSelect (val) {
      this.$emit('selectChange', val)
    },
    //去重
    unique1(arr) {
      var hash=[];
      for (var i = 0; i < arr.length; i++) {
        if(hash.indexOf(arr[i])==-1){
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
  .tupian{
    width: 30px;
    height: auto;
  }
</style>
