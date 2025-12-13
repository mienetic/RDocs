# char - ตัวอักษร

Rust มี `char` สำหรับตัวอักษรเดียว (Unicode)! 

---

## char คืออะไร?

`char` คือ Unicode scalar value:
- **ขนาด**: 4 bytes (32 bits)
- **ช่วงค่า**: U+0000 ถึง U+D7FF และ U+E000 ถึง U+10FFFF
- รองรับ emoji, ภาษาไทย, และทุกภาษา!

:::tip char vs u8
- `char` = Unicode (4 bytes) - ใช้กับตัวอักษร
- `u8` = ASCII byte (1 byte) - ใช้กับ raw bytes
:::

---

## 1. การประกาศ

<RustPlayground>

```rust
fn main() {
 // Single quotes สำหรับ char
 let c = 'A';
 let thai = 'ก';
 let emoji = '';
 
 println!("c = {}", c);
 println!("thai = {}", thai);
 println!("emoji = {}", emoji);
 
 // ขนาด char คือ 4 bytes เสมอ
 println!("size_of char = {} bytes", std::mem::size_of::<char>());
}
```

</RustPlayground>

---

## 2. Escape Sequences

<RustPlayground>

```rust
fn main() {
 // Special characters
 let newline = '\n'; // ขึ้นบรรทัดใหม่
 let tab = '\t'; // tab
 let backslash = '\\'; // \
 let quote = '\''; // '
 
 println!("Hello{}World", newline);
 println!("Col1{}Col2", tab);
 println!("backslash: {}", backslash);
 println!("quote: {}", quote);
 
 // Unicode escape
 let heart = '\u{2764}'; // 
 let crab = '\u{1F980}'; // 
 println!("heart: {}", heart);
 println!("crab: {}", crab);
}
```

</RustPlayground>

---

## 3. Checking Character Type

<RustPlayground>

```rust
fn main() {
 let chars = ['A', 'a', '5', ' ', '\n', 'ก', ''];
 
 for c in chars {
 println!("'{}' ->", c);
 println!(" is_alphabetic: {}", c.is_alphabetic());
 println!(" is_numeric: {}", c.is_numeric());
 println!(" is_alphanumeric: {}", c.is_alphanumeric());
 println!(" is_whitespace: {}", c.is_whitespace());
 println!(" is_ascii: {}", c.is_ascii());
 println!(" is_control: {}", c.is_control());
 println!();
 }
}
```

</RustPlayground>

---

## 4. ASCII Operations

<RustPlayground>

```rust
fn main() {
 let c = 'A';
 
 // ASCII checks
 println!("'A'.is_ascii_uppercase: {}", c.is_ascii_uppercase());
 println!("'A'.is_ascii_lowercase: {}", c.is_ascii_lowercase());
 println!("'A'.is_ascii_digit: {}", c.is_ascii_digit());
 println!("'A'.is_ascii_alphabetic: {}", c.is_ascii_alphabetic());
 
 // Case conversion (ASCII only)
 println!("'A'.to_ascii_lowercase: {}", c.to_ascii_lowercase());
 println!("'a'.to_ascii_uppercase: {}", 'a'.to_ascii_uppercase());
 
 // Digits
 let digit = '7';
 println!("'7'.is_ascii_digit: {}", digit.is_ascii_digit());
 println!("'7'.to_digit(10): {:?}", digit.to_digit(10)); // Some(7)
}
```

</RustPlayground>

---

## 5. Unicode Case Conversion

<RustPlayground>

```rust
fn main() {
 let c = 'ß'; // German sharp s
 
 // to_uppercase อาจ return หลายตัว!
 println!("'ß'.to_uppercase:");
 for upper in c.to_uppercase() {
 print!("{}", upper); // SS
 }
 println!();
 
 // to_lowercase
 let big_sigma = 'Σ';
 println!("'Σ'.to_lowercase:");
 for lower in big_sigma.to_lowercase() {
 print!("{}", lower); // σ
 }
 println!();
 
 // ภาษาไทยไม่มี uppercase/lowercase
 let thai = 'ก';
 println!("'ก'.is_uppercase: {}", thai.is_uppercase());
 println!("'ก'.is_lowercase: {}", thai.is_lowercase());
}
```

</RustPlayground>

---

## 6. Conversion

<RustPlayground>

```rust
fn main() {
 // char -> u32 (Unicode code point)
 let c = 'ก';
 let code: u32 = c as u32;
 println!("'ก' = U+{:04X} = {}", code, code);
 
 // u32 -> char (may fail)
 let code: u32 = 0x0E01; // 'ก'
 if let Some(ch) = char::from_u32(code) {
 println!("U+{:04X} = '{}'", code, ch);
 }
 
 // char -> String
 let s: String = c.to_string();
 println!("char to String: {}", s);
 
 // ASCII only: char -> u8
 let ascii = 'A';
 if ascii.is_ascii() {
 let byte = ascii as u8;
 println!("'A' as u8 = {}", byte); // 65
 }
}
```

</RustPlayground>

---

## 7. Iterating Strings

<RustPlayground>

```rust
fn main() {
 let s = "Hello ก";
 
 // วน chars
 println!("chars:");
 for c in s.chars() {
 println!(" '{}' ({} bytes)", c, c.len_utf8());
 }
 
 // นับ chars
 println!("char count: {}", s.chars().count());
 println!("byte length: {}", s.len());
 
 // ตำแหน่ง char
 for (i, c) in s.char_indices() {
 println!(" byte {} -> '{}'", i, c);
 }
}
```

</RustPlayground>

---

## Quick Reference

### Character Checks
| Method | ตรวจสอบ |
|--------|--------|
| `is_alphabetic()` | ตัวอักษร |
| `is_numeric()` | ตัวเลข |
| `is_alphanumeric()` | ตัวอักษรหรือตัวเลข |
| `is_whitespace()` | ช่องว่าง |
| `is_ascii()` | ASCII (0-127) |
| `is_control()` | Control character |

### Case Methods
| Method | คำอธิบาย |
|--------|---------|
| `is_uppercase()` | เป็นตัวใหญ่ |
| `is_lowercase()` | เป็นตัวเล็ก |
| `to_uppercase()` | Iterator ตัวใหญ่ |
| `to_lowercase()` | Iterator ตัวเล็ก |
| `to_ascii_uppercase()` | ASCII ตัวใหญ่ |
| `to_ascii_lowercase()` | ASCII ตัวเล็ก |

### Conversion
| From/To | Method |
|---------|--------|
| `char → u32` | `c as u32` |
| `u32 → char` | `char::from_u32(n)` |
| `char → String` | `c.to_string()` |
| `char → digit` | `c.to_digit(radix)` |

---

[← Floats](./floats) | [str →](./str)
