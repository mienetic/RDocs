# Path Structs - เส้นทางไฟล์

`Path`, `PathBuf`, `OsStr`, `OsString` สำหรับจัดการ paths! 

---

## Path - Path Reference

<RustPlayground>

```rust
use std::path::Path;

fn main() {
 let path = Path::new("/home/user/document.txt");
 
 // แยกส่วนต่างๆ
 println!("full: {:?}", path);
 println!("parent: {:?}", path.parent());
 println!("file_name: {:?}", path.file_name());
 println!("extension: {:?}", path.extension());
 println!("stem: {:?}", path.file_stem());
 
 // ตรวจสอบ
 println!("exists: {}", path.exists());
 println!("is_file: {}", path.is_file());
 println!("is_dir: {}", path.is_dir());
 println!("is_absolute: {}", path.is_absolute());
}
```

</RustPlayground>

---

## PathBuf - Owned Path

<RustPlayground>

```rust
use std::path::PathBuf;

fn main() {
 // สร้าง PathBuf
 let mut path = PathBuf::new();
 path.push("/home");
 path.push("user");
 path.push("documents");
 println!("path = {:?}", path);
 
 // จาก String
 let path2 = PathBuf::from("/tmp/test.txt");
 println!("path2 = {:?}", path2);
 
 // แก้ไข
 let mut path3 = PathBuf::from("/home/user/file.txt");
 path3.set_extension("md");
 println!("changed ext: {:?}", path3);
 
 path3.set_file_name("new_file.rs");
 println!("changed name: {:?}", path3);
}
```

</RustPlayground>

---

## Path Operations

<RustPlayground>

```rust
use std::path::{Path, PathBuf};

fn main() {
 // join paths
 let base = Path::new("/home/user");
 let full = base.join("documents").join("file.txt");
 println!("joined: {:?}", full);
 
 // components
 let path = Path::new("/home/user/file.txt");
 for component in path.components() {
 println!("component: {:?}", component);
 }
 
 // ancestors
 println!("\nancestors:");
 for ancestor in path.ancestors() {
 println!(" {:?}", ancestor);
 }
}
```

</RustPlayground>

---

## Quick Reference

| Type | คำอธิบาย |
|------|---------|
| `Path` | Path reference (เหมือน `&str`) |
| `PathBuf` | Owned path (เหมือน `String`) |
| `OsStr` | OS string reference |
| `OsString` | Owned OS string |

### Common Methods
| Method | คำอธิบาย |
|--------|---------|
| `join()` | รวม paths |
| `parent()` | directory ที่อยู่ |
| `file_name()` | ชื่อไฟล์ |
| `extension()` | นามสกุล |
| `exists()` | มีจริงไหม |
| `is_file()` | เป็นไฟล์ไหม |
| `is_dir()` | เป็น directory ไหม |

---

[← I/O](./io) | [Time →](./time)
