# Env Structs - Environment Variables

`Args`, `Vars`, `VarsOs` สำหรับ command line และ environment! 

---

## Command Line Arguments

<RustPlayground>

```rust
use std::env;

fn main() {
 // อ่าน arguments
 println!("=== Command Line Arguments ===");
 for (i, arg) in env::args().enumerate() {
 println!(" arg[{}]: {}", i, arg);
 }
 
 // เก็บเป็น Vec
 let args: Vec<String> = env::args().collect();
 println!("\nTotal args: {}", args.len());
 
 // skip ชื่อ program
 let user_args: Vec<String> = env::args().skip(1).collect();
 println!("User args: {:?}", user_args);
}
```

</RustPlayground>

---

## Environment Variables

<RustPlayground>

```rust
use std::env;

fn main() {
 // อ่าน env var
 match env::var("HOME") {
 Ok(val) => println!("HOME: {}", val),
 Err(e) => println!("HOME not found: {}", e),
 }
 
 // ใช้ unwrap_or
 let user = env::var("USER").unwrap_or("unknown".to_string());
 println!("USER: {}", user);
 
 // ดู env vars ทั้งหมด (first 5)
 println!("\n=== Environment Variables ===");
 for (key, value) in env::vars().take(5) {
 let v = if value.len() > 30 {
 format!("{}...", &value[..30])
 } else {
 value
 };
 println!(" {}: {}", key, v);
 }
}
```

</RustPlayground>

---

## Set/Remove Env Vars

<RustPlayground>

```rust
use std::env;

fn main() {
 // ตั้งค่า env var
 env::set_var("MY_VAR", "hello rust");
 println!("MY_VAR: {:?}", env::var("MY_VAR"));
 
 // ลบ env var
 env::remove_var("MY_VAR");
 println!("MY_VAR after remove: {:?}", env::var("MY_VAR"));
 
 // Warning: set_var/remove_var ไม่ thread-safe!
 // ใช้เฉพาะตอนเริ่ม program
}
```

</RustPlayground>

---

## Current Directory

<RustPlayground>

```rust
use std::env;
use std::path::PathBuf;

fn main() {
 // อ่าน current directory
 match env::current_dir() {
 Ok(path) => println!("current dir: {}", path.display()),
 Err(e) => println!("error: {}", e),
 }
 
 // อ่าน executable path
 match env::current_exe() {
 Ok(path) => println!("executable: {}", path.display()),
 Err(e) => println!("error: {}", e),
 }
 
 // อ่าน temp directory
 let temp = env::temp_dir();
 println!("temp dir: {}", temp.display());
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย |
|------|---------|
| `Args` | Iterator สำหรับ arguments |
| `ArgsOs` | Iterator (OsString) |
| `Vars` | Iterator สำหรับ env vars |
| `VarsOs` | Iterator (OsString keys/values) |

### Functions
| Function | คำอธิบาย |
|----------|---------|
| `args()` | Command line arguments |
| `args_os()` | Arguments as OsString |
| `var(key)` | อ่าน env var |
| `var_os(key)` | อ่านเป็น OsString |
| `vars()` | Iterator ทุก env vars |
| `set_var(k, v)` | ตั้งค่า env var |
| `remove_var(k)` | ลบ env var |
| `current_dir()` | Current directory |
| `current_exe()` | Path to executable |
| `temp_dir()` | Temp directory |
| `home_dir()` | Home directory (deprecated) |

---

[← FFI](./ffi) | [กลับ Index →](./index)
