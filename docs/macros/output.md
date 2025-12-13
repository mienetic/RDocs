# Output Macros - แสดงผล

`println!`, `print!`, `eprintln!`, `eprint!` สำหรับแสดงผลข้อความ! 

---

## println! - พิมพ์พร้อมขึ้นบรรทัดใหม่

<RustPlayground>

```rust
fn main() {
 // พิมพ์ข้อความง่ายๆ
 println!("Hello, World!");
 
 // เว้นบรรทัด
 println!();
 
 // ใส่ค่าตัวแปร
 let name = "Rust";
 let version = 2024;
 println!("Welcome to {} edition {}!", name, version);
 
 // หลาย arguments
 println!("a={}, b={}, c={}", 1, 2, 3);
}
```

</RustPlayground>

---

## Format Specifiers

<RustPlayground>

```rust
fn main() {
 let x = 42;
 let pi = 3.14159;
 
 // Debug format {:?}
 println!("debug: {:?}", vec![1, 2, 3]);
 
 // Pretty debug {:#?}
 println!("pretty: {:#?}", vec![1, 2, 3]);
 
 // Binary, Hex, Octal
 println!("binary: {:b}", x); // 101010
 println!("hex: {:x}", x); // 2a
 println!("HEX: {:X}", x); // 2A
 println!("octal: {:o}", x); // 52
 
 // Width and Precision
 println!("width 10: {:10}", x); // " 42"
 println!("left align: {:<10}", x); // "42 "
 println!("right align: {:>10}", x); // " 42"
 println!("center: {:^10}", x); // " 42 "
 println!("padding: {:0>5}", x); // "00042"
 
 // Float precision
 println!("2 decimals: {:.2}", pi); // 3.14
 println!("5 decimals: {:.5}", pi); // 3.14159
}
```

</RustPlayground>

---

## Named Arguments

<RustPlayground>

```rust
fn main() {
 println!("{name} has {count} items", 
 name = "Alice", 
 count = 42);
 
 // ผสม positional กับ named
 println!("{0} and {name}", 
 "Bob", 
 name = "Charlie");
 
 // ใน Rust 2021+ ใช้ตัวแปรตรงๆ ได้
 let name = "David";
 let score = 95;
 println!("{name} scored {score}!");
}
```

</RustPlayground>

---

## print! - พิมพ์ไม่ขึ้นบรรทัดใหม่

<RustPlayground>

```rust
fn main() {
 print!("Loading");
 print!(".");
 print!(".");
 print!(".");
 println!(" Done!");
 
 // Progress bar
 for i in 0..=5 {
 print!("\rProgress: {}% ", i * 20);
 }
 println!();
}
```

</RustPlayground>

---

## eprintln! และ eprint! - ส่งออก stderr

<RustPlayground>

```rust
fn main() {
 // eprintln! ส่งออก stderr (error stream)
 eprintln!("Error: Something went wrong!");
 
 // ใช้สำหรับ error messages
 let filename = "config.toml";
 eprintln!("Warning: {} not found", filename);
 
 // eprint! ไม่ขึ้นบรรทัดใหม่
 eprint!("Critical: ");
 eprintln!("System failure!");
 
 // println! ส่ง stdout (ปกติ)
 println!("This goes to stdout");
}
```

</RustPlayground>

:::tip stdout vs stderr
- `println!` → stdout (standard output)
- `eprintln!` → stderr (error output)

ใช้ stderr สำหรับ errors และ warnings เพื่อให้ redirect แยกได้
:::

---

## Quick Reference

### Macros
| Macro | Output | เมื่อไหร่ใช้ |
|-------|--------|------------|
| `println!` | stdout + newline | ข้อความปกติ |
| `print!` | stdout | ไม่ต้องการ newline |
| `eprintln!` | stderr + newline | Errors, warnings |
| `eprint!` | stderr | Errors ไม่มี newline |

### Format Specifiers
| Specifier | คำอธิบาย |
|-----------|---------|
| `{}` | Display format |
| `{:?}` | Debug format |
| `{:#?}` | Pretty debug |
| `{:b}` | Binary |
| `{:x}` | Lowercase hex |
| `{:X}` | Uppercase hex |
| `{:o}` | Octal |
| `{:.N}` | N decimal places |
| `{:N}` | Width N |
| `{:<N}` | Left align |
| `{:>N}` | Right align |
| `{:^N}` | Center |

---

[← Index](./index) | [Formatting →](./formatting)
