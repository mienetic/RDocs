# Hello World!

ได้เวลาเขียนโปรแกรม Rust แรกของเรากันแล้ว!

## สร้าง Project ใหม่

ใช้ Cargo สร้าง project:

```bash
# สร้าง project ชื่อ hello_rust
cargo new hello_rust

# เข้าไปใน folder
cd hello_rust
```

คำสั่งนี้จะสร้างโครงสร้าง project ให้เราอัตโนมัติ:

```
hello_rust/
 Cargo.toml # ไฟล์ config ของ project
 src/
 main.rs # โค้ดหลักของเรา
```

## โครงสร้างไฟล์

### Cargo.toml

นี่คือไฟล์ config หลักของ project:

```toml
[package]
name = "hello_rust" # ชื่อ project
version = "0.1.0" # เวอร์ชัน
edition = "2024" # Rust edition ที่ใช้

[dependencies]
# dependencies จะถูกเพิ่มที่นี่
```

:::tip TOML คืออะไร?
TOML (Tom's Obvious Minimal Language) เป็นรูปแบบไฟล์ config ที่อ่านง่าย
เหมือนกับ `package.json` ของ npm หรือ `pyproject.toml` ของ Python!
:::

### src/main.rs

นี่คือโค้ดที่ Cargo สร้างให้:

<RustPlayground>

```rust
fn main() {
 println!("Hello, world!");
}
```

</RustPlayground>

## ทำความเข้าใจโค้ด

มาดูทีละส่วน:

<RustPlayground>

```rust
// fn = function (ฟังก์ชัน)
// main = ชื่อฟังก์ชัน (ฟังก์ชันหลักที่โปรแกรมเริ่มทำงาน)
fn main() {
 // println! = macro สำหรับพิมพ์ข้อความ
 // ! หมายความว่านี่คือ macro ไม่ใช่ฟังก์ชันธรรมดา
 println!("Hello, world!");
}
```

</RustPlayground>

### ส่วนประกอบของโค้ด

| ส่วนประกอบ | ความหมาย | เทียบกับภาษาอื่น |
|-----------|----------|------------------|
| `fn` | keyword สำหรับประกาศฟังก์ชัน | `function` (JS), `def` (Python) |
| `main` | ฟังก์ชันหลัก (entry point) | เหมือนกันทุกภาษา |
| `()` | ไม่มี parameters | เหมือนกัน |
| `{}` | body ของฟังก์ชัน | เหมือนกัน |
| `println!` | macro สำหรับพิมพ์ + ขึ้นบรรทัดใหม่ | `console.log` (JS), `print` (Python) |
| `;` | จบ statement | เหมือน C/C++/Java |

## รันโปรแกรม

```bash
# วิธีที่ 1: ใช้ cargo run (แนะนำ!)
cargo run

# ผลลัพธ์:
# Compiling hello_rust v0.1.0 (/path/to/hello_rust)
# Finished dev [unoptimized + debuginfo] target(s) in 0.50s
# Running `target/debug/hello_rust`
# Hello, world!
```

:::info cargo run ทำอะไรบ้าง?
1. Compile โค้ด (`cargo build`)
2. รันโปรแกรมที่ compile แล้ว
3. ทั้งหมดในคำสั่งเดียว!
:::

## มาแต่งโค้ดกันเถอะ!

เปิดไฟล์ `src/main.rs` แล้วลองแก้ไข:

<RustPlayground>

```rust
fn main() {
 // ทักทายเป็นภาษาไทย!
 println!("สวัสดีชาว Rust!");
 
 // พิมพ์หลายบรรทัด
 println!("ยินดีต้อนรับสู่การเขียนโปรแกรมภาษา Rust");
 println!("ภาษาที่เร็วและปลอดภัยที่สุดในโลก!");
 
 // พิมพ์ตัวเลข
 println!("1 + 1 = {}", 1 + 1);
 
 // พิมพ์หลายค่า
 println!("{} + {} = {}", 2, 3, 2 + 3);
}
```

</RustPlayground>

## รู้จัก println! มากขึ้น

`println!` เป็น macro ที่มีความสามารถเยอะมาก

### การใส่ค่าพื้นฐาน (Basic Formatting)

<RustPlayground>

```rust
fn main() {
 // แบบธรรมดา
 println!("Hello!");
 
 // ใส่ค่าด้วย {}
 let name = "Ferris";
 println!("Hello, {}!", name);
 
 // หลายค่า
 println!("{} loves {}!", "I", "Rust");
 
 // ระบุลำดับ
 println!("{1} {0}!", "World", "Hello");
 
 // ตั้งชื่อ
 println!("{language} is {feeling}!", language="Rust", feeling="awesome");
 
 // Debug format (แสดงค่าแบบ debug)
 println!("{:?}", [1, 2, 3]);
 
 // Pretty debug (อ่านง่ายกว่า)
 println!("{:#?}", [1, 2, 3]);
}
```

</RustPlayground>

### Format Specifiers

#### แสดงตัวเลขในฐานต่างๆ

<RustPlayground>

```rust
fn main() {
 let num = 42;
 
 println!("Decimal (ฐาน 10): {}", num);
 println!("Binary (ฐาน 2): {:b}", num); // 101010
 println!("Octal (ฐาน 8): {:o}", num); // 52
 println!("Hex lower (ฐาน 16): {:x}", num); // 2a
 println!("Hex upper (ฐาน 16): {:X}", num); // 2A
}
```

</RustPlayground>

#### จัดรูปแบบตัวเลขทศนิยม

<RustPlayground>

```rust
fn main() {
 let pi = 3.14159265359;
 
 println!("Default: {}", pi); // 3.14159265359
 println!("2 decimals: {:.2}", pi); // 3.14
 println!("5 decimals: {:.5}", pi); // 3.14159
 println!("0 decimals: {:.0}", pi); // 3
 
 // Width + precision
 println!("Width 10: {:10.2}", pi); // 3.14
}
```

</RustPlayground>

#### Padding และ Alignment

<RustPlayground>

```rust
fn main() {
 // Padding ด้วย 0
 println!("Pad zeros: {:05}", 42); // 00042
 println!("Pad zeros: {:08}", 255); // 00000255
 
 // Alignment
 let text = "Rust";
 println!("Right align: {:>10}", text); // Rust
 println!("Left align: {:<10}", text); // Rust 
 println!("Center: {:^10}", text); // Rust 
 
 // Custom fill character
 println!("Fill dash: {:->10}", text); // ------Rust
 println!("Fill star: {:*<10}", text); // Rust******
}
```

</RustPlayground>

#### Debug และ Pretty Print

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 let person = ("Alice", 30, true);
 
 // {:?} = Debug format
 println!("Debug: {:?}", numbers);
 println!("Debug: {:?}", person);
 
 // {:#?} = Pretty Debug (อ่านง่ายกว่า)
 println!("Pretty:\n{:#?}", numbers);
}
```

</RustPlayground>

### สรุป Format ที่ใช้บ่อย

| Format | ความหมาย | ตัวอย่าง |
|--------|---------|---------|
| `{}` | Display format | `42` |
| `{:?}` | Debug format | `[1, 2, 3]` |
| `{:#?}` | Pretty debug | แบ่งบรรทัด |
| `{:b}` | Binary | `101010` |
| `{:x}` | Hex lowercase | `2a` |
| `{:X}` | Hex uppercase | `2A` |
| `{:.2}` | 2 decimal places | `3.14` |
| `{:05}` | Pad with zeros | `00042` |
| `{:>10}` | Right align | ` text` |
| `{:<10}` | Left align | `text ` |
| `{:^10}` | Center | ` text ` |

### เปรียบเทียบ Print กับภาษาอื่น

| Rust | JavaScript | Python | C |
|------|------------|--------|---|
| `println!("Hi")` | `console.log("Hi")` | `print("Hi")` | `printf("Hi\n")` |
| `println!("{}", x)` | `` console.log(`${x}`) `` | `print(f"{x}")` | `printf("%d", x)` |
| `print!("Hi")` | `process.stdout.write("Hi")` | `print("Hi", end="")` | `printf("Hi")` |
| `eprintln!("Err")` | `console.error("Err")` | `print("Err", file=sys.stderr)` | `fprintf(stderr, "Err")` |

## print! vs println!

<RustPlayground>

```rust
fn main() {
 // print! ไม่ขึ้นบรรทัดใหม่
 print!("Hello ");
 print!("World");
 println!("!"); // ขึ้นบรรทัดใหม่ตรงนี้
 
 // ผลลัพธ์: Hello World!
}
```

</RustPlayground>

## Comments

<RustPlayground>

```rust
fn main() {
 // นี่คือ single-line comment
 // ใช้ // นำหน้า
 
 /*
 นี่คือ multi-line comment
 ใช้ได้หลายบรรทัด
 เหมาะกับอธิบายยาวๆ
 */
 
 println!("Comments ไม่ถูกรัน!");
}

/// นี่คือ documentation comment
/// จะถูกใช้สร้าง documentation อัตโนมัติ
/// รองรับ Markdown!
fn documented_function() {}

//! นี่คือ inner doc comment
//! ใช้อธิบาย module หรือ crate ทั้งหมด
```

</RustPlayground>

## cargo check vs cargo build

| คำสั่ง | ทำอะไร | ความเร็ว | ผลลัพธ์ |
|-------|-------|---------|--------|
| `cargo check` | เช็ค error เท่านั้น | เร็วมาก | ไม่มี executable |
| `cargo build` | Compile แบบ debug | ปานกลาง | executable ใน target/debug |
| `cargo build --release` | Compile แบบ optimized | ช้า | executable ใน target/release |

:::tip ใช้ `cargo check` บ่อยๆ
ตอนเขียนโค้ด ใช้ `cargo check` จะเร็วกว่า `cargo build` มาก
เพราะมันแค่เช็ค error โดยไม่สร้างไฟล์ executable
:::

## ลองทำให้ Error ดูสิ!

Rust Compiler มี error message ที่ดีมาก ลองทำให้ error:

```rust
fn main() {
 // ลืมใส่ ;
 println!("Hello")
}
```

Compiler จะบอก:

```
error: expected `;`, found `}`
 --> src/main.rs:3:23
 |
3 | println!("Hello")
 | ^ help: add `;` here
```

:::info Rust Compiler เป็นเพื่อน!
Error message ของ Rust:
- บอกตำแหน่งที่ผิด
- อธิบายว่าผิดอะไร
- แนะนำวิธีแก้ (help)

อ่านดีๆ แล้วจะแก้ได้ง่าย!
:::

## สรุป

ในบทนี้เราได้เรียนรู้:

- สร้าง project ด้วย `cargo new`
- โครงสร้าง project (Cargo.toml, src/main.rs)
- ฟังก์ชัน `main()` คือจุดเริ่มต้นของโปรแกรม
- ใช้ `println!` macro พิมพ์ข้อความ
- รันโปรแกรมด้วย `cargo run`
- Rust Compiler error message ช่วยเราได้!

---

ต่อไปเราจะเรียนเรื่องตัวแปรและชนิดข้อมูลกัน!

[บทถัดไป: ตัวแปรและชนิดข้อมูล](./variables)
