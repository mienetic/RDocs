# Format Functions (std::fmt)

Functions สำหรับ Formatting และ Writing! 

---

## format

สร้าง formatted String (เหมือน format! macro)

<RustPlayground>

```rust
use std::fmt;

fn main() {
 // ใช้ format! macro (recommended)
 let s = format!("Hello, {}!", "World");
 println!("{}", s);
 
 // Format numbers
 let num = format!("{:08b}", 42); // Binary with padding
 println!("Binary: {}", num);
 
 let hex = format!("{:#x}", 255); // Hex with prefix
 println!("Hex: {}", hex);
 
 // Multiple values
 let msg = format!("{} + {} = {}", 2, 3, 5);
 println!("{}", msg);
}
```

</RustPlayground>

---

## write

เขียน formatted data ลง Writer

<RustPlayground>

```rust
use std::fmt::Write;

fn main() {
 let mut buffer = String::new();
 
 // write! เขียนลง buffer
 write!(buffer, "Hello, ").unwrap();
 write!(buffer, "{}!", "World").unwrap();
 
 println!("Buffer: {}", buffer);
 
 // writeln! เพิ่ม newline
 let mut log = String::new();
 writeln!(log, "Line 1").unwrap();
 writeln!(log, "Line 2").unwrap();
 
 println!("Log:\n{}", log);
}
```

</RustPlayground>

---

## from_fn

สร้าง Display implementation จาก closure

<RustPlayground>

```rust
use std::fmt;

fn main() {
 // from_fn สร้าง type ที่ Display ได้
 let display = fmt::from_fn(|f| {
 write!(f, "Custom Display: {}", 42)
 });
 
 println!("{}", display);
 
 // ใช้ใน struct
 let custom = fmt::from_fn(|f| {
 write!(f, "[{} × {}]", 10, 20)
 });
 
 println!("Size: {}", custom);
}
```

</RustPlayground>

---

## Debug vs Display

<RustPlayground>

```rust
#[derive(Debug)]
struct Point {
 x: i32,
 y: i32,
}

use std::fmt;

impl fmt::Display for Point {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "({}, {})", self.x, self.y)
 }
}

fn main() {
 let p = Point { x: 10, y: 20 };
 
 println!("Debug: {:?}", p); // Debug trait
 println!("Display: {}", p); // Display trait
 println!("Pretty: {:#?}", p); // Pretty Debug
}
```

</RustPlayground>

---

## Quick Reference

| Macro/Function | คำอธิบาย | Return Type |
|----------------|---------|-------------|
| `format!(...)` | สร้าง String | `String` |
| `write!(buf, ...)` | เขียนลง buffer | `Result` |
| `writeln!(buf, ...)` | เขียน + newline | `Result` |
| `from_fn(f)` | Custom Display | `FromFn<F>` |

---

[← Char](./char) | [Index →](./index)
