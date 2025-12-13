# BStr Types (std::bstr)

Types สำหรับ Byte Strings! 

---

## ByteStr

Borrowed byte string (เหมือน `&str` แต่สำหรับ bytes)

<RustPlayground>

```rust
// ByteStr ยังเป็น nightly feature
// ใช้ slice แทนในตอนนี้

fn main() {
 // Byte string literal
 let bytes: &[u8] = b"Hello, World!";
 
 // แปลงเป็น string ถ้า valid UTF-8
 match std::str::from_utf8(bytes) {
 Ok(s) => println!("As string: {}", s),
 Err(e) => println!("Not valid UTF-8: {}", e),
 }
 
 // Byte operations
 println!("Length: {}", bytes.len());
 println!("First byte: {}", bytes[0]);
 
 // Contains check
 if bytes.starts_with(b"Hello") {
 println!("Starts with Hello!");
 }
}
```

</RustPlayground>

---

## Working with Byte Slices

<RustPlayground>

```rust
fn main() {
 let data: &[u8] = b"Hello\nWorld\x00Binary";
 
 // Split by delimiter
 for part in data.split(|&b| b == b'\n') {
 match std::str::from_utf8(part) {
 Ok(s) => println!("Part: {:?}", s),
 Err(_) => println!("Binary part: {:?}", part),
 }
 }
 
 // Find pattern
 if let Some(pos) = data.iter().position(|&b| b == b'\n') {
 println!("Newline at position: {}", pos);
 }
 
 // Check for null bytes
 if data.contains(&0) {
 println!("Contains null byte!");
 }
}
```

</RustPlayground>

---

## Vec of Bytes (Owned)

<RustPlayground>

```rust
fn main() {
 // Owned byte string
 let mut bytes: Vec<u8> = b"Hello".to_vec();
 
 // Append
 bytes.extend_from_slice(b", World!");
 
 // Modify
 bytes[0] = b'h'; // lowercase
 
 // Convert to String
 match String::from_utf8(bytes.clone()) {
 Ok(s) => println!("As String: {}", s),
 Err(e) => println!("Error: {}", e),
 }
 
 // Lossy conversion (replace invalid UTF-8)
 let lossy = String::from_utf8_lossy(&bytes);
 println!("Lossy: {}", lossy);
}
```

</RustPlayground>

---

## Byte String Literals

<RustPlayground>

```rust
fn main() {
 // Regular byte string
 let bytes: &[u8] = b"Hello";
 println!("{:?}", bytes); // [72, 101, 108, 108, 111]
 
 // Raw byte string (no escaping)
 let raw: &[u8] = br"Hello\nWorld";
 println!("{:?}", raw); // includes literal \n
 
 // Byte character
 let byte: u8 = b'A';
 println!("Byte: {}", byte); // 65
 
 // Escape sequences
 let escaped: &[u8] = b"Line1\nLine2\tTabbed";
 println!("{:?}", escaped);
}
```

</RustPlayground>

---

## CStr vs BStr

<RustPlayground>

```rust
use std::ffi::CStr;

fn main() {
 // CStr: null-terminated C string
 let c_str = CStr::from_bytes_with_nul(b"Hello\0").unwrap();
 println!("CStr: {:?}", c_str);
 
 // Byte slice: any bytes, any length
 let bytes: &[u8] = b"Hello\x00World"; // embedded null OK
 println!("Bytes length: {}", bytes.len()); // 11
 
 // Convert CStr to byte slice
 let cstr_bytes = c_str.to_bytes();
 println!("CStr bytes: {:?}", cstr_bytes); // no null
 
 let cstr_bytes_nul = c_str.to_bytes_with_nul();
 println!("CStr with nul: {:?}", cstr_bytes_nul); // includes null
}
```

</RustPlayground>

---

## Quick Reference

| Type | คำอธิบาย |
|------|---------|
| `&[u8]` | Borrowed byte slice |
| `Vec<u8>` | Owned byte vector |
| `b"..."` | Byte string literal |
| `br"..."` | Raw byte string |
| `b'x'` | Byte character |

---

## Conversions

| From | To | Method |
|------|----|--------|
| `&str` | `&[u8]` | `.as_bytes()` |
| `&[u8]` | `&str` | `std::str::from_utf8()` |
| `String` | `Vec<u8>` | `.into_bytes()` |
| `Vec<u8>` | `String` | `String::from_utf8()` |
| `&[u8]` | `String` | `String::from_utf8_lossy()` |

---

[← Waker](/structs/waker) | [Index →](/structs/)
