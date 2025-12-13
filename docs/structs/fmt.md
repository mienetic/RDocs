# Fmt Structs - Formatting

`Formatter`, `Arguments` สำหรับ formatting output! 

---

## Debug และ Display Traits

<RustPlayground>

```rust
use std::fmt;

struct Point {
 x: i32,
 y: i32,
}

// Display - สำหรับ user
impl fmt::Display for Point {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "({}, {})", self.x, self.y)
 }
}

// Debug - สำหรับ developer
impl fmt::Debug for Point {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 f.debug_struct("Point")
 .field("x", &self.x)
 .field("y", &self.y)
 .finish()
 }
}

fn main() {
 let p = Point { x: 10, y: 20 };
 
 println!("Display: {}", p);
 println!("Debug: {:?}", p);
 println!("Pretty Debug: {:#?}", p);
}
```

</RustPlayground>

---

## Formatter Options

<RustPlayground>

```rust
use std::fmt;

struct Number(i32);

impl fmt::Display for Number {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 // ใช้ formatter options
 if let Some(width) = f.width() {
 write!(f, "{:>width$}", self.0, width = width)
 } else {
 write!(f, "{}", self.0)
 }
 }
}

fn main() {
 let n = Number(42);
 
 println!("|{}|", n); // normal
 println!("|{:10}|", n); // width 10
 println!("|{:<10}|", n); // left align
 println!("|{:>10}|", n); // right align
 println!("|{:^10}|", n); // center
 println!("|{:0>10}|", n); // zero pad
}
```

</RustPlayground>

---

## Custom Format Specifiers

<RustPlayground>

```rust
use std::fmt;

struct Color {
 r: u8,
 g: u8,
 b: u8,
}

// Display - RGB format
impl fmt::Display for Color {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "rgb({}, {}, {})", self.r, self.g, self.b)
 }
}

// LowerHex - hex format
impl fmt::LowerHex for Color {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "#{:02x}{:02x}{:02x}", self.r, self.g, self.b)
 }
}

// UpperHex - HEX format
impl fmt::UpperHex for Color {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "#{:02X}{:02X}{:02X}", self.r, self.g, self.b)
 }
}

fn main() {
 let red = Color { r: 255, g: 0, b: 0 };
 
 println!("Display: {}", red);
 println!("Hex: {:x}", red);
 println!("HEX: {:X}", red);
}
```

</RustPlayground>

---

## format! และ write! Macros

<RustPlayground>

```rust
use std::fmt::Write;

fn main() {
 // format! - return String
 let s = format!("Hello, {}!", "World");
 println!("{}", s);
 
 // Named parameters
 let name = "Rust";
 let version = 2021;
 let info = format!("{name} edition {version}");
 println!("{}", info);
 
 // write! - เขียนไปที่ buffer
 let mut buffer = String::new();
 write!(buffer, "Line 1\n").unwrap();
 write!(buffer, "Line 2\n").unwrap();
 println!("{}", buffer);
 
 // Format numbers
 println!("Binary: {:b}", 42);
 println!("Octal: {:o}", 42);
 println!("Hex: {:x}", 42);
 println!("Scientific: {:e}", 1234.5);
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย |
|------|---------|
| `Formatter` | Controls formatting output |
| `Arguments` | Pre-compiled format string |
| `Error` | Formatting error |

### Traits
| Trait | Format | ตัวอย่าง |
|-------|--------|---------|
| `Display` | `{}` | User-friendly |
| `Debug` | `{:?}` | Developer debug |
| `Binary` | `{:b}` | `101010` |
| `Octal` | `{:o}` | `52` |
| `LowerHex` | `{:x}` | `2a` |
| `UpperHex` | `{:X}` | `2A` |
| `LowerExp` | `{:e}` | `1.23e3` |
| `UpperExp` | `{:E}` | `1.23E3` |
| `Pointer` | `{:p}` | `0x7fff...` |

### Format Options
| Option | คำอธิบาย | ตัวอย่าง |
|--------|---------|---------|
| `width` | ความกว้าง | `{:10}` |
| `<` | Left align | `{:<10}` |
| `>` | Right align | `{:>10}` |
| `^` | Center | `{:^10}` |
| `0` | Zero pad | `{:010}` |
| `.precision` | Precision | `{:.2}` |

---

[← Fs](./fs) | [Marker →](./marker)
