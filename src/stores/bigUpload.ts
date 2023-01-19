import { defineStore } from 'pinia';
import {bigUploadStates} from "/@/stores/interface";

export const bigUpload = defineStore('bigUpload', {
    state:():bigUploadStates=>({
        panelShow:false
    }),
    actions: {
        async setPanelShow(bool: boolean) {
            this.panelShow = bool;
        }
    },
})
