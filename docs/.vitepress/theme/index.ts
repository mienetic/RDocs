import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { Icon } from '@iconify/vue'
import RustPlayground from './components/RustPlayground.vue'
import './custom.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        // ลงทะเบียน Icon component
        app.component('Icon', Icon)
        // ลงทะเบียน RustPlayground component
        app.component('RustPlayground', RustPlayground)
    }
} satisfies Theme
