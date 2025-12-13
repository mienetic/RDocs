# ติดตั้ง Rust

ยินดีต้อนรับสู่โลกของ Rust! 

ก่อนจะเริ่มเขียนโค้ดสุดเท่ได้ เราต้องติดตั้ง Rust ก่อนนะ ไม่ยากเลย แค่ไม่กี่นาที!

:::tip เกร็ดน่ารู้ 
ทำไมถึงใช้ปู เป็นสัญลักษณ์? เพราะ Rustacean (ชาว Rust) มาจาก Crustacean (สัตว์จำพวกปู)! เก๋ป่ะ~
:::

---

## ติดตั้ง Rustup

**Rustup** คือเครื่องมือจัดการ Rust version เหมือน nvm ของ Node.js นั่นแหละ!

### บน Linux และ macOS

เปิด Terminal แล้วก็อปปี้วางเลย:

```bash
# คำสั่งมหัศจรรย์ ติดตั้ง Rust ได้ในบรรทัดเดียว! 
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

:::tip ไม่ต้องกลัวนะ!
คำสั่งนี้ดาวน์โหลด script อย่างเป็นทางการจาก Rust team มาให้เลย ปลอดภัย 100% ไม่มีไวรัสแน่นอน! 
:::

หลังจากรันเสร็จ ให้ restart terminal หรือรันนี่:

```bash
source $HOME/.cargo/env
```

### บน Windows

1. ไปที่ [rustup.rs](https://rustup.rs) 
2. กด Download แล้วรัน `rustup-init.exe`
3. กด Enter ไปเรื่อยๆ (default ดีอยู่แล้ว!)
4. Restart Command Prompt

:::warning สำหรับ Windows User! 
อาจต้องติดตั้ง [Visual Studio C++ Build tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) ด้วยนะ เลือก "Desktop development with C++" ไว้
:::

::: pitfall
**ปัญหาที่พบบ่อย: PATH ไม่ขึ้น**
ถ้าพิมพ์ `cargo` ไม่เจอหลังติดตั้ง ให้ลองปิด Terminal แล้วเปิดใหม่ หรือ log out/log in ใหม่อีกรอบครับ มันเป็นเรื่องปกติที่ Path อาจจะยังไม่อัปเดตทันที
:::

---

## เช็คว่าติดตั้งสำเร็จหรือยัง

```bash
# เช็คเวอร์ชัน Rust
rustc --version
# ถ้าเห็น: rustc 1.92.0 (xxx) = สำเร็จ!

# เช็คเวอร์ชัน Cargo (ตัวจัดการ package)
cargo --version
# ถ้าเห็น: cargo 1.92.0 (xxx) = เยี่ยม!
```

ถ้าเห็นเลข version แสดงว่า **ติดตั้งสำเร็จแล้ว!** 

---

## มีอะไรติดมาบ้าง?

หลังติดตั้ง Rust คุณจะได้เครื่องมือ 3 ตัว:

| เครื่องมือ | ทำอะไร? | เทียบกับภาษาอื่น |
|-----------|---------|-----------------|
| `rustc` | Compiler - แปลงโค้ดเป็นโปรแกรม | เหมือน `gcc` |
| `cargo` | ตัวจัดการ project + package | เหมือน `npm` + `webpack` รวมร่าง! |
| `rustup` | จัดการ Rust version | เหมือน `nvm` |

:::tip แทบไม่ได้ใช้ rustc ตรงๆ เลย!
ส่วนใหญ่เราจะใช้ `cargo` เกือบทุกอย่าง มันดีมากจริงๆ จนติดใจ 
:::

---

## Cargo คือเพื่อนที่ดีที่สุดของเรา!

Cargo เป็น package manager ที่ดีที่สุดที่เคยใช้มา (จริงๆ นะ ไม่ได้พูดเอง!)

```bash
# สร้าง project ใหม่
cargo new my_awesome_project
# สร้างโฟลเดอร์ + ไฟล์ให้หมดเลย!

# รัน project (build + run ในคำสั่งเดียว)
cargo run
# สะดวกมากกก ไม่ต้อง build แยก!

# เช็ค error โดยไม่ต้อง build จริง (เร็วมาก!)
cargo check
# ใช้บ่อยมาก เวลากำลังเขียนโค้ด

# Build แบบ release (optimize เต็มที่)
cargo build --release
# ใช้ตอนจะ deploy จริง

# Format โค้ดให้สวย
cargo fmt
# ไม่ต้องเถียงกันเรื่อง code style อีกต่อไป!

# ตรวจสอบ best practices
cargo clippy
# Lint ที่ฉลาดมาก แนะนำให้ใช้!
```

---

## เปรียบเทียบกับภาษาอื่น

| ทำอะไร | Cargo (Rust) | npm (Node) | pip (Python) |
|--------|--------------|------------|--------------|
| สร้าง project | `cargo new` | `npm init` | ไม่มี |
| ติดตั้ง package | `cargo add` | `npm install` | `pip install` |
| Build | `cargo build` | `npm run build` | ไม่ต้อง |
| Run | `cargo run` | `npm start` | `python app.py` |
| Test | `cargo test` | `npm test` | `pytest` |
| Format | `cargo fmt` | `prettier` | `black` |

สังเกตไหมว่า Cargo ทำได้หมดเลย! 

---

## ตั้งค่า Edition 2024

Rust 2024 Edition เป็นเวอร์ชันใหม่ล่าสุด! เวลาสร้าง project ใหม่จะได้อัตโนมัติ แต่เช็คใน `Cargo.toml` ได้:

```toml
[package]
name = "my_project"
version = "0.1.0"
edition = "2024" # ใหม่ล่าสุด!

[dependencies]
# เพิ่ม package ที่นี่
```

---

## แนะนำ IDE (สำคัญมาก!)

### VS Code + rust-analyzer = 

1. ติดตั้ง [VS Code](https://code.visualstudio.com/)
2. ติดตั้ง extension **rust-analyzer**

```bash
code --install-extension rust-lang.rust-analyzer
```

**ทำไมต้องใช้ rust-analyzer?**

| ฟีเจอร์ | ทำอะไรได้ |
|--------|----------|
| Auto-complete | พิมพ์ไม่กี่ตัว มันเดาให้เลย! |
| Go to definition | Ctrl+Click ไปดู source code ได้ |
| Inline type hints | เห็น type โดยไม่ต้องเขียนเอง |
| Error checking | เช็ค error ขณะพิมพ์ (ไม่ต้องรอ compile!) |
| Quick fixes | กด Ctrl+. แก้ error อัตโนมัติ |

:::tip ความลับ! 
rust-analyzer ฉลาดขนาดที่ว่า... บางทีมันรู้ว่าเราจะพิมพ์อะไรก่อนเราจะรู้ตัวอีก! 
:::

---

## อัปเดต Rust

Rust ออกเวอร์ชันใหม่ทุก 6 สัปดาห์ อัปเดตง่ายมาก:

```bash
# อัปเดตเป็นเวอร์ชันล่าสุด
rustup update

# ดูว่าติดตั้งอะไรไว้บ้าง
rustup show
```

---

## สรุป

ติดตั้ง Rust สำเร็จ 
รู้จัก `cargo` เพื่อนรักของเรา 
ตั้งค่า VS Code + rust-analyzer 
พร้อมเขียนโปรแกรมแรก! 

---

พร้อมแล้วใช่ไหม? ไปเขียน Hello World กันเลย! 

[บทถัดไป: Hello World!](./hello-world)
