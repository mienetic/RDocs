# FFI - เชื่อมต่อกับภาษา C

**std::ffi** มี types สำหรับเชื่อมต่อกับ C และระบบปฏิบัติการ! 

---

## FFI คืออะไร?

**FFI** (Foreign Function Interface) คือการเรียกใช้ฟังก์ชันจากภาษาอื่น:
- เรียก C libraries จาก Rust
- ให้ C เรียก Rust functions
- ใช้งาน OS APIs โดยตรง

:::warning ต้องใช้ unsafe
FFI ส่วนใหญ่ต้องอยู่ใน `unsafe` block เพราะ compiler ตรวจสอบความปลอดภัยไม่ได้!
:::

---

## 1. CString และ CStr

<RustPlayground>

```rust
use std::ffi::{CString, CStr};

fn main() {
 // CString: owned null-terminated string สำหรับส่งไป C
 let c_string = CString::new("สวัสดี C!").unwrap();
 println!("CString: {:?}", c_string);
 
 // ดู bytes (ไม่รวม null)
 println!("bytes: {:?}", c_string.as_bytes());
 
 // ดู bytes (รวม null)
 println!("bytes + null: {:?}", c_string.as_bytes_with_nul());
 
 // ได้ pointer สำหรับ C function
 let ptr = c_string.as_ptr();
 println!("pointer: {:p}", ptr);
 
 // CStr: borrowed null-terminated string
 let c_str: &CStr = c_string.as_c_str();
 println!("CStr: {:?}", c_str);
 
 // แปลงกลับเป็น Rust string
 match c_str.to_str() {
 Ok(s) => println!("กลับเป็น &str: {}", s),
 Err(e) => println!("UTF-8 ไม่ valid: {}", e),
 }
 
 // lossy conversion (แทน invalid bytes)
 println!("lossy: {}", c_str.to_string_lossy());
}
```

</RustPlayground>

---

## 2. CString ไม่รับ Null Bytes

<RustPlayground>

```rust
use std::ffi::CString;

fn main() {
 // CString ไม่สามารถมี null bytes ตรงกลาง!
 let result = CString::new("hello\0world"); // มี \0 ตรงกลาง
 
 match result {
 Ok(_) => println!("สำเร็จ"),
 Err(e) => {
 println!("NulError: {}", e);
 println!(" ตำแหน่ง null: {}", e.nul_position());
 
 // ดึง bytes เดิมกลับมา
 let bytes = e.into_vec();
 println!(" bytes เดิม: {:?}", bytes);
 }
 }
 
 // string ที่ valid
 let valid = CString::new("hello world").unwrap();
 println!("Valid CString: {:?}", valid);
}
```

</RustPlayground>

---

## 3. OsString และ OsStr

<RustPlayground>

```rust
use std::ffi::{OsString, OsStr};
use std::path::Path;

fn main() {
 // OsString: owned platform-native string
 // บน Unix อาจไม่ใช่ valid UTF-8
 let os_string = OsString::from("hello");
 println!("OsString: {:?}", os_string);
 
 // OsStr: borrowed platform-native string
 let os_str: &OsStr = os_string.as_os_str();
 println!("OsStr: {:?}", os_str);
 
 // แปลงเป็น &str (อาจ fail บนบาง platforms)
 match os_str.to_str() {
 Some(s) => println!("เป็น &str: {}", s),
 None => println!("ไม่ใช่ valid UTF-8"),
 }
 
 // Path ใช้ OsStr ภายใน
 let path = Path::new("/home/user");
 let path_os: &OsStr = path.as_os_str();
 println!("Path เป็น OsStr: {:?}", path_os);
 
 // อ่าน environment variables (return OsString)
 if let Some(home) = std::env::var_os("HOME") {
 println!("HOME: {:?}", home);
 }
}
```

</RustPlayground>

:::info OsString vs String
- **String** = valid UTF-8 เสมอ
- **OsString** = อาจไม่ใช่ UTF-8 บางระบบ (เช่น ชื่อไฟล์บน Linux)
:::

---

## 4. C Types

<RustPlayground>

```rust
use std::ffi::{c_char, c_int, c_void};

fn main() {
 // C type aliases ตรงกับ types ใน C
 let _char: c_char = 65; // char ใน C
 let _int: c_int = 42; // int ใน C
 
 println!("=== ขนาด C Types ===");
 println!("c_char: {} bytes", std::mem::size_of::<c_char>());
 println!("c_int: {} bytes", std::mem::size_of::<c_int>());
 
 // c_void สำหรับ opaque pointers
 let x = 42_i32;
 let void_ptr: *const c_void = &x as *const i32 as *const c_void;
 println!("void pointer: {:p}", void_ptr);
 
 // Types อื่นๆ ที่มี:
 // c_schar, c_uchar
 // c_short, c_ushort
 // c_long, c_ulong
 // c_longlong, c_ulonglong
 // c_float, c_double
}
```

</RustPlayground>

---

## 5. เรียก C Functions

```rust
use std::ffi::{c_char, c_int, CString};

// ประกาศ C function ที่ต้องการเรียก
extern "C" {
 fn strlen(s: *const c_char) -> usize;
 fn printf(format: *const c_char, ...) -> c_int;
}

fn main() {
 let s = CString::new("Hello, C!").unwrap();
 
 unsafe {
 // เรียก strlen ของ C
 let len = strlen(s.as_ptr());
 println!("strlen: {}", len);
 
 // เรียก printf ของ C
 let fmt = CString::new("จาก C: %d\n").unwrap();
 printf(fmt.as_ptr(), 42 as c_int);
 }
}
```

:::info extern "C"
`extern "C"` บอก Rust ว่าใช้ C calling convention
:::

---

## 6. ให้ C เรียก Rust Functions

```rust
use std::ffi::{c_char, c_int, CStr, CString};

// Export function สำหรับ C
#[no_mangle] // ไม่ mangle ชื่อ
pub extern "C" fn rust_add(a: c_int, b: c_int) -> c_int {
 a + b
}

// รับ string จาก C
#[no_mangle]
pub unsafe extern "C" fn rust_print(s: *const c_char) {
 // ตรวจ null ก่อน!
 if s.is_null() {
 return;
 }
 
 // แปลง C string เป็น Rust
 let c_str = CStr::from_ptr(s);
 match c_str.to_str() {
 Ok(rust_str) => println!("จาก C: {}", rust_str),
 Err(_) => println!("UTF-8 ไม่ valid"),
 }
}

// Return string ไป C (caller ต้อง free!)
#[no_mangle]
pub extern "C" fn rust_greet(name: *const c_char) -> *mut c_char {
 let c_str = unsafe { CStr::from_ptr(name) };
 let name_str = c_str.to_str().unwrap_or("Unknown");
 let greeting = format!("Hello, {}!", name_str);
 
 // into_raw() ให้ ownership ไป caller
 CString::new(greeting).unwrap().into_raw()
}

// Free string ที่ Rust allocate
#[no_mangle]
pub unsafe extern "C" fn rust_free_string(s: *mut c_char) {
 if !s.is_null() {
 // รับ ownership กลับมาแล้ว drop
 drop(CString::from_raw(s));
 }
}
```

---

## 7. Safety Rules

| ทำ | ไม่ทำ |
|------|--------|
| ตรวจ null pointers | Dereference โดยไม่ตรวจ |
| ใช้ CString สำหรับ owned | ใช้ String ส่งไป C โดยตรง |
| Validate UTF-8 | สมมติว่าเป็น UTF-8 เสมอ |
| Free memory ถูกที่ | ผสม allocators |
| ใช้ unsafe blocks | ซ่อน unsafe |

---

## Quick Reference

### Types
| Type | คำอธิบาย |
|------|---------|
| `CString` | owned null-terminated (→ C) |
| `CStr` | borrowed null-terminated |
| `OsString` | owned platform-native |
| `OsStr` | borrowed platform-native |
| `c_char` | char ใน C |
| `c_int` | int ใน C |
| `c_void` | void ใน C |

### CString Methods
| Method | คำอธิบาย |
|--------|---------|
| `new(s)` | สร้างจาก bytes |
| `as_ptr()` | ได้ raw pointer |
| `as_c_str()` | ได้ &CStr |
| `into_raw()` | ปล่อย ownership (ต้อง free!) |
| `from_raw(ptr)` | รับ ownership คืน |

### CStr Methods
| Method | คำอธิบาย |
|--------|---------|
| `from_ptr(ptr)` | สร้างจาก pointer (unsafe) |
| `to_str()` | `Result<&str, Utf8Error>` |
| `to_string_lossy()` | `Cow<str>` |
| `as_ptr()` | ได้ raw pointer |

### Attributes
| Attribute | คำอธิบาย |
|-----------|---------|
| `#[no_mangle]` | ไม่ mangle ชื่อ function |
| `extern "C"` | ใช้ C calling convention |

---

[← Any](./any) | [Alloc →](./alloc)
