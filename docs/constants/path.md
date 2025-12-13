# Path Constants

`std::path` constants สำหรับ path separators! 

---

## MAIN_SEPARATOR

<RustPlayground>

```rust
use std::path::MAIN_SEPARATOR;

fn main() {
 println!("=== Path Separator ===");
 println!("MAIN_SEPARATOR = '{}'", MAIN_SEPARATOR);
 
 // สร้าง path แบบ cross-platform
 let parts = ["home", "user", "documents", "file.txt"];
 let path: String = parts.join(&MAIN_SEPARATOR.to_string());
 println!("Path: {}", path);
 
 // ใช้กับ PathBuf ดีกว่า
 use std::path::PathBuf;
 let mut path = PathBuf::new();
 path.push("home");
 path.push("user");
 path.push("documents");
 println!("PathBuf: {:?}", path);
}
```

</RustPlayground>

---

## MAIN_SEPARATOR_STR

<RustPlayground>

```rust
use std::path::MAIN_SEPARATOR_STR;

fn main() {
 println!("MAIN_SEPARATOR_STR = {:?}", MAIN_SEPARATOR_STR);
 
 // ใช้ join ได้เลย
 let parts = vec!["usr", "local", "bin"];
 let path = parts.join(MAIN_SEPARATOR_STR);
 println!("Joined: {}", path);
 
 // Split path
 let path = "/home/user/file.txt";
 let parts: Vec<&str> = path.split(MAIN_SEPARATOR_STR).collect();
 println!("Parts: {:?}", parts);
}
```

</RustPlayground>

---

## Cross-Platform Paths

<RustPlayground>

```rust
use std::path::{Path, MAIN_SEPARATOR};

fn main() {
 // Platform ที่รันอยู่
 if MAIN_SEPARATOR == '/' {
 println!("Running on Unix-like system");
 } else if MAIN_SEPARATOR == '\\' {
 println!("Running on Windows");
 }
 
 // ใช้ Path methods แทน hardcode separator
 let path = Path::new("/home/user/file.txt");
 
 println!("\n=== Path components ===");
 for component in path.components() {
 println!(" {:?}", component);
 }
 
 println!("\nParent: {:?}", path.parent());
 println!("File name: {:?}", path.file_name());
 println!("Extension: {:?}", path.extension());
}
```

</RustPlayground>

---

## Quick Reference

### Path Constants
| Constant | Unix | Windows | คำอธิบาย |
|----------|------|---------|---------|
| `MAIN_SEPARATOR` | `/` | `\` | Path separator (char) |
| `MAIN_SEPARATOR_STR` | `"/"` | `"\\"` | Path separator (str) |

### Tips
- ใช้ `Path`/`PathBuf` แทน string manipulation
- `path.push()` จัดการ separator อัตโนมัติ
- `path.join()` รวม paths อย่างถูกต้อง

---

[← Math](./math) | [Time →](./time)
