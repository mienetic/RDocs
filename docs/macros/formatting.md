# Formatting Macros - จัดรูปแบบ

`format!`, `write!`, `writeln!` สำหรับสร้างและเขียน String! 

---

## format! - สร้าง String

<RustPlayground>

```rust
fn main() {
 // สร้าง String จาก format
 let s = format!("Hello, {}!", "World");
 println!("{}", s);
 
 // หลายค่า
 let info = format!("Name: {}, Age: {}", "Alice", 30);
 println!("{}", info);
 
 // Debug format
 let debug = format!("{:?}", vec![1, 2, 3]);
 println!("{}", debug);
 
 // Named arguments
 let msg = format!("{name} scored {score}%", 
 name = "Bob", 
 score = 95);
 println!("{}", msg);
}
```

</RustPlayground>

---

## format! vs println!

<RustPlayground>

```rust
fn main() {
 let name = "Rust";
 
 // println! พิมพ์ทันที
 println!("Hello, {}!", name);
 
 // format! return String เก็บไว้ใช้ทีหลัง
 let greeting = format!("Hello, {}!", name);
 println!("{}", greeting);
 
 // ใช้ format! เมื่อต้องการ String
 fn greet(msg: String) {
 println!("Greeting: {}", msg);
 }
 greet(format!("Welcome, {}!", name));
}
```

</RustPlayground>

---

## write! - เขียนลง buffer

<RustPlayground>

```rust
use std::fmt::Write;

fn main() {
 let mut buffer = String::new();
 
 // write! เขียนลง buffer ไม่ขึ้นบรรทัดใหม่
 write!(buffer, "Hello").unwrap();
 write!(buffer, ", ").unwrap();
 write!(buffer, "World!").unwrap();
 
 println!("buffer: {}", buffer);
 
 // ล้าง buffer
 buffer.clear();
 
 // สร้างข้อความซับซ้อน
 for i in 1..=3 {
 write!(buffer, "[{}] ", i).unwrap();
 }
 println!("buffer: {}", buffer);
}
```

</RustPlayground>

---

## writeln! - เขียนลง buffer + newline

<RustPlayground>

```rust
use std::fmt::Write;

fn main() {
 let mut log = String::new();
 
 // writeln! เพิ่ม newline
 writeln!(log, "=== Log Start ===").unwrap();
 writeln!(log, "Event 1: User login").unwrap();
 writeln!(log, "Event 2: API call").unwrap();
 writeln!(log, "=== Log End ===").unwrap();
 
 println!("{}", log);
}
```

</RustPlayground>

---

## เขียนลงไฟล์

<RustPlayground>

```rust
use std::io::Write;

fn main() {
 // เขียนลง Vec<u8>
 let mut bytes = Vec::new();
 write!(bytes, "Hello ").unwrap();
 writeln!(bytes, "World!").unwrap();
 
 let s = String::from_utf8(bytes).unwrap();
 println!("from bytes: {}", s);
 
 // ในการใช้งานจริง เขียนลงไฟล์:
 // use std::fs::File;
 // let mut file = File::create("output.txt")?;
 // writeln!(file, "Hello, file!")?;
}
```

</RustPlayground>

---

## format_args! - ไม่ allocate

<RustPlayground>

```rust
use std::fmt;

fn main() {
 // format_args! ไม่สร้าง String (zero-allocation)
 let args = format_args!("x = {}, y = {}", 10, 20);
 println!("{}", args);
 
 // ใช้กับ custom logging
 fn log(args: fmt::Arguments) {
 println!("[LOG] {}", args);
 }
 
 log(format_args!("User {} logged in", "Alice"));
 log(format_args!("Processing {} items", 100));
}
```

</RustPlayground>

---

## Quick Reference

### Macros
| Macro | Return | ใช้ทำอะไร |
|-------|--------|----------|
| `format!` | String | สร้าง String |
| `write!` | Result | เขียนลง buffer |
| `writeln!` | Result | เขียนลง buffer + newline |
| `format_args!` | Arguments | Zero-allocation formatting |

### เมื่อไหร่ใช้อะไร
| Situation | ใช้ |
|-----------|-----|
| พิมพ์ทันที | `println!` |
| เก็บ String | `format!` |
| สะสมข้อความ | `write!` |
| เขียนไฟล์ | `write!` / `writeln!` |
| Performance | `format_args!` |

---

[← Output](./output) | [Assertions →](./assertions)
