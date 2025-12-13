
import { getHighlighter } from 'shiki'

const code = `
// ตัวอย่าง async ง่ายๆ
println!("Result: {}", result);
`

async function main() {
    try {
        const highlighter = await getHighlighter({
            themes: ['github-light'],
            langs: ['rust']
        })

        const html = highlighter.codeToHtml(code, { lang: 'rust', theme: 'github-light' })
        console.log(html)
    } catch (e) {
        console.error(e)
    }
}

main()
