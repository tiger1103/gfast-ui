<template>
    <div class="ck-content">
        <ckeditor :config="editorConfig" v-model="dataValue" ref="ckdt" :editor-url="editorUrl"></ckeditor>
    </div>
</template>
<script>
import CKEditor from 'ckeditor4-vue';
import { getToken } from '@/utils/auth';
export default {
    name :"CKEditor",
    components: {
            // Use the <ckeditor> component in this view.
            ckeditor: CKEditor.component
        },
        props:{
            value:String,
            editorConfig:{
                type:Object,
                default:function(){
                    const _this = this
                    return {
                        // filebrowserUploadUrl:"/aaa",
                        // filebrowserImageUploadUrl:_this.apiUrl+"/system/upload/ckEditorUpImg",
                        // imageUploadUrl:_this.apiUrl+"/system/upload/ckEditorUpImg?token="+encodeURIComponent(getToken()),


                        toolbar: [{
                            name: 'document',
                                items: ['Print']
                            },
                            {
                            name: 'clipboard',
                                items: ['Undo', 'Redo']
                            },
                            {
                            name: 'styles',
                                items: ['Format', 'Font', 'FontSize']
                            },
                            {
                            name: 'colors',
                                items: ['TextColor', 'BGColor']
                            },
                            {
                            name: 'align',
                                items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
                            },
                            '/',
                            {
                            name: 'basicstyles',
                                items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting']
                            },
                            {
                            name: 'links',
                                items: ['Link', 'Unlink']
                            },
                            {
                            name: 'paragraph',
                                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']
                            },
                            {
                            name: 'insert',
                                items: ['Image', 'Table']
                            },
                            {
                                name: 'tools',
                                items: ['Maximize']
                            },
                            {
                                name: 'editing',
                                items: ['Scayt']
                            },
                            {
                                name:'source',
                                items:['Source']
                            }
                        ],

                        extraAllowedContent: 'h3{clear};h2{line-height};h2 h3{margin-left,margin-top}',

                        // Adding drag and drop image upload.
                        extraPlugins: 'print,format,font,colorbutton,justify,uploadimage,divarea',
                        uploadUrl: _this.apiUrl+"/system/upload/ckEditorUp?command=QuickUpload&type=Files&token="+encodeURIComponent(getToken()),

                        // Configure your file manager integration. This example uses CKFinder 3 for PHP.
                        //filebrowserBrowseUrl: '/apps/ckfinder/3.4.5/ckfinder.html',
                        //filebrowserImageBrowseUrl: '/apps/ckfinder/3.4.5/ckfinder.html?type=Images',
                        filebrowserUploadUrl: _this.apiUrl+"/system/upload/ckEditorUp?command=QuickUpload&type=Files&token="+encodeURIComponent(getToken()),
                        filebrowserImageUploadUrl: _this.apiUrl+"/system/upload/ckEditorUp?command=QuickUpload&type=Images&token="+encodeURIComponent(getToken()),

                        width:'auto',
                        height: 420,

                        removeDialogTabs: 'image:advanced;link:advanced',

                    }
                },
            }
        },
        data() {
            return {
                editorUrl: process.env.BASE_URL+"js/ckeditor/ckeditor.js"
            };
        },
        computed:{
            dataValue:{
                get(){
                    return this.value
                },
                set(data){
                    this.$emit('setEditContent',data)
                },
            }
        },
        methods:{

        }

}
</script>

<style>
.ck-content {
  font-family: 微软雅黑 宋体;
  font-size:14px;
}
.ck-content p{
  margin: 0 0 6px 0;
  line-height: 22px;
  text-indent: 2em;
}
</style>
