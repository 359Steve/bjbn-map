<script lang='ts' setup>
import { computed } from 'vue';
import { useLoadingIndicator } from './utils';

interface Props {
	throttle?: number;
	duration?: number;
	hideDelay?: number;
	resetDelay?: number;
	height?: number;
	color?: string | boolean;
	errorColor?: string;
	estimatedProgress?: (duration: number, elapsed: number) => number;
}

const {
	throttle = 200,
	duration = 2000,
	hideDelay = 500,
	resetDelay = 400,
	height = 3,
	color = 'repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)',
	errorColor = 'repeating-linear-gradient(to right,#f87171 0%,#ef4444 100%)',
	estimatedProgress,
} = defineProps<Props>();

const { progress, isLoading, error } = useLoadingIndicator({
	duration,
	throttle,
	hideDelay,
	resetDelay,
	estimatedProgress,
});

const defaultGradient = 'repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)';
const barBackground = computed(() => (error.value ? errorColor : typeof color === 'string' ? color : defaultGradient));
</script>

<template>
	<div :style="{
		position: 'fixed',
		top: 0,
		right: 0,
		left: 0,
		pointerEvents: 'none',
		width: 'auto',
		height: `${height}px`,
		opacity: isLoading ? 1 : 0,
		background: barBackground,
		backgroundSize: `${progress > 0 ? (100 / progress) * 100 : 0}% auto`,
		transform: `scaleX(${progress}%)`,
		transformOrigin: 'left',
		transition: 'transform 0.1s, height 0.4s, opacity 0.4s',
		zIndex: 999999,
	}" />
</template>

<style lang='scss' scoped></style>