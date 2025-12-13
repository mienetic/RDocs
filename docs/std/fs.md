# File System - จัดการไฟล์

**std::fs** สำหรับอ่าน เขียน และจัดการไฟล์กับโฟลเดอร์! 

---

## fs คืออะไร?

std::fs มีฟังก์ชันสำหรับ:
- อ่านและเขียนไฟล์
- สร้าง/ลบ ไฟล์และโฟลเดอร์
- ดูข้อมูลไฟล์ (metadata)
- คัดลอกและย้ายไฟล์

:::warning ทุกฟังก์ชันใน fs return `io::Result`
ต้องจัดการ error ด้วย `?` หรือ `unwrap()` / `expect()`
:::

---

## 1. อ่านไฟล์

<RustPlayground>

```rust
use std::fs;

fn main() {
 // read_to_string - อ่านทั้งไฟล์เป็น String (ง่ายที่สุด!)
 let content = fs::read_to_string("Cargo.toml")
 .expect("อ่านไฟล์ไม่ได้");
 println!("=== Cargo.toml ===\n{}", &content[..200.min(content.len())]);
 
 // read - อ่านเป็น bytes (สำหรับ binary)
 let bytes = fs::read("Cargo.toml").expect("อ่าน bytes ไม่ได้");
 println!("\nsize: {} bytes", bytes.len());
 
 // เปรียบเทียบ: อ่านแบบ streaming (ประหยัด memory)
 use std::io::{BufRead, BufReader};
 let file = fs::File::open("Cargo.toml").expect("เปิดไฟล์ไม่ได้");
 let reader = BufReader::new(file);
 
 println!("\n=== First 3 lines ===");
 for line in reader.lines().take(3) {
 println!("{}", line.unwrap());
 }
}
```

</RustPlayground>

---

## 2. เขียนไฟล์

<RustPlayground>

```rust
use std::fs;
use std::io::Write;

fn main() {
 // write - เขียนทั้งไฟล์ (overwrite ถ้ามีอยู่)
 fs::write("output.txt", "Hello, World!\n")
 .expect("เขียนไม่ได้");
 println!("เขียน output.txt แล้ว");
 
 // อ่านกลับมาเช็ค
 let content = fs::read_to_string("output.txt").unwrap();
 println!("content: {}", content);
 
 // เขียน bytes
 fs::write("binary.bin", &[0x48, 0x65, 0x6c, 0x6c, 0x6f])
 .expect("เขียน bytes ไม่ได้");
 
 // เขียนแบบ streaming (ประหยัด memory)
 let mut file = fs::File::create("stream.txt")
 .expect("สร้างไฟล์ไม่ได้");
 
 for i in 1..=5 {
 writeln!(file, "Line {}", i).unwrap();
 }
 println!("เขียน stream.txt แล้ว");
 
 // ลบไฟล์ทดสอบ
 fs::remove_file("output.txt").ok();
 fs::remove_file("binary.bin").ok();
 fs::remove_file("stream.txt").ok();
}
```

</RustPlayground>

---

## 3. File Options

<RustPlayground>

```rust
use std::fs::{File, OpenOptions};
use std::io::Write;

fn main() {
 // File::open - เปิดอ่านอย่างเดียว
 let _read_only = File::open("Cargo.toml")
 .expect("เปิดอ่านไม่ได้");
 
 // File::create - สร้างใหม่ (overwrite ถ้ามี)
 let _new_file = File::create("new.txt")
 .expect("สร้างไม่ได้");
 
 // OpenOptions - ควบคุมละเอียด
 let file = OpenOptions::new()
 .write(true) // เขียนได้
 .append(true) // เพิ่มท้ายไฟล์
 .create(true) // สร้างถ้าไม่มี
 .open("log.txt")
 .expect("เปิดไม่ได้");
 
 let mut file = file;
 writeln!(file, "Log entry").unwrap();
 
 // ตัวเลือกทั้งหมด
 // .read(true) - อ่านได้
 // .write(true) - เขียนได้
 // .append(true) - เพิ่มท้าย
 // .truncate(true) - ล้างไฟล์ก่อน
 // .create(true) - สร้างถ้าไม่มี
 // .create_new(true) - error ถ้ามีอยู่แล้ว
 
 // ลบไฟล์ทดสอบ
 std::fs::remove_file("new.txt").ok();
 std::fs::remove_file("log.txt").ok();
}
```

</RustPlayground>

---

## 4. จัดการ Directory

<RustPlayground>

```rust
use std::fs;

fn main() {
 // create_dir - สร้างโฟลเดอร์
 fs::create_dir("test_dir").ok();
 println!("สร้าง test_dir");
 
 // create_dir_all - สร้างทั้ง path
 fs::create_dir_all("a/b/c").ok();
 println!("สร้าง a/b/c");
 
 // read_dir - อ่านรายการในโฟลเดอร์
 println!("\n=== เนื้อหาใน . ===");
 for entry in fs::read_dir(".").unwrap() {
 let entry = entry.unwrap();
 let name = entry.file_name();
 let file_type = entry.file_type().unwrap();
 let kind = if file_type.is_dir() { "" } else { "" };
 println!("{} {:?}", kind, name);
 }
 
 // remove_dir - ลบโฟลเดอร์ว่าง
 fs::remove_dir("test_dir").ok();
 
 // remove_dir_all - ลบทั้ง path (ระวัง!)
 fs::remove_dir_all("a").ok();
 println!("\nลบโฟลเดอร์ทดสอบแล้ว");
}
```

</RustPlayground>

---

## 5. Metadata

<RustPlayground>

```rust
use std::fs;

fn main() {
 // metadata - ข้อมูลไฟล์
 let meta = fs::metadata("Cargo.toml").expect("ไม่พบไฟล์");
 
 println!("=== Cargo.toml metadata ===");
 println!("size: {} bytes", meta.len());
 println!("is_file: {}", meta.is_file());
 println!("is_dir: {}", meta.is_dir());
 println!("is_symlink: {}", meta.is_symlink());
 println!("readonly: {}", meta.permissions().readonly());
 
 // modified time
 if let Ok(modified) = meta.modified() {
 println!("modified: {:?}", modified);
 }
 
 // ตรวจว่าไฟล์มีไหม
 let exists = fs::metadata("nonexistent.txt").is_ok();
 println!("\nไฟล์ที่ไม่มีอยู่: {}", exists);
 
 // symlink_metadata - ไม่ follow symlink
 if let Ok(link_meta) = fs::symlink_metadata("Cargo.toml") {
 println!("symlink metadata: {:?}", link_meta.file_type());
 }
}
```

</RustPlayground>

---

## 6. Copy, Rename, Remove

<RustPlayground>

```rust
use std::fs;

fn main() {
 // สร้างไฟล์ทดสอบ
 fs::write("original.txt", "Original content").unwrap();
 
 // copy - คัดลอกไฟล์
 fs::copy("original.txt", "copy.txt").expect("copy ไม่ได้");
 println!("คัดลอกแล้ว");
 
 // rename - ย้าย/เปลี่ยนชื่อ
 fs::rename("copy.txt", "renamed.txt").expect("rename ไม่ได้");
 println!("เปลี่ยนชื่อแล้ว");
 
 // ตรวจสอบ
 println!("renamed.txt มีไหม: {}", fs::metadata("renamed.txt").is_ok());
 println!("copy.txt มีไหม: {}", fs::metadata("copy.txt").is_ok());
 
 // remove_file - ลบไฟล์
 fs::remove_file("original.txt").expect("ลบ original ไม่ได้");
 fs::remove_file("renamed.txt").expect("ลบ renamed ไม่ได้");
 println!("ลบทั้งคู่แล้ว");
}
```

</RustPlayground>

---

## 7. Canonical และ Permissions

<RustPlayground>

```rust
use std::fs;
use std::os::unix::fs::PermissionsExt;

fn main() {
 // canonicalize - แปลงเป็น absolute path
 let abs = fs::canonicalize("Cargo.toml").expect("canonicalize ไม่ได้");
 println!("absolute path: {:?}", abs);
 
 // อ่าน permissions
 let meta = fs::metadata("Cargo.toml").unwrap();
 let perm = meta.permissions();
 println!("readonly: {}", perm.readonly());
 
 // Unix: ดู mode
 #[cfg(unix)]
 {
 println!("mode: {:o}", perm.mode());
 }
 
 // set_permissions - เปลี่ยน permissions
 // let mut perm = perm;
 // perm.set_readonly(true);
 // fs::set_permissions("file.txt", perm).unwrap();
}
```

</RustPlayground>

---

## Quick Reference

### อ่านเขียน
| Function | คำอธิบาย |
|----------|---------|
| `read_to_string(path)` | อ่านเป็น String |
| `read(path)` | อ่านเป็น `Vec<u8>` |
| `write(path, data)` | เขียนทั้งไฟล์ |
| `File::open(path)` | เปิดอ่าน |
| `File::create(path)` | สร้างใหม่ |

### Directory
| Function | คำอธิบาย |
|----------|---------|
| `create_dir(path)` | สร้างโฟลเดอร์ |
| `create_dir_all(path)` | สร้างทั้ง path |
| `read_dir(path)` | อ่านรายการ |
| `remove_dir(path)` | ลบโฟลเดอร์ว่าง |
| `remove_dir_all(path)` | ลบทั้ง path |

### จัดการไฟล์
| Function | คำอธิบาย |
|----------|---------|
| `copy(from, to)` | คัดลอก |
| `rename(from, to)` | ย้าย/เปลี่ยนชื่อ |
| `remove_file(path)` | ลบไฟล์ |
| `metadata(path)` | ข้อมูลไฟล์ |
| `canonicalize(path)` | absolute path |

---

[← I/O](./io) | [Path →](./path)
