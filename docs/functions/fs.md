# File System Functions (std::fs)

Functions สำหรับจัดการ File System! 

---

## read

อ่านไฟล์ทั้งหมดเป็น `Vec<u8>`

<RustPlayground>

```rust
use std::fs;

fn main() {
 // สร้างไฟล์ทดสอบก่อน
 fs::write("test.txt", "Hello, World!").unwrap();
 
 // อ่านเป็น bytes
 let bytes = fs::read("test.txt").unwrap();
 println!("Bytes: {:?}", bytes);
 
 // แปลงเป็น String
 let content = String::from_utf8(bytes).unwrap();
 println!("Content: {}", content);
 
 // Cleanup
 fs::remove_file("test.txt").unwrap();
}
```

</RustPlayground>

---

## read_to_string

อ่านไฟล์ทั้งหมดเป็น `String` โดยตรง

<RustPlayground>

```rust
use std::fs;

fn main() {
 // สร้างไฟล์ทดสอบ
 fs::write("hello.txt", "สวัสดีครับ!").unwrap();
 
 // อ่านเป็น String ตรงๆ
 let content = fs::read_to_string("hello.txt").unwrap();
 println!("Content: {}", content);
 
 // Cleanup
 fs::remove_file("hello.txt").unwrap();
}
```

</RustPlayground>

---

## write

เขียนข้อมูลลงไฟล์ (สร้างใหม่ถ้าไม่มี, overwrite ถ้ามี)

<RustPlayground>

```rust
use std::fs;

fn main() {
 // เขียน String
 fs::write("output.txt", "Hello from Rust!").unwrap();
 
 // เขียน bytes
 fs::write("binary.bin", &[0x48, 0x65, 0x6c, 0x6c, 0x6f]).unwrap();
 
 // อ่านกลับมาตรวจสอบ
 let content = fs::read_to_string("output.txt").unwrap();
 println!("Written: {}", content);
 
 // Cleanup
 fs::remove_file("output.txt").unwrap();
 fs::remove_file("binary.bin").unwrap();
}
```

</RustPlayground>

---

## copy

คัดลอกไฟล์

<RustPlayground>

```rust
use std::fs;

fn main() {
 // สร้างไฟล์ต้นฉบับ
 fs::write("source.txt", "Original content").unwrap();
 
 // คัดลอก
 let bytes_copied = fs::copy("source.txt", "destination.txt").unwrap();
 println!("Copied {} bytes", bytes_copied);
 
 // ตรวจสอบ
 let dest_content = fs::read_to_string("destination.txt").unwrap();
 println!("Destination: {}", dest_content);
 
 // Cleanup
 fs::remove_file("source.txt").unwrap();
 fs::remove_file("destination.txt").unwrap();
}
```

</RustPlayground>

---

## create_dir_all

สร้าง directories (รวมถึง parent directories)

<RustPlayground>

```rust
use std::fs;

fn main() {
 // สร้าง nested directories
 fs::create_dir_all("a/b/c/d").unwrap();
 
 // ตรวจสอบว่ามีอยู่
 println!("Exists: {}", fs::metadata("a/b/c/d").is_ok());
 
 // Cleanup
 fs::remove_dir_all("a").unwrap();
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `read(path)` | อ่านเป็น bytes | `Result<Vec<u8>>` |
| `read_to_string(path)` | อ่านเป็น String | `Result<String>` |
| `write(path, data)` | เขียนไฟล์ | `Result<()>` |
| `copy(src, dst)` | คัดลอกไฟล์ | `Result<u64>` |
| `create_dir(path)` | สร้าง dir | `Result<()>` |
| `create_dir_all(path)` | สร้าง nested dirs | `Result<()>` |
| `remove_file(path)` | ลบไฟล์ | `Result<()>` |
| `remove_dir(path)` | ลบ dir ว่าง | `Result<()>` |
| `remove_dir_all(path)` | ลบ dir ทั้งหมด | `Result<()>` |
| `rename(from, to)` | เปลี่ยนชื่อ/ย้าย | `Result<()>` |

---

[← Memory](./mem) | [Environment →](./env)
