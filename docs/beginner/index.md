# ผู้เริ่มต้น (Beginner)

ยินดีต้อนรับสู่โลกของ Rust! 

ไม่ว่าจะไม่เคยเขียนโปรแกรมมาก่อน หรือเป็นโปรแกรมเมอร์ที่อยากลองของใหม่ มาถูกที่แล้ว! เราจะพาคุณเข้าใจพื้นฐานของ Rust แบบสนุกๆ ไม่น่าเบื่อ! 

:::tip เคล็ดลับสำหรับมือใหม่ 
อย่ารีบนะ! Rust มีแนวคิดบางอย่างที่แตกต่างจากภาษาอื่น โดยเฉพาะเรื่อง **Ownership** ค่อยๆ ทำความเข้าใจ แล้วจะติดใจ!
:::

## สิ่งที่จะได้เรียนรู้ (12 บทเรียน)

| บทเรียน | เรียนเรื่องอะไร | เวลา |
|---------|-----------------|------|
| [ติดตั้ง Rust](./getting-started) | ติดตั้ง Rust + ตั้งค่า environment | ~15 นาที |
| [Hello World](./hello-world) | เขียนโปรแกรมแรก! | ~20 นาที |
| [Guessing Game](./guessing-game) | สร้างเกมทายตัวเลข | ~30 นาที |
| [Comments & Docs](./comments) | เขียน comments และ documentation | ~15 นาที |
| [ตัวแปร](./variables) | let, mut, types | ~30 นาที |
| [Option & Result](./option-result) | จัดการค่าที่อาจมีหรือไม่มี | ~25 นาที |
| [ฟังก์ชัน](./functions) | สร้างและใช้งานฟังก์ชัน | ~25 นาที |
| [Control Flow](./control-flow) | if, loop, match | ~35 นาที |
| [Pattern Matching](./patterns) | destructuring, guards, bindings | ~30 นาที |
| [Ownership](./ownership) | หัวใจสำคัญของ Rust! | ~45 นาที |
| [Debugging](./debugging) | dbg!, println!, VS Code debugger | ~20 นาที |

## หลังจบระดับนี้คุณจะ...

ติดตั้งและใช้งาน Rust ได้ 
เขียนโปรแกรมพื้นฐานเป็น 
เข้าใจระบบ Type ของ Rust 
ใช้ Option และ Result ได้ 
เข้าใจ Ownership (เจ๋งมาก!) 
Debug โค้ดเป็น 
พร้อมก้าวสู่ระดับ Intermediate! 

## Rust ยากไหม? 

> "Rust มี learning curve ที่สูงกว่าภาษาอื่น แต่พอเข้าใจแล้ว... มันจะเปลี่ยนวิธีคิดเรื่องโปรแกรมของคุณไปเลย!"

```rust
// ไม่ต้องกลัว! Rust อ่านง่ายนะ
fn greet(name: &str) {
 println!("สวัสดี {}! ยินดีต้อนรับสู่ Rust ", name);
}

fn main() {
 greet("มือใหม่");
}
```

:::warning Compiler ดุแต่หวังดี! 
Rust Compiler จะบ่นเยอะมาก (error แดงลาม) แต่จริงๆ มันช่วยคุณนะ! 

ลองอ่าน error message ดีๆ มันจะบอกวิธีแก้ไขให้ด้วย เหมือนครูที่ดุแต่หวังดี!
:::

---

พร้อมแล้วใช่ไหม? 

[ไปติดตั้ง Rust กันเลย!](./getting-started)
