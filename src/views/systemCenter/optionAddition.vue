<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd('add')">添加选项</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
    >
      <el-table-column show-overflow-tooltip prop="MarkID" label="选项标识"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Name" label="选项名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Description" label="描述"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="text"  @click="handleAdd('edit',row)">编辑</el-button>
          <el-button type="text" @click="handleAddChildren(row)">添加子级</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.CurrentPage"
      :layout="layout"
      :page-size="queryForm.PageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>

    <el-dialog title="新增选项" :visible.sync="dialogFormVisible" width="500px" @close="close">
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="选项标识" prop="MarkID">
          <el-input v-model.trim="addForm.MarkID" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项名称" prop="Name">
          <el-input v-model.trim="addForm.Name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项描述">
          <el-input v-model.trim="addForm.Description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getDictionaryClassList, getDictionaryClassUpdate } from '@/api/optionAddtion'
  export default {
    data() {
      return {
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          CurrentPage: 1,
          PageSize: 10,
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          SearchKey: ''
        },
        dialogFormVisible: false,
        addForm: {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          DictionaryClassID: '',
          MarkID: '',
          Name: '',
          Description: ''
        },
        addRules: {
          MarkID: [{ required: true, trigger: 'blur', message: '请输入选项标识' }],
          Name: [{ required: true, trigger: 'blur', message: '请输入选项名称' }],
        }
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleAdd(type,row) {
        console.log(row)
        this.dialogFormVisible = true
        if(type == 'add'){
          this.addForm = {
            'CallType': '',
            'UserID': sessionStorage.getItem('UserID'),
            'DictionaryClassID': '',
            'MarkID': '',
            'Name': '',
            'Description': ''
          }
        }else if(type == 'edit'){
          this.addForm = {
            'CallType': '',
            'UserID': sessionStorage.getItem('UserID'),
            'DictionaryClassID': row.DictionaryClassID,
            'MarkID': row.MarkID,
            'Name': row.Name,
            'Description': row.Description
          }
        }
      },
      save() {
        this.$refs['addForm'].validate(async (valid) => {
          if (valid) {
            const { Status } = await getDictionaryClassUpdate(this.addForm)
            if(Status == 0){
              this.dialogFormVisible = false
              this.$refs['addForm'].resetFields()
              this.$baseMessage('新增成功', 'success')
            }else{
              this.dialogFormVisible = true
              this.$baseMessage('新增失败', 'success')
            }
            this.fetchData()
          } else {
            return false
          }
        })
      },
      close() {
        this.dialogFormVisible = false
      },
      handleAddChildren(row) {
        this.$router.push({
          path: '/systemCenter/optionAdditionView',
          query: {
            DictionaryClassID: row.DictionaryClassID
          }
        })
      },
      handleSizeChange(val) {
        this.queryForm.PageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.CurrentPage = val
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { Data, Count} = await getDictionaryClassList(this.queryForm)
        this.total = Count
        this.list = Data
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      }
    }
  }
</script>
