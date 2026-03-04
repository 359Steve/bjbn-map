# VP Loading Indicator

基于 **Vue 3** 的 VitePress 顶部加载进度条组件，适用于文档站或 Vue 应用中的页面加载指示。

---

## 特性

- 基于 **Vue 3**，适配 **VitePress**
- 顶部进度条样式，可自定义高度、颜色、渐变
- 支持 **throttle / duration / hideDelay** 等时序配置
- 提供 **TypeScript** 类型（`LoadingProps`、`LoadingIndicator`）
- 支持 **ESM / UMD**，带类型声明（`dist/index.d.ts`）

---

## 安装

```bash
npm install vp-loading-indicator
```

**Peer 依赖**：`vue`、`@vueuse/core`、`vitepress`（按需安装）

---

## 使用

### 作为组件

```vue
<script setup>
import VPLoadingIndicator from 'vp-loading-indicator'
import 'vp-loading-indicator/dist/vp-loading-indicator.css'
</script>

<template>
  <VPLoadingIndicator
    :duration="2000"
    :height="3"
    color="repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)"
  />
</template>
```

### 类型导出

```ts
import VPLoadingIndicator, {
  type LoadingProps,
  type LoadingIndicator,
} from 'vp-loading-indicator'
```

### Props（LoadingProps）

| 属性 | 类型 | 说明 |
|------|------|------|
| `throttle` | `number` | 节流间隔，默认 200 |
| `duration` | `number` | 进度条持续时间，默认 2000 |
| `hideDelay` | `number` | 隐藏延迟，默认 500 |
| `resetDelay` | `number` | 重置延迟，默认 400 |
| `height` | `number` | 进度条高度（px），默认 3 |
| `color` | `string \| boolean` | 进度条颜色或渐变 |
| `errorColor` | `string` | 错误状态颜色 |
| `estimatedProgress` | `(duration, elapsed) => number` | 自定义进度估算函数 |

---

## 开发与构建

```bash
npm install
npm run build
```

构建产物在 `dist/`，包含 ESM、UMD、CSS 及类型声明。

---

## License

MIT · Author: Josef-qiao
