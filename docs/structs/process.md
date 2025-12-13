# Process Structs - การจัดการ Process

`Command`, `Child`, `ExitStatus`, `Output`, `Stdio` สำหรับรัน external programs! 

---

## Command คืออะไร?

`Command` ใช้สำหรับสร้างและรัน external programs จาก Rust:
- รันคำสั่ง shell
- รับ output (stdout, stderr)
- ส่ง input (stdin)
- ตั้ง environment variables

---

## รัน Command อย่างง่าย

<RustPlayground>

```rust
use std::process::Command;

fn main() {
 // รัน echo และรับ output
 let output = Command::new("echo")
 .arg("Hello from Rust! ")
 .output()
 .expect("failed to execute");
 
 println!("status: {}", output.status);
 println!("stdout: {}", String::from_utf8_lossy(&output.stdout));
 
 // รัน command ที่มีหลาย args
 let output = Command::new("printf")
 .args(["%s %s\n", "Hello", "World"])
 .output()
 .expect("failed");
 
 println!("printf: {}", String::from_utf8_lossy(&output.stdout));
}
```

</RustPlayground>

---

## รอเฉพาะ Status

<RustPlayground>

```rust
use std::process::Command;

fn main() {
 // .status() - รอแค่ exit code ไม่เก็บ output
 let status = Command::new("echo")
 .arg("test")
 .status()
 .expect("failed");
 
 println!("success: {}", status.success());
 println!("exit code: {:?}", status.code());
 
 // ตรวจสอบ exit code
 if status.success() {
 println!("Command สำเร็จ!");
 } else {
 println!("Command ล้มเหลว!");
 }
}
```

</RustPlayground>

---

## spawn() - รัน Async

<RustPlayground>

```rust
use std::process::Command;
use std::thread;
use std::time::Duration;

fn main() {
 // spawn() รัน process แบบ async
 let mut child = Command::new("sleep")
 .arg("1")
 .spawn()
 .expect("failed to spawn");
 
 println!("spawned child with id: {}", child.id());
 
 // ทำงานอื่นระหว่างรอ
 for i in 1..=3 {
 println!(" doing work {}...", i);
 thread::sleep(Duration::from_millis(200));
 }
 
 // รอ child เสร็จ
 let status = child.wait().expect("failed to wait");
 println!("child finished with: {}", status);
}
```

</RustPlayground>

---

## Pipe stdin/stdout

<RustPlayground>

```rust
use std::process::{Command, Stdio};
use std::io::Write;

fn main() {
 // สร้าง process ที่รับ stdin
 let mut child = Command::new("cat")
 .stdin(Stdio::piped())
 .stdout(Stdio::piped())
 .spawn()
 .expect("failed");
 
 // เขียนไป stdin
 {
 let stdin = child.stdin.as_mut().expect("no stdin");
 stdin.write_all(b"Hello from Rust!\n").unwrap();
 stdin.write_all(b"Line 2\n").unwrap();
 }
 
 // รับ output
 let output = child.wait_with_output().expect("failed");
 println!("output:\n{}", String::from_utf8_lossy(&output.stdout));
}
```

</RustPlayground>

---

## Environment Variables

<RustPlayground>

```rust
use std::process::Command;
use std::env;

fn main() {
 // ดู env vars ปัจจุบัน
 println!("=== Current ENV (first 3) ===");
 for (key, value) in env::vars().take(3) {
 println!("{}: {}", key, &value[..value.len().min(30)]);
 }
 
 // รัน command พร้อม env var
 let output = Command::new("sh")
 .arg("-c")
 .arg("echo Hello $MY_NAME from $MY_CITY")
 .env("MY_NAME", "Rust")
 .env("MY_CITY", "Bangkok")
 .output()
 .expect("failed");
 
 println!("\n=== With custom ENV ===");
 println!("{}", String::from_utf8_lossy(&output.stdout));
}
```

</RustPlayground>

---

## Current Directory

<RustPlayground>

```rust
use std::process::Command;

fn main() {
 // รัน command ใน directory อื่น
 let output = Command::new("pwd")
 .current_dir("/tmp")
 .output()
 .expect("failed");
 
 println!("working dir: {}", String::from_utf8_lossy(&output.stdout));
 
 // รัน ls ใน /tmp
 let output = Command::new("ls")
 .args(["-la"])
 .current_dir("/tmp")
 .output()
 .expect("failed");
 
 println!("files (first 5 lines):");
 let stdout = String::from_utf8_lossy(&output.stdout);
 for line in stdout.lines().take(5) {
 println!(" {}", line);
 }
}
```

</RustPlayground>

---

## Handle Errors

<RustPlayground>

```rust
use std::process::Command;

fn main() {
 // command ที่ไม่มีจริง
 match Command::new("nonexistent_command").output() {
 Ok(output) => println!("output: {:?}", output),
 Err(e) => println!("Error: {}", e),
 }
 
 // command ที่ fail (exit code != 0)
 let output = Command::new("ls")
 .arg("/nonexistent_path")
 .output()
 .expect("failed to execute");
 
 if !output.status.success() {
 println!("Command failed!");
 println!("stderr: {}", String::from_utf8_lossy(&output.stderr));
 }
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย |
|------|---------|
| `Command` | Builder สร้างคำสั่ง |
| `Child` | Running process |
| `ExitStatus` | ผลลัพธ์ (exit code) |
| `Output` | stdout + stderr + status |
| `Stdio` | config สำหรับ stdin/stdout/stderr |

### Command Builder Methods
| Method | คำอธิบาย |
|--------|---------|
| `new(program)` | สร้าง command |
| `arg(a)` | เพิ่ม 1 argument |
| `args([...])` | เพิ่มหลาย arguments |
| `env(k, v)` | เพิ่ม env var |
| `envs([(k, v), ...])` | เพิ่มหลาย env vars |
| `current_dir(p)` | ตั้ง working directory |
| `stdin(Stdio)` | config stdin |
| `stdout(Stdio)` | config stdout |
| `stderr(Stdio)` | config stderr |

### Execution Methods
| Method | Block? | Return |
|--------|--------|--------|
| `output()` | | `Output` |
| `status()` | | `ExitStatus` |
| `spawn()` | | `Child` |

### Child Methods
| Method | คำอธิบาย |
|--------|---------|
| `id()` | process ID |
| `wait()` | รอ process จบ |
| `wait_with_output()` | รอ + เก็บ output |
| `kill()` | ฆ่า process |

### Stdio Options
| Value | คำอธิบาย |
|-------|---------|
| `Stdio::inherit()` | ใช้ parent's stdin/stdout |
| `Stdio::piped()` | สร้าง pipe |
| `Stdio::null()` | discard (/dev/null) |

---

[← Iterator](./iterator) | [กลับ Index →](./index)
