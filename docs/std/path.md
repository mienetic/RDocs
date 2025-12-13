# Path - เส้นทางไฟล์

**std::path** สำหรับจัดการเส้นทางไฟล์แบบ cross-platform! 

---

## Path vs PathBuf

| Type | เปรียบเทียบ | ความสัมพันธ์ |
|------|------------|-------------|
| `Path` | เหมือน `&str` | ยืม ไม่แก้ไขได้ |
| `PathBuf` | เหมือน `String` | เป็นเจ้าของ แก้ไขได้ |

:::tip เลือกอันไหน?
- ใช้ `&Path` สำหรับ parameters (ยืดหยุ่นกว่า)
- ใช้ `PathBuf` เมื่อต้องเก็บหรือแก้ไข
:::

---

## 1. สร้าง Path

<RustPlayground>

```rust
use std::path::{Path, PathBuf};

fn main() {
 // Path - จาก string literal
 let p = Path::new("/home/user/file.txt");
 println!("Path: {:?}", p);
 
 // PathBuf - สร้างว่าง
 let mut path_buf = PathBuf::new();
 path_buf.push("/home");
 path_buf.push("user");
 path_buf.push("file.txt");
 println!("PathBuf: {:?}", path_buf);
 
 // PathBuf - จาก string
 let path_buf2 = PathBuf::from("/home/user/file.txt");
 println!("From string: {:?}", path_buf2);
 
 // แปลงระหว่างกัน
 let path: &Path = path_buf.as_path();
 let path_buf3: PathBuf = path.to_path_buf();
 println!("Converted: {:?}", path_buf3);
}
```

</RustPlayground>

---

## 2. ส่วนประกอบของ Path

<RustPlayground>

```rust
use std::path::Path;

fn main() {
 let path = Path::new("/home/user/documents/report.txt");
 
 // file_name - ชื่อไฟล์
 println!("file_name: {:?}", path.file_name()); // "report.txt"
 
 // file_stem - ชื่อไม่รวม extension
 println!("file_stem: {:?}", path.file_stem()); // "report"
 
 // extension - นามสกุล
 println!("extension: {:?}", path.extension()); // "txt"
 
 // parent - โฟลเดอร์แม่
 println!("parent: {:?}", path.parent()); // "/home/user/documents"
 
 // ancestors - ทุก parent
 println!("\n=== ancestors ===");
 for ancestor in path.ancestors() {
 println!("{:?}", ancestor);
 }
}
```

</RustPlayground>

---

## 3. ต่อ Path

<RustPlayground>

```rust
use std::path::{Path, PathBuf};

fn main() {
 // push - เพิ่มต่อท้าย (ใช้กับ PathBuf)
 let mut path = PathBuf::from("/home/user");
 path.push("documents");
 path.push("file.txt");
 println!("push: {:?}", path);
 
 // join - สร้าง PathBuf ใหม่
 let base = Path::new("/home/user");
 let joined = base.join("documents").join("file.txt");
 println!("join: {:?}", joined);
 
 // ระวัง! join กับ absolute path จะ replace
 let result = base.join("/etc/config");
 println!("join absolute: {:?}", result); // "/etc/config"
 
 // pop - ลบส่วนท้าย
 let mut path2 = PathBuf::from("/a/b/c");
 path2.pop();
 println!("after pop: {:?}", path2); // "/a/b"
}
```

</RustPlayground>

---

## 4. ตรวจสอบ Path

<RustPlayground>

```rust
use std::path::Path;

fn main() {
 let abs = Path::new("/home/user/file.txt");
 let rel = Path::new("./documents/file.txt");
 
 // is_absolute / is_relative
 println!("abs is_absolute: {}", abs.is_absolute());
 println!("rel is_relative: {}", rel.is_relative());
 
 // exists - มีอยู่จริงไหม
 let cargo = Path::new("Cargo.toml");
 println!("Cargo.toml exists: {}", cargo.exists());
 
 // is_file / is_dir
 println!("is_file: {}", cargo.is_file());
 println!("is_dir: {}", cargo.is_dir());
 
 // has_root
 println!("has_root: {}", abs.has_root());
 
 // starts_with / ends_with
 println!("starts_with /home: {}", abs.starts_with("/home"));
 println!("ends_with .txt: {}", abs.to_str().unwrap().ends_with(".txt"));
}
```

</RustPlayground>

---

## 5. แก้ไข Extension

<RustPlayground>

```rust
use std::path::PathBuf;

fn main() {
 let mut path = PathBuf::from("/home/user/document.txt");
 
 // set_extension - เปลี่ยน extension
 path.set_extension("md");
 println!("change ext: {:?}", path); // ".../document.md"
 
 // set_extension("") - ลบ extension
 path.set_extension("");
 println!("remove ext: {:?}", path); // ".../document"
 
 // with_extension - สร้างใหม่ไม่แก้ต้นฉบับ
 let original = PathBuf::from("/home/report.txt");
 let changed = original.with_extension("pdf");
 println!("original: {:?}", original);
 println!("changed: {:?}", changed);
 
 // set_file_name - เปลี่ยนชื่อไฟล์
 let mut path2 = PathBuf::from("/home/old_name.txt");
 path2.set_file_name("new_name.txt");
 println!("set_file_name: {:?}", path2);
 
 // with_file_name
 let new = original.with_file_name("other.doc");
 println!("with_file_name: {:?}", new);
}
```

</RustPlayground>

---

## 6. Components

<RustPlayground>

```rust
use std::path::{Path, Component};

fn main() {
 let path = Path::new("/home/user/../docs/./file.txt");
 
 // components - แยกส่วน
 println!("=== components ===");
 for comp in path.components() {
 match comp {
 Component::RootDir => println!("RootDir: /"),
 Component::Normal(name) => println!("Normal: {:?}", name),
 Component::ParentDir => println!("ParentDir: .."),
 Component::CurDir => println!("CurDir: ."),
 Component::Prefix(p) => println!("Prefix: {:?}", p),
 }
 }
 
 // iter - เหมือน components แต่เป็น OsStr
 println!("\n=== iter ===");
 for part in path.iter() {
 println!("{:?}", part);
 }
}
```

</RustPlayground>

---

## 7. แปลงเป็น String

<RustPlayground>

```rust
use std::path::{Path, PathBuf};
use std::ffi::OsStr;

fn main() {
 let path = Path::new("/home/user/ไฟล์.txt");
 
 // to_str - แปลงเป็น &str (อาจ None ถ้าไม่ใช่ valid UTF-8)
 match path.to_str() {
 Some(s) => println!("to_str: {}", s),
 None => println!("to_str: not valid UTF-8"),
 }
 
 // to_string_lossy - แปลงเสมอ (แทนที่ invalid chars)
 let lossy = path.to_string_lossy();
 println!("to_string_lossy: {}", lossy);
 
 // as_os_str - เป็น OsStr
 let os_str: &OsStr = path.as_os_str();
 println!("as_os_str: {:?}", os_str);
 
 // display - สำหรับ print
 println!("display: {}", path.display());
 
 // String -> PathBuf
 let s = "/home/user";
 let path_buf: PathBuf = s.into();
 println!("from string: {:?}", path_buf);
}
```

</RustPlayground>

---

## 8. ใช้ร่วมกับ fs

<RustPlayground>

```rust
use std::path::Path;
use std::fs;

fn main() {
 let path = Path::new("Cargo.toml");
 
 // ใช้ Path กับ fs functions
 if path.exists() {
 let content = fs::read_to_string(path).unwrap();
 println!("Read {} bytes from {:?}", content.len(), path);
 }
 
 // canonicalize - absolute path
 if let Ok(abs) = fs::canonicalize(path) {
 println!("absolute: {}", abs.display());
 }
 
 // metadata ผ่าน Path
 if let Ok(meta) = path.metadata() {
 println!("size: {} bytes", meta.len());
 }
 
 // read_dir ผ่าน Path
 let dir = Path::new(".");
 if let Ok(entries) = dir.read_dir() {
 println!("\n=== Files in . ===");
 for entry in entries.take(5) {
 if let Ok(e) = entry {
 println!("{:?}", e.file_name());
 }
 }
 }
}
```

</RustPlayground>

---

## Quick Reference

### ส่วนประกอบ
| Method | คำอธิบาย |
|--------|---------|
| `file_name()` | ชื่อไฟล์ |
| `file_stem()` | ชื่อไม่รวม ext |
| `extension()` | นามสกุล |
| `parent()` | โฟลเดอร์แม่ |
| `ancestors()` | ทุก parent |

### ต่อ/แก้ไข
| Method | คำอธิบาย |
|--------|---------|
| `push(p)` | เพิ่มท้าย (mut) |
| `pop()` | ลบท้าย (mut) |
| `join(p)` | สร้างใหม่ |
| `set_extension(e)` | เปลี่ยน ext |
| `set_file_name(n)` | เปลี่ยนชื่อ |

### ตรวจสอบ
| Method | คำอธิบาย |
|--------|---------|
| `exists()` | มีอยู่ไหม |
| `is_file()` | เป็นไฟล์ |
| `is_dir()` | เป็นโฟลเดอร์ |
| `is_absolute()` | absolute path |
| `is_relative()` | relative path |

### แปลง
| Method | คำอธิบาย |
|--------|---------|
| `to_str()` | `Option<&str>` |
| `to_string_lossy()` | `Cow<str>` |
| `display()` | สำหรับ print |

---

[← File System](./fs) | [Environment →](./env)
