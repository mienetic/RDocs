# Fs Structs - File System

`ReadDir`, `DirEntry`, `Metadata`, `Permissions` สำหรับ file system! 

---

## อ่าน Directory

<RustPlayground>

```rust
use std::fs;

fn main() {
 // อ่าน directory
 match fs::read_dir(".") {
 Ok(entries) => {
 println!("=== Files in current dir ===");
 for entry in entries.take(10) {
 if let Ok(e) = entry {
 println!(" {:?}", e.path());
 }
 }
 }
 Err(e) => println!("Error: {}", e),
 }
}
```

</RustPlayground>

---

## DirEntry - รายการใน Directory

<RustPlayground>

```rust
use std::fs;

fn main() {
 if let Ok(entries) = fs::read_dir(".") {
 for entry in entries.take(5).flatten() {
 println!("name: {:?}", entry.file_name());
 println!("path: {:?}", entry.path());
 
 if let Ok(file_type) = entry.file_type() {
 println!(" is_file: {}", file_type.is_file());
 println!(" is_dir: {}", file_type.is_dir());
 }
 println!("---");
 }
 }
}
```

</RustPlayground>

---

## Metadata - ข้อมูลไฟล์

<RustPlayground>

```rust
use std::fs;

fn main() {
 // อ่าน metadata
 match fs::metadata("Cargo.toml") {
 Ok(meta) => {
 println!("=== Cargo.toml Metadata ===");
 println!("is_file: {}", meta.is_file());
 println!("is_dir: {}", meta.is_dir());
 println!("len: {} bytes", meta.len());
 println!("readonly: {}", meta.permissions().readonly());
 
 if let Ok(modified) = meta.modified() {
 println!("modified: {:?}", modified);
 }
 }
 Err(e) => println!("Error: {}", e),
 }
}
```

</RustPlayground>

---

## Permissions

<RustPlayground>

```rust
use std::fs;

fn main() {
 if let Ok(meta) = fs::metadata("Cargo.toml") {
 let perms = meta.permissions();
 
 println!("readonly: {}", perms.readonly());
 
 // Note: การเปลี่ยน permissions
 // let mut perms = perms;
 // perms.set_readonly(true);
 // fs::set_permissions("file.txt", perms)?;
 }
}
```

</RustPlayground>

---

## Common Operations

<RustPlayground>

```rust
use std::fs;
use std::path::Path;

fn main() {
 // ตรวจสอบว่ามีอยู่ไหม
 println!("Cargo.toml exists: {}", Path::new("Cargo.toml").exists());
 
 // อ่านไฟล์ทั้งหมด
 if let Ok(content) = fs::read_to_string("Cargo.toml") {
 println!("\nCargo.toml (first 100 chars):");
 println!("{}", &content[..content.len().min(100)]);
 }
 
 // อ่าน directory recursively
 fn count_files(path: &Path) -> usize {
 let mut count = 0;
 if let Ok(entries) = fs::read_dir(path) {
 for entry in entries.flatten() {
 if entry.file_type().map(|t| t.is_file()).unwrap_or(false) {
 count += 1;
 }
 }
 }
 count
 }
 
 println!("\nFiles in ./src: {}", count_files(Path::new("./src")));
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย |
|------|---------|
| `ReadDir` | Iterator สำหรับ directory entries |
| `DirEntry` | รายการใน directory |
| `Metadata` | ข้อมูลไฟล์/directory |
| `Permissions` | สิทธิ์ในการเข้าถึง |
| `FileType` | ประเภท (file/dir/symlink) |

### Functions
| Function | คำอธิบาย |
|----------|---------|
| `read_dir(path)` | อ่าน directory |
| `metadata(path)` | ดู metadata |
| `read(path)` | อ่านเป็น bytes |
| `read_to_string(path)` | อ่านเป็น string |
| `write(path, data)` | เขียนไฟล์ |
| `create_dir(path)` | สร้าง directory |
| `remove_file(path)` | ลบไฟล์ |
| `remove_dir(path)` | ลบ directory |
| `copy(src, dst)` | คัดลอก |
| `rename(src, dst)` | เปลี่ยนชื่อ/ย้าย |

---

[← Env](./env) | [Fmt →](./fmt)
