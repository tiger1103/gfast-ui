<template>
  <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="tpl_category">
          <span slot="label">生成模板</span>
          <el-select v-model="info.tpl_category">
            <el-option label="单表（增删改查）" value="crud" />
            <el-option label="树表（增删改查）" value="tree"/>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="package_name">
          <span slot="label">
            生成包路径
            <el-tooltip content="生成在哪个java包下，例如 com.ruoyi.system" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.package_name" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="module_name">
          <span slot="label">
            生成模块名
            <el-tooltip content="可理解为子系统名，例如 system" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.module_name" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="business_name">
          <span slot="label">
            生成业务名
            <el-tooltip content="可理解为功能英文名，例如 user" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.business_name" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="function_name">
          <span slot="label">
            生成功能名
            <el-tooltip content="用作类描述，例如 用户" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.function_name" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-show="info.tpl_category == 'tree'">
      <h4 class="form-header">其他信息</h4>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            树编码字段
            <el-tooltip content="树显示的编码字段名， 如：dept_id" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.tree_code" placeholder="请选择">
            <el-option
              v-for="column in info.columns"
              :key="column.column_name"
              :label="column.column_name + '：' + column.column_comment"
              :value="column.column_name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            树父编码字段
            <el-tooltip content="树显示的父编码字段名， 如：parent_Id" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.tree_parent_code" placeholder="请选择">
            <el-option
              v-for="column in info.columns"
              :key="column.column_name"
              :label="column.column_name + '：' + column.column_comment"
              :value="column.column_name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            树名称字段
            <el-tooltip content="树节点的显示名称字段名， 如：dept_name" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.tree_name" placeholder="请选择">
            <el-option
              v-for="column in info.columns"
              :key="column.column_name"
              :label="column.column_name + '：' + column.column_comment"
              :value="column.column_name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: "BasicInfoForm",
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rules: {
        tpl_category: [
          { required: true, message: "请选择生成模板", trigger: "blur" }
        ],
        package_name: [
          { required: true, message: "请输入生成包路径", trigger: "blur" }
        ],
        module_name: [
          { required: true, message: "请输入生成模块名", trigger: "blur" }
        ],
        business_name: [
          { required: true, message: "请输入生成业务名", trigger: "blur" }
        ],
        function_name: [
          { required: true, message: "请输入生成功能名", trigger: "blur" }
        ]
      }
    };
  },
  beforeCreate() {
      
  }
};
</script>
