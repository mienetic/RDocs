# Display Traits

`Debug`, `Display` สำหรับแสดงผล! 

---

## Debug - `{:?}`

<RustPlayground>

```rust
#[derive(Debug)]
struct Point {
 x: i32,
 y: i32,
}

#[derive(Debug)]
struct Rectangle {
 top_left: Point,
 bottom_right: Point,
}

fn main() {
 let p = Point { x: 10, y: 20 };
 let rect = Rectangle {
 top_left: Point { x: 0, y: 0 },
 bottom_right: Point { x: 100, y: 100 },
 };
 
 // {:?} - Debug format
 println!("Point: {:?}", p);
 println!("Rectangle: {:?}", rect);
 
 // {:#?} - Pretty print
 println!("\nPretty print:");
 println!("{:#?}", rect);
}
```

</RustPlayground>

---

## Display - `{}`

<RustPlayground>

```rust
use std::fmt;

struct Point {
 x: i32,
 y: i32,
}

impl fmt::Display for Point {
 fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
 write!(f, "({}, {})", self.x, self.y)
 }
}

impl fmt::Debug for Point {
 fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
 write!(f, "Point {{ x: {}, y: {} }}", self.x, self.y)
 }
}

fn main() {
 let p = Point { x: 10, y: 20 };
 
 // {} uses Display
 println!("Display: {}", p);
 
 // {:?} uses Debug
 println!("Debug: {:?}", p);
 
 // Display ใช้กับ .to_string()
 let s = p.to_string();
 println!("to_string: {}", s);
}
```

</RustPlayground>

::: best-practice
**Implement `Display` แล้วได้ `ToString` ฟรี!**
เมื่อคุณ implement `Display` trait, Rust จะแถม `ToString` trait (และ method `.to_string()`) ให้โดยอัตโนมัติ
ไม่ต้องไป implement `ToString` เองโดยตรง!
:::

---

## Error Display

<RustPlayground>

```rust
use std::fmt;

#[derive(Debug)]
struct MyError {
 code: i32,
 message: String,
}

impl fmt::Display for MyError {
 fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
 write!(f, "Error {}: {}", self.code, self.message)
 }
}

impl std::error::Error for MyError {}

fn might_fail(fail: bool) -> Result<String, MyError> {
 if fail {
 Err(MyError {
 code: 404,
 message: "Not found".to_string(),
 })
 } else {
 Ok("Success!".to_string())
 }
}

fn main() {
 match might_fail(true) {
 Ok(s) => println!("{}", s),
 Err(e) => println!("Display: {}", e),
 }
}
```

</RustPlayground>

---

## Quick Reference

### Display Traits
| Trait | Format | Derivable | คำอธิบาย |
|-------|--------|-----------|---------|
| `Debug` | `{:?}` | | for developers |
| `Display` | `{}` | | for users |

### Format Specifiers
| Specifier | คำอธิบาย |
|-----------|---------|
| `{}` | Display |
| `{:?}` | Debug |
| `{:#?}` | Pretty Debug |
| `{:p}` | Pointer |
| `{:b}` | Binary |
| `{:x}` | Hex lowercase |
| `{:X}` | Hex uppercase |
| `{:e}` | Scientific |

### Tips
- ใช้ `#[derive(Debug)]` ทุกที่
- Implement `Display` สำหรับ user-facing output
- Error types ควรมีทั้ง `Debug` และ `Display`

---

[← Iterator](./iterator) | [I/O →](./io)
