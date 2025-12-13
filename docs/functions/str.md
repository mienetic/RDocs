# String Functions (std::str)

Functions สำหรับจัดการ UTF-8 Strings! 

---

## from_utf8

แปลง bytes เป็น &str (ตรวจสอบ UTF-8)

<RustPlayground>

```rust
use std::str;

fn main() {
 // Valid UTF-8
 let bytes = [104, 101, 108, 108, 111]; // "hello"
 
 match str::from_utf8(&bytes) {
 Ok(s) => println!("Valid: {}", s),
 Err(e) => println!("Invalid: {}", e),
 }
 
 // Invalid UTF-8
 let bad = [0xff, 0xfe];
 match str::from_utf8(&bad) {
 Ok(s) => println!("Valid: {}", s),
 Err(e) => println!("Invalid UTF-8 at byte {}", e.valid_up_to()),
 }
}
```

</RustPlayground>

---

## from_utf8_unchecked

แปลง bytes เป็น &str โดยไม่ตรวจสอบ (Unsafe)

<RustPlayground>

```rust
use std::str;

fn main() {
 let bytes = [104, 101, 108, 108, 111]; // "hello"
 
 // Unsafe! ต้องมั่นใจว่าเป็น valid UTF-8
 let s = unsafe { str::from_utf8_unchecked(&bytes) };
 
 println!("String: {}", s);
}
```

</RustPlayground>

---

## from_utf8_mut

เหมือน from_utf8 แต่ได้ mutable reference

<RustPlayground>

```rust
use std::str;

fn main() {
 let mut bytes = *b"hello";
 
 match str::from_utf8_mut(&mut bytes) {
 Ok(s) => {
 // แก้ไข string ผ่าน bytes ได้
 // (ต้องระวังไม่ให้เสีย UTF-8)
 println!("Mutable str: {}", s);
 }
 Err(e) => println!("Invalid: {}", e),
 }
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Safety |
|----------|---------|--------|
| `from_utf8(bytes)` | แปลงพร้อมตรวจสอบ | Safe |
| `from_utf8_unchecked(bytes)` | แปลงไม่ตรวจสอบ | Unsafe |
| `from_utf8_mut(bytes)` | แปลงแบบ mutable | Safe |

---

[← Hint](./hint) | [Char →](./char)
