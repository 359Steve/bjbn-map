import { ElSelect, ElOption } from 'element-plus';
import { defineComponent, h, onBeforeMount, onMounted, onBeforeUnmount, ref, watch, watchEffect, nextTick, computed, CSSProperties, PropType } from 'vue'
import { loadScript } from 'vue-plugin-load-script'
import { MapConfigVo, MapObj } from './types';

// 地图初始化方法类型
interface BNMap {
	BFactory: {
		Load: (mapId: string, config: MapConfigVo['config'], callback: (map: any) => void) => void
	}
}
// 引入地图js
declare const BNMap: BNMap;

export default defineComponent({
	name: 'MapContainer',
	props: {
		boxId: { type: String, required: true },
		mapConfigs: { type: Array<MapConfigVo>, required: true },
		showSelect: { type: Boolean, default: false },
		left: { type: Number },
		right: { type: Number, default: 30 },
		bottom: { type: Number },
		top: { type: Number, default: 30 },
		width: { type: Number, default: 150 },
		height: { type: Number, default: 32 },
		currentMapConfig: { type: Object as PropType<MapConfigVo>, required: true }
	},
	emits: {
		initGeoBox: (_mapObj: MapObj) => true,
		mapChange: (_msg: boolean, _mapId: string) => true,
		'update:currentMapConfig': (_val: MapConfigVo) => true
	},
	setup(props, { expose, emit }) {
		const scriptElement = ref<HTMLScriptElement | null>(null)
		const selectRef = ref<InstanceType<typeof ElSelect> | null>(null)

		const mapObj = ref<any>(null)
		const bnmap = ref<any>(null)
		const draw = ref<any>(null)
		const edit = ref<any>(null)
		const playback = ref<any>(null)
		const control = ref<any>(null)

		const selectMap = ref<string>(props.currentMapConfig.id)

		const updateMapConfig = (val: MapConfigVo) => {
			emit('update:currentMapConfig', val)
		}

		const handleMapChange = (id: string) => {
			updateMapConfig(props.mapConfigs.find((item: MapConfigVo) => item.id === id) as MapConfigVo)
		}

		const styleObj = computed((): CSSProperties => ({
			left: `${props.left}px`,
			top: `${props.top}px`,
			right: `${props.right}px`,
			bottom: `${props.bottom}px`,
			width: `${props.width}px`,
			height: `${props.height}px`
		}))

		// 重置
		const reset = () => {
			// 清空地图
			mapObj.value = null
			bnmap.value = null
			draw.value = null
			edit.value = null
			playback.value = null

			// 清空容器，避免重复渲染
			const container = document.getElementById(props.boxId)
			if (container) container.innerHTML = ''
		}

		// 获取选择框元素
		const getSelect = async () => {
			await nextTick()
			if (selectRef.value) {
				const wrapper = selectRef.value.$el.querySelector('.el-select__wrapper') as HTMLElement
				if (wrapper) {
					wrapper.style.height = `${props.height}px`
				}
			}
		}

		// 重置地图状态方法
		const resetMapState = () => {
			if (!mapObj.value) {
				console.warn('地图对象未初始化，无法重置地图状态')
				return
			}

			if (!props.currentMapConfig || !props.currentMapConfig.config) {
				console.warn('地图配置未初始化，无法重置地图状态')
				return
			}
			const { zoom, center, bearing, boxZoom, bounds } = props.currentMapConfig.config;

			try {
				// 重置zoom
				if (zoom !== undefined) {
					mapObj.value.setZoom(zoom)
				}

				// 重置center
				if (center) {
					mapObj.value.setCenter(center)
				}

				// 重置bearing
				if (bearing !== undefined) {
					mapObj.value.setBearing(bearing)
				}

				// 重置boxZoom
				if (boxZoom !== undefined) {
					if (boxZoom) {
						mapObj.value.boxZoom.enable()
					} else {
						mapObj.value.boxZoom.disable()
					}
				}

				// 重置bounds
				if (bounds) {
					mapObj.value.fitBounds(bounds, { padding: 50, duration: 1000 })
				}

				console.log('地图状态重置成功')
			} catch (error) {
				console.error('重置地图状态时发生错误:', error)
			}
		}


		// 封装初始化地图
		const initMap = async () => {
			if (scriptElement.value) {
				// 先删除
				scriptElement.value.remove()
			}
			// 加载地图 js
			scriptElement.value = await loadScript(props.currentMapConfig.config.apiUrl)

			reset()

			// 初始化
			BNMap.BFactory.Load(
				props.currentMapConfig.config.mapId,
				{
					container: props.boxId,
					...props.currentMapConfig.config
				},
				(map: any) => {
					mapObj.value = map
					bnmap.value = map._innerMap

					let mapInstance = {
						mapObj: mapObj.value,
						bnmap: bnmap.value,
						BNMap: BNMap
					}
					// 将地图对象赋值给geoBox工具文件
					emit('initGeoBox', mapInstance)
				}
			)
		}

		// 初始加载
		onBeforeMount(() => {
			initMap()
		})

		onMounted(() => {
			getSelect()
		})

		onBeforeUnmount(() => {
			reset()
		})

		// 监听切换
		watch(selectMap, async () => {
			emit('mapChange', true, props.currentMapConfig.id)
			reset()
			await nextTick()
			await initMap()
		})

		watchEffect(async () => {
			if (props.height) {
				getSelect()
			}
		})

		expose({
			mapObj,
			bnmap,
			draw,
			edit,
			playback,
			resetMapState,
			control
		})

		return () => h('div', {
			style: {
				width: '100%',
				height: '100%',
				position: 'absolute',
				display: 'flex'
			}
		}, [
			// 地图容器
			h('div', {
				id: props.boxId,
				style: {
					width: '100%',
					height: '100%',
					background: props.currentMapConfig.background
				}
			}),
			// 下拉框
			props.showSelect ? h('div', {
				style: {
					position: 'absolute',
					zIndex: 999,
					...styleObj.value
				}
			}, [
				h(ElSelect, {
					ref: selectRef,
					modelValue: selectMap.value,
					placeholder: '请选择地图',
					'onUpdate:modelValue': (val: string) => { selectMap.value = val },
					onChange: handleMapChange,
					style: { width: '100%', height: 'auto' }
				}, () => props.mapConfigs.map((item: MapConfigVo) =>
					h(ElOption, { key: item.id, label: item.name, value: item.id })
				))
			]) : null
		])
	}
})
