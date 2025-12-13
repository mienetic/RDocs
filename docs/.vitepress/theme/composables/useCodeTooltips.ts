// Composable สำหรับ process code blocks และเพิ่ม tooltips
import { onMounted, onUnmounted, reactive, nextTick } from 'vue'
import { rustTypes, allTypeNames } from '../data/rust-types'

// Shared state for the global tooltip component
export const tooltipState = reactive({
    visible: false,
    typeName: '',
    x: 0,
    y: 0
})


export function useCodeTooltips() {
    let hideTimeout: number | null = null

    // Detect if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const showTooltip = (trigger: HTMLElement, typeName: string) => {
        if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
        }

        tooltipState.typeName = typeName
        tooltipState.visible = true

        const rect = trigger.getBoundingClientRect()
        const tooltipWidth = 280
        const tooltipHeight = 100 // approx

        let left = rect.left + rect.width / 2 - tooltipWidth / 2
        let top = rect.top - tooltipHeight - 8

        // Stay within viewport
        if (left < 10) left = 10
        if (left + tooltipWidth > window.innerWidth - 10) {
            left = window.innerWidth - tooltipWidth - 10
        }

        // Show below if no space above
        if (top < 10) {
            top = rect.bottom + 8
        }

        tooltipState.x = left
        tooltipState.y = top
    }

    const hideTooltip = () => {
        if (hideTimeout) return

        hideTimeout = window.setTimeout(() => {
            tooltipState.visible = false
            hideTimeout = null
        }, 150)
    }

    // สร้าง regex สำหรับหา type names (เฉพาะ word boundaries)
    const typePattern = new RegExp(`\\b(${allTypeNames.join('|')})\\b`, 'g')

    const wrapTypesInSpan = (textNode: Text, parent: Element) => {
        const text = textNode.textContent || ''
        if (!typePattern.test(text)) return false

        // Reset regex
        typePattern.lastIndex = 0

        const fragment = document.createDocumentFragment()
        let lastIndex = 0
        let match

        while ((match = typePattern.exec(text)) !== null) {
            // Add text before match
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)))
            }

            // Create span for the type
            const span = document.createElement('span')
            span.textContent = match[1]
            span.setAttribute('data-rust-type', match[1])
            span.style.cursor = 'pointer'
            span.style.borderRadius = '2px'
            fragment.appendChild(span)

            lastIndex = match.index + match[0].length
        }

        // Add remaining text
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
        }

        parent.replaceChild(fragment, textNode)
        return true
    }

    const processCodeBlocks = () => {
        const codeBlocks = document.querySelectorAll('pre.shiki, pre.vp-code, div.language-rust pre, div.language-rs pre')

        codeBlocks.forEach((codeBlock) => {
            if (codeBlock.hasAttribute('data-tooltips-processed')) return
            codeBlock.setAttribute('data-tooltips-processed', 'true')

            // Method 1: Check existing spans with exact match
            const spans = codeBlock.querySelectorAll('span')
            spans.forEach(span => {
                const text = span.textContent?.trim()
                if (text && allTypeNames.includes(text) && !span.hasAttribute('data-rust-type')) {
                    span.setAttribute('data-rust-type', text)
                    span.style.cursor = 'pointer'
                    span.style.borderRadius = '2px'
                }
            })

            // Method 2: Process text nodes and wrap types
            const walker = document.createTreeWalker(
                codeBlock,
                NodeFilter.SHOW_TEXT,
                null
            )

            const textNodes: Text[] = []
            let node
            while (node = walker.nextNode()) {
                if (node.textContent && typePattern.test(node.textContent)) {
                    // Check if parent looks like a comment or string based on text content
                    const parent = node.parentElement
                    if (parent) {
                        const parentText = parent.textContent?.trim() || ''
                        // Skip comments (//) and doc comments (///)
                        if (parentText.startsWith('//')) continue
                        // Skip strings (", ') and raw strings (r", r#")
                        if (parentText.startsWith('"') || parentText.startsWith("'") ||
                            parentText.startsWith('r"') || parentText.startsWith('r#')) continue
                    }

                    typePattern.lastIndex = 0
                    textNodes.push(node as Text)
                }
            }

            // Process text nodes (in reverse to avoid index issues)
            textNodes.reverse().forEach(textNode => {
                if (textNode.parentElement && !textNode.parentElement.hasAttribute('data-rust-type')) {
                    wrapTypesInSpan(textNode, textNode.parentElement)
                }
            })
        })
    }

    const handleMouseOver = (e: MouseEvent) => {
        // Skip mouseover on touch devices to prevent conflict with click
        if (isTouchDevice) return

        const target = e.target as HTMLElement
        if (target.hasAttribute('data-rust-type')) {
            const typeName = target.getAttribute('data-rust-type')!
            target.style.backgroundColor = 'var(--vp-c-brand-soft)'
            showTooltip(target, typeName)
            // Attach hover handlers to tooltip after showing
            setTimeout(attachTooltipHoverHandlers, 50)
        }
    }

    const handleMouseOut = (e: MouseEvent) => {
        // Skip mouseout on touch devices
        if (isTouchDevice) return

        const target = e.target as HTMLElement
        if (target.hasAttribute('data-rust-type')) {
            // Check if mouse is moving to the tooltip
            const relatedTarget = e.relatedTarget as HTMLElement
            const tooltip = document.querySelector('.rust-type-tooltip')

            // Don't hide if moving to tooltip
            if (tooltip && relatedTarget && tooltip.contains(relatedTarget)) {
                return
            }

            target.style.backgroundColor = ''
            hideTooltip()
        }
    }

    // Keep tooltip visible when hovering over it
    const handleTooltipMouseEnter = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
        }
    }

    const handleTooltipMouseLeave = () => {
        // Clear background from all highlighted types
        const highlightedTypes = document.querySelectorAll('[data-rust-type]')
        highlightedTypes.forEach(el => {
            const element = el as HTMLElement
            if (element.style.backgroundColor) {
                element.style.backgroundColor = ''
            }
        })
        hideTooltip()
    }

    // Attach hover handlers to tooltip after it's created
    const attachTooltipHoverHandlers = () => {
        const tooltip = document.querySelector('.rust-type-tooltip')
        if (tooltip && !tooltip.hasAttribute('data-hover-attached')) {
            tooltip.setAttribute('data-hover-attached', 'true')
            tooltip.addEventListener('mouseenter', handleTooltipMouseEnter)
            tooltip.addEventListener('mouseleave', handleTooltipMouseLeave)
        }
    }

    const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.hasAttribute('data-rust-type')) {
            const typeName = target.getAttribute('data-rust-type')!
            const typeInfo = rustTypes[typeName]

            // On touch devices: show tooltip (user will click footer button to navigate)
            if (isTouchDevice) {
                if (!tooltipState.visible || tooltipState.typeName !== typeName) {
                    e.preventDefault()
                    e.stopPropagation()
                    target.style.backgroundColor = 'var(--vp-c-brand-soft)'
                    showTooltip(target, typeName)
                }
                return
            }

            // On desktop: redirect directly (hover already shows tooltip)
            if (typeInfo?.link) {
                e.preventDefault()
                e.stopPropagation()
                const basePath = '/RDocs'
                window.location.href = basePath + typeInfo.link
            }
        }
    }

    onMounted(() => {
        setTimeout(processCodeBlocks, 500)

        document.addEventListener('mouseover', handleMouseOver)
        document.addEventListener('mouseout', handleMouseOut)
        document.addEventListener('click', handleClick)

        const observer = new MutationObserver(() => {
            setTimeout(processCodeBlocks, 200)
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    })

    onUnmounted(() => {
        document.removeEventListener('mouseover', handleMouseOver)
        document.removeEventListener('mouseout', handleMouseOut)
        document.removeEventListener('click', handleClick)
    })
}

