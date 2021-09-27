<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item>
            <el-select v-model="pol" placeholder="起运港三字码" :remote-method="polMethod" :loading="loading" clearable
              filterable remote reserve-keyword>
              <el-option v-for="(item,index) in polOpt" :disabled="pod == item.threeLetterCode"
                :key="item.threeLetterCode" :value="item.threeLetterCode">
                <span>{{item.threeLetterCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="pod" placeholder="目的港三字码" :remote-method="podMethod" :loading="loading" clearable
              filterable remote reserve-keyword>
              <el-option v-for="item in podOpt" :disabled="pol == item.threeLetterCode" :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span>{{item.threeLetterCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="agentName" placeholder="代理公司名称" :remote-method="agentMethod" :loading="loading" clearable
              filterable remote reserve-keyword style="width: 220px;">
              <el-option v-for="item in agentOpt" :key="item.value" :label="item.agentName" :value="item.agentName">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="airCompanyCode" placeholder="航司代码" :remote-method="companyMethod" :loading="loading"
              clearable filterable remote reserve-keyword>
              <el-option v-for="item in airCompanyCodeOpt" 
				:key="item.airCompanyCode" 
				:value="item.airCompanyCode">
                <span>{{item.airCompanyCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select placeholder="中转/直飞" size="medium" v-model="legCount" clearable style="width: 130px;">
              <el-option v-for="item in legCountOpt" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select placeholder="状态" size="medium" v-model="status" clearable style="width: 130px;">
              <el-option v-for="item in statusOpt" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary" icon="el-icon-search">查询</el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>

          <el-form-item style="float: right;margin-right: 0">
            <el-row>
              <el-button @click="newAdd" size="medium">新增航线</el-button>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
      <Table ref="multipleTable1" :tableData='tableData' :columns='columns' :operation='operation'
        :total='total' :currentPage='pageNum' :pageSize='pageSize' @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange' @handleClick='handleClick' @switchChangeUser="switchChangeUser">
      </Table>
    </div>
    <!-- <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="150px">

    </el-dialog> -->
  </div>
</template>

<script>
  import Table from '@/components/Table'
  import {
    toData
  } from '@/util/assist'
  export default {
    data() {
      return {
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        columns: [{
            label: '航线ID',
            prop: 'id',
            show: true,
            width: '90'
          },
          {
            label: '航司代码',
            prop: 'airCompanyCode',
            show: true,
            width: '100'
          },
          {
            label: '起运港',
            prop: 'pol',
            show: true,
            width: '100'
          },
          {
            label: '目的港',
            prop: 'pod',
            show: true,
            width: '100'
          },
          {
            label: '航线区域',
            prop: 'continent',
            show: true,
            width: '100'
          },
          {
            label: '中转/直飞',
            prop: 'nonStop',
            show: true,
            width: '100'
          },
          {
            label: '航程',
            prop: 'legCount',
            show: true,
            width: '50'
          },
          // {
          //   label: '飞机型号',
          //   prop: 'planeType',
          //   show: true,
          //   width: '150'
          // },
          {
            label: '托盘',
            prop: 'tray',
            show: true,
            width: '50'
          },
          {
            label: '散货',
            prop: 'bulkCargo',
            show: true,
            width: '50'
          },
          {
            label: '状态',
            prop: 'status',
            show: true,
            width: '100'
          },
          {
            label: '更新时间',
            prop: 'updateTime',
            show: true,
            width: '180'
          }
        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '180',
          options: [{
              label: '编辑',
              method: 'routeEdit'
            },
            {
              label: '删除',
              method: 'routeDel'
            },
            {
              label: '查看',
              method: 'routeView'
            }
          ]
        },
        pol: '',
        pod: '',
        agentName: '',
        airCompanyCode: '',
        legCount: '',
        legCountOpt: [{
            name: '全部',
            value: '2'
          },
          {
            name: '直飞',
            value: '1'
          },
          {
            name: '中转',
            value: '0'
          },
        ],
        status: '',
        statusOpt: [{
            name: '全部',
            value: '2'
          },
          {
            name: '下架',
            value: '1'
          },
          {
            name: '上架',
            value: '0'
          },
        ],
        loading: false,
        polOpt: [],
        podOpt: [],
        airCompanyCodeOpt: [],
        agentOpt: [],
      }
    },
    mounted() {
      this.initAirlineSearchByPage()
      this.initAirportSearchByPage()
      this.initCompanySearchByPage()
      this.initAgentList()
    },
    methods: {
      //起始港三字码
      initAirportSearchByPage(keyWord, type) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.airportSearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            if (type == '起始港') {
              this.polOpt = data.data.records
            } else if (type == '目的港') {
              this.podOpt = data.data.records
            } else {
              this.polOpt = data.data.records
              this.podOpt = data.data.records
            }
          } else {
            this.$message.error(data.message)
          }
        })
      },
      polMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '起始港')
      },
      podMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '目的港')
      },
      //航司公司
      initCompanySearchByPage(keyWord) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.companySearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            this.airCompanyCodeOpt = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      companyMethod(keyWord) {
        this.initCompanySearchByPage(keyWord)
      },
      //代理公司
      initAgentList(agentName) {
        if (!agentName) {
          agentName = ''
        }
        var data = {
          agentName: agentName
        }
        this.$http.post(this.$service.agentList, data).then((data) => {
          this.loading = false
          if (data.code == 200) {
            this.agentOpt = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      agentMethod(agentName) {
        this.initAgentList(agentName)
      },
      switchChangeUser(item) {
        var data = {
          id: item.row.id,
          status: item.row.status ? 0 : 1
        }
        this.$http.post(this.$service.airlineUpdate, data).then(data => {
          if (data.code == 200) {
            this.$message.success('状态更新成功')
            this.initAirlineSearchByPage()
          } else {
            this.$message.error('状态更新失败')
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //航线列表
      initAirlineSearchByPage() {
        const vm = this
        var data = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          pol: this.pol,
          pod: this.pod,
          status: this.status,
          legCount: this.legCount,
          airCompanyCode: this.airCompanyCode,
          agentName: this.agentName
        }
        vm.$http.post(vm.$service.airlineSearchByPage, data).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records
          }else {
            this.$message.error(data.message)
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //查询
      searchClick() {
        this.pageSize = 10
        this.pageNum = 1
        this.initAirlineSearchByPage()
      },
      //重置
      restClick() {
        this.pol = ''
        this.pod = ''
        this.agentName = ''
        this.airCompanyCode = ''
        this.legCount = ''
        this.status = ''
        this.pageSize = 10
        this.pageNum = 1
        this.initAirlineSearchByPage()
        this.initAirportSearchByPage()
        this.initCompanySearchByPage()
        this.initAgentList()
      },
      //新增
      newAdd() {
        this.$router.push('/routeManagement/routeAdd')
      },
      //操作
      handleClick(scope) {
        var vm = this
        if (scope.method == 'routeEdit') {
          this.$router.push({
            path: '/routeManagement/routeEdit',
            query: {
              id: scope.row.id
            }
          })
        } else if (scope.method == 'routeDel') {
          this.$confirm("确定删除这条航线?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            vm.$http.delete(vm.$service.airlineDelete + '?id=' + scope.row.id).then(data => {
              if (data.code == 200) {
                vm.$message.success('删除成功')
                this.initAirlineSearchByPage()
              } else {
                vm.$message.error('删除失败')
              }
            })
          }).catch(() => {
            console.log('取消')
          })
        } else if (scope.method == 'routeView') {
          this.$router.push({
            path: '/routeManagement/routeDetails',
            query: {
              id: scope.row.id
            }
          })
        }
      },
      handleCurrentChange(e) {
        this.pageNum = e
        this.initAirlineSearchByPage()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.initAirlineSearchByPage()
      },
    },
    watch: {
      tableData(idx) {
        return idx
      }
    },
    components: {
      Table
    }
  }
</script>


<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 20px;
    vertical-align: bottom;
  }

  .parimary_btn {
    background-color: #9ac143 !important;
    border-color: #9ac143 !important;

    &:hover {
      color: #f1e3d5 !important;
      background-color: #7f9e3c !important;
      border-color: #7f9e3c !important;
    }
  }

  .icon-shouqi {
    color: #3985ca;
    margin-right: 2px;
    font-size: 14px;
    margin-left: 15px;
  }

  .shouqi {
    cursor: pointer;
    color: #3985ca;
    position: relative;
  }

  .shouqi .iconfont {
    font-size: 2px;
    position: absolute;
    height: 20px;
    line-height: 20px;
    margin-top: 7px;
    margin-left: 10px;
  }

  .wrapper,
  .content {
    width: 100%;

    /*background-color: #fff;*/
  }

  .el-table .sort-caret.ascending {
    border-bottom-color: #FFF;
  }

  .content-search-normal {
    padding: 20px 20px 0 20px;
    background: #fff;
  }

  .content-search-high {
    padding: 0 0 20px 30px;
  }

  /deep/ .el-dialog {
    min-width: 480px;
    border-radius: 6px;
  }
</style>
