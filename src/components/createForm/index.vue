<template>
  <div>
    <formCreate :rule="ruleInfo" :option="formoption" v-model="fApi" />
  </div>
</template>

<script>
import Editor from "@/components/CKeditor";
import upFile from "@/components/upfile";
import formCreate, { maker } from "@form-create/element-ui";
import { getToken } from "@/utils/auth";
formCreate.component("Editor", Editor);
formCreate.component("upFile", upFile);
export default {
  name: "CF",
  components: {
    Editor,
    upFile,
    formCreate: formCreate.$form(),
  },
  props: {
    formoption: {
      type: Object,
      default: function () {
        return {
          form: {
            labelWidth: "80px",
          },
          submitBtn: {
            show: false,
          },
        };
      },
    },
    rule: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      fApi: {},
    };
  },
  methods: {
    setEditContent(inject, v) {
      this.fApi.setValue(inject.inject, v);
    },
    setUpFielList(inject, v) {
      this.fApi.setValue(inject.inject, v);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.fApi.on("editorPrefix-setEditContent", this.setEditContent);
      this.fApi.on("upFilePrefix-setUpFielList", this.setUpFielList);
    });
  },
  computed: {
    ruleInfo() {
      let rule = [];
      this.rule.forEach((value) => {
        let item = Object.assign({}, value);
        //如果是富文本编辑器，添加绑定内容事件
        if (item.type == "Editor") {
          item.emit = [{ name: "setEditContent", inject: item.field }];
          item.emitPrefix = "editorPrefix";
        }else if(item.type=="upFile"){
          //上传附件
          item.props.action = this.apiUrl + item.props.action;
          item.emit = [{ name: "setUpFielList", inject: item.field }];
          item.emitPrefix = "upFilePrefix";
        } else if (item.type == "upload") {
          //如果是上传图片组件
          //上传请求地址
          item.props.action = this.apiUrl + item.props.action;
          //上传请求的token
          item.props.data = {
            token: getToken(),
          };
          if (item.uploadType == "image") {
            item.props.beforeUpload = function (file) {
              if (file.type.substring(0, 5) != "image") {
                this.msgError("只能上传图片文件");
                return false;
              }
              return true;
            };
          }

          //上传成功处理
          item.props.onSuccess = function (res, file,fileList) {
            if (res.code !== 0) {
              fileList.splice(fileList.findIndex(item => item.uid === file.id), 1)
              this.msgError(res.msg);
              return;
            } else {
              file.url = this.apiUrl + "/" + res.data.fileInfo.fileUrl;
            }
          };
        }
        rule.push(item);
      });
      return rule;
    },
  },
};
</script>