# Fmt Enums

`Alignment` สำหรับ text formatting! 

---

## Alignment - การจัดวางข้อความ

<RustPlayground>

```rust
use std::fmt::{self, Alignment};

struct MyStruct(i32);

impl fmt::Display for MyStruct {
 fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
 // ดู alignment จาก formatter
 let align = f.align();
 
 match align {
 Some(Alignment::Left) => write!(f, "[L:{}]", self.0),
 Some(Alignment::Right) => write!(f, "[R:{}]", self.0),
 Some(Alignment::Center) => write!(f, "[C:{}]", self.0),
 None => write!(f, "[{}]", self.0),
 }
 }
}

fn main() {
 let x = MyStruct(42);
 
 // ใช้ format specifiers
 println!("Default: '{}'", x);
 println!("Left: '{:<10}'", x);
 println!("Right: '{:>10}'", x);
 println!("Center: '{:^10}'", x);
 
 // กับ fill character
 println!("Fill: '{:*^10}'", x);
}
```

</RustPlayground>

---

## Formatter Options

<RustPlayground>

```rust
use std::fmt::{self, Formatter};

struct Debug(i32);

impl fmt::Display for Debug {
 fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
 // ดู options ต่างๆ
 write!(f, "value={}", self.0)?;
 
 if let Some(w) = f.width() {
 write!(f, " width={}", w)?;
 }
 
 if let Some(p) = f.precision() {
 write!(f, " precision={}", p)?;
 }
 
 if f.sign_plus() {
 write!(f, " +sign")?;
 }
 
 if f.alternate() {
 write!(f, " #alternate")?;
 }
 
 Ok(())
 }
}

fn main() {
 let x = Debug(42);
 
 println!("{}", x);
 println!("{:10}", x);
 println!("{:+}", x);
 println!("{:#}", x);
 println!("{:.5}", x);
}
```

</RustPlayground>

---

## การ Format ตัวเลข

<RustPlayground>

```rust
fn main() {
 let n = 42;
 
 // Alignment กับตัวเลข
 println!("=== Number Alignment ===");
 println!("Left: |{:<10}|", n);
 println!("Right: |{:>10}|", n);
 println!("Center: |{:^10}|", n);
 
 // Fill characters
 println!("\n=== Fill ===");
 println!("Zero: |{:010}|", n);
 println!("Dash: |{:-<10}|", n);
 println!("Star: |{:*^10}|", n);
 
 // Signs
 println!("\n=== Signs ===");
 println!("Plus: {:+}", n);
 println!("Minus: {:+}", -n);
 
 // Bases
 println!("\n=== Bases ===");
 println!("Binary: {:b}", n);
 println!("Octal: {:o}", n);
 println!("Hex: {:x}", n);
 println!("HEX: {:X}", n);
 println!("Pointer: {:p}", &n);
}
```

</RustPlayground>

---

## Quick Reference

### Alignment
| Variant | Format | คำอธิบาย |
|---------|--------|---------|
| `Left` | `<` | ชิดซ้าย |
| `Right` | `>` | ชิดขวา |
| `Center` | `^` | กลาง |

### Format Specifiers
| Spec | คำอธิบาย | ตัวอย่าง |
|------|---------|---------|
| `width` | ความกว้าง | `{:10}` |
| `precision` | ทศนิยม | `{:.2}` |
| `+` | แสดง sign | `{:+}` |
| `#` | alternate form | `{:#x}` |
| `0` | pad ด้วย 0 | `{:05}` |
| `fill` + `align` | fill char | `{:*>10}` |

---

[← Num](./num-enum) | [Index →](./index)
