import { getCurrentScope, onScopeDispose, shallowRef } from "vue";
import { useRouter } from 'vitepress'
import { LoadingIndicator, LoadingProps } from "../types";

/**
 * 近段进度比例
 * @param duration 动画总时长
 * @param elapsed 过了多长时间
 * @returns number
 */
const defaultEstimatedProgress = (duration: number, elapsed: number): number => {
	const completionPercentage = (elapsed / duration) * 100;
	return (2 / Math.PI) * 100 * Math.atan(completionPercentage / 50);
}

// 初始化进度条实例
const createLoadingIndicator = (opts: Partial<LoadingProps>): LoadingIndicator => {
	/**
	 * duration：默认动画总时长 2000ms
	 * throttle：显示 loading 前的最短等待时间，防止短请求闪烁
	 * hideDelay：结束后延迟隐藏 loading（避免瞬间消失）
	 * resetDelay：隐藏后延迟重置进度值
	 */
	const { duration = 2000, throttle = 200, hideDelay = 500, resetDelay = 400 } = opts;

	// 获取进度比例方法
	const getProgress = opts.estimatedProgress || defaultEstimatedProgress;

	// 进度比例
	const progress = shallowRef(0);
	// 是否显示进度条
	const isLoading = shallowRef(false);
	// 是否报错
	const error = shallowRef(false);

	// 是否完成
	let done = false;
	let rafId: number;

	// 加载进度条之前等待定时器
	let throttleTimeout: number | NodeJS.Timeout;
	// 隐藏进度条定时器
	let hideTimeout: number | NodeJS.Timeout;
	// 重制进度定时器
	let resetTimeout: number | NodeJS.Timeout;

	const clearTimeouts = () => {
		clearTimeout(hideTimeout)
		clearTimeout(resetTimeout)
	}

	const clearStart = () => {
		clearTimeout(throttleTimeout)
		cancelAnimationFrame(rafId)
	}

	// 隐藏进度条
	const hide = () => {
		hideTimeout = setTimeout(() => {
			isLoading.value = false
			resetTimeout = setTimeout(() => {
				progress.value = 0
			}, resetDelay);
		}, hideDelay)
	}

	// 结束
	const end = () => {
		progress.value = 100
		done = true
		clearStart()
		clearTimeouts()
		hide()
	}

	// 绘制进度条
	const startProgress = () => {
		done = false

		// 设置开始时间
		let startTime: number

		const step = (time: number) => {
			// 结束绘制
			if (done) return
			// 计算结束时间
			startTime ??= time
			const endTime = time - startTime

			// 计算进度
			progress.value = Math.max(0, Math.min(100, getProgress(duration, endTime)))

			// 循环下一帧
			rafId = requestAnimationFrame(step)
		}

		// 启动第一帧
		rafId = requestAnimationFrame(step)
	}

	// 设置进度
	const setIndicator = (at: number) => {
		// 先清除进度条开始加载之前的定时器
		clearStart()

		// 初始化进度
		progress.value = at

		throttleTimeout = setTimeout(() => {
			isLoading.value = true
			startProgress()
		}, throttle)
	}

	// 开始进度条动画
	const start = () => {
		// 先清除隐藏和重制进度条定时器
		clearTimeouts()

		error.value = false

		// 设置进度
		setIndicator(0)
	}

	if (!import.meta.env.SSR) {
		const router = useRouter()

		// 页面加载前
		router.onBeforeRouteChange = () => {
			start()
		}

		// 页面加载后
		router.onAfterRouteChange = () => {
			end()
		}
	}

	return {
		progress,
		isLoading,
		error,
		start,
		end,
		setIndicator,
		clearStart
	}
}

// 存储唯一实例
let onlyIndicator: LoadingIndicator | null = null;
// 记录当前多少组件使用
let indicatorUseCount: number = 0

export const useLoadingIndicator = (opts: Partial<LoadingProps> = {}): LoadingIndicator => {
	if (!onlyIndicator) {
		onlyIndicator = createLoadingIndicator(opts)
	}

	// 判断是否在客户端和是否在组件响应式作用域里
	if (!import.meta.env.SSR && getCurrentScope()) {
		indicatorUseCount++;

		onScopeDispose(() => {
			indicatorUseCount--;

			if (indicatorUseCount === 0) {
				onlyIndicator = null
			}
		})
	}

	return onlyIndicator!
}