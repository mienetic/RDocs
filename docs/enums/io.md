# I/O Enums

`ErrorKind`, `SeekFrom` สำหรับ I/O operations! 

---

## ErrorKind - ประเภท I/O Error

<RustPlayground>

```rust
use std::io::{self, ErrorKind};

fn main() {
 // ErrorKind variants ที่พบบ่อย
 let kinds = [
 ErrorKind::NotFound,
 ErrorKind::PermissionDenied,
 ErrorKind::ConnectionRefused,
 ErrorKind::AlreadyExists,
 ErrorKind::WouldBlock,
 ErrorKind::InvalidInput,
 ErrorKind::InvalidData,
 ErrorKind::TimedOut,
 ErrorKind::Interrupted,
 ErrorKind::UnexpectedEof,
 ];
 
 println!("=== Common ErrorKinds ===");
 for kind in kinds {
 println!(" {:?}", kind);
 }
 
 // สร้าง error จาก ErrorKind
 let err = io::Error::new(ErrorKind::NotFound, "file not found");
 println!("\nCustom error: {}", err);
 println!("Error kind: {:?}", err.kind());
}
```

</RustPlayground>

---

## ErrorKind Pattern Matching

<RustPlayground>

```rust
use std::io::{self, ErrorKind};
use std::fs::File;

fn open_or_create(path: &str) -> io::Result<File> {
 match File::open(path) {
 Ok(file) => Ok(file),
 Err(e) => {
 match e.kind() {
 ErrorKind::NotFound => {
 println!("File not found, creating...");
 File::create(path)
 }
 ErrorKind::PermissionDenied => {
 println!("Permission denied!");
 Err(e)
 }
 _ => {
 println!("Unknown error: {}", e);
 Err(e)
 }
 }
 }
 }
}

fn main() {
 // ตัวอย่างการใช้
 match open_or_create("test.txt") {
 Ok(_) => println!("File ready!"),
 Err(e) => println!("Failed: {}", e),
 }
}
```

</RustPlayground>

---

## SeekFrom - ตำแหน่ง Seek

<RustPlayground>

```rust
use std::io::{Cursor, Read, Seek, SeekFrom};

fn main() {
 let data = b"Hello, World!";
 let mut cursor = Cursor::new(data.to_vec());
 
 // SeekFrom::Start - จากต้น
 cursor.seek(SeekFrom::Start(7)).unwrap();
 let mut buf = [0u8; 5];
 cursor.read_exact(&mut buf).unwrap();
 println!("From start(7): {:?}", String::from_utf8_lossy(&buf));
 
 // SeekFrom::End - จากท้าย
 cursor.seek(SeekFrom::End(-6)).unwrap();
 let mut buf2 = [0u8; 5];
 cursor.read_exact(&mut buf2).unwrap();
 println!("From end(-6): {:?}", String::from_utf8_lossy(&buf2));
 
 // SeekFrom::Current - จากปัจจุบัน
 cursor.seek(SeekFrom::Start(0)).unwrap();
 cursor.seek(SeekFrom::Current(7)).unwrap();
 let pos = cursor.position();
 println!("Current position: {}", pos);
 
 // สรุป SeekFrom variants
 println!("\n=== SeekFrom variants ===");
 println!("Start(n): จากต้น + n");
 println!("End(n): จากท้าย + n (n มักติดลบ)");
 println!("Current(n): จากปัจจุบัน + n");
}
```

</RustPlayground>

---

## Quick Reference

### ErrorKind
| Variant | คำอธิบาย |
|---------|---------|
| `NotFound` | ไม่พบไฟล์ |
| `PermissionDenied` | ไม่มีสิทธิ์ |
| `ConnectionRefused` | ปฏิเสธการเชื่อมต่อ |
| `AlreadyExists` | มีอยู่แล้ว |
| `WouldBlock` | จะ block (non-blocking mode) |
| `InvalidInput` | input ไม่ถูกต้อง |
| `InvalidData` | data ไม่ถูกต้อง |
| `TimedOut` | หมดเวลา |
| `Interrupted` | ถูกขัดจังหวะ |
| `UnexpectedEof` | จบไฟล์ไม่คาดคิด |

### SeekFrom
| Variant | คำอธิบาย |
|---------|---------|
| `Start(u64)` | จากต้นไฟล์ |
| `End(i64)` | จากท้ายไฟล์ |
| `Current(i64)` | จากตำแหน่งปัจจุบัน |

---

[← Collections](./collections) | [Net →](./net)
