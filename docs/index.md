---
layout: home

hero:
  name: "Rust ฉบับไทย"
  text: "เรียน Rust แบบสนุก ไม่น่าเบื่อ!"
  tagline: เว็บสอน Rust ภาษาไทย ครบ 49 บทเรียน ตั้งแต่มือใหม่จนถึงมือโปร พร้อม Interactive Playground!
  image:
    src: /logo.svg
    alt: Ferris the Crab
  actions:
    - theme: brand
      text: เริ่มเรียนเลย 🚀
      link: /beginner/
    - theme: alt
      text: ดู Roadmap
      link: /beginner/getting-started

features:
  - icon:
      src: /icons/seedling.svg
    title: ผู้เริ่มต้น (12 บทเรียน)
    details: เริ่มจากศูนย์! Hello World, Variables, Functions, Ownership และอื่นๆ
    link: /beginner/
    linkText: เริ่มเรียน

  - icon:
      src: /icons/tree.svg
    title: ระดับกลาง (19 บทเรียน)
    details: Structs, Traits, Testing, Networking, Serde, Regex และอีกมากมาย!
    link: /intermediate/
    linkText: ไปต่อ

  - icon:
      src: /icons/mountain.svg
    title: ระดับสูง (18 บทเรียน)
    details: Lifetimes, Async, Macros, Web, WASM, FFI, Embedded และ Performance!
    link: /advanced/
    linkText: ท้าทายตัวเอง

  - icon:
      src: /icons/bolt.svg
    title: เร็วจี๊ด ⚡
    details: Rust เร็วพอๆ กับ C/C++ แต่เขียนปลอดภัยกว่าเพราะมี Borrow Checker คอยดูแล

  - icon:
      src: /icons/shield.svg
    title: ปลอดภัยต่อ Memory 🛡️
    details: ไม่มี null pointer, ไม่มี data race - Compiler ช่วยจับ bug ก่อน runtime

  - icon:
      src: /icons/target.svg
    title: ภาษาไทย 100% 🇹🇭
    details: เนื้อหาเป็นภาษาไทยทั้งหมด พร้อม Google Font ไทยที่อ่านง่าย!
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #F74C00 0%, #FF8533 50%, #FFB366 100%);
  
  --vp-home-hero-image-background-image: linear-gradient(135deg, #F74C00 10%, #FF8533 50%, #FFB366 90%);
  --vp-home-hero-image-filter: blur(72px);
}

.VPHero .VPImage {
  max-width: 200px;
  max-height: 200px;
}

@media (min-width: 640px) {
  .VPHero .VPImage {
    max-width: 280px;
    max-height: 280px;
  }
}
</style>

## ทำไมต้องเรียน Rust? 🤔

> "ถ้า C++ คือดาบที่คมมากแต่ตัดมือตัวเองได้ง่าย Rust ก็คือดาบที่คมเท่ากันแต่มีระบบล็อคนิรภัยกันตัดมือ!"

Rust เป็นภาษาที่ได้รับความนิยมสูงสุดจากนักพัฒนาทั่วโลก **8 ปีซ้อน** บน Stack Overflow Survey เพราะ:

| คุณสมบัติ | รายละเอียด |
|-----------|------------|
| **ประสิทธิภาพสูง** | เร็วเท่า C/C++ เพราะ compile เป็น native code |
| **Memory Safety** | ไม่มี garbage collector แต่ปลอดภัยด้วย ownership system |
| **Concurrency** | เขียน multi-thread ได้ง่ายและปลอดภัย |
| **Cargo** | Package manager ที่ดีที่สุดในโลก (ไม่ได้โม้) |
| **Zero-cost Abstractions** | เขียน code สวยๆ ได้โดยไม่สูญเสีย performance |

## ลองเลย! 🎮

:::tip Interactive Playground
คลิกปุ่ม Run เพื่อรันโค้ดได้เลยบน Browser!
:::

<RustPlayground>

```rust
// ลองโค้ดง่ายๆ กันก่อน!
fn main() {
    // สวัสดีชาวโลก!
    println!("สวัสดี Rust! 🦀");
    
    // ลองเล่นกับตัวแปร
    let name = "Ferris"; // ชื่อมาสคอตของ Rust
    println!("ยินดีต้อนรับ {}!", name);
    
    // Pattern matching
    let level = 1;
    match level {
        1 => println!("เริ่มต้น! 🌱"),
        2 => println!("ระดับกลาง! 🌳"),
        3 => println!("ระดับสูง! ⛰️"),
        _ => println!("มาสเตอร์! 🏆"),
    }
}
```

</RustPlayground>

## Roadmap การเรียน 🗺️

```
Beginner (2-3 สัปดาห์) - 12 บทเรียน
   ├── ติดตั้ง Rust 🛠️
   ├── Hello World
   ├── Guessing Game 🎮
   ├── Comments & Docs
   ├── Variables & Types
   ├── Option & Result
   ├── Functions
   ├── Control Flow
   ├── Pattern Matching
   ├── Ownership (สำคัญมาก! 💖)
   └── Debugging
          ↓
Intermediate (3-4 สัปดาห์) - 19 บทเรียน
   ├── Cargo 📦
   ├── Structs & Enums
   ├── Error Handling
   ├── Collections
   ├── Strings
   ├── Modules
   ├── Traits & Generics
   ├── Testing ✅
   ├── Iterators
   ├── File I/O
   ├── Networking 🌐
   ├── Date & Time
   ├── Regex
   └── Serde & JSON
          ↓
Advanced (4-6 สัปดาห์) - 18 บทเรียน
   ├── Lifetimes
   ├── Smart Pointers
   ├── Memory Model 🧠
   ├── Interior Mutability
   ├── Concurrency 🧵
   ├── Async/Await
   ├── Macros
   ├── CLI Development 💻
   ├── Web Development 🌐
   ├── WebAssembly 🕸️
   ├── FFI
   ├── Embedded 🔌
   └── Performance ⚡
          ↓
      Rust Master! 🏆
```

---

<div style="text-align: center; margin-top: 40px;">

### พร้อมแล้วใช่ไหม? 💪

[เริ่มเรียน Rust เลย!](/beginner/getting-started)

</div>
