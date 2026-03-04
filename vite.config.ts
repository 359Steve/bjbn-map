import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
	plugins: [
		vue(),
		vueJsx(),
		dts({
		insertTypesEntry: true,
		include: ['src/**/*.ts', 'src/**/*.vue', 'src/types/**/*.d.ts'],
		outDir: 'dist',
	})
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'VPLoadingIndicator',
			formats: ['es', 'umd'],
			fileName: (format) => `vp-loading-indicator.${format}.js`
		},
		rollupOptions: {
			external: ['vue', 'vitepress'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
})
