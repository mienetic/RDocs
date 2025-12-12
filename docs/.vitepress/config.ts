import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

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
      },

      editLink: {
        pattern: 'https://github.com/user/repo/edit/main/docs/:path',
        text: 'แก้ไขหน้านี้บน GitHub'
      }
    },

    markdown: {
      lineNumbers: true,
      theme: {
        light: 'github-light',
        dark: 'one-dark-pro'
      }
    },

    lastUpdated: true
  })
)
