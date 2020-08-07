<template>
  <div class="app-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item v-show="false" label="站点ID">
        <el-input v-model="ruleForm.webId"></el-input>
      </el-form-item>
      <el-form-item label="站点名称" prop="webName">
        <el-input v-model="ruleForm.webName"></el-input>
      </el-form-item>
      <el-form-item label="站点网址" prop="webSite">
        <el-input v-model="ruleForm.webSite"></el-input>
      </el-form-item>
      <el-form-item label="网站Logo" prop="webLogo">
        <el-upload
          v-loading="upLoading"
          class="avatar-uploader"
          :action="apiUrl+'/system/upload/upImg'"
          :show-file-list="false"
          name="file"
          :data="setUpData()"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="备案信息" prop="recordInfo">
        <el-input v-model="ruleForm.recordInfo"></el-input>
      </el-form-item>
      <el-form-item label="统计代码" prop="statisticsCode">
        <el-input type="textarea" v-model="ruleForm.statisticsCode"></el-input>
      </el-form-item>
      <el-form-item label="版权信息" prop="CopyrightInfo">
        <el-input type="textarea" v-model="ruleForm.CopyrightInfo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo, updateInfo } from "@/api/system/config/webSet";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      // 图片上传地址
      imageUrl: "",
      // 上传加载
      upLoading: false,
      // 表单参数
      ruleForm: {},
      // 表单验证
      rules: {
        webName: [
          { required: true, message: "站点名称不能为空", trigger: "blur" },
        ],
        webSite: [
          { required: true, message: "站点网址不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getWeb();
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.ruleForm.webLogo = res.data.fileInfo.fileUrl;
      } else {
        this.msgError(res.msg);
      }
      this.upLoading = false;
    },

    beforeAvatarUpload(file) {
      this.upLoading = true;
      return true;
    },

    setUpData() {
      return { token: getToken() };
    },

    getWeb() {
      getInfo().then((response) => {
        let data = response.data;
        if (data) {
          this.ruleForm = {
            webId: data.web_id,
            webName: data.web_content.webName,
            webSite: data.web_content.webSite,
            webLogo: data.web_content.webLogo,
            recordInfo: data.web_content.recordInfo,
            statisticsCode: data.web_content.statisticsCode,
            CopyrightInfo: data.web_content.CopyrightInfo,
          };
          this.imageUrl = this.apiUrl + "/" + this.ruleForm.webLogo;
        }
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateInfo(this.ruleForm).then((response) => {
            if (response.code === 0) {
              this.msgSuccess("修改保存成功!");
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.imageUrl = "";
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>