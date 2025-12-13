# Env Constants

`std::env::consts` สำหรับ platform information! 

---

## Platform Constants

<RustPlayground>

```rust
use std::env::consts;

fn main() {
 println!("=== Platform Information ===");
 println!("OS = {:?}", consts::OS);
 println!("FAMILY = {:?}", consts::FAMILY);
 println!("ARCH = {:?}", consts::ARCH);
 
 println!("\n=== Executable Extensions ===");
 println!("EXE_EXTENSION = {:?}", consts::EXE_EXTENSION);
 println!("EXE_SUFFIX = {:?}", consts::EXE_SUFFIX);
 
 println!("\n=== Library Extensions ===");
 println!("DLL_EXTENSION = {:?}", consts::DLL_EXTENSION);
 println!("DLL_PREFIX = {:?}", consts::DLL_PREFIX);
 println!("DLL_SUFFIX = {:?}", consts::DLL_SUFFIX);
}
```

</RustPlayground>

---

## Conditional Compilation

<RustPlayground>

```rust
use std::env::consts;

fn main() {
 // ใช้ constants สำหรับ runtime check
 match consts::OS {
 "linux" => println!("Running on Linux"),
 "macos" => println!("Running on macOS"),
 "windows" => println!("Running on Windows"),
 _ => println!("Running on {}", consts::OS),
 }
 
 // สร้าง executable path
 let exe_name = format!("myapp{}", consts::EXE_SUFFIX);
 println!("\nExecutable name: {}", exe_name);
 
 // สร้าง library path
 let lib_name = format!("{}mylib{}", 
 consts::DLL_PREFIX, 
 consts::DLL_SUFFIX);
 println!("Library name: {}", lib_name);
 
 // Architecture check
 match consts::ARCH {
 "x86_64" => println!("\n64-bit x86"),
 "aarch64" => println!("\n64-bit ARM"),
 "x86" => println!("\n32-bit x86"),
 _ => println!("\nArch: {}", consts::ARCH),
 }
}
```

</RustPlayground>

---

## Compile-time vs Runtime

<RustPlayground>

```rust
fn main() {
 // compile-time (cfg)
 #[cfg(target_os = "linux")]
 println!("Compiled for Linux");
 
 #[cfg(target_os = "macos")]
 println!("Compiled for macOS");
 
 #[cfg(target_os = "windows")]
 println!("Compiled for Windows");
 
 // runtime (consts)
 // ค่าเหมือนกัน แต่ตรวจสอบ runtime
 println!("\nRuntime OS: {}", std::env::consts::OS);
 
 // cfg! macro - boolean ที่ compile time
 if cfg!(target_os = "linux") {
 println!("This is Linux (cfg!)");
 }
 
 println!("\nTarget family: {}", std::env::consts::FAMILY);
}
```

</RustPlayground>

---

## Quick Reference

### OS Values
| OS | `consts::OS` | `consts::FAMILY` |
|----|--------------|------------------|
| Linux | "linux" | "unix" |
| macOS | "macos" | "unix" |
| Windows | "windows" | "windows" |
| FreeBSD | "freebsd" | "unix" |
| Android | "android" | "unix" |

### Architecture Values
| Arch | `consts::ARCH` |
|------|----------------|
| 64-bit x86 | "x86_64" |
| 32-bit x86 | "x86" |
| 64-bit ARM | "aarch64" |
| 32-bit ARM | "arm" |
| RISC-V 64 | "riscv64" |

### File Extensions
| Platform | EXE_SUFFIX | DLL_PREFIX | DLL_SUFFIX |
|----------|------------|------------|------------|
| Linux | "" | "lib" | ".so" |
| macOS | "" | "lib" | ".dylib" |
| Windows | ".exe" | "" | ".dll" |

---

[← Char](./char) | [Index →](./index)
