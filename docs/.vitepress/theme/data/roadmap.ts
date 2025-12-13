
export interface RoadmapItem {
    text: string
    link?: string
    highlight?: boolean
}

export interface RoadmapLevel {
    title: string
    duration: string
    description: string
    icon: string
    colorClass: string
    items: RoadmapItem[]
}

export const roadmapData: RoadmapLevel[] = [
    {
        title: 'Beginner',
        duration: '2-3 สัปดาห์',
        description: 'เริ่มต้นจากศูนย์ ปูพื้นฐานให้แน่นเปรี๊ยะ!',
        icon: 'lucide:sprout',
        colorClass: 'beginner',
        items: [
            { text: 'ติดตั้ง Rust', link: '/beginner/getting-started' },
            { text: 'Hello World', link: '/beginner/hello-world' },
            { text: 'Guessing Game', link: '/beginner/guessing-game' },
            { text: 'Comments & Docs', link: '/beginner/comments' },
            { text: 'Variables & Types', link: '/beginner/variables' },
            { text: 'Option & Result', link: '/beginner/option-result' },
            { text: 'Functions', link: '/beginner/functions' },
            { text: 'Control Flow', link: '/beginner/control-flow' },
            { text: 'Pattern Matching', link: '/beginner/patterns' },
            { text: 'Ownership', link: '/beginner/ownership'},
            { text: 'Debugging', link: '/beginner/debugging' }
        ]
    },
    {
        title: 'Intermediate',
        duration: '3-4 สัปดาห์',
        description: 'เริ่มใช้งานจริง สร้างโปรเจกต์ที่ซับซ้อนขึ้น',
        icon: 'lucide:layers',
        colorClass: 'intermediate',
        items: [
            { text: 'Cargo & Crates', link: '/intermediate/cargo' },
            { text: 'Structs & Enums', link: '/intermediate/structs' },
            { text: 'Error Handling', link: '/intermediate/error-handling' },
            { text: 'Collections', link: '/intermediate/collections' },
            { text: 'Strings', link: '/intermediate/strings' },
            { text: 'Modules', link: '/intermediate/modules' },
            { text: 'Traits & Generics', link: '/intermediate/traits' },
            { text: 'Testing', link: '/intermediate/testing' },
            { text: 'Iterators', link: '/intermediate/iterators' },
            { text: 'File I/O', link: '/intermediate/file-io' },
            { text: 'Networking', link: '/intermediate/networking' },
            { text: 'Date & Time', link: '/intermediate/datetime' },
            { text: 'Serde & JSON', link: '/intermediate/serde' }
        ]
    },
    {
        title: 'Advanced',
        duration: '4-6 สัปดาห์',
        description: 'เจาะลึกระดับเทพ ทำสิ่งที่ภาษาอื่นทำยาก!',
        icon: 'lucide:zap',
        colorClass: 'advanced',
        items: [
            { text: 'Lifetimes', link: '/advanced/lifetimes' },
            { text: 'Smart Pointers', link: '/advanced/smart-pointers' },
            { text: 'Memory Model', link: '/advanced/memory' },
            { text: 'Interior Mutability', link: '/advanced/interior-mutability' },
            { text: 'Concurrency', link: '/advanced/concurrency' },
            { text: 'Async/Await', link: '/advanced/async' },
            { text: 'Macros', link: '/advanced/macros' },
            { text: 'CLI & Web', link: '/advanced/cli' },
            { text: 'WASM & FFI', link: '/advanced/wasm' },
            { text: 'Embedded', link: '/advanced/embedded' },
            { text: 'Performance', link: '/advanced/performance' },
            { text: 'Process & System', link: '/structs/process' }
        ]
    }
]
