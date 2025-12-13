# Formatting - จัดรูปแบบข้อความ

**std::fmt** มี traits และ macros สำหรับจัดรูปแบบข้อความให้สวยงาม! 

---

## fmt คืออะไร?

Rust มี 2 traits หลักสำหรับแสดงผล:
- `Display` - สำหรับผู้ใช้ (ใช้ `{}`)
- `Debug` - สำหรับ developer (ใช้ `{:?}`)

:::tip ควรใช้อันไหน?
- `{}` Display - ข้อความที่ user จะเห็น
- `{:?}` Debug - debug ตอนพัฒนา
- `{:#?}` Debug pretty - debug แบบสวย
:::

---

## 1. println! และ format!

<RustPlayground>

```rust
fn main() {
 let name = "Alice";
 let age = 25;
 
 // println! - print + newline
 println!("Hello, {}!", name);
 println!("{} is {} years old", name, age);
 
 // print! - print ไม่ขึ้นบรรทัดใหม่
 print!("Loading");
 print!("...");
 println!(" Done!");
 
 // format! - สร้าง String (ไม่ print)
 let message = format!("{} อายุ {} ปี", name, age);
 println!("{}", message);
 
 // eprint! / eprintln! - print ไป stderr
 eprintln!("Error: something went wrong");
}
```

</RustPlayground>

---

## 2. Positional และ Named Arguments

<RustPlayground>

```rust
fn main() {
 // ตำแหน่งตามลำดับ
 println!("{} {} {}", "one", "two", "three");
 
 // ระบุตำแหน่ง
 println!("{0} {1} {0}", "first", "second"); // first second first
 
 // ใช้ชื่อ
 println!("{name} is {age} years old",
 name = "Alice",
 age = 25);
 
 // ผสมกัน
 let city = "Bangkok";
 println!("{city} is in {country}",
 country = "Thailand");
}
```

</RustPlayground>

---

## 3. Width และ Alignment

<RustPlayground>

```rust
fn main() {
 let name = "Rust";
 
 // กำหนดความกว้าง
 println!("|{:10}|", name); // ชิดซ้าย (default สำหรับ string)
 println!("|{:<10}|", name); // ชิดซ้าย
 println!("|{:>10}|", name); // ชิดขวา
 println!("|{:^10}|", name); // กึ่งกลาง
 
 // เติมอักขระ
 println!("|{:*<10}|", name); // เติม * ซ้าย
 println!("|{:*>10}|", name); // เติม * ขวา
 println!("|{:*^10}|", name); // เติม * สองข้าง
 
 // ตัวเลข
 let n = 42;
 println!("|{:5}|", n); // ชิดขวา (default สำหรับตัวเลข)
 println!("|{:05}|", n); // เติม 0 ข้างหน้า
}
```

</RustPlayground>

---

## 4. Numbers

<RustPlayground>

```rust
fn main() {
 let n = 42;
 let pi = 3.14159265;
 
 // ต่างๆ
 println!("decimal: {}", n);
 println!("binary: {:b}", n); // 101010
 println!("octal: {:o}", n); // 52
 println!("hex lower: {:x}", n); // 2a
 println!("hex upper: {:X}", n); // 2A
 
 // ทศนิยม
 println!("2 decimals: {:.2}", pi); // 3.14
 println!("5 decimals: {:.5}", pi); // 3.14159
 println!("width + decimals: {:8.2}", pi); // " 3.14"
 
 // เติม 0
 println!("leading zeros: {:08.2}", pi); // 00003.14
 
 // เครื่องหมาย
 let pos = 42;
 let neg = -42;
 println!("with sign: {:+}", pos); // +42
 println!("with sign: {:+}", neg); // -42
 
 // exponent
 let big = 12345.6789;
 println!("scientific: {:e}", big); // 1.23456789e4
 println!("scientific: {:E}", big); // 1.23456789E4
}
```

</RustPlayground>

---

## 5. Debug trait

<RustPlayground>

```rust
#[derive(Debug)]
struct Person {
 name: String,
 age: u32,
}

fn main() {
 let person = Person {
 name: "Alice".to_string(),
 age: 25,
 };
 
 // Debug ธรรมดา
 println!("{:?}", person);
 
 // Debug แบบ pretty (เยื้องบรรทัด)
 println!("{:#?}", person);
 
 // สำหรับ collections
 let vec = vec![1, 2, 3, 4, 5];
 println!("{:?}", vec);
 println!("{:#?}", vec);
 
 // Debug ซ้อนกัน
 let nested = vec![
 Person { name: "Alice".to_string(), age: 25 },
 Person { name: "Bob".to_string(), age: 30 },
 ];
 println!("{:#?}", nested);
}
```

</RustPlayground>

---

## 6. Implement Display

<RustPlayground>

```rust
use std::fmt;

struct Point {
 x: f64,
 y: f64,
}

// Implement Display เอง
impl fmt::Display for Point {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "({}, {})", self.x, self.y)
 }
}

// Implement Debug ด้วย
impl fmt::Debug for Point {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 f.debug_struct("Point")
 .field("x", &self.x)
 .field("y", &self.y)
 .finish()
 }
}

fn main() {
 let p = Point { x: 3.0, y: 4.0 };
 
 println!("Display: {}", p); // (3, 4)
 println!("Debug: {:?}", p); // Point { x: 3.0, y: 4.0 }
 println!("Pretty: {:#?}", p); // Pretty printed
}
```

</RustPlayground>

---

## 7. Pointer และ Type

<RustPlayground>

```rust
fn main() {
 let x = 42;
 let ptr = &x as *const i32;
 
 // แสดง address
 println!("pointer: {:p}", ptr);
 println!("reference: {:p}", &x);
 
 // Binary / Octal / Hex ของตัวเลขใหญ่
 let n = 255u8;
 println!("binary: {:08b}", n); // 11111111
 println!("octal: {:03o}", n); // 377
 println!("hex: {:02x}", n); // ff
 
 // typename (ใช้ std::any::type_name)
 fn print_type_of<T>(_: &T) {
 println!("Type: {}", std::any::type_name::<T>());
 }
 
 print_type_of(&42);
 print_type_of(&"hello");
 print_type_of(&vec![1, 2, 3]);
}
```

</RustPlayground>

---

## 8. write! macro

<RustPlayground>

```rust
use std::fmt::Write;

fn main() {
 // write! เขียนลง buffer แทน stdout
 let mut buffer = String::new();
 
 write!(buffer, "Hello, {}!", "World").unwrap();
 println!("buffer: {}", buffer);
 
 // เพิ่มต่อ
 write!(buffer, " And {} too!", "Rust").unwrap();
 println!("buffer: {}", buffer);
 
 // writeln! เพิ่ม newline
 let mut log = String::new();
 writeln!(log, "Line 1").unwrap();
 writeln!(log, "Line 2").unwrap();
 writeln!(log, "Line 3").unwrap();
 println!("Log:\n{}", log);
}
```

</RustPlayground>

---

## Quick Reference

### Format Specifiers
| Specifier | คำอธิบาย | ตัวอย่าง |
|-----------|---------|---------|
| `{}` | Display | Hello |
| `{:?}` | Debug | "Hello" |
| `{:#?}` | Debug pretty | สวยขึ้น |
| `{:b}` | Binary | 101010 |
| `{:o}` | Octal | 52 |
| `{:x}` | Hex lower | 2a |
| `{:X}` | Hex upper | 2A |
| `{:e}` | Scientific | 1.23e4 |
| `{:p}` | Pointer | 0x... |

### Width & Alignment
| Specifier | คำอธิบาย |
|-----------|---------|
| `{:n}` | ความกว้าง n |
| `{:<n}` | ชิดซ้าย |
| `{:>n}` | ชิดขวา |
| `{:^n}` | กึ่งกลาง |
| `{:0n}` | เติม 0 |
| `{:.n}` | ทศนิยม n ตำแหน่ง |

### Macros
| Macro | คำอธิบาย |
|-------|---------|
| `print!()` | stdout |
| `println!()` | stdout + newline |
| `eprint!()` | stderr |
| `eprintln!()` | stderr + newline |
| `format!()` | return String |
| `write!()` | เขียนลง buffer |

---

[← Collections](./collections-ref) | [Clone & Copy →](./clone-copy)
