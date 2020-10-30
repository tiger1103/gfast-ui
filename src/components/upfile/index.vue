<template>
  <div>
    <el-upload
      class="upload-file"
      :action="action"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :multiple="true"
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

  computed:{
      dataFileList:{
           get(){
                    return this.value?this.value:[]
                },
            set(data){
                this.$emit('setUpFielList',data)
            },
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
        if(res.code!==0){
            fileList.splice(fileList.findIndex(item => item.uid === file.id), 1)
            this.msgError(res.msg)
            return false
        }
        file.url = this.apiUrl + "/" + res.data.fileInfo.fileUrl;
        this.setDataFileList(fileList)
    },
    handlePreview(file){
        window.open(file.url)
    },
    setDataFileList(fileList){
        let list = [];
        fileList.forEach(item => {
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
