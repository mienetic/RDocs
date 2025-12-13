# I/O - อ่านเขียนข้อมูล

**std::io** คือ module หลักสำหรับ Input/Output เช่น อ่านจาก stdin เขียนไป stdout! 

---

## io คืออะไร?

std::io มี:
- **Traits**: `Read`, `Write`, `BufRead`, `Seek`
- **Types**: `stdin`, `stdout`, `File`, `BufReader`, `Cursor`
- **Error handling**: `io::Result<T>`

:::tip io::Result
ฟังก์ชันใน std::io return `io::Result<T>` ซึ่งคือ `Result<T, io::Error>`
:::

---

## 1. Read จาก stdin

<RustPlayground>

```rust
use std::io::{self, BufRead};

fn main() {
 println!("พิมพ์ชื่อของคุณ:");
 
 // อ่านทีละบรรทัด
 let stdin = io::stdin();
 let mut input = String::new();
 
 // read_line เพิ่มต่อท้าย String เดิม
 stdin.read_line(&mut input).expect("อ่านไม่ได้");
 
 // ตัด newline ด้วย trim()
 let name = input.trim();
 println!("สวัสดี, {}!", name);
 
 // อ่านจาก locked stdin (เร็วกว่า)
 let stdin = io::stdin();
 let handle = stdin.lock();
 
 println!("พิมพ์หลายบรรทัด (Ctrl+D จบ):");
 for line in handle.lines() {
 let line = line.expect("อ่าน line ไม่ได้");
 println!("ได้รับ: {}", line);
 }
}
```

</RustPlayground>

---

## 2. Write ไป stdout/stderr

<RustPlayground>

```rust
use std::io::{self, Write};

fn main() {
 // stdout
 let stdout = io::stdout();
 let mut handle = stdout.lock();
 
 // write! macro
 write!(handle, "Hello, ").unwrap();
 writeln!(handle, "World!").unwrap();
 
 // flush - บังคับให้ส่งออกทันที
 handle.flush().unwrap();
 
 // stderr สำหรับ error messages
 let stderr = io::stderr();
 let mut err_handle = stderr.lock();
 writeln!(err_handle, "Error: something went wrong").unwrap();
 
 // print! และ println! ใช้ stdout
 print!("No newline");
 println!(" With newline");
 
 // eprint! และ eprintln! ใช้ stderr
 eprintln!("Error message to stderr");
}
```

</RustPlayground>

---

## 3. Read Trait

<RustPlayground>

```rust
use std::io::Read;

fn main() {
 // Read จาก byte slice (ทดสอบแทน file)
 let data = b"Hello, World!";
 let mut reader = &data[..];
 
 // read_to_string - อ่านทั้งหมดเป็น String
 let mut content = String::new();
 reader.read_to_string(&mut content).unwrap();
 println!("read_to_string: {}", content);
 
 // read_to_end - อ่านเป็น bytes
 let data2 = b"Binary data";
 let mut reader2 = &data2[..];
 let mut bytes = Vec::new();
 reader2.read_to_end(&mut bytes).unwrap();
 println!("read_to_end: {:?}", bytes);
 
 // read - อ่านเข้า buffer
 let data3 = b"Hello";
 let mut reader3 = &data3[..];
 let mut buf = [0u8; 3]; // buffer ขนาด 3
 let n = reader3.read(&mut buf).unwrap();
 println!("read {} bytes: {:?}", n, &buf[..n]);
 
 // read_exact - อ่านครบตามที่ต้องการ
 let data4 = b"Hello";
 let mut reader4 = &data4[..];
 let mut exact_buf = [0u8; 5];
 reader4.read_exact(&mut exact_buf).unwrap();
 println!("read_exact: {:?}", exact_buf);
}
```

</RustPlayground>

---

## 4. Write Trait

<RustPlayground>

```rust
use std::io::Write;

fn main() {
 // Write ไป Vec<u8>
 let mut buffer: Vec<u8> = Vec::new();
 
 // write - เขียน bytes
 buffer.write(b"Hello").unwrap();
 buffer.write(b" ").unwrap();
 buffer.write(b"World").unwrap();
 println!("buffer: {:?}", String::from_utf8_lossy(&buffer));
 
 // write_all - เขียนทั้งหมด (error ถ้าไม่ครบ)
 let mut buf2: Vec<u8> = Vec::new();
 buf2.write_all(b"Complete message").unwrap();
 println!("buf2: {:?}", String::from_utf8_lossy(&buf2));
 
 // write! macro
 let mut buf3: Vec<u8> = Vec::new();
 write!(buf3, "formatted: {} + {} = {}", 1, 2, 3).unwrap();
 println!("buf3: {:?}", String::from_utf8_lossy(&buf3));
 
 // flush - บังคับ flush buffer
 buffer.flush().unwrap();
}
```

</RustPlayground>

---

## 5. BufReader และ BufWriter

<RustPlayground>

```rust
use std::io::{BufRead, BufReader, BufWriter, Write};

fn main() {
 // BufReader - อ่านพร้อม buffer (เร็วกว่า)
 let data = b"Line 1\nLine 2\nLine 3\n";
 let reader = BufReader::new(&data[..]);
 
 // lines() - อ่านทีละบรรทัด
 println!("=== BufReader lines ===");
 for line in reader.lines() {
 println!("{}", line.unwrap());
 }
 
 // BufReader อื่นๆ
 let reader2 = BufReader::new(&b"word1 word2 word3"[..]);
 
 // read_line
 let mut reader3 = BufReader::new(&b"Hello\nWorld"[..]);
 let mut line = String::new();
 reader3.read_line(&mut line).unwrap();
 println!("first line: {:?}", line);
 
 // BufWriter - เขียนพร้อม buffer (เร็วกว่า)
 let mut output: Vec<u8> = Vec::new();
 {
 let mut writer = BufWriter::new(&mut output);
 writer.write_all(b"Buffered ").unwrap();
 writer.write_all(b"output").unwrap();
 // flush อัตโนมัติเมื่อ drop
 }
 println!("output: {:?}", String::from_utf8_lossy(&output));
}
```

</RustPlayground>

---

## 6. Cursor

<RustPlayground>

```rust
use std::io::{Cursor, Read, Write, Seek, SeekFrom};

fn main() {
 // Cursor - ทำให้ bytes เหมือน file (seek ได้)
 let data = b"Hello, World!";
 let mut cursor = Cursor::new(data.to_vec());
 
 // อ่าน 5 bytes แรก
 let mut buf = [0u8; 5];
 cursor.read_exact(&mut buf).unwrap();
 println!("first 5: {:?}", String::from_utf8_lossy(&buf));
 
 // ดู position ปัจจุบัน
 println!("position: {}", cursor.position());
 
 // seek ไปตำแหน่งต่างๆ
 cursor.seek(SeekFrom::Start(7)).unwrap(); // ตำแหน่ง 7
 let mut rest = String::new();
 cursor.read_to_string(&mut rest).unwrap();
 println!("from 7: {}", rest);
 
 // seek แบบ relative
 cursor.seek(SeekFrom::End(-6)).unwrap(); // 6 จากท้าย
 let mut buf2 = [0u8; 5];
 cursor.read_exact(&mut buf2).unwrap();
 println!("last 5: {:?}", String::from_utf8_lossy(&buf2));
 
 // Cursor สำหรับเขียน
 let mut write_cursor = Cursor::new(Vec::new());
 write!(write_cursor, "Written to cursor").unwrap();
 println!("written: {:?}", String::from_utf8_lossy(write_cursor.get_ref()));
}
```

</RustPlayground>

---

## 7. io::Error

<RustPlayground>

```rust
use std::io::{self, ErrorKind};

fn might_fail(should_fail: bool) -> io::Result<String> {
 if should_fail {
 // สร้าง error เอง
 Err(io::Error::new(ErrorKind::NotFound, "file not found"))
 } else {
 Ok("success".to_string())
 }
}

fn main() {
 // จัดการ io::Error
 match might_fail(true) {
 Ok(data) => println!("Data: {}", data),
 Err(e) => {
 println!("Error: {}", e);
 println!("Kind: {:?}", e.kind());
 }
 }
 
 // ErrorKind ที่พบบ่อย
 let kinds = [
 ErrorKind::NotFound,
 ErrorKind::PermissionDenied,
 ErrorKind::ConnectionRefused,
 ErrorKind::AlreadyExists,
 ErrorKind::WouldBlock,
 ErrorKind::InvalidInput,
 ];
 
 println!("\n=== ErrorKind ที่พบบ่อย ===");
 for kind in kinds {
 println!("{:?}", kind);
 }
}
```

</RustPlayground>

---

## 8. copy และ utility functions

<RustPlayground>

```rust
use std::io::{self, Read, Write};

fn main() {
 // io::copy - copy จาก reader ไป writer
 let source = b"Data to copy";
 let mut reader = &source[..];
 let mut writer: Vec<u8> = Vec::new();
 
 let bytes = io::copy(&mut reader, &mut writer).unwrap();
 println!("copied {} bytes: {:?}", bytes, String::from_utf8_lossy(&writer));
 
 // io::empty - reader ที่ไม่มีอะไร
 let mut empty = io::empty();
 let mut buf = String::new();
 empty.read_to_string(&mut buf).unwrap();
 println!("empty read: '{}'", buf);
 
 // io::sink - writer ที่ทิ้งทุกอย่าง
 let mut sink = io::sink();
 sink.write_all(b"This goes nowhere").unwrap();
 
 // io::repeat - reader ที่ซ้ำ byte เดิม
 let mut repeat = io::repeat(b'x');
 let mut buf = [0u8; 5];
 repeat.read_exact(&mut buf).unwrap();
 println!("repeat: {:?}", buf);
}
```

</RustPlayground>

---

## Quick Reference

### Traits หลัก
| Trait | Methods หลัก |
|-------|-------------|
| `Read` | `read()`, `read_to_string()`, `read_to_end()` |
| `Write` | `write()`, `write_all()`, `flush()` |
| `BufRead` | `read_line()`, `lines()` |
| `Seek` | `seek()` |

### Types
| Type | ใช้ทำอะไร |
|------|---------|
| `stdin()` | อ่านจาก console |
| `stdout()` | เขียนไป console |
| `stderr()` | เขียน error messages |
| `BufReader<R>` | อ่านพร้อม buffer |
| `BufWriter<W>` | เขียนพร้อม buffer |
| `Cursor<T>` | bytes เป็น seekable |

### ErrorKind ที่พบบ่อย
| Kind | ความหมาย |
|------|---------|
| `NotFound` | ไม่พบไฟล์ |
| `PermissionDenied` | ไม่มีสิทธิ์ |
| `AlreadyExists` | มีอยู่แล้ว |
| `InvalidInput` | input ไม่ถูกต้อง |

---

[← Clone & Copy](./clone-copy) | [File System →](./fs)
