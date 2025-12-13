# Comments & Documentation

เขียน comments และ documentation อย่างมืออาชีพ! 

:::tip Documentation is First-Class in Rust!
Rust มีระบบ documentation ที่ดีมาก - `rustdoc` สร้าง documentation สวยๆ จาก comments อัตโนมัติ!
:::

---

## 1. Comments

### 1.1 Line Comments

<RustPlayground>

```rust
fn main() {
 // นี่คือ line comment
 let x = 5; // comment ท้ายบรรทัดก็ได้
 
 // หลายบรรทัด
 // ก็ใช้ // ซ้ำได้
 let y = 10;
 
 println!("x = {}, y = {}", x, y);
}
```

</RustPlayground>

### 1.2 Block Comments

<RustPlayground>

```rust
fn main() {
 /* นี่คือ block comment
 สามารถเขียนได้หลายบรรทัด
 โดยไม่ต้อง // ทุกบรรทัด */
 
 let x = /* comment ตรงกลางก็ได้ */ 42;
 
 /* 
 * แบบมีดาวสวยๆ
 * ก็นิยมใช้กัน
 */
 
 println!("x = {}", x);
}
```

</RustPlayground>

---

## 2. Documentation Comments

### 2.1 Outer Doc Comments (`///`)

<RustPlayground>

```rust
/// คำนวณพื้นที่สี่เหลี่ยม
/// 
/// # Arguments
/// 
/// * `width` - ความกว้าง
/// * `height` - ความสูง
/// 
/// # Returns
/// 
/// พื้นที่ของสี่เหลี่ยม
/// 
/// # Examples
/// 
/// ```
/// let area = calculate_area(5, 10);
/// assert_eq!(area, 50);
/// ```
fn calculate_area(width: u32, height: u32) -> u32 {
 width * height
}

fn main() {
 let area = calculate_area(5, 10);
 println!("Area: {}", area);
}
```

</RustPlayground>

### 2.2 Inner Doc Comments (`//!`)

```rust
//! # My Crate
//! 
//! `my_crate` เป็น crate สำหรับทำ xxx
//! 
//! ## Features
//! 
//! - Feature 1
//! - Feature 2
//! 
//! ## Quick Start
//! 
//! ```rust
//! use my_crate::do_something;
//! do_something();
//! ```

/// Function documentation here
pub fn do_something() {
 // ...
}
```

---

## 3. Documentation Sections

### 3.1 มาตรฐานที่ใช้กัน

```rust
/// Brief description (บรรทัดแรก)
/// 
/// Longer description here. สามารถเขียนยาวได้
/// หลายบรรทัด
/// 
/// # Arguments
/// 
/// * `name` - อธิบาย parameter
/// * `age` - อธิบาย parameter
/// 
/// # Returns
/// 
/// อธิบายว่า return อะไร
/// 
/// # Panics
/// 
/// อธิบายว่า panic เมื่อไหร่ (ถ้ามี)
/// 
/// # Errors
/// 
/// อธิบาย error cases (สำหรับ Result)
/// 
/// # Safety
/// 
/// อธิบาย safety requirements (สำหรับ unsafe fn)
/// 
/// # Examples
/// 
/// ```
/// // ตัวอย่างการใช้งาน
/// let result = my_function("Alice", 30);
/// ```
pub fn my_function(name: &str, age: u32) -> String {
 format!("{} is {} years old", name, age)
}
```

### 3.2 Doc Sections ที่นิยมใช้

| Section | ใช้เมื่อ |
|---------|---------|
| `# Arguments` | อธิบาย parameters |
| `# Returns` | อธิบาย return value |
| `# Examples` | ตัวอย่างการใช้งาน |
| `# Panics` | เงื่อนไขที่จะ panic |
| `# Errors` | Error cases (Result) |
| `# Safety` | ข้อกำหนดสำหรับ unsafe |

---

## 4. Doc Tests

### 4.1 ตัวอย่างที่รัน test ได้!

<RustPlayground>

```rust
/// เพิ่มค่า 1
/// 
/// # Examples
/// 
/// ```
/// let x = add_one(5);
/// assert_eq!(x, 6);
/// ```
/// 
/// ```
/// // ค่าลบก็ได้
/// let y = add_one(-1);
/// assert_eq!(y, 0);
/// ```
fn add_one(x: i32) -> i32 {
 x + 1
}

fn main() {
 println!("5 + 1 = {}", add_one(5));
}
```

</RustPlayground>

### 4.2 รัน Doc Tests

```bash
cargo test --doc
```

### 4.3 ซ่อนบรรทัดใน Examples

```rust
/// # Examples
/// 
/// ```
/// # // บรรทัดที่ขึ้นต้นด้วย # จะซ่อนใน docs แต่รันใน test
/// # fn main() {
/// let x = 42;
/// assert_eq!(x, 42);
/// # }
/// ```
```

---

## 5. สร้าง Documentation

### 5.1 สร้างและเปิด Docs

```bash
# สร้าง documentation
cargo doc

# สร้างและเปิดใน browser
cargo doc --open

# รวม dependencies ด้วย
cargo doc --document-private-items
```

### 5.2 Output

Documentation จะอยู่ใน `target/doc/`

---

## 6. Markdown in Docs

<RustPlayground>

```rust
/// # Heading 1
/// ## Heading 2
/// ### Heading 3
/// 
/// **Bold** และ *Italic*
/// 
/// - List item 1
/// - List item 2
/// 
/// 1. Numbered item
/// 2. Numbered item
/// 
/// `inline code` และ
/// 
/// ```
/// code block
/// ```
/// 
/// [Link](https://rust-lang.org)
/// 
/// | Column 1 | Column 2 |
/// |----------|----------|
/// | Cell 1 | Cell 2 |
fn example() {}

fn main() {
 println!("Check the docs!");
}
```

</RustPlayground>

---

## 7. Best Practices

### 7.1 Do's 

```rust
/// สั้น กระชับ ได้ใจความ (บรรทัดแรก)
/// 
/// รายละเอียดเพิ่มเติมถ้าจำเป็น
/// 
/// # Examples
/// 
/// ```
/// // ตัวอย่างที่ใช้งานได้จริง
/// ```
pub fn good_docs() {}
```

### 7.2 Don'ts 

```rust
// ไม่มี documentation
pub fn no_docs() {}

// Documentation ไม่มีประโยชน์
/// This function does something
pub fn useless_docs() {}

// ไม่มี Examples
/// คำนวณค่าบางอย่าง
pub fn no_examples() {}
```

---

## 8. สรุป

| Syntax | Purpose |
|--------|---------|
| `//` | Line comment |
| `/* */` | Block comment |
| `///` | Outer doc comment |
| `//!` | Inner doc comment (crate/module) |
| `# Section` | Doc section |
| ` ``` ` | Code example (tested!) |
| `cargo doc` | Generate documentation |

---

[บทถัดไป: Variables](/beginner/variables)
