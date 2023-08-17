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
          <span>{{ row.supplier }}</span>
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
  </div>
</template>

<script>
export default {
  name: 'SystemTable',
  data() {
    return {}
  },
  created() {},
  // 加载页面就进行操作
  mounted() {},
  methods: {}
}
</script>
