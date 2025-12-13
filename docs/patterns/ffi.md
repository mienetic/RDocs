# FFI Patterns

Pattern สำหรับ Foreign Function Interface กับ C! 

---

## Calling C from Rust

<RustPlayground>

```rust
// ประกาศ external C functions
extern "C" {
 fn abs(input: i32) -> i32;
 fn sqrt(x: f64) -> f64;
}

fn main() {
 unsafe {
 println!("abs(-5) = {}", abs(-5));
 println!("sqrt(25) = {}", sqrt(25.0));
 }
}
```

</RustPlayground>

---

## Exposing Rust to C

```rust
// ทำให้ C เรียก Rust ได้
#[no_mangle]
pub extern "C" fn rust_add(a: i32, b: i32) -> i32 {
 a + b
}

#[no_mangle]
pub extern "C" fn rust_greet(name: *const std::ffi::c_char) {
 let c_str = unsafe {
 std::ffi::CStr::from_ptr(name)
 };
 
 if let Ok(s) = c_str.to_str() {
 println!("Hello, {}!", s);
 }
}
```

---

## C Strings

<RustPlayground>

```rust
use std::ffi::{CStr, CString};

fn main() {
 // Rust String -> CString (for passing to C)
 let rust_string = "Hello, C!";
 let c_string = CString::new(rust_string).unwrap();
 
 // Get pointer for C
 let ptr = c_string.as_ptr();
 
 // CStr -> Rust (for receiving from C)
 unsafe {
 let received = CStr::from_ptr(ptr);
 println!("From C: {:?}", received.to_str());
 }
}
```

</RustPlayground>

---

## C Structs

```rust
// C-compatible struct layout
#[repr(C)]
pub struct Point {
 pub x: f64,
 pub y: f64,
}

#[repr(C)]
pub struct Color {
 pub r: u8,
 pub g: u8,
 pub b: u8,
 pub a: u8,
}

// Use with C functions
extern "C" {
 fn draw_point(p: Point);
 fn set_color(c: Color);
}
```

---

## Opaque Types

```rust
// Opaque pointer pattern
#[repr(C)]
pub struct Database {
 _private: [u8; 0], // Zero-sized, opaque
}

#[no_mangle]
pub extern "C" fn db_create() -> *mut Database {
 let db = Box::new(RealDatabase::new());
 Box::into_raw(db) as *mut Database
}

#[no_mangle]
pub extern "C" fn db_destroy(db: *mut Database) {
 if !db.is_null() {
 unsafe {
 let _ = Box::from_raw(db as *mut RealDatabase);
 }
 }
}

struct RealDatabase {
 // internal implementation
}

impl RealDatabase {
 fn new() -> Self { RealDatabase {} }
}
```

---

## Callbacks

```rust
// C callback type
type Callback = extern "C" fn(i32) -> i32;

#[no_mangle]
pub extern "C" fn register_callback(cb: Callback) {
 let result = cb(42);
 println!("Callback returned: {}", result);
}

// Rust callback implementation
extern "C" fn my_callback(x: i32) -> i32 {
 x * 2
}

fn main() {
 register_callback(my_callback);
}
```

---

## Error Handling

```rust
use std::ffi::c_int;

#[repr(C)]
pub enum ErrorCode {
 Ok = 0,
 InvalidInput = 1,
 OutOfMemory = 2,
 Unknown = -1,
}

#[no_mangle]
pub extern "C" fn do_operation(input: c_int) -> ErrorCode {
 if input < 0 {
 return ErrorCode::InvalidInput;
 }
 
 // Do work...
 
 ErrorCode::Ok
}
```

---

## Quick Reference

| Item | Rust | C |
|------|------|---|
| `i8` | i8 | `int8_t` |
| `u8` | u8 | `uint8_t` |
| `i32` | i32 | `int32_t` |
| `f32` | f32 | `float` |
| `f64` | f64 | `double` |
| `*const T` | raw pointer | `const T*` |
| `*mut T` | raw pointer | `T*` |
| `()` | unit | `void` |

---

## Tools

- **cbindgen** - Generate C headers from Rust
- **bindgen** - Generate Rust from C headers
- **cxx** - Safe C++/Rust interop

---

[← Unsafe](/patterns/unsafe) | [Lifetime →](/patterns/lifetime)
