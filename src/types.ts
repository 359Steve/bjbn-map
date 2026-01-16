export interface MapConfigVo {
	// 地图配置id
	id: string,
	// 地图名称
	name: string,
	// 地图背景色
	background: string,
	// 排序
	index: number,
	// 配置
	config: BNMapConfig
}
interface BNMapConfig {
	/** 地图初始中心点，例：[x,y] */
	center?: [number, number];
	/** 地图地址 */
	apiUrl: string
	/** 地图id */
	mapId: string
	/** 地图初始旋转角度 */
	bearing: number;
	/** 地图初始边界，将覆盖 center 和 zoom，例：[[Xmin,Ymin], [Xmax, Ymax]] */
	bounds?: [number, number][];
	/** 是否开启框选缩放功能，默认：true */
	boxZoom?: boolean;
	/** 地图容器 ID 或 HTMLElement */
	container?: HTMLElement | string;
	/** 是否开启双击缩放，默认：true */
	doubleClick?: boolean;
	/** 是否开启拖动平移，默认：true */
	dragPan?: boolean;
	/** 是否开启拖动旋转，默认：true */
	dragRotate?: boolean;
	/** 是否开启鼠标、触摸、键盘监听器响应，默认：true */
	interactive?: boolean;
	/** 地图最大边界，例：[[Xmin,Ymin], [Xmax, Ymax]] */
	maxBounds?: [number, number][];
	/** 地图最大倾斜角度（0-85） */
	maxPitch?: number;
	/** 地图最小倾斜角度（0-85） */
	minPitch?: number;
	/** 地图的最大缩放级别 （0-24） */
	maxZoom?: number;
	/** 地图的最小缩放级别 （0-24） */
	minZoom?: number;
	/** 地图初始倾斜度 */
	pitch?: number;
	/** 是否开启拖动旋转和地图倾斜，默认：true */
	pitchWithRotate?: boolean;
	/** 是否开启滚动缩放，默认：true */
	scrollZoom?: boolean;
	/** 是否开启拖动倾斜地图，默认：true */
	touchPitch?: boolean;
	/** 地图大小是否跟随浏览器窗口变化，默认：true */
	trackResize?: boolean;
	/** 地图初始缩放等级 */
	zoom?: number;
	/** 地图全区域 */
	graphic?: string
	/** 预警区域 */
	warnArea?: string[],
	/** 报警区域 */
	alarmArea?: string[]
}

export interface MapObj {
	mapObj: any,
	bnmap: any,
	BNMap: any
}