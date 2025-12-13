# Path Enums

`Component`, `Prefix` สำหรับ path parsing! 

---

## Component - ส่วนประกอบของ Path

<RustPlayground>

```rust
use std::path::{Path, Component};

fn main() {
 let path = Path::new("/home/user/file.txt");
 
 println!("=== Components of {} ===", path.display());
 for component in path.components() {
 match component {
 Component::RootDir => println!(" RootDir: /"),
 Component::Normal(s) => println!(" Normal: {:?}", s),
 Component::CurDir => println!(" CurDir: ."),
 Component::ParentDir => println!(" ParentDir: .."),
 Component::Prefix(p) => println!(" Prefix: {:?}", p),
 }
 }
 
 // Path พิเศษ
 let paths = [
 "./relative/path",
 "../parent/path",
 "simple",
 ];
 
 for p in paths {
 println!("\n{:?}:", p);
 for c in Path::new(p).components() {
 println!(" {:?}", c);
 }
 }
}
```

</RustPlayground>

---

## Prefix (Windows)

<RustPlayground>

```rust
use std::path::Path;

fn main() {
 // Prefix ใช้บน Windows
 // C:\Users\name -> Prefix(C:), RootDir, Normal("Users"), Normal("name")
 
 #[cfg(windows)]
 {
 let path = Path::new(r"C:\Users\name");
 for c in path.components() {
 println!("{:?}", c);
 }
 }
 
 // บน Unix ไม่มี Prefix
 println!("Running on Unix - no Prefix component");
 
 // ตัวอย่าง Unix path
 let path = Path::new("/usr/local/bin");
 for c in path.components() {
 println!("{:?}", c);
 }
}
```

</RustPlayground>

---

## Path Manipulation

<RustPlayground>

```rust
use std::path::{Path, PathBuf, Component};

fn normalize_path(path: &Path) -> PathBuf {
 let mut result = PathBuf::new();
 
 for component in path.components() {
 match component {
 Component::ParentDir => {
 result.pop();
 }
 Component::CurDir => {
 // ข้าม .
 }
 c => {
 result.push(c);
 }
 }
 }
 
 result
}

fn main() {
 let paths = [
 "/home/user/../other/./file.txt",
 "./a/b/../c",
 "/a/b/c/../../d",
 ];
 
 for p in paths {
 let normalized = normalize_path(Path::new(p));
 println!("{} -> {}", p, normalized.display());
 }
}
```

</RustPlayground>

---

## Quick Reference

### Component
| Variant | คำอธิบาย | ตัวอย่าง |
|---------|---------|---------|
| `RootDir` | Root directory | `/` |
| `Normal(OsStr)` | ชื่อปกติ | `file.txt` |
| `CurDir` | Current directory | `.` |
| `ParentDir` | Parent directory | `..` |
| `Prefix(PrefixComponent)` | Drive prefix (Windows) | `C:` |

### Prefix (Windows only)
| Variant | ตัวอย่าง |
|---------|---------|
| `Disk(u8)` | `C:` |
| `UNC` | `\\server\share` |
| `DeviceNS` | `\\.\device` |
| `Verbatim` | `\\?\path` |

---

[← Convert](./convert) | [Index →](./index)
