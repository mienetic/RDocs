# FFI Structs - Foreign Function Interface

`CStr`, `CString` สำหรับเชื่อมต่อกับ C code! 

---

## FFI คืออะไร?

**FFI** (Foreign Function Interface) ใช้สำหรับ:
- เรียกใช้ C libraries จาก Rust
- ส่ง strings ไปยัง C functions
- รับ strings จาก C functions

---

## CString - Owned C String

<RustPlayground>

```rust
use std::ffi::CString;

fn main() {
 // สร้าง CString จาก Rust string
 let hello = CString::new("Hello, World!").unwrap();
 
 println!("CString: {:?}", hello);
 println!("as_bytes: {:?}", hello.as_bytes());
 println!("len: {}", hello.as_bytes().len());
 
 // แปลงกลับเป็น Rust string
 let s = hello.to_str().unwrap();
 println!("back to str: {}", s);
 
 // สร้างจาก bytes
 let bytes = CString::new(vec![72, 101, 108, 108, 111]).unwrap();
 println!("from bytes: {:?}", bytes);
}
```

</RustPlayground>

---

## CStr - Borrowed C String

<RustPlayground>

```rust
use std::ffi::{CStr, CString};

fn main() {
 // สร้าง CStr จาก literal
 let c_str = c"Hello from C literal!";
 println!("CStr: {:?}", c_str);
 
 // แปลงเป็น Rust &str
 match c_str.to_str() {
 Ok(s) => println!("as str: {}", s),
 Err(e) => println!("error: {}", e),
 }
 
 // CStr จาก CString
 let owned = CString::new("owned string").unwrap();
 let borrowed: &CStr = owned.as_c_str();
 println!("borrowed: {:?}", borrowed);
}
```

</RustPlayground>

---

## Null-terminated Strings

<RustPlayground>

```rust
use std::ffi::CString;

fn main() {
 let s = CString::new("Hello").unwrap();
 
 // ดู bytes รวม null terminator
 let with_null = s.as_bytes_with_nul();
 println!("with null: {:?}", with_null);
 
 // ไม่รวม null terminator
 let without_null = s.as_bytes();
 println!("without null: {:?}", without_null);
 
 // CString ไม่รองรับ null byte ใน string!
 match CString::new("Hello\0World") {
 Ok(_) => println!("OK"),
 Err(e) => println!("Error: {} (position: {})", e, e.nul_position()),
 }
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย | เหมือน |
|------|---------|-------|
| `CString` | Owned C string | `String` |
| `CStr` | Borrowed C string | `&str` |
| `OsString` | Owned OS string | `String` |
| `OsStr` | Borrowed OS string | `&str` |

### CString Methods
| Method | คำอธิบาย |
|--------|---------|
| `new(s)` | สร้าง CString |
| `as_c_str()` | ได้ &CStr |
| `as_bytes()` | ได้ &[u8] (ไม่มี null) |
| `as_bytes_with_nul()` | ได้ &[u8] (มี null) |
| `as_ptr()` | ได้ *const c_char |
| `into_raw()` | ย้าย ownership ไป C |
| `from_raw()` | รับ ownership จาก C |

### CStr Methods
| Method | คำอธิบาย |
|--------|---------|
| `to_str()` | แปลงเป็น &str |
| `to_string_lossy()` | แปลงเป็น `Cow&lt;str&gt;` |
| `as_ptr()` | ได้ pointer |

---

[← Process](./process) | [Env →](./env)
