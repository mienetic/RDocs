# Process - รันโปรแกรมภายนอก

**std::process** สำหรับรันคำสั่งและโปรแกรมภายนอก! 

---

## process มีอะไร?

- **Command** - สร้างและรันคำสั่ง
- **Child** - process ที่รันอยู่
- **Output** - ผลลัพธ์จาก process
- **exit** - จบโปรแกรม

---

## 1. Command พื้นฐาน

<RustPlayground>

```rust
use std::process::Command;

fn main() {
 // รันคำสั่งง่ายๆ
 let output = Command::new("echo")
 .arg("Hello, World!")
 .output()
 .expect("failed to execute");
 
 println!("stdout: {}", String::from_utf8_lossy(&output.stdout));
 println!("stderr: {}", String::from_utf8_lossy(&output.stderr));
 println!("status: {}", output.status);
 
 // หลาย arguments
 let output2 = Command::new("ls")
 .arg("-l")
 .arg("-a")
 .output()
 .expect("failed to execute ls");
 
 println!("\n=== ls -la ===\n{}", 
 String::from_utf8_lossy(&output2.stdout));
 
 // args - หลายตัวพร้อมกัน
 let output3 = Command::new("ls")
 .args(["-l", "-h"])
 .output()
 .expect("failed");
 
 println!("status: {:?}", output3.status.success());
}
```

</RustPlayground>

---

## 2. spawn และ Child

<RustPlayground>

```rust
use std::process::Command;

fn main() {
 // spawn - รัน background (ไม่รอ)
 let mut child = Command::new("sleep")
 .arg("1")
 .spawn()
 .expect("failed to spawn");
 
 println!("Child PID: {:?}", child.id());
 
 // wait - รอให้จบ
 let status = child.wait().expect("failed to wait");
 println!("Exit status: {}", status);
 println!("Exited successfully: {}", status.success());
 
 // try_wait - ตรวจโดยไม่ block
 let mut child2 = Command::new("sleep")
 .arg("2")
 .spawn()
 .expect("failed");
 
 match child2.try_wait() {
 Ok(Some(status)) => println!("Exited with: {}", status),
 Ok(None) => println!("Still running..."),
 Err(e) => println!("Error: {}", e),
 }
 
 // kill - หยุดทันที
 child2.kill().expect("failed to kill");
 println!("Killed child2");
}
```

</RustPlayground>

---

## 3. Stdio Piping

<RustPlayground>

```rust
use std::process::{Command, Stdio};
use std::io::{Write, Read};

fn main() {
 // Pipe output
 let child = Command::new("echo")
 .arg("Hello from pipe")
 .stdout(Stdio::piped())
 .spawn()
 .expect("failed");
 
 let output = child.wait_with_output().expect("failed");
 println!("Piped output: {}", String::from_utf8_lossy(&output.stdout));
 
 // Pipe input (stdin)
 let mut child = Command::new("cat")
 .stdin(Stdio::piped())
 .stdout(Stdio::piped())
 .spawn()
 .expect("failed to spawn cat");
 
 // เขียนไป stdin
 if let Some(ref mut stdin) = child.stdin {
 stdin.write_all(b"Hello, cat!").expect("failed to write");
 }
 
 let output = child.wait_with_output().expect("failed");
 println!("Cat says: {}", String::from_utf8_lossy(&output.stdout));
}
```

</RustPlayground>

---

## 4. Pipe ระหว่าง Commands

<RustPlayground>

```rust
use std::process::{Command, Stdio};

fn main() {
 // echo "hello world" | tr 'a-z' 'A-Z'
 
 // Command แรก
 let echo = Command::new("echo")
 .arg("hello world")
 .stdout(Stdio::piped())
 .spawn()
 .expect("failed to spawn echo");
 
 // Command ที่สอง - รับ stdout จาก echo
 let tr = Command::new("tr")
 .args(["a-z", "A-Z"])
 .stdin(echo.stdout.unwrap())
 .stdout(Stdio::piped())
 .spawn()
 .expect("failed to spawn tr");
 
 let output = tr.wait_with_output().expect("failed");
 println!("Result: {}", String::from_utf8_lossy(&output.stdout));
}
```

</RustPlayground>

---

## 5. Environment และ Working Dir

<RustPlayground>

```rust
use std::process::Command;

fn main() {
 // ตั้ง environment variable
 let output = Command::new("sh")
 .arg("-c")
 .arg("echo $MY_VAR")
 .env("MY_VAR", "Hello from env!")
 .output()
 .expect("failed");
 
 println!("With env: {}", String::from_utf8_lossy(&output.stdout));
 
 // env_clear - ล้าง env ทั้งหมด
 let output2 = Command::new("env")
 .env_clear()
 .env("ONLY_THIS", "one")
 .output()
 .expect("failed");
 
 println!("Cleared env:\n{}", String::from_utf8_lossy(&output2.stdout));
 
 // current_dir - เปลี่ยน working directory
 let output3 = Command::new("pwd")
 .current_dir("/tmp")
 .output()
 .expect("failed");
 
 println!("Working dir: {}", String::from_utf8_lossy(&output3.stdout));
}
```

</RustPlayground>

---

## 6. status() shortcut

<RustPlayground>

```rust
use std::process::Command;

fn main() {
 // status() - รันและรอ ได้แค่ status
 let status = Command::new("ls")
 .arg(".")
 .status()
 .expect("failed to execute");
 
 println!("Exit status: {}", status);
 println!("Success: {}", status.success());
 
 // ตรวจ exit code
 if let Some(code) = status.code() {
 println!("Exit code: {}", code);
 } else {
 println!("Process terminated by signal");
 }
 
 // คำสั่งที่ fail
 let status2 = Command::new("ls")
 .arg("/nonexistent_path")
 .status()
 .expect("failed");
 
 println!("\nFailed command: {:?}", status2);
}
```

</RustPlayground>

---

## 7. exit และ abort

<RustPlayground>

```rust
use std::process;

fn main() {
 let should_exit = false;
 
 if should_exit {
 // exit - จบ gracefully
 process::exit(0); // 0 = success
 // process::exit(1); // non-zero = error
 }
 
 let should_abort = false;
 if should_abort {
 // abort - จบทันที (crash)
 process::abort();
 }
 
 println!("Program continues normally");
 
 // id - get current process id
 println!("Current PID: {}", process::id());
}
```

</RustPlayground>

---

## Quick Reference

### Command Methods
| Method | คำอธิบาย |
|--------|---------|
| `new(prog)` | สร้าง Command |
| `arg(a)` | เพิ่ม argument |
| `args([...])` | เพิ่มหลาย args |
| `env(k, v)` | ตั้ง env var |
| `current_dir(d)` | ตั้ง working dir |

### Execution
| Method | คำอธิบาย | Blocking |
|--------|---------|----------|
| `output()` | รัน รอ ได้ทุกอย่าง | |
| `status()` | รัน รอ ได้แค่ status | |
| `spawn()` | รัน background | |

### Child Methods
| Method | คำอธิบาย |
|--------|---------|
| `id()` | process ID |
| `wait()` | รอให้จบ |
| `try_wait()` | ตรวจโดยไม่ block |
| `kill()` | หยุดทันที |
| `wait_with_output()` | รอและเก็บ output |

### Stdio
| Value | คำอธิบาย |
|-------|---------|
| `Stdio::piped()` | pipe I/O |
| `Stdio::null()` | ทิ้ง output |
| `Stdio::inherit()` | ใช้ของ parent |

---

[← Environment](./env) | [Networking →](./net)
