# Char Functions (std::char)

Functions สำหรับจัดการ Characters! 

---

## from_u32

แปลง u32 เป็น char (ตรวจสอบ validity)

<RustPlayground>

```rust
use std::char;

fn main() {
 // Valid Unicode code points
 println!("{:?}", char::from_u32(0x41)); // Some('A')
 println!("{:?}", char::from_u32(0x0E01)); // Some('ก') - Thai
 println!("{:?}", char::from_u32(0x1F600)); // Some('')
 
 // Invalid code points
 println!("{:?}", char::from_u32(0xD800)); // None (surrogate)
 println!("{:?}", char::from_u32(0x110000)); // None (too large)
}
```

</RustPlayground>

---

## from_digit

แปลงตัวเลข (0-35) เป็น char ตาม radix

<RustPlayground>

```rust
use std::char;

fn main() {
 // Base 10
 println!("{:?}", char::from_digit(5, 10)); // Some('5')
 println!("{:?}", char::from_digit(9, 10)); // Some('9')
 println!("{:?}", char::from_digit(10, 10)); // None (out of range)
 
 // Base 16 (Hex)
 println!("{:?}", char::from_digit(10, 16)); // Some('a')
 println!("{:?}", char::from_digit(15, 16)); // Some('f')
 
 // Base 2 (Binary)
 println!("{:?}", char::from_digit(0, 2)); // Some('0')
 println!("{:?}", char::from_digit(1, 2)); // Some('1')
 println!("{:?}", char::from_digit(2, 2)); // None
}
```

</RustPlayground>

---

## decode_utf16

Decode UTF-16 encoded data

<RustPlayground>

```rust
use std::char;

fn main() {
 // UTF-16 encoded "Hello"
 let utf16 = [0x0048, 0x0065, 0x006c, 0x006c, 0x006f];
 
 let decoded: String = char::decode_utf16(utf16.iter().copied())
 .map(|r| r.unwrap_or('?'))
 .collect();
 
 println!("Decoded: {}", decoded); // Hello
 
 // With emoji (surrogate pairs)
 let emoji = [0xD83D, 0xDE00]; // 
 let decoded: String = char::decode_utf16(emoji.iter().copied())
 .map(|r| r.unwrap_or('?'))
 .collect();
 
 println!("Emoji: {}", decoded);
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `from_u32(n)` | u32 → char | `Option<char>` |
| `from_u32_unchecked(n)` | u32 → char (unsafe) | `char` |
| `from_digit(n, radix)` | digit → char | `Option<char>` |
| `decode_utf16(iter)` | UTF-16 → chars | `DecodeUtf16` |

---

[← String](./str) | [Format →](./fmt)
