<script>
export default {
    name: "popup",
    props: {
        config: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
    },
    data() {
        return {
            baseConfig: {
                visible: false,
            },
            _content: undefined,
            _fn: undefined
        };
    },
    methods: {
        close() {
            this.baseConfig.visible = false;
        },
        content(content) {
            if (typeof content === "function") {
                this._content = content;
            }
            return this
        },
        confirm(fn) {
            if(typeof fn === "function") {
                this._fn = fn
            }
        }
    },
    created() {
        this.baseConfig = Object.assign(this.baseConfig, this.config);
    },
    render: function (h) {
        let _this = this;
        return h (
            "el-dialog",
            {
                props: { ...this.baseConfig },
                on: {
                    close: function () {
                        _this.close();
                    }
                },
            },
            (function () {

                let foot = h("span",{
                    slot: "footer",
                    class: "dialog-footer"
                }, [
                    h("el-button",{
                        on: {
                            click: () => {
                                _this.close();
                            }
                        }
                    }, "取消"),
                    h("el-button",{
                        attrs:{
                            type: "primary"
                        },
                        on: {
                            click: () => {
                                let flag = true
                                if(typeof _this._fn === "function") {
                                    flag =  _this._fn()
                                }

                                if(flag !== false) {
                                     flag = true
                                } 
                                if (flag) {
                                    _this.close();
                                }
                            }
                        }
                    }, "确定")
                ])

                if (typeof _this._content === "function") {
                    var result = _this._content(h);
                    if (Array.isArray(result)) {
                        return [...result,foot];
                    } else {
                        return [result,foot];
                    }
                }
            })()
        );
    },
};
</script>
