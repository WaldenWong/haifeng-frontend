<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Title"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        placeholder="Type"
        clearable
        class="filter-item"
        style="width: 130px; margin-left: 10px"
      >
        <el-option
          v-for="item in goodsTypeOptions"
          :key="item.key"
          :label="item.display_name + '(' + item.key + ')'"
          :value="item.key"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.date"
        placeholder="Date"
        clearable
        class="filter-item"
        style="width: 130px; margin-left: 10px"
      >
      </el-date-picker>
      <!-- <el-select
        v-model="listQuery.sort"
        style="width: 140px; margin-left: 10px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select> -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-left: 10px"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button>
    </div>
    <!-- 加载表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="商品名" min-width="300px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品编号"
        prop="identifier"
        width="150px"
        align="center"
        sortable="custom"
        :class-name="listQuery.sort"
      >
        <template slot-scope="{ row }">
          <span>{{ row.identifier }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品种类" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进价" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.purchase_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.selling_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.inventory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销量" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sales }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sales }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="入库时间"
        prop="purchase_at"
        width="250px"
        align="center"
        sortable="custom"
        :class-name="listQuery.sort"
      >
        <template slot-scope="{ row }">
          <span>{{ row.purchase_at }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showReviewer"
        label="Reviewer"
        width="110px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="170"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <!-- 编辑 -->
          <span>
            <i class="el-icon-edit-outline" @click="handleUpdate(row)"></i
          ></span>
          <!-- 查看 -->
          <span style="margin-left: 15px">
            <i class="el-icon-document"></i>
          </span>
          <!-- 删除 -->
          <span style="margin-left: 15px">
            <i
              v-if="row.status !== 'deleted'"
              class="el-icon-delete"
              type="danger"
              style="color: red"
              @click="handleDelete(row, $index)"
          /></span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 翻页按钮 -->
    <!-- <div :class="{ hidden: hidden }" class="pagination-container">
      <el-pagination
        :background="background"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
        v-bind="$attrs"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->

    <!-- 添加add对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="addData"
        label-position="right"
        label-width="80px"
        style="width: 280px; margin-left: 50px"
      >
        <el-form-item label="商品名" prop="name">
          <el-input name="name" v-model="addData.name" />
        </el-form-item>
        <el-form-item label="商品编号" prop="identifier">
          <el-input
            name="identifier"
            v-model="addData.identifier"
            :autosize="{ minRows: 3, maxRows: 15 }"
          />
        </el-form-item>
        <el-form-item label="商品种类" prop="type">
          <el-select
            v-model="addData.type"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in goodsTypeOptions"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="进价" prop="purchase_price">
          <el-input
            v-model="addData.purchase_price"
            clearable
            @input="
              (value) => {
                isNaN(value)
                  ? isNaN(parseFloat(value))
                    ? (addData.purchase_price = null)
                    : (addData.purchase_price = parseFloat(value).toFixed(2))
                  : (addData.purchase_price = value)
              }
            "
          />
        </el-form-item>
        <el-form-item label="售价" prop="selling_price">
          <el-input
            v-model="addData.selling_price"
            type="number"
            clearable
            @input="
              (value) => {
                isNaN(value)
                  ? isNaN(parseFloat(value))
                    ? (addData.selling_price = null)
                    : (addData.selling_price = parseFloat(value).toFixed(2))
                  : (addData.selling_price = value)
              }
            "
          />
        </el-form-item>
        <el-form-item label="库存" prop="inventory">
          <el-input
            v-model="addData.inventory"
            clearable
            @input="
              (value) => {
                isNaN(value)
                  ? isNaN(parseInt(value))
                    ? (addData.inventory = null)
                    : (addData.inventory = parseInt(value))
                  : (addData.inventory = value)
              }
            "
          />
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input
            v-model="addData.sales"
            clearable
            @input="
              (value) => {
                isNaN(value)
                  ? isNaN(parseInt(value))
                    ? (addData.sales = null)
                    : (addData.sales = parseInt(value))
                  : (addData.sales = value)
              }
            "
          />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-select
            v-model="addData.supplier"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in supplierOptions"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间" prop="purchase_at">
          <el-date-picker
            v-model="addData.purchase_at"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取 消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'add' ? addGoods() : updateGoods()"
        >
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  goodsTypes,
  addGoods,
  updateGoods,
  goodsList,
  // goodsItems,
  deleteGoods
} from '@/api/goods'
import { supplierItems } from '@/api/supplier'
import waves from '@/directive/waves' // waves directive
import { parseTime, fomatTime } from '@/utils'
import { fetchPv } from '@/api/article'
import { collectCoverageFrom } from 'jest.config'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'GoodsTable',
  components: {
    // Pagination
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    const validateGoodsName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please enter the goods name'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      addData: {
        name: undefined,
        identifier: undefined,
        type: undefined,
        purchase_price: undefined,
        selling_price: undefined,
        inventory: undefined,
        sales: undefined,
        supplier: undefined,
        purchase_at: fomatTime(new Date())
      },
      updateData: {
        type: undefined,
        purchase_price: undefined,
        selling_price: undefined,
        inventory: undefined,
        sales: undefined,
        supplier: undefined,
        purchase_at: fomatTime(new Date())
      },
      listQuery: {
        date: undefined,
        title: undefined,
        type: undefined,
        page: 1,
        page_size: 20,
        sort: 'desc',
        sort_k: 'purchase_at'
      },
      supplierOptions: [],
      goodsTypeOptions: [],
      // sortOptions: [
      //   { label: 'ID Ascending', key: 'asc' },
      //   { label: 'ID Descending', key: 'desc' }
      // ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商品',
        add: '添加商品'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [
          { required: true, trigger: 'blur', validator: validateGoodsName }
        ]
        // type: [
        //   { required: true, message: 'type is required', trigger: 'change' }
        // ],
        // supplier: [
        //   { required: true, message: 'supplier is required', trigger: 'change' }
        // ],
        // purchase_at: [
        //   {
        //     type: 'datetime',
        //     required: true,
        //     message: 'purchase_at is required',
        //     trigger: 'change'
        //   }
        // ]
      },
      downloadLoading: false
    }
  },
  created() {},
  // 加载页面就进行操作
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      goodsList(this.listQuery).then((response) => {
        this.list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      this.listQuery.sort_k = prop
      this.sortByID(order)
    },
    sortByID(order) {
      if (order === 'descending') {
        this.listQuery.sort = 'desc'
      } else {
        this.listQuery.sort = 'asc'
      }
      this.handleFilter()
    },
    resetAddData() {
      this.addData = {
        name: undefined,
        identifier: undefined,
        type: undefined,
        purchase_price: undefined,
        selling_price: undefined,
        inventory: undefined,
        sales: undefined,
        supplier: undefined,
        purchase_at: fomatTime(new Date())
      }
    },
    handleCreate() {
      this.resetAddData()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      this.getGoodsTypes()
      this.getSupplier()
    },
    getGoodsTypes() {
      goodsTypes().then((res) => {
        this.goodsTypeOptions = []
        for (let i = 0; i < res.data.length; i++) {
          this.goodsTypeOptions.push({
            key: res.data[i].key,
            display_name: res.data[i].display_name
          })
        }
      })
    },
    getSupplier() {
      supplierItems().then((res) => {
        this.supplierOptions = []
        for (let i = 0; i < res.data.length; i++) {
          this.supplierOptions.push({
            key: res.data[i].id,
            display_name: res.data[i].name
          })
        }
      })
    },
    addGoods() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          addGoods(this.addData)
            .then((res) => {
              if (res.code === 200) {
                if (this.addData.type === 'meat') {
                  this.addData.type = '肉'
                } else if (this.addData.type === 'vegetable') {
                  this.addData.type = '蔬菜'
                } else if (this.addData.type === 'dry_goods') {
                  this.addData.type = '干货'
                }
                this.list.unshift(this.addData)
                this.dialogFormVisible = false //对话框可见
                this.$notify({
                  title: 'Success',
                  message: 'Create Successfully',
                  type: 'success',
                  duration: 2000
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateGoods() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateGoods(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteGoods({ id: row.id })
        .then((res) => {
          if (res.code === 200) {
            this.list.splice(index, 1)
            this.$notify({
              title: 'Success',
              message: 'delete Successfully',
              type: 'success',
              duration: 2000
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
    // getSortClass: function () {
    //   return this.listQuery.sort
    // }
  }
}
</script>
