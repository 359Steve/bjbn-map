import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
	plugins: [vue(), vueJsx()],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.tsx'),
			name: 'BjbnMapContainer',
			fileName: (format) => `bjbn-map-container.${format}.js`
		},
		rollupOptions: {
			external: ['vue', 'element-plus'],
			output: {
				globals: {
					vue: 'Vue',
					'element-plus': 'ElementPlus'
				}
			},
		}
	}
})
