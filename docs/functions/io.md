# I/O Functions (std::io)

Functions สำหรับ Input/Output! 

---

## stdin

ดึง Standard Input Handle

<RustPlayground>

```rust
use std::io::{self, BufRead};

fn main() {
 println!("Enter your name:");
 
 let stdin = io::stdin();
 let mut input = String::new();
 
 // อ่านบรรทัด
 stdin.read_line(&mut input).expect("Failed to read");
 
 println!("Hello, {}!", input.trim());
}
```

</RustPlayground>

---

## stdout

ดึง Standard Output Handle

<RustPlayground>

```rust
use std::io::{self, Write};

fn main() {
 let stdout = io::stdout();
 let mut handle = stdout.lock();
 
 // เขียนหลายบรรทัดพร้อม flush
 writeln!(handle, "Line 1").unwrap();
 writeln!(handle, "Line 2").unwrap();
 handle.flush().unwrap();
 
 println!("Output completed!");
}
```

</RustPlayground>

---

## stderr

ดึง Standard Error Handle

<RustPlayground>

```rust
use std::io::{self, Write};

fn main() {
 let stderr = io::stderr();
 let mut handle = stderr.lock();
 
 // เขียน error message
 writeln!(handle, "Warning: something happened").unwrap();
 
 println!("This goes to stdout");
}
```

</RustPlayground>

---

## copy

คัดลอก bytes จาก Reader ไป Writer

<RustPlayground>

```rust
use std::io::{self, Read, Write};

fn main() {
 let input = b"Hello, World!";
 let mut reader = &input[..];
 let mut output = Vec::new();
 
 // คัดลอก bytes
 let bytes_copied = io::copy(&mut reader, &mut output).unwrap();
 
 println!("Copied {} bytes", bytes_copied);
 println!("Output: {}", String::from_utf8(output).unwrap());
}
```

</RustPlayground>

---

## empty / sink / repeat

Utility I/O streams

<RustPlayground>

```rust
use std::io::{self, Read, Write};

fn main() {
 // empty: อ่านได้ 0 bytes เสมอ
 let mut empty = io::empty();
 let mut buf = [0u8; 10];
 let n = empty.read(&mut buf).unwrap();
 println!("Read {} bytes from empty", n); // 0
 
 // sink: เขียนได้เท่าไหร่ก็ได้ (throw away)
 let mut sink = io::sink();
 let n = sink.write(b"Hello").unwrap();
 println!("Wrote {} bytes to sink", n); // 5
 
 // repeat: อ่านได้ไม่จบ
 let mut repeat = io::repeat(b'X');
 let mut buf = [0u8; 5];
 repeat.read_exact(&mut buf).unwrap();
 println!("Read from repeat: {:?}", buf);
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `stdin()` | Standard Input | `Stdin` |
| `stdout()` | Standard Output | `Stdout` |
| `stderr()` | Standard Error | `Stderr` |
| `copy(r, w)` | คัดลอก bytes | `Result<u64>` |
| `empty()` | Empty reader | `Empty` |
| `sink()` | Discard writer | `Sink` |
| `repeat(byte)` | Infinite reader | `Repeat` |

---

[← Future](./future) | [Process →](./process)
