# Environment Functions (std::env)

Functions สำหรับจัดการ Environment Variables และ Arguments! 

---

## args

ดึง Command Line Arguments

<RustPlayground>

```rust
use std::env;

fn main() {
 // ใน Playground จะได้ค่าว่าง
 // แต่ตอนรันจริง: cargo run arg1 arg2
 
 let args: Vec<String> = env::args().collect();
 
 println!("Number of args: {}", args.len());
 for (i, arg) in args.iter().enumerate() {
 println!("Arg {}: {}", i, arg);
 }
 
 // ตัวอย่าง: ถ้ารัน "./program hello world"
 // Arg 0: ./program
 // Arg 1: hello
 // Arg 2: world
}
```

</RustPlayground>

---

## var

อ่าน Environment Variable

<RustPlayground>

```rust
use std::env;

fn main() {
 // อ่าน PATH (มักจะมีอยู่แล้ว)
 match env::var("PATH") {
 Ok(val) => println!("PATH length: {} chars", val.len()),
 Err(e) => println!("PATH not found: {}", e),
 }
 
 // อ่าน variable ที่อาจไม่มี
 let home = env::var("HOME").unwrap_or_else(|_| "Unknown".to_string());
 println!("HOME: {}", home);
 
 // ตั้ง variable ใหม่ (สำหรับ process นี้เท่านั้น)
 env::set_var("MY_VAR", "my_value");
 println!("MY_VAR: {}", env::var("MY_VAR").unwrap());
}
```

</RustPlayground>

---

## current_dir

ดึง Current Working Directory

<RustPlayground>

```rust
use std::env;

fn main() {
 match env::current_dir() {
 Ok(path) => println!("Current dir: {}", path.display()),
 Err(e) => println!("Error: {}", e),
 }
}
```

</RustPlayground>

---

## temp_dir

ดึง Temporary Directory ของระบบ

<RustPlayground>

```rust
use std::env;

fn main() {
 let temp = env::temp_dir();
 println!("Temp dir: {}", temp.display());
 
 // ใช้ร่วมกับการสร้างไฟล์ชั่วคราว
 let temp_file = temp.join("my_temp_file.txt");
 println!("Temp file path: {}", temp_file.display());
}
```

</RustPlayground>

---

## vars

ดึง Environment Variables ทั้งหมด

<RustPlayground>

```rust
use std::env;

fn main() {
 println!("Environment Variables (first 5):");
 
 for (i, (key, value)) in env::vars().enumerate() {
 if i >= 5 { break; }
 println!(" {}: {} chars", key, value.len());
 }
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `args()` | Command line args | `Args` (Iterator) |
| `args_os()` | Args แบบ OsString | `ArgsOs` |
| `var(key)` | อ่าน env var | `Result<String>` |
| `var_os(key)` | อ่านแบบ OsString | `Option<OsString>` |
| `set_var(key, val)` | ตั้ง env var | `()` |
| `remove_var(key)` | ลบ env var | `()` |
| `vars()` | ดึงทั้งหมด | Iterator |
| `current_dir()` | Current dir | `Result<PathBuf>` |
| `set_current_dir(p)` | เปลี่ยน dir | `Result<()>` |
| `temp_dir()` | Temp dir | `PathBuf` |

---

[← File System](./fs) | [Thread →](./thread)
