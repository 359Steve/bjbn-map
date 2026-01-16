# BJBN 3.0 地图通用组件

**1.安装组件**

```
npm i bjbn-map-container
```

**2.使用组件先在 main.ts 文件中引入 css 文件**

```typescript
import "bjbn-map-container/dist/bjbn-map-container.css";
```

**3.再在页面中引入组件**

```vue
import { MapContainer } from 'bjbn-map-container'
```

**4.内置类型**

```vue
import type { MapConfigVo, MapObj } from 'bjbn-map-container'
```

**参数列表**

| 参数名                   | 描述               | 类型               | 是否必传 | 默认值        |
| ------------------------ | ------------------ | ------------------ | -------- | ------------- |
| boxId                    | 地图容器 id        | string             | true     | \-            |
| mapConfigs               | 地图数组           | Array<MapConfigVo> | true     | \-            |
| showSelect               | 控制切换地图选择框 | boolean            | false    | false         |
| left                     | 下拉选择框位置     | number             | false    | \-            |
| right                    | 下拉选择框位置     | number             | false    | 30            |
| bottom                   | 下拉选择框位置     | number             | false    | \-            |
| top                      | 下拉选择框位置     | number             | false    | 30            |
| width                    | 下拉选择框位置     | number             | false    | 150           |
| height                   | 下拉选择框位置     | number             | false    | 32            |
| v-model:currentMapConfig | 当前地图状态数据   | MapConfigVo        | true     | mapConfigs[0] |

**事件列表**

| 事件名     | 描述                 | 示例                                                                   |
| ---------- | -------------------- | ---------------------------------------------------------------------- |
| initGeoBox | 获取当前地图实例对象 | @init-geo-box="(obj) => {console.log(obj)}"                            |
| mapChange  | 获取修改后地图数据   | @map-change="(value: boolean, id: string) => {console.log(value, id)}" |

**MapConfigVo 和 MapObj 类型**

```typescript
export interface MapConfigVo {
  // 地图配置id
  id: string;
  // 地图名称
  name: string;
  // 地图背景色
  background: string;
  // 排序
  index: number;
  // 配置
  config: BNMapConfig;
}
interface BNMapConfig {
  /** 地图初始中心点，例：[x,y] */
  center?: [number, number];
  /** 地图地址 */
  apiUrl: string;
  /** 地图id */
  mapId: string;
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
  graphic?: string;
  /** 预警区域 */
  warnArea?: string[];
  /** 报警区域 */
  alarmArea?: string[];
}

export interface MapObj {
  mapObj: any;
  bnmap: any;
  BNMap: any;
}
```

**完整实例**

```vue
<MapContainer
  v-if="mapConfigs && mapConfigs.length > 0"
  box-id="Map"
  :show-select="true"
  :map-configs="mapConfigs"
  v-model:currentMapConfig="currentMapConfig"
  :right="30"
  :top="30"
  :width="150"
  :height="32"
  @map-change="mapChange"
  @init-geo-box="initGeoBox"
>
</MapContainer>
```
