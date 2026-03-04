import type { Ref } from 'vue'

/**
 * @description 进度条组件props类型
 */
export interface LoadingProps {
	throttle?: number;
	duration?: number;
	hideDelay?: number;
	resetDelay?: number;
	height?: number;
	color?: string | boolean;
	errorColor?: string;
	estimatedProgress?: (duration: number, elapsed: number) => number;
}

export interface LoadingIndicator {
	progress: Ref<number>;
	isLoading: Ref<boolean>;
	error: Ref<boolean>;
	start: (opts?: { force?: boolean }) => void;
	setIndicator: (value: number, opts?: { force?: boolean }) => void;
	end: (opts?: { force?: boolean; error?: boolean }) => void;
	clearStart: () => void;
}
