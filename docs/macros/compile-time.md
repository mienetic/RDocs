# Compile-time Macros - ทำงานตอน Compile

Macros ที่ทำงานตอน compile time! 

---

## cfg! - ตรวจ configuration

<RustPlayground>

```rust
fn main() {
 // ตรวจ debug/release mode
 if cfg!(debug_assertions) {
 println!("Running in DEBUG mode");
 } else {
 println!("Running in RELEASE mode");
 }
 
 // ตรวจ OS
 if cfg!(target_os = "windows") {
 println!("Windows");
 } else if cfg!(target_os = "macos") {
 println!("macOS");
 } else if cfg!(target_os = "linux") {
 println!("Linux");
 } else {
 println!("Other OS");
 }
 
 // ตรวจ architecture
 if cfg!(target_arch = "x86_64") {
 println!("64-bit Intel/AMD");
 } else if cfg!(target_arch = "aarch64") {
 println!("64-bit ARM");
 }
}
```

</RustPlayground>

---

## env! - อ่าน environment variable

<RustPlayground>

```rust
fn main() {
 // env! ต้องมีค่าตอน compile ไม่งั้น error
 let cargo_pkg_name = env!("CARGO_PKG_NAME");
 let cargo_pkg_version = env!("CARGO_PKG_VERSION");
 
 println!("Package: {} v{}", cargo_pkg_name, cargo_pkg_version);
 
 // option_env! return Option
 let custom = option_env!("MY_CUSTOM_VAR");
 match custom {
 Some(v) => println!("MY_CUSTOM_VAR = {}", v),
 None => println!("MY_CUSTOM_VAR not set"),
 }
}
```

</RustPlayground>

---

## file!, line!, column! - ตำแหน่งใน source code

<RustPlayground>

```rust
macro_rules! log {
 ($msg:expr) => {
 println!("[{}:{}] {}", file!(), line!(), $msg);
 };
}

fn main() {
 println!("file: {}", file!());
 println!("line: {}", line!());
 println!("column: {}", column!());
 
 // ใช้สร้าง log macro
 log!("Hello!");
 log!("World!");
}
```

</RustPlayground>

---

## module_path! - ชื่อ module

<RustPlayground>

```rust
mod my_module {
 pub fn print_path() {
 println!("module_path: {}", module_path!());
 }
}

fn main() {
 println!("main module: {}", module_path!());
 my_module::print_path();
}
```

</RustPlayground>

---

## stringify! - แปลง code เป็น &str

<RustPlayground>

```rust
macro_rules! debug_var {
 ($var:expr) => {
 println!("{} = {:?}", stringify!($var), $var);
 };
}

fn main() {
 let x = 42;
 let y = vec![1, 2, 3];
 
 // stringify! แปลง expression เป็นข้อความ
 println!("expression: {}", stringify!(x + y * 2));
 
 debug_var!(x);
 debug_var!(y);
 debug_var!(x * 2 + 1);
}
```

</RustPlayground>

---

## concat! - รวม string literals

<RustPlayground>

```rust
fn main() {
 // concat! รวม string literals ตอน compile
 const GREETING: &str = concat!("Hello", ", ", "World", "!");
 println!("{}", GREETING);
 
 // ใช้กับ numbers ได้ด้วย (แปลงเป็น string)
 const VERSION: &str = concat!("v", 1, ".", 2, ".", 3);
 println!("Version: {}", VERSION);
 
 // ใช้สร้าง path
 const PATH: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/src/main.rs");
 println!("Path: {}", PATH);
}
```

</RustPlayground>

---

## include_str! และ include_bytes!

<RustPlayground>

```rust
fn main() {
 // include_str! อ่านไฟล์เป็น &str ตอน compile
 // (ต้องมีไฟล์อยู่จริงตอน compile)
 
 // const README: &str = include_str!("../README.md");
 // println!("{}", README);
 
 // include_bytes! อ่านเป็น &[u8]
 // const IMAGE: &[u8] = include_bytes!("../logo.png");
 // println!("Image size: {} bytes", IMAGE.len());
 
 // ตัวอย่าง inline string
 let sample = "This would be file content";
 println!("Sample: {}", sample);
}
```

</RustPlayground>

---

## include! - รวม Rust code

<RustPlayground>

```rust
fn main() {
 // include! จะ include Rust code จากไฟล์อื่น
 // เหมือน copy-paste ตอน compile
 
 // include!("generated_code.rs");
 
 // ใช้สำหรับ code ที่ generate อัตโนมัติ
 // เช่น build.rs สร้าง OUT_DIR/generated.rs
 // include!(concat!(env!("OUT_DIR"), "/generated.rs"));
 
 println!("include! is useful for generated code");
}
```

</RustPlayground>

---

## thread_local! - Thread-local storage

<RustPlayground>

```rust
use std::cell::RefCell;

thread_local! {
 static COUNTER: RefCell<u32> = RefCell::new(0);
 static NAME: RefCell<String> = RefCell::new(String::from("main"));
}

fn main() {
 // อ่านค่า
 COUNTER.with(|c| {
 println!("counter = {}", *c.borrow());
 });
 
 // เปลี่ยนค่า
 COUNTER.with(|c| {
 *c.borrow_mut() += 1;
 });
 
 COUNTER.with(|c| {
 println!("counter after = {}", *c.borrow());
 });
 
 // แต่ละ thread มี copy ของตัวเอง
 NAME.with(|n| {
 println!("name = {}", n.borrow());
 });
}
```

</RustPlayground>

---

## compile_error! - สร้าง compile error

<RustPlayground>

```rust
// compile_error! ใช้สร้าง error ตอน compile
// มักใช้ใน macros

macro_rules! check_feature {
 () => {
 // ตรวจสอบ feature flag
 #[cfg(not(feature = "my_feature"))]
 compile_error!("feature 'my_feature' is required!");
 };
}

fn main() {
 // ถ้าใช้ compile_error! ตรงๆ จะ compile ไม่ผ่าน
 // compile_error!("This won't compile!");
 
 println!("compile_error! is useful for validation");
}
```

</RustPlayground>

---

## concat_bytes! - รวม bytes (unstable)

<RustPlayground>

```rust
fn main() {
 // concat_bytes! รวม byte slices (unstable feature)
 // #![feature(concat_bytes)]
 // const BYTES: &[u8] = concat_bytes!(b"Hello", b" ", b"World");
 
 // ใช้แบบ stable:
 const HELLO: &[u8] = b"Hello World";
 println!("bytes: {:?}", HELLO);
 println!("as str: {}", std::str::from_utf8(HELLO).unwrap());
}
```

</RustPlayground>

---

## Quick Reference

### Configuration
| Macro | ใช้ทำอะไร |
|-------|----------|
| `cfg!(...)` | ตรวจ compile config |
| `env!("VAR")` | อ่าน env var (ต้องมี) |
| `option_env!("VAR")` | อ่าน env var (Option) |
| `compile_error!("msg")` | สร้าง compile error |

### Source Location
| Macro | Return |
|-------|--------|
| `file!()` | ชื่อไฟล์ |
| `line!()` | เลขบรรทัด |
| `column!()` | เลข column |
| `module_path!()` | ชื่อ module |

### String/Data
| Macro | ใช้ทำอะไร |
|-------|----------|
| `stringify!(expr)` | Expression → &str |
| `concat!(...)` | รวม literals |
| `include_str!("path")` | ไฟล์ → &str |
| `include_bytes!("path")` | ไฟล์ → &[u8] |
| `include!("path")` | ไฟล์ → Rust code |

### Threading
| Macro | ใช้ทำอะไร |
|-------|----------|
| `thread_local!` | Thread-local storage |

---

[← Data](./data) | [กลับ Index →](./index)

