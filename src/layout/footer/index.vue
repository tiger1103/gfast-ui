<template>
	<div class="layout-footer pb15">
		<div class="layout-footer-warp">
			<div>Copyright © 2021-2023 g-fast.cn All Rights Reserved.</div>
			<div class="mt5">云南奇讯科技有限公司版权所有</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutFooter">
// 此处需有内容（注释也得），否则缓存将失败
</script>

<style scoped lang="scss">
.layout-footer {
	width: 100%;
	display: flex;
	&-warp {
		margin: auto;
		color: var(--el-text-color-secondary);
		text-align: center;
		animation: error-num 0.3s ease;
	}
}
</style>
