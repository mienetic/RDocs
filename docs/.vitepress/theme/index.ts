import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import { Icon } from '@iconify/vue'
import RustPlayground from './components/RustPlayground.vue'
import CodeTooltipProvider from './components/CodeTooltipProvider.vue'
import Roadmap from './components/Roadmap.vue'
import './custom.css'

export default {
    extends: DefaultTheme,
    Layout() {
        return h(CodeTooltipProvider, null, {
            default: () => h(DefaultTheme.Layout)
        })
    },
    enhanceApp({ app }) {
        // ลงทะเบียน Icon component
        app.component('Icon', Icon)
        // ลงทะเบียน RustPlayground component
        app.component('RustPlayground', RustPlayground)
        // ลงทะเบียน Roadmap component
        app.component('Roadmap', Roadmap)
    }
} satisfies Theme
