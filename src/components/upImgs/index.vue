<template>
  <div>
    <el-upload
      ref="upload"
      :action="action"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :multiple="false"
      :limit="limit"
      :data="dataParam"
      :on-exceed="handleExceed"
      :file-list="dataFileList"
      :on-success="handleSuccess"
      :on-preview="handlePreview">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  name: "upImgs",
  props:{
      action:{
          type:String,
          default:function(){
              return ""
          }
      },
      limit:{
          type:Number,
          default:function(){
              return 10
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
      dialogImageUrl: '',
      dialogVisible: false,
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
              this.$emit('setUpImgList',data)
            },
      }
  },
  methods: {
    handleRemove(file, fileList) {
      this.uploadedFile.splice(this.uploadedFile.findIndex(item => item.name === file.name), 1)
      this.setDataFileList()
    },
    beforeUpload(file){
      if (file.type.substring(0, 5) != "image") {
        this.msgError("只能上传图片文件");
        return false;
      }
      return true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `最多可上传 ${this.limit} 个文件，已超出最大限制数。`
      );
    },
    handleSuccess(res,file,fileList){
      if(file.response.code===0){
        let url = this.getUpFileUrl(this.apiUrl , file.response.data.fileInfo.fileUrl);
        this.uploadedFile.push({name:file.name,url:url})
      }
      this.setDataFileList()
    },
    handlePreview(file){
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
