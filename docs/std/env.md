# Environment - ตัวแปรระบบ

**std::env** สำหรับอ่านตัวแปรสภาพแวดล้อม arguments และข้อมูลระบบ! 

---

## env มีอะไร?

- **Environment variables** - `HOME`, `PATH` ฯลฯ
- **Command line arguments** - ข้อมูลที่ส่งมาตอนรัน
- **Current directory** - โฟลเดอร์ปัจจุบัน
- **System info** - OS, architecture

---

## 1. Environment Variables

<RustPlayground>

```rust
use std::env;

fn main() {
 // var - อ่านตัวแปร (return Result)
 match env::var("HOME") {
 Ok(home) => println!("HOME: {}", home),
 Err(e) => println!("HOME not set: {}", e),
 }
 
 // var_os - return OsString (ไม่ต้อง valid UTF-8)
 if let Some(path) = env::var_os("PATH") {
 println!("PATH exists (length: {} bytes)", 
 path.to_string_lossy().len());
 }
 
 // ตรวจว่ามีไหม (ไม่สนใจค่า)
 let has_home = env::var("HOME").is_ok();
 println!("has HOME: {}", has_home);
 
 // ใช้ unwrap_or สำหรับ default
 let editor = env::var("EDITOR").unwrap_or("vim".to_string());
 println!("EDITOR: {}", editor);
}
```

</RustPlayground>

---

## 2. Set/Remove Variables

<RustPlayground>

```rust
use std::env;

fn main() {
 // set_var - ตั้งค่า (เฉพาะ process นี้)
 env::set_var("MY_VAR", "my_value");
 println!("MY_VAR: {:?}", env::var("MY_VAR"));
 
 // remove_var - ลบ
 env::remove_var("MY_VAR");
 println!("MY_VAR after remove: {:?}", env::var("MY_VAR"));
 
 // ตัวอย่างใช้งานจริง: ตั้ง config
 env::set_var("RUST_LOG", "debug");
 env::set_var("DATABASE_URL", "postgres://localhost/mydb");
 
 println!("RUST_LOG: {:?}", env::var("RUST_LOG"));
 println!("DATABASE_URL: {:?}", env::var("DATABASE_URL"));
}
```

</RustPlayground>

---

## 3. List All Variables

<RustPlayground>

```rust
use std::env;

fn main() {
 // vars - iterator ของทุกตัวแปร
 println!("=== Environment Variables (first 10) ===");
 for (key, value) in env::vars().take(10) {
 println!("{}: {}", key, 
 if value.len() > 50 { 
 format!("{}...", &value[..50]) 
 } else { 
 value 
 });
 }
 
 // นับจำนวน
 let count = env::vars().count();
 println!("\nTotal: {} variables", count);
 
 // หาเฉพาะที่ขึ้นต้นด้วย RUST_
 println!("\n=== RUST_* variables ===");
 for (key, value) in env::vars().filter(|(k, _)| k.starts_with("RUST")) {
 println!("{}: {}", key, value);
 }
}
```

</RustPlayground>

---

## 4. Command Line Arguments

<RustPlayground>

```rust
use std::env;

fn main() {
 // args - iterator ของ arguments
 // args[0] = ชื่อโปรแกรม, args[1..] = arguments
 println!("=== Arguments ===");
 for (i, arg) in env::args().enumerate() {
 println!("[{}]: {}", i, arg);
 }
 
 // collect เป็น Vec
 let args: Vec<String> = env::args().collect();
 println!("\nเป็น Vec: {:?}", args);
 
 // args_os - สำหรับ non-UTF8 arguments
 let args_os: Vec<_> = env::args_os().collect();
 println!("args_os: {:?}", args_os);
 
 // ตัวอย่างการใช้งาน
 if args.len() > 1 {
 println!("\nFirst arg: {}", args[1]);
 } else {
 println!("\nNo arguments provided");
 }
}
```

</RustPlayground>

---

## 5. Current Directory

<RustPlayground>

```rust
use std::env;

fn main() {
 // current_dir - โฟลเดอร์ปัจจุบัน
 match env::current_dir() {
 Ok(path) => println!("Current dir: {}", path.display()),
 Err(e) => println!("Error: {}", e),
 }
 
 // set_current_dir - เปลี่ยนโฟลเดอร์
 let original = env::current_dir().unwrap();
 
 if env::set_current_dir("/tmp").is_ok() {
 println!("Changed to: {:?}", env::current_dir());
 
 // กลับมาที่เดิม
 env::set_current_dir(&original).unwrap();
 println!("Back to: {:?}", env::current_dir());
 }
}
```

</RustPlayground>

---

## 6. Executable และ Temp

<RustPlayground>

```rust
use std::env;

fn main() {
 // current_exe - path ของโปรแกรมที่รัน
 match env::current_exe() {
 Ok(path) => println!("Executable: {}", path.display()),
 Err(e) => println!("Error: {}", e),
 }
 
 // temp_dir - โฟลเดอร์ temp ของระบบ
 let temp = env::temp_dir();
 println!("Temp dir: {}", temp.display());
 
 // ตัวอย่างสร้างไฟล์ temp
 let temp_file = temp.join("my_app_data.tmp");
 println!("Temp file path: {}", temp_file.display());
}
```

</RustPlayground>

---

## 7. System Info

<RustPlayground>

```rust
use std::env;

fn main() {
 // consts - ค่าคงที่เกี่ยวกับระบบ
 println!("=== System Info ===");
 println!("OS: {}", env::consts::OS); // "linux", "macos", "windows"
 println!("Family: {}", env::consts::FAMILY); // "unix" หรือ "windows"
 println!("Arch: {}", env::consts::ARCH); // "x86_64", "aarch64"
 println!("DLL ext: {}", env::consts::DLL_EXTENSION); // "so", "dylib", "dll"
 println!("Exe suffix: '{}'", env::consts::EXE_SUFFIX); // "" หรือ ".exe"
 
 // Conditional compilation based on OS
 #[cfg(target_os = "macos")]
 println!("Running on macOS!");
 
 #[cfg(target_os = "linux")]
 println!("Running on Linux!");
 
 #[cfg(target_os = "windows")]
 println!("Running on Windows!");
}
```

</RustPlayground>

---

## 8. Path Separator

<RustPlayground>

```rust
use std::env;

fn main() {
 // split_paths - แยก PATH-style string
 if let Ok(path) = env::var("PATH") {
 println!("=== PATH entries (first 5) ===");
 for entry in env::split_paths(&path).take(5) {
 println!("{}", entry.display());
 }
 }
 
 // join_paths - รวม paths
 let paths = vec!["/usr/bin", "/usr/local/bin", "/home/user/bin"];
 let joined = env::join_paths(paths).expect("join failed");
 println!("\nJoined: {:?}", joined);
}
```

</RustPlayground>

---

## Quick Reference

### Environment Variables
| Function | คำอธิบาย |
|----------|---------|
| `var(key)` | อ่าน (Result) |
| `var_os(key)` | อ่าน (`Option<OsString>`) |
| `set_var(key, val)` | ตั้งค่า |
| `remove_var(key)` | ลบ |
| `vars()` | ทุกตัวแปร |

### Arguments & Paths
| Function | คำอธิบาย |
|----------|---------|
| `args()` | command line args |
| `current_dir()` | โฟลเดอร์ปัจจุบัน |
| `set_current_dir(p)` | เปลี่ยนโฟลเดอร์ |
| `current_exe()` | path ของ executable |
| `temp_dir()` | temp folder |

### System Constants (env::consts)
| Constant | ตัวอย่าง |
|----------|---------|
| `OS` | "linux", "macos", "windows" |
| `FAMILY` | "unix", "windows" |
| `ARCH` | "x86_64", "aarch64" |
| `EXE_SUFFIX` | "", ".exe" |

---

[← Path](./path) | [Process →](./process)
