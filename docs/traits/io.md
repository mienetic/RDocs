# I/O Traits

`Read`, `Write`, `Seek`, `BufRead` สำหรับ Input/Output! 

---

## Read Trait

<RustPlayground>

```rust
use std::io::{self, Read, Cursor};

fn main() -> io::Result<()> {
 // Cursor implements Read
 let data = b"Hello, World!";
 let mut cursor = Cursor::new(data);
 
 // read_to_string
 let mut s = String::new();
 cursor.read_to_string(&mut s)?;
 println!("Read: {}", s);
 
 // read to buffer
 cursor.set_position(0);
 let mut buf = [0u8; 5];
 let n = cursor.read(&mut buf)?;
 println!("Read {} bytes: {:?}", n, &buf[..n]);
 
 // read_exact
 cursor.set_position(0);
 let mut exact = [0u8; 5];
 cursor.read_exact(&mut exact)?;
 println!("Exact: {:?}", exact);
 
 Ok(())
}
```

</RustPlayground>

---

## Write Trait

<RustPlayground>

```rust
use std::io::{self, Write};

fn main() -> io::Result<()> {
 // Vec<u8> implements Write
 let mut buffer: Vec<u8> = Vec::new();
 
 // write bytes
 buffer.write_all(b"Hello, ")?;
 buffer.write_all(b"World!")?;
 
 println!("Buffer: {:?}", String::from_utf8_lossy(&buffer));
 
 // write! macro
 let mut buf2: Vec<u8> = Vec::new();
 write!(buf2, "The answer is {}", 42)?;
 println!("Formatted: {}", String::from_utf8_lossy(&buf2));
 
 // stdout
 let mut stdout = io::stdout();
 writeln!(stdout, "Direct to stdout")?;
 stdout.flush()?;
 
 Ok(())
}
```

</RustPlayground>

---

## BufRead Trait

<RustPlayground>

```rust
use std::io::{self, BufRead, Cursor};

fn main() -> io::Result<()> {
 let data = "Line 1\nLine 2\nLine 3\n";
 let cursor = Cursor::new(data);
 let reader = io::BufReader::new(cursor);
 
 println!("=== Reading lines ===");
 for line in reader.lines() {
 println!(" {}", line?);
 }
 
 // read_line
 let cursor2 = Cursor::new("Hello\nWorld\n");
 let mut reader2 = io::BufReader::new(cursor2);
 let mut line = String::new();
 reader2.read_line(&mut line)?;
 println!("\nFirst line: {:?}", line);
 
 // split by delimiter
 let data3 = "one,two,three";
 let cursor3 = Cursor::new(data3);
 let reader3 = io::BufReader::new(cursor3);
 
 println!("\n=== Split by comma ===");
 for part in reader3.split(b',') {
 println!(" {:?}", String::from_utf8_lossy(&part?));
 }
 
 Ok(())
}
```

</RustPlayground>

---

## Seek Trait

<RustPlayground>

```rust
use std::io::{self, Seek, SeekFrom, Cursor, Read};

fn main() -> io::Result<()> {
 let data = b"0123456789";
 let mut cursor = Cursor::new(data);
 
 // Seek to position
 cursor.seek(SeekFrom::Start(5))?;
 let mut buf = [0u8; 3];
 cursor.read(&mut buf)?;
 println!("From position 5: {:?}", String::from_utf8_lossy(&buf));
 
 // Current position
 let pos = cursor.stream_position()?;
 println!("Current position: {}", pos);
 
 // Seek from end
 cursor.seek(SeekFrom::End(-3))?;
 let mut buf2 = [0u8; 3];
 cursor.read(&mut buf2)?;
 println!("Last 3 bytes: {:?}", String::from_utf8_lossy(&buf2));
 
 // Rewind to start
 cursor.rewind()?;
 println!("After rewind: {}", cursor.position());
 
 Ok(())
}
```

</RustPlayground>

---

## Quick Reference

### I/O Traits
| Trait | คำอธิบาย | ตัวอย่าง Types |
|-------|---------|---------------|
| `Read` | อ่านข้อมูล | `File`, `TcpStream`, `Cursor` |
| `Write` | เขียนข้อมูล | `File`, `TcpStream`, `Vec<u8>` |
| `Seek` | เลื่อนตำแหน่ง | `File`, `Cursor` |
| `BufRead` | อ่านแบบ buffered | `BufReader` |

### Read Methods
| Method | คำอธิบาย |
|--------|---------|
| `read(&mut buf)` | อ่านเข้า buffer |
| `read_exact(&mut buf)` | อ่านเต็ม buffer |
| `read_to_string(&mut s)` | อ่านทั้งหมดเป็น String |
| `read_to_end(&mut vec)` | อ่านทั้งหมดเป็น Vec |

### Write Methods
| Method | คำอธิบาย |
|--------|---------|
| `write(&buf)` | เขียน buffer |
| `write_all(&buf)` | เขียนทั้งหมด |
| `flush()` | บังคับเขียน |

---

[← Display](./display) | [Concurrency →](./concurrency)
