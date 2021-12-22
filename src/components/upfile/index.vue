<template>
  <div>
    <el-upload
      class="upload-file"
      :action="action"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :multiple="false"
      :limit="limit"
      :data="dataParam"
      :fileList="uploadedFile"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  name: "upFile",
  props:{
      action:{
          type:String,
          default:function(){
              return ""
          }
      },
      multiple:{
          type:Boolean,
          default:function(){
              return false
          }
      },
      limit:{
          type:Number,
          default:function(){
              return 1
          }
      },
      value:{
        type:Array,
        default:function(){
            return []
        }
      },
      dataParam:{
          type:Object,
          default:function(){
              return {
                  token:getToken()
              }
          }
      }
  },
  data(){
    return {
      uploadedFile:[],
    }
  },
  mounted() {
    if(this.value){
      this.uploadedFile = this.value
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.setDataFileList(fileList)
    },

    handleExceed(files, fileList) {
      this.$message.warning(
        `最多可上传 ${this.limit} 个文件，已超出最大限制数。`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess(res,file,fileList){
      if(file.response.code===0){
        this.setDataFileList(fileList)
      }else{
        this.msgError(res.msg)
      }

    },
    handlePreview(file){
        window.open(file.url)
    },
    setDataFileList(fileList){
      this.uploadedFile = fileList.map(item=>{
        if(item.url) {
          return {url: item.url,name:item.name}
        } else {
          try {
            return {url: item.response.data.fileInfo.fileUrl,name:item.name}
          }catch (e){
            console.error(e)
          }
        }
      })
      this.$emit('set-up-file-list',this.uploadedFile)
    }
  },
};
</script>
<style>
ul.el-upload-list li {
  padding-left: 8px;
  height: 45px;
  line-height: 45px;
  background: #efefef;
}
</style>
