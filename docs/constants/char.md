# Char Constants

Character constants สำหรับ Unicode limits! 

---

## Unicode Constants

<RustPlayground>

```rust
fn main() {
 println!("=== Char Constants ===");
 
 // MAX - highest valid Unicode code point
 println!("char::MAX = '{}' (U+{:X})", char::MAX, char::MAX as u32);
 
 // REPLACEMENT_CHARACTER - ใช้แทน invalid UTF-8
 println!("REPLACEMENT_CHARACTER = '{}' (U+{:X})", 
 char::REPLACEMENT_CHARACTER, 
 char::REPLACEMENT_CHARACTER as u32);
 
 // UNICODE_VERSION
 println!("UNICODE_VERSION = {:?}", char::UNICODE_VERSION);
 
 // UTF-8 encoding lengths
 println!("\n=== UTF-8 Encoding ===");
 let chars = ['A', 'ก', '', ''];
 for c in chars {
 println!("'{}' = {} bytes (UTF-8)", c, c.len_utf8());
 }
}
```

</RustPlayground>

---

## Using REPLACEMENT_CHARACTER

<RustPlayground>

```rust
fn main() {
 // REPLACEMENT_CHARACTER ใช้แทน invalid bytes
 let valid = "Hello สวัสดี";
 println!("Valid: {}", valid);
 
 // สร้าง String ที่แทน invalid ด้วย replacement
 let bytes = [0x48, 0x69, 0xFF, 0x21]; // 0xFF is invalid UTF-8
 let s: String = bytes.iter()
 .map(|&b| {
 char::from_u32(b as u32).unwrap_or(char::REPLACEMENT_CHARACTER)
 })
 .collect();
 println!("With replacement: {}", s);
 
 // String::from_utf8_lossy ใช้ REPLACEMENT_CHARACTER อัตโนมัติ
 let lossy = String::from_utf8_lossy(&bytes);
 println!("from_utf8_lossy: {}", lossy);
}
```

</RustPlayground>

---

## Char Ranges

<RustPlayground>

```rust
fn main() {
 println!("=== Character Ranges ===");
 
 // ASCII
 println!("ASCII printable: ' ' (32) to '~' (126)");
 for i in 32u8..=126 {
 print!("{}", i as char);
 }
 println!();
 
 // Check if in range
 let c = 'ก';
 println!("\n'{}' (U+{:04X}):", c, c as u32);
 println!(" is_ascii: {}", c.is_ascii());
 println!(" is_alphabetic: {}", c.is_alphabetic());
 
 // Thai range
 println!("\nThai characters: U+0E00 - U+0E7F");
 for i in 0x0E01..=0x0E3A {
 if let Some(c) = char::from_u32(i) {
 print!("{}", c);
 }
 }
 println!();
}
```

</RustPlayground>

---

## Quick Reference

### char Constants
| Constant | ค่า | คำอธิบาย |
|----------|-----|---------|
| `MAX` | '\u{10FFFF}' | Unicode สูงสุด |
| `REPLACEMENT_CHARACTER` | '' (U+FFFD) | แทน invalid |
| `UNICODE_VERSION` | (major, minor, patch) | Version ที่รองรับ |

### UTF-8 Length Constants
| Constant | ค่า | คำอธิบาย |
|----------|-----|---------|
| `MAX_LEN_UTF8` | 4 | max bytes ต่อ char |
| `MAX_LEN_UTF16` | 2 | max u16 ต่อ char |

### Character Categories
| Method | คำอธิบาย |
|--------|---------|
| `is_ascii()` | 0x00-0x7F |
| `is_alphabetic()` | ตัวอักษร (ทุกภาษา) |
| `is_numeric()` | ตัวเลข |
| `is_whitespace()` | ช่องว่าง |

---

[← Integer](./integer) | [Env →](./env)
