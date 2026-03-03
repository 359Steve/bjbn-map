<script setup lang="ts">
import { useRafFn, useWindowSize, type Fn } from '@vueuse/core';
import { computed, nextTick, onMounted, ref, shallowRef, type ShallowRef } from 'vue';

const r180 = Math.PI;
const r90 = Math.PI / 2;
const r15 = Math.PI / 12;
const color = '#88888825';

const el = ref<HTMLCanvasElement | null>(null);

const { random } = Math;
const size = ref<{
	width: ShallowRef<number>;
	height: ShallowRef<number>;
}>({
	width: shallowRef(0),
	height: shallowRef(0),
});

const MIN_BRANCH = 30;
const len = ref<number>(6); // 最大长度为6
const stopped = ref<boolean>(false);

const controls = ref<ReturnType<typeof useRafFn>>();
const steps = ref<Fn[]>([]);
const prevSteps = ref<Fn[]>([]);
const lastTime = ref<number>(0);
const interval = 1000 / 40;

/** 返回 0.2～0.8 的随机数，用于在边框中段位置发芽 */
const randomMiddle = computed(() => random() * 0.6 + 0.2);

/**
 * 初始化画布方法
 * @param canvas canvas dom元素
 * @param width 屏幕宽度
 * @param height 屏幕高度
 */
function initCanvas(canvas: HTMLCanvasElement, width = 400, height = 400) {
	const ctx = canvas.getContext('2d')!;

	// 获取像素与真实屏幕比例，表示 1 个 CSS 像素 等于 多少个物理像素
	const dpr = window.devicePixelRatio || 1;

	// 设置画布内部像素数量
	canvas.width = width * dpr;
	canvas.height = height * dpr;

	// 设置canvas尺寸
	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;

	// 把 canvas 的绘图坐标系统放大 dpr 倍
	ctx.scale(dpr, dpr);

	return ctx;
}

/**
 * 极坐标转笛卡尔坐标
 * @param x 起点x
 * @param y 终点y
 * @param r 半径
 * @param theta 下一次角度
 */
function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
	// 求当前线条对应x长度
	const dx = r * Math.cos(theta);
	// 求当前线条对应y长度
	const dy = r * Math.sin(theta);
	// 加上起点的x，y得到改线条的终点x，y
	return [x + dx, y + dy];
}

/**
 * 绘制线条方法
 * @param x 起点
 * @param y 七点
 * @param rad 弧度
 * @param counter 深度
 */
function step(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	rad: number,
	counter: { value: number } = { value: 0 },
) {
	// 生成随机长度
	const length = random() * len.value;

	// 深度加一
	counter.value += 1;

	// 计算终点坐标
	const [nx, ny] = polar2cart(x, y, length, rad);

	// 绘制线条从起点绘制到终点
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(nx, ny);
	ctx.stroke();

	// 计算左右分叉方向，每次偏一点点
	const rad1 = rad + random() * r15;
	const rad2 = rad - random() * r15;

	// 超出视口边界则不再分叉
	if (nx < -100 || nx > size.value.width + 100 || ny < -100 || ny > size.value.height + 100) return;

	// 根据深度决定分叉概率 MIN_BRANCH = 30，前30层0.8后面就0.5
	const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;

	// 左分支
	if (random() < rate) steps.value.push(() => step(ctx, nx, ny, rad1, counter));

	// 右分支
	if (random() < rate) steps.value.push(() => step(ctx, nx, ny, rad2, counter));
}

function frame() {
	if (!controls.value) return;
	// 如果距离上一次执行还没到 25ms 直接跳过
	if (performance.now() - lastTime.value < interval) return;

	// 把上一帧积累的任务拿出来执行，然后清空当前队列
	prevSteps.value = steps.value;
	steps.value = [];
	lastTime.value = performance.now();

	// 没任务了就停
	if (!prevSteps.value.length) {
		controls.value.pause();
		stopped.value = true;
	}

	// 执行上一帧收集的步进，约 50% 延后到下一帧，使生长更自然
	prevSteps.value.forEach((i) => {
		if (random() < 0.5) steps.value.push(i);
		else i();
	});
}

function start(ctx: CanvasRenderingContext2D, width: number, height: number) {
	if (!controls.value) return;
	controls.value.pause();

	// 从左上角0，0坐标清楚画布
	ctx.clearRect(0, 0, width, height);
	// 设置线条样式
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;

	// 清空历史绘制队列
	prevSteps.value = [];

	// 初始化第一批生长任务
	steps.value = [
		// 上方
		() => step(ctx, randomMiddle.value * size.value.width, 0, r90),
		// 下方
		() => step(ctx, randomMiddle.value * size.value.width, size.value.height, -r90),
		// 左方
		() => step(ctx, 0, randomMiddle.value * size.value.height, 0),
		// 右方
		() => step(ctx, size.value.width, randomMiddle.value * size.value.height, r180),
	];
	if (size.value.width < 500) steps.value = steps.value.slice(0, 2);
	controls.value.resume();
	stopped.value = false;
}

onMounted(async () => {
	nextTick(() => {
		size.value = useWindowSize();
		const canvas = el.value!;
		const ctx = initCanvas(canvas, size.value.width, size.value.height);
		const { width, height } = canvas;

		// 获取加载完成时长
		lastTime.value = performance.now();

		controls.value = useRafFn(frame, { immediate: false });

		start(ctx, width, height);
	});
});

// 径向渐变遮罩：中心透明、边缘黑色，使树枝在边缘淡出
const mask = computed(() => 'radial-gradient(circle, transparent, black);');
</script>

<template>
	<!-- 全屏背景层：不响应点击、置于底层、打印时隐藏 -->
	<div class="branch-class" :style="`mask-image: ${mask};--webkit-mask-image: ${mask};`">
		<canvas ref="el" width="400" height="400" />
	</div>
</template>

<style scoped>
.branch-class {
	pointer-events: none;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: -1;
}

/* 打印时隐藏 */
@media print {
	.branch-class {
		display: none;
	}
}
</style>
