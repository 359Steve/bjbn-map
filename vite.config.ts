import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
	plugins: [
		vue(),
		vueJsx(),
		dts({ insertTypesEntry: true })
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.tsx'),
			name: 'BranchCanvas',
			formats: ['es', 'umd'],
			fileName: (format) => `branch-canvas.${format}.js`
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
})
