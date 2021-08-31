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
      :on-exceed="handleExceed"
      :file-list="dataFileList"
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
  computed:{
      dataFileList:{
           get(){
               let value = this.value || []
               value.map(item=>{
                 if(item.url){
                  item.url = this.getUpFileUrl(this.apiUrl,item.url)
                 }
               })
               this.uploadedFile = value
               return value
            },
            set(data){
              this.$emit('setUpFielList',data)
            },
      }
  },
  methods: {
    handleRemove(file, fileList) {
      this.uploadedFile.splice(this.uploadedFile.findIndex(item => item.name === file.name), 1)
      this.setDataFileList()
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
        let url = this.getUpFileUrl(this.apiUrl , file.response.data.fileInfo.fileUrl);
        this.uploadedFile.push({name:file.name,url:url})
      }else{
        this.msgError(res.msg)
      }
      this.setDataFileList()
    },
    handlePreview(file){
        window.open(file.url)
    },
    setDataFileList(){
      let list = [];
      this.uploadedFile.forEach(item => {
        list.push({name:item.name,url:item.url})
      });
      this.dataFileList = list
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
