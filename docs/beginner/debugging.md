# Debugging

เรียนรู้วิธี Debug โค้ด Rust อย่างมือโปร!

:::tip Compiler คือนักดีบักที่ดีที่สุด!
Rust compiler บอก error ชัดมาก อ่านดีๆ จะรู้วิธีแก้เลย!
:::

---

## 1. println! และ dbg!

### 1.1 println! (Classic Debug)

<RustPlayground>

```rust
fn main() {
 let x = 42;
 let name = "Alice";
 let vec = vec![1, 2, 3];

 // Basic print
 println!("x = {}", x);

 // Debug format {:?}
 println!("vec = {:?}", vec);

 // Pretty print {:#?}
 println!("vec = {:#?}", vec);

 // Multiple values
 println!("name={}, x={}, vec={:?}", name, x, vec);
}
```

</RustPlayground>

### 1.2 dbg! (Modern Debug)

<RustPlayground>

```rust
fn main() {
 let a = 2;
 let b = 3;

 // dbg! แสดง: [src/main.rs:5] a = 2
 dbg!(a);

 // dbg! returns the value! ใช้ใน expression ได้
 let c = dbg!(a * b) + 10;
 dbg!(c);

 // ใช้กับ struct
 #[derive(Debug)]
 struct Point { x: i32, y: i32 }

 let p = Point { x: 10, y: 20 };
 dbg!(&p);

 // Chain
 let result = dbg!(dbg!(2 + 2) * dbg!(3 + 3));
 println!("Result: {}", result);
}
```

</RustPlayground>

### 1.3 เปรียบเทียบ println! vs dbg!

| Feature | `println!` | `dbg!` |
|---------|-----------|--------|
| Output to | stdout | stderr |
| Shows file/line | | |
| Returns value | | |
| In expressions | | |
| For production | | |

::: recommendation
**ใช้ `dbg!` แทน `println!` ตอน Debug**
เพราะ `dbg!` ให้ข้อมูล File และ Line number โดยอัตโนมัติ แถมยังคืนค่าออกมาให้ใช้ต่อใน expression ได้ด้วย!
:::

---

## 2. derive(Debug)

<RustPlayground>

```rust
// เพิ่ม #[derive(Debug)] ให้ struct/enum
#[derive(Debug)]
struct User {
 name: String,
 age: u32,
 email: String,
}

#[derive(Debug)]
enum Status {
 Active,
 Inactive,
 Pending { reason: String },
}

fn main() {
 let user = User {
 name: String::from("สมชาย"),
 age: 25,
 email: String::from("somchai@example.com"),
 };

 // {:?} = Debug format
 println!("User: {:?}", user);

 // {:#?} = Pretty print
 println!("\nPretty:\n{:#?}", user);

 let status = Status::Pending {
 reason: String::from("รอการอนุมัติ")
 };
 println!("\nStatus: {:?}", status);
}
```

</RustPlayground>

---

## 3. Custom Debug Implementation

<RustPlayground>

```rust
use std::fmt;

struct Password(String);

// Custom Debug - ซ่อน password
impl fmt::Debug for Password {
 fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
 write!(f, "Password(***)")
 }
}

#[derive(Debug)]
struct User {
 name: String,
 password: Password,
}

fn main() {
 let user = User {
 name: String::from("admin"),
 password: Password(String::from("secret123")),
 };

 println!("{:?}", user);
 // User { name: "admin", password: Password(***) }
}
```

</RustPlayground>

---

## 4. Assertions

<RustPlayground>

```rust
fn main() {
 let x = 5;

 // assert! - ถ้า false จะ panic
 assert!(x > 0);
 assert!(x == 5, "x ต้องเท่ากับ 5, got {}", x);

 // assert_eq! - เปรียบเทียบเท่ากัน
 assert_eq!(x, 5);
 assert_eq!(2 + 2, 4, "Math is broken!");

 // assert_ne! - เปรียบเทียบไม่เท่ากัน
 assert_ne!(x, 0);

 println!("All assertions passed! ");

 // debug_assert! - ทำงานเฉพาะ debug build
 debug_assert!(x > 0, "Only in debug mode");
}
```

</RustPlayground>

---

## 5. Compiler Error Messages

### 5.1 อ่าน Error Message

```rust
// Error: borrow of moved value
fn main() {
 let s1 = String::from("hello");
 let s2 = s1;
 println!("{}", s1); // Error!
}
```

Compiler จะบอก:
```
error[E0382]: borrow of moved value: `s1`
 --> src/main.rs:4:20
 |
2 | let s1 = String::from("hello");
 | -- move occurs because `s1` has type `String`
3 | let s2 = s1;
 | -- value moved here
4 | println!("{}", s1);
 | ^^ value borrowed here after move
 |
 = help: consider cloning the value if you want to use it again
```

:::tip อ่าน Error แบบมือโปร!
1. ดู `error[EXXXX]` - error code
2. ดู `-->` - บรรทัดที่ error
3. ดู `|` - visual indicator
4. ดู `help:` - วิธีแก้!
:::

---

## 6. VS Code Debugging

### 6.1 ติดตั้ง Extensions

1. **CodeLLDB** - debugger for Rust
2. **rust-analyzer** - language support

### 6.2 สร้าง launch.json

```json
// .vscode/launch.json
{
 "version": "0.2.0",
 "configurations": [
 {
 "type": "lldb",
 "request": "launch",
 "name": "Debug",
 "cargo": {
 "args": [
 "build",
 "--bin=${workspaceFolderBasename}"
 ]
 },
 "args": [],
 "cwd": "${workspaceFolder}"
 }
 ]
}
```

### 6.3 วิธีใช้

1. ตั้ง Breakpoint (คลิกซ้ายที่เลขบรรทัด)
2. กด F5 หรือ Run > Start Debugging
3. ใช้ Debug toolbar:
 - Continue
 - Step Over
 - Step Into
 - Step Out
 - Restart
 - Stop

---

## 7. Tracing & Logging

### 7.1 log crate

```toml
# Cargo.toml
[dependencies]
log = "0.4"
env_logger = "0.10"
```

```rust
use log::{info, warn, error, debug, trace};

fn main() {
 env_logger::init();

 trace!("Detailed trace info");
 debug!("Debug info");
 info!("Normal info");
 warn!("Warning!");
 error!("Error occurred!");
}
```

```bash
# รันพร้อม log level
RUST_LOG=debug cargo run
```

### 7.2 tracing crate (Modern)

```toml
# Cargo.toml
[dependencies]
tracing = "0.1"
tracing-subscriber = "0.3"
```

```rust
use tracing::{info, instrument, span, Level};

#[instrument]
fn process_data(id: u32) {
 info!("Processing data");
 // ... logic ...
}

fn main() {
 tracing_subscriber::fmt::init();

 let span = span!(Level::INFO, "main");
 let _enter = span.enter();

 info!("Starting application");
 process_data(42);
}
```

---

## 8. Common Debug Patterns

### 8.1 Debug Iterator

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];

 let result: Vec<i32> = numbers
 .iter()
 .inspect(|x| println!("before filter: {}", x))
 .filter(|x| *x % 2 == 0)
 .inspect(|x| println!("after filter: {}", x))
 .map(|x| x * 2)
 .inspect(|x| println!("after map: {}", x))
 .collect();

 println!("\nResult: {:?}", result);
}
```

</RustPlayground>

### 8.2 Debug Option/Result

<RustPlayground>

```rust
fn main() {
 let value: Option<i32> = Some(42);

 // Inspect without consuming
 if let Some(v) = &value {
 println!("Value is: {}", v);
 }

 // Chain with map for debugging
 let result = value
 .map(|v| {
 println!("Processing: {}", v);
 v * 2
 });

 println!("Result: {:?}", result);
}
```

</RustPlayground>

---

## 9. สรุป

| Tool | Use Case |
|------|----------|
| `println!("{:?}")` | Simple debug output |
| `dbg!()` | Quick debug with file/line |
| `#[derive(Debug)]` | Enable debug for structs |
| `assert!()` | Runtime checks |
| VS Code + CodeLLDB | Interactive debugging |
| `log`/`tracing` | Production logging |
| `.inspect()` | Debug iterators |

---

[บทถัดไป: Control Flow](/beginner/control-flow)
