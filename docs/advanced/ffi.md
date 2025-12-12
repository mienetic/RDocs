# FFI - Foreign Function Interface

เชื่อมต่อ Rust กับ C และภาษาอื่น! 🔗

:::tip FFI คือสะพานเชื่อมภาษา
FFI ช่วยให้ Rust เรียก C libraries หรือให้ภาษาอื่นเรียก Rust ได้!
:::

---

## 1. เรียก C จาก Rust

### 1.1 Basic C Function

```rust
// ประกาศ external function
extern "C" {
    fn abs(x: i32) -> i32;
    fn sqrt(x: f64) -> f64;
}

fn main() {
    unsafe {
        println!("abs(-5) = {}", abs(-5));
        println!("sqrt(16) = {}", sqrt(16.0));
    }
}
```

### 1.2 Linking to C Library

```rust
// Link to a specific library
#[link(name = "m")]  // libm - math library
extern "C" {
    fn sin(x: f64) -> f64;
    fn cos(x: f64) -> f64;
}

fn main() {
    unsafe {
        let pi = std::f64::consts::PI;
        println!("sin(π/2) = {}", sin(pi / 2.0));
        println!("cos(0) = {}", cos(0.0));
    }
}
```

---

## 2. C Types

### 2.1 Primitive Types

| C Type | Rust Type |
|--------|-----------|
| `int` | `c_int` |
| `unsigned int` | `c_uint` |
| `long` | `c_long` |
| `char` | `c_char` |
| `void*` | `*mut c_void` |
| `const char*` | `*const c_char` |
| `size_t` | `usize` |

```rust
use std::os::raw::{c_int, c_char, c_void};
use std::ffi::{CStr, CString};

extern "C" {
    fn strlen(s: *const c_char) -> usize;
}

fn main() {
    let s = CString::new("Hello").unwrap();
    unsafe {
        let len = strlen(s.as_ptr());
        println!("Length: {}", len);
    }
}
```

### 2.2 Strings

```rust
use std::ffi::{CStr, CString};
use std::os::raw::c_char;

// Rust String -> C string
fn to_c_string(s: &str) -> CString {
    CString::new(s).expect("CString conversion failed")
}

// C string -> Rust &str
unsafe fn from_c_string(ptr: *const c_char) -> &'static str {
    CStr::from_ptr(ptr).to_str().unwrap()
}
```

---

## 3. Structs

### 3.1 repr(C)

```rust
// ใช้ #[repr(C)] เพื่อให้ layout เหมือน C
#[repr(C)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

extern "C" {
    fn calculate_distance(p1: Point, p2: Point) -> f64;
}

fn main() {
    let p1 = Point { x: 0.0, y: 0.0 };
    let p2 = Point { x: 3.0, y: 4.0 };
    
    unsafe {
        let dist = calculate_distance(p1, p2);
        println!("Distance: {}", dist);
    }
}
```

### 3.2 Opaque Types

```rust
// เมื่อไม่รู้ layout ของ struct
#[repr(C)]
pub struct OpaqueHandle {
    _private: [u8; 0],  // Zero-sized, can't be instantiated
}

extern "C" {
    fn create_handle() -> *mut OpaqueHandle;
    fn use_handle(h: *mut OpaqueHandle);
    fn destroy_handle(h: *mut OpaqueHandle);
}
```

---

## 4. Callbacks

```rust
// C-compatible function pointer
extern "C" fn rust_callback(value: i32) {
    println!("Callback called with: {}", value);
}

extern "C" {
    fn register_callback(cb: extern "C" fn(i32));
}

fn main() {
    unsafe {
        register_callback(rust_callback);
    }
}
```

### 4.1 With User Data

```rust
extern "C" fn callback_with_data(value: i32, user_data: *mut std::ffi::c_void) {
    unsafe {
        let counter = user_data as *mut i32;
        *counter += value;
    }
}

extern "C" {
    fn register_callback_ex(
        cb: extern "C" fn(i32, *mut std::ffi::c_void),
        user_data: *mut std::ffi::c_void
    );
}
```

---

## 5. Export Rust to C

### 5.1 Export Functions

```rust
// Rust function callable from C
#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[no_mangle]
pub extern "C" fn greet(name: *const std::os::raw::c_char) {
    use std::ffi::CStr;
    
    let name = unsafe { CStr::from_ptr(name) };
    println!("Hello, {}!", name.to_str().unwrap());
}
```

### 5.2 Header Generation (cbindgen)

```toml
# cbindgen.toml
language = "C"
include_guard = "MY_LIB_H"
```

```bash
# Generate C header
cbindgen --config cbindgen.toml --crate my_lib --output my_lib.h
```

Generated header:
```c
// my_lib.h
#ifndef MY_LIB_H
#define MY_LIB_H

#include <stdint.h>

int32_t add(int32_t a, int32_t b);
void greet(const char *name);

#endif
```

---

## 6. Error Handling

```rust
use std::ffi::c_int;

// Return error code
#[no_mangle]
pub extern "C" fn divide(a: i32, b: i32, result: *mut i32) -> c_int {
    if b == 0 {
        return -1;  // Error code
    }
    
    unsafe {
        *result = a / b;
    }
    0  // Success
}

// Or return nullable pointer
#[no_mangle]
pub extern "C" fn create_data() -> *mut Data {
    match try_create() {
        Ok(data) => Box::into_raw(Box::new(data)),
        Err(_) => std::ptr::null_mut(),
    }
}
```

---

## 7. Memory Management

### 7.1 Rust Allocates, C Uses

```rust
// Rust creates, C uses, Rust destroys
#[no_mangle]
pub extern "C" fn create_string() -> *mut std::os::raw::c_char {
    let s = CString::new("Hello from Rust").unwrap();
    s.into_raw()
}

#[no_mangle]
pub extern "C" fn free_string(ptr: *mut std::os::raw::c_char) {
    if !ptr.is_null() {
        unsafe {
            drop(CString::from_raw(ptr));
        }
    }
}
```

### 7.2 Box for Heap Data

```rust
#[repr(C)]
pub struct Data {
    value: i32,
}

#[no_mangle]
pub extern "C" fn create_data(value: i32) -> *mut Data {
    Box::into_raw(Box::new(Data { value }))
}

#[no_mangle]
pub extern "C" fn get_value(data: *const Data) -> i32 {
    unsafe { (*data).value }
}

#[no_mangle]
pub extern "C" fn free_data(data: *mut Data) {
    if !data.is_null() {
        unsafe {
            drop(Box::from_raw(data));
        }
    }
}
```

---

## 8. bindgen (Auto-generate bindings)

### 8.1 Setup

```toml
[build-dependencies]
bindgen = "0.69"
```

### 8.2 build.rs

```rust
// build.rs
fn main() {
    println!("cargo:rustc-link-lib=mylib");
    
    let bindings = bindgen::Builder::default()
        .header("wrapper.h")
        .generate()
        .expect("Unable to generate bindings");
    
    let out_path = std::path::PathBuf::from(std::env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join("bindings.rs"))
        .expect("Couldn't write bindings!");
}
```

### 8.3 Use

```rust
include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
```

---

## 9. Safety Guidelines

| Do | Don't |
|----|-------|
| ✅ Use `#[repr(C)]` | ❌ Trust C pointers blindly |
| ✅ Check null pointers | ❌ Assume valid UTF-8 |
| ✅ Document ownership | ❌ Mix Rust/C allocators |
| ✅ Use `CString`/`CStr` | ❌ Pass Rust references |
| ✅ Wrap unsafe in safe API | ❌ Panic across FFI boundary |

---

## 10. สรุป

| Concept | Description |
|---------|-------------|
| `extern "C"` | C calling convention |
| `#[no_mangle]` | Disable name mangling |
| `#[repr(C)]` | C-compatible struct layout |
| `CString` | Owned C string |
| `CStr` | Borrowed C string |
| `bindgen` | Generate Rust from C headers |
| `cbindgen` | Generate C headers from Rust |

---

[บทถัดไป: Embedded Rust](/advanced/embedded)
