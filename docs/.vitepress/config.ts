import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import container from 'markdown-it-container'

// https://vitepress.dev/reference/site-config
export default withMermaid(
    defineConfig({
        title: "Rust ฉบับไทย",
        description: "เรียน Rust แบบสนุก ไม่น่าเบื่อ พร้อมมุกตลก!",
        lang: 'th-TH',
        base: '/RDocs/',

        head: [
            ['link', { rel: 'icon', href: '/RDocs/logo.svg' }],
            ['meta', { name: 'theme-color', content: '#F74C00' }],
            ['meta', { name: 'og:type', content: 'website' }],
            ['meta', { name: 'og:title', content: 'Rust ฉบับไทย - เรียน Rust แบบสนุก!' }],
            ['meta', { name: 'og:description', content: 'เว็บสอนภาษา Rust ภาษาไทย ครบทุกระดับตั้งแต่มือใหม่ยันโปร!' }],
        ],

        themeConfig: {
            logo: '/logo.svg',
            siteTitle: 'Rust ฉบับไทย',

            nav: [
                { text: 'หน้าแรก', link: '/' },
                { text: 'ผู้เริ่มต้น', link: '/beginner/' },
                { text: 'ระดับกลาง', link: '/intermediate/' },
                { text: 'ระดับสูง', link: '/advanced/' },
                {
                    text: 'Reference',
                    items: [
                        { text: 'Std Library', link: '/std/' },
                        { text: 'Primitive Types', link: '/primitives/' },
                        { text: 'Macros', link: '/macros/' },
                        { text: 'Structs', link: '/structs/' },
                        { text: 'Enums', link: '/enums/' },
                        { text: 'Constants', link: '/constants/' },
                        { text: 'Traits', link: '/traits/' },
                        { text: 'Functions', link: '/functions/' },
                        { text: 'Cheat Sheet', link: '/cheatsheet' },
                        { text: 'Patterns', link: '/patterns/' },
                    ]
                },
            ],

            sidebar: {
                '/beginner/': [
                    {
                        text: 'ผู้เริ่มต้น (Beginner)',
                        items: [
                            { text: 'เริ่มต้นใช้งาน', link: '/beginner/' },
                            { text: 'ติดตั้ง Rust', link: '/beginner/getting-started' },
                            { text: 'Hello World!', link: '/beginner/hello-world' },
                            { text: 'Guessing Game', link: '/beginner/guessing-game' },
                            { text: 'Comments & Docs', link: '/beginner/comments' },
                            { text: 'ตัวแปรและชนิดข้อมูล', link: '/beginner/variables' },
                            { text: 'Option & Result', link: '/beginner/option-result' },
                            { text: 'ฟังก์ชัน', link: '/beginner/functions' },
                            { text: 'Control Flow', link: '/beginner/control-flow' },
                            { text: 'Pattern Matching', link: '/beginner/patterns' },
                            { text: 'Ownership', link: '/beginner/ownership' },
                            { text: 'Debugging', link: '/beginner/debugging' },
                        ]
                    }
                ],
                '/intermediate/': [
                    {
                        text: 'ระดับกลาง (Intermediate)',
                        items: [
                            { text: 'ภาพรวม', link: '/intermediate/' },
                            { text: 'Cargo & Dependencies', link: '/intermediate/cargo' },
                            { text: 'Structs & Enums', link: '/intermediate/structs' },
                            { text: 'จัดการ Error', link: '/intermediate/error-handling' },
                            { text: 'Collections', link: '/intermediate/collections' },
                            { text: 'Strings Deep Dive', link: '/intermediate/strings' },
                            { text: 'Modules & Packages', link: '/intermediate/modules' },
                            { text: 'Traits & Generics', link: '/intermediate/traits' },
                            { text: 'rustdoc', link: '/intermediate/rustdoc' },
                            { text: 'Testing', link: '/intermediate/testing' },
                            { text: 'Iterators & Closures', link: '/intermediate/iterators' },
                            { text: 'File I/O', link: '/intermediate/file-io' },
                            { text: 'Networking', link: '/intermediate/networking' },
                            { text: 'Date & Time', link: '/intermediate/datetime' },
                            { text: 'Regex', link: '/intermediate/regex' },
                            { text: 'Serde & JSON', link: '/intermediate/serde' },
                            { text: 'Environment & Config', link: '/intermediate/config' },
                            { text: 'Attributes', link: '/intermediate/attributes' },
                            { text: 'Type Conversions', link: '/intermediate/conversions' },
                        ]
                    }
                ],
                '/advanced/': [
                    {
                        text: 'ระดับสูง (Advanced)',
                        items: [
                            { text: 'ภาพรวม', link: '/advanced/' },
                            { text: 'Lifetimes', link: '/advanced/lifetimes' },
                            { text: 'Smart Pointers', link: '/advanced/smart-pointers' },
                            { text: 'Memory Model', link: '/advanced/memory' },
                            { text: 'Interior Mutability', link: '/advanced/interior-mutability' },
                            { text: 'Pinning', link: '/advanced/pinning' },
                            { text: 'Concurrency (Threads)', link: '/advanced/concurrency' },
                            { text: 'Async/Await', link: '/advanced/async' },
                            { text: 'Error Patterns', link: '/advanced/error-patterns' },
                            { text: 'Unsafe Rust', link: '/advanced/unsafe' },
                            { text: 'Macros', link: '/advanced/macros' },
                            { text: 'CLI Development', link: '/advanced/cli' },
                            { text: 'Web Development', link: '/advanced/web' },
                            { text: 'WebAssembly', link: '/advanced/wasm' },
                            { text: 'FFI', link: '/advanced/ffi' },
                            { text: 'Embedded Rust', link: '/advanced/embedded' },
                            { text: 'Performance', link: '/advanced/performance' },
                            { text: 'Rust 2024 Edition', link: '/advanced/rust-2024' },
                        ]
                    }
                ],
                '/std/': [
                    {
                        text: 'พื้นฐานที่ใช้บ่อย',
                        items: [
                            { text: 'ภาพรวม', link: '/std/' },
                            { text: 'Vec - อาเรย์แบบยืดหยุ่น', link: '/std/vec' },
                            { text: 'String - ข้อความ', link: '/std/string' },
                            { text: 'Option - ค่าที่อาจมี/ไม่มี', link: '/std/option' },
                            { text: 'Result - สำเร็จ/ผิดพลาด', link: '/std/result' },
                            { text: 'Iterator - วนซ้ำ', link: '/std/iter' },
                            { text: 'Collections - โครงสร้างข้อมูล', link: '/std/collections-ref' },
                            { text: 'Formatting - จัดรูปแบบ', link: '/std/fmt' },
                            { text: 'Clone & Copy - คัดลอก', link: '/std/clone-copy' },
                        ]
                    },
                    {
                        text: 'ระบบและ I/O',
                        items: [
                            { text: 'I/O - อ่าน/เขียน', link: '/std/io' },
                            { text: 'File System - ไฟล์', link: '/std/fs' },
                            { text: 'Path - เส้นทางไฟล์', link: '/std/path' },
                            { text: 'Environment - ตัวแปรระบบ', link: '/std/env' },
                            { text: 'Process - รันโปรแกรม', link: '/std/process' },
                            { text: 'Networking - เครือข่าย', link: '/std/net' },
                            { text: 'Time - เวลา', link: '/std/time' },
                            { text: 'Thread - หลาย thread', link: '/std/thread' },
                            { text: 'Sync - ซิงค์ข้อมูล', link: '/std/sync' },
                            { text: 'Cell - แก้ไขภายใน', link: '/std/cell' },
                        ]
                    },
                    {
                        text: 'Traits สำคัญ',
                        items: [
                            { text: 'Operators - ตัวดำเนินการ', link: '/std/ops' },
                            { text: 'Convert - แปลงชนิด', link: '/std/convert' },
                            { text: 'Comparison - เปรียบเทียบ', link: '/std/cmp' },
                            { text: 'Hash - แฮช', link: '/std/hash' },
                            { text: 'Default - ค่าเริ่มต้น', link: '/std/default' },
                            { text: 'Borrow - ยืม', link: '/std/borrow' },
                            { text: 'Memory - หน่วยความจำ', link: '/std/mem' },
                            { text: 'Pointers - พอยน์เตอร์', link: '/std/ptr' },
                        ]
                    },
                    {
                        text: 'Smart Pointers & Async',
                        items: [
                            { text: 'Rc - Reference Counting', link: '/std/rc' },
                            { text: 'Box - Heap Allocation', link: '/std/box' },
                            { text: 'Pin - Pinned Memory', link: '/std/pin' },
                            { text: 'Future - Async', link: '/std/future' },
                        ]
                    },
                    {
                        text: 'หัวข้อเฉพาะทาง',
                        items: [
                            { text: 'Error - ข้อผิดพลาด', link: '/std/error' },
                            { text: 'Panic - พังทันที', link: '/std/panic' },
                            { text: 'Marker Traits - ระบุคุณสมบัติ', link: '/std/marker' },
                            { text: 'Any - ทุกชนิด', link: '/std/any' },
                            { text: 'FFI - เชื่อมภาษา C', link: '/std/ffi' },
                            { text: 'Allocator - จัดการหน่วยความจำ', link: '/std/alloc' },
                        ]
                    }
                ],
                '/primitives/': [
                    {
                        text: ' ตัวเลข',
                        items: [
                            { text: 'ภาพรวม', link: '/primitives/' },
                            { text: 'Integers (i8-i128)', link: '/primitives/integers' },
                            { text: 'Unsigned (u8-u128)', link: '/primitives/unsigned' },
                            { text: 'Floats (f32, f64)', link: '/primitives/floats' },
                        ]
                    },
                    {
                        text: ' ข้อความ',
                        items: [
                            { text: 'char - ตัวอักษร', link: '/primitives/char' },
                            { text: 'str - String slice', link: '/primitives/str' },
                        ]
                    },
                    {
                        text: 'พื้นฐาน',
                        items: [
                            { text: 'bool & unit', link: '/primitives/bool-unit' },
                        ]
                    },
                    {
                        text: 'Compound',
                        items: [
                            { text: 'array - อาเรย์คงที่', link: '/primitives/array' },
                            { text: 'slice - มุมมอง', link: '/primitives/slice' },
                            { text: 'tuple - กลุ่มค่า', link: '/primitives/tuple' },
                        ]
                    },
                    {
                        text: ' Pointers',
                        items: [
                            { text: 'reference (&T)', link: '/primitives/reference' },
                            { text: 'pointer (*T)', link: '/primitives/pointer' },
                            { text: 'fn & never', link: '/primitives/fn-never' },
                        ]
                    }
                ],
                '/macros/': [
                    {
                        text: ' Output',
                        items: [
                            { text: 'ภาพรวม', link: '/macros/' },
                            { text: 'println!, print!', link: '/macros/output' },
                            { text: 'format!, write!', link: '/macros/formatting' },
                        ]
                    },
                    {
                        text: 'Testing & Debug',
                        items: [
                            { text: 'assert!, assert_eq!', link: '/macros/assertions' },
                            { text: 'dbg!, todo!', link: '/macros/debugging' },
                            { text: 'panic!', link: '/macros/panic' },
                        ]
                    },
                    {
                        text: 'Data',
                        items: [
                            { text: 'vec!, matches!', link: '/macros/data' },
                        ]
                    },
                    {
                        text: ' Compile-time',
                        items: [
                            { text: 'cfg!, env!, include!', link: '/macros/compile-time' },
                        ]
                    }
                ],
                '/structs/': [
                    {
                        text: 'Collections',
                        items: [
                            { text: 'ภาพรวม', link: '/structs/' },
                            { text: 'Collections', link: '/structs/collections' },
                        ]
                    },
                    {
                        text: ' Smart Pointers',
                        items: [
                            { text: 'Box, Rc, Arc', link: '/structs/smart-pointers' },
                            { text: 'Cell Types', link: '/structs/cell' },
                        ]
                    },
                    {
                        text: ' System',
                        items: [
                            { text: 'I/O', link: '/structs/io' },
                            { text: 'Path', link: '/structs/path' },
                            { text: 'Time', link: '/structs/time' },
                            { text: 'Sync', link: '/structs/sync' },
                        ]
                    },
                    {
                        text: ' Network & Thread',
                        items: [
                            { text: 'Networking', link: '/structs/net' },
                            { text: 'Threading', link: '/structs/thread' },
                        ]
                    },
                    {
                        text: 'อื่นๆ',
                        items: [
                            { text: 'Range', link: '/structs/range' },
                            { text: 'Channel', link: '/structs/channel' },
                            { text: 'Error', link: '/structs/error' },
                            { text: 'Iterator', link: '/structs/iterator' },
                            { text: 'Process', link: '/structs/process' },
                            { text: 'FFI', link: '/structs/ffi' },
                            { text: 'Env', link: '/structs/env' },
                            { text: 'Fs', link: '/structs/fs' },
                            { text: 'Fmt', link: '/structs/fmt' },
                            { text: 'Marker', link: '/structs/marker' },
                            { text: 'Mem', link: '/structs/mem' },
                            { text: 'Num', link: '/structs/num' },
                            { text: 'Slice', link: '/structs/slice' },
                            { text: 'Ops', link: '/structs/ops' },
                            { text: 'Lazy', link: '/structs/lazy' },
                            { text: 'Backtrace', link: '/structs/backtrace' },
                            { text: 'Alloc', link: '/structs/alloc' },
                            { text: 'Pin', link: '/structs/pin' },
                            { text: 'Waker', link: '/structs/waker' },
                            { text: 'BStr', link: '/structs/bstr' },
                            { text: 'NonZero', link: '/structs/nonzero' },
                        ]
                    }
                ],
                '/enums/': [
                    {
                        text: 'Enums',
                        items: [
                            { text: 'ภาพรวม', link: '/enums/' },
                            { text: 'Option & Result', link: '/enums/core' },
                            { text: 'Comparison', link: '/enums/cmp' },
                        ]
                    },
                    {
                        text: 'Collections & I/O',
                        items: [
                            { text: 'Entry', link: '/enums/collections' },
                            { text: 'I/O Enums', link: '/enums/io' },
                        ]
                    },
                    {
                        text: ' Network & Async',
                        items: [
                            { text: 'Network', link: '/enums/net' },
                            { text: 'Async (Poll)', link: '/enums/async' },
                            { text: 'Channel Errors', link: '/enums/channel' },
                        ]
                    },
                    {
                        text: ' อื่นๆ',
                        items: [
                            { text: 'Convert', link: '/enums/convert' },
                            { text: 'Path', link: '/enums/path-enum' },
                            { text: 'Env', link: '/enums/env-enum' },
                            { text: 'Atomic', link: '/enums/atomic' },
                            { text: 'Num', link: '/enums/num-enum' },
                            { text: 'Fmt', link: '/enums/fmt-enum' },
                        ]
                    }
                ],
                '/constants/': [
                    {
                        text: 'Constants',
                        items: [
                            { text: 'ภาพรวม', link: '/constants/' },
                            { text: 'Float', link: '/constants/float' },
                            { text: 'Integer', link: '/constants/integer' },
                            { text: 'Char', link: '/constants/char' },
                            { text: 'Env', link: '/constants/env' },
                            { text: 'Math', link: '/constants/math' },
                            { text: 'Path', link: '/constants/path' },
                            { text: 'Time', link: '/constants/time' },
                        ]
                    }
                ],
                '/traits/': [
                    {
                        text: 'Traits',
                        items: [
                            { text: 'ภาพรวม', link: '/traits/' },
                            { text: 'Core', link: '/traits/core' },
                            { text: 'Comparison', link: '/traits/comparison' },
                            { text: 'Conversion', link: '/traits/conversion' },
                            { text: 'Iterator', link: '/traits/iterator' },
                            { text: 'Display', link: '/traits/display' },
                            { text: 'I/O', link: '/traits/io' },
                            { text: 'Concurrency', link: '/traits/concurrency' },
                            { text: 'Operators', link: '/traits/ops' },
                            { text: 'Memory', link: '/traits/memory' },
                            { text: 'Future', link: '/traits/future' },
                            { text: 'Error', link: '/traits/error' },
                            { text: 'Any', link: '/traits/any' },
                            { text: 'Iterators (Adv)', link: '/traits/iterator-ext' },
                            { text: 'Markers', link: '/traits/markers' },
                        ]
                    }
                ],
                '/functions/': [
                    {
                        text: 'Functions',
                        items: [
                            { text: 'ภาพรวม', link: '/functions/' },
                            { text: 'Memory', link: '/functions/mem' },
                            { text: 'File System', link: '/functions/fs' },
                            { text: 'Environment', link: '/functions/env' },
                            { text: 'Thread', link: '/functions/thread' },
                            { text: 'Compare', link: '/functions/cmp' },
                            { text: 'Future', link: '/functions/future' },
                            { text: 'I/O', link: '/functions/io' },
                            { text: 'Process', link: '/functions/process' },
                            { text: 'Pointer', link: '/functions/ptr' },
                            { text: 'Iterator', link: '/functions/iter' },
                            { text: 'Panic', link: '/functions/panic' },
                            { text: 'Any', link: '/functions/any' },
                            { text: 'Hint', link: '/functions/hint' },
                            { text: 'String', link: '/functions/str' },
                            { text: 'Char', link: '/functions/char' },
                            { text: 'Format', link: '/functions/fmt' },
                        ]
                    }
                ],
                '/patterns/': [
                    {
                        text: 'Patterns',
                        items: [
                            { text: 'ภาพรวม', link: '/patterns/' },
                            { text: 'Error Handling', link: '/patterns/error-handling' },
                            { text: 'Async/Await', link: '/patterns/async' },
                            { text: 'Builder', link: '/patterns/builder' },
                            { text: 'Newtype', link: '/patterns/newtype' },
                            { text: 'Smart Pointers', link: '/patterns/smart-pointers' },
                            { text: 'Iterator', link: '/patterns/iterator' },
                            { text: 'Typestate', link: '/patterns/typestate' },
                            { text: 'Trait Objects', link: '/patterns/trait-objects' },
                            { text: 'Testing', link: '/patterns/testing' },
                            { text: 'Unsafe', link: '/patterns/unsafe' },
                            { text: 'FFI', link: '/patterns/ffi' },
                            { text: 'Lifetime', link: '/patterns/lifetime' },
                        ]
                    }
                ],
            },

            socialLinks: [
                { icon: 'github', link: 'https://github.com/rust-lang/rust' }
            ],

            footer: {
                message: 'เขียนด้วยความรัก',
                copyright: `Copyright © ${new Date().getFullYear()} Rust ฉบับไทย`
            },

            outline: {
                label: 'หัวข้อในหน้านี้'
            },

            docFooter: {
                prev: 'ก่อนหน้า',
                next: 'ถัดไป'
            },

            lastUpdated: {
                text: 'อัปเดตล่าสุด',
                formatOptions: {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                }
            },

            search: {
                provider: 'local',
                options: {
                    translations: {
                        button: {
                            buttonText: 'ค้นหา',
                            buttonAriaLabel: 'ค้นหา'
                        },
                        modal: {
                            noResultsText: 'ไม่พบผลลัพธ์',
                            resetButtonTitle: 'ล้างการค้นหา',
                            footer: {
                                selectText: 'เลือก',
                                navigateText: 'นำทาง',
                                closeText: 'ปิด'
                            }
                        }
                    }
                }
            }
        },

        markdown: {
            lineNumbers: true,
            theme: {
                light: 'github-light',
                dark: 'one-dark-pro'
            },
            config: (md) => {
                // Use container plugin

                const createContainer = (klass, defaultTitle) => {
                    md.use(container, klass, {
                        render: (tokens, idx) => {
                            const token = tokens[idx]
                            const info = token.info.trim().slice(klass.length).trim()
                            if (token.nesting === 1) {
                                const title = info || defaultTitle
                                return `<div class="${klass} custom-block">\n<p class="custom-block-title">${title}</p>\n`
                            } else {
                                return `</div>\n`
                            }
                        }
                    })
                }

                createContainer('best-practice', '💡 Best Practice | แนวทางปฏิบัติที่ดี')
                createContainer('observation', '🧐 Observation | ข้อสังเกต')
                createContainer('caution', '⚠️ Caution | ข้อควรระวัง')
                createContainer('recommendation', '✅ Recommendation | คำแนะนำ')
                createContainer('pitfall', '⛔ Common Pitfalls | ปัญหาที่พบบ่อย')
            }
        },

        lastUpdated: true
    }))
