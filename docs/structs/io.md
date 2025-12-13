# I/O Structs - อ่าน/เขียน

`File`, `BufReader`, `BufWriter`, `Stdin`, `Stdout`! 

---

## File - ไฟล์

<RustPlayground>

```rust
use std::fs::File;
use std::io::{Read, Write};

fn main() {
 // เขียนไฟล์
 {
 let mut file = File::create("/tmp/test.txt").unwrap();
 file.write_all(b"Hello, World!").unwrap();
 println!("wrote to file");
 }
 
 // อ่านไฟล์
 {
 let mut file = File::open("/tmp/test.txt").unwrap();
 let mut contents = String::new();
 file.read_to_string(&mut contents).unwrap();
 println!("read: {}", contents);
 }
 
 // ใช้ fs shortcuts
 std::fs::write("/tmp/test2.txt", "Quick write!").unwrap();
 let data = std::fs::read_to_string("/tmp/test2.txt").unwrap();
 println!("quick read: {}", data);
}
```

</RustPlayground>

---

## BufReader - Buffered Reading

::: best-practice
**ใช้ Buffer เสมอเมื่ออ่านไฟล์!**
การอ่านไฟล์ทีละนิด (เช่นทีละบรรทัด) โดยตรงจาก disk ช้ามาก! ให้ครอบด้วย `BufReader` เสมอ เพื่อลดจำนวน System Calls
:::

<RustPlayground>

```rust
use std::fs::File;
use std::io::{BufRead, BufReader};

fn main() {
 // สร้างไฟล์ตัวอย่าง
 std::fs::write("/tmp/lines.txt", "line 1\nline 2\nline 3").unwrap();
 
 // อ่านทีละบรรทัด
 let file = File::open("/tmp/lines.txt").unwrap();
 let reader = BufReader::new(file);
 
 for (i, line) in reader.lines().enumerate() {
 println!("{}: {}", i + 1, line.unwrap());
 }
}
```

</RustPlayground>

---

## BufWriter - Buffered Writing

<RustPlayground>

```rust
use std::fs::File;
use std::io::{BufWriter, Write};

fn main() {
 let file = File::create("/tmp/buffered.txt").unwrap();
 let mut writer = BufWriter::new(file);
 
 // เขียนหลายครั้ง (buffered)
 for i in 1..=5 {
 writeln!(writer, "Line {}", i).unwrap();
 }
 
 // flush เพื่อบันทึก
 writer.flush().unwrap();
 
 // ตรวจสอบ
 let content = std::fs::read_to_string("/tmp/buffered.txt").unwrap();
 println!("{}", content);
}
```

</RustPlayground>

---

## Stdin/Stdout - Standard I/O

::: best-practice
**ล็อค Stdout ถ้าพิมพ์เยอะๆ**
`println!` จะล็อค Stdout ทุกครั้งที่เรียก ถ้าต้องพิมพ์ล้านบรรทัด ให้ใช้ `stdout.lock()` แล้วเขียนเองจะเร็วกว่ามาก!
:::

<RustPlayground>

```rust
use std::io::{self, Write};

fn main() {
 // Stdout
 let stdout = io::stdout();
 let mut handle = stdout.lock();
 writeln!(handle, "Hello from locked stdout!").unwrap();
 
 // Stderr
 let stderr = io::stderr();
 let mut handle = stderr.lock();
 writeln!(handle, "Error message!").unwrap();
 
 // ปกติใช้ println! ง่ายกว่า
 println!("Normal println!");
 eprintln!("Normal eprintln!");
}
```

</RustPlayground>

---

## Quick Reference

### File Operations
| Method | คำอธิบาย |
|--------|---------|
| `File::open(path)` | เปิดอ่าน |
| `File::create(path)` | สร้าง/เขียนทับ |
| `OpenOptions::new()` | Custom options |

### Buffered I/O
| Type | ใช้เมื่อ |
|------|--------|
| `BufReader<R>` | อ่านทีละบรรทัด |
| `BufWriter<W>` | เขียนหลายครั้ง |
| `BufRead::lines()` | Iterator บรรทัด |

### Standard I/O
| Type | คำอธิบาย |
|------|---------|
| `Stdin` | Standard input |
| `Stdout` | Standard output |
| `Stderr` | Standard error |

---

[← Cell](./cell) | [Sync →](./sync)
