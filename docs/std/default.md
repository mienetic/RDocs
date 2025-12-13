# Default - ค่าเริ่มต้น

**std::default** มี trait สำหรับสร้างค่าเริ่มต้นของ types! 

---

## Default คืออะไร?

`Default` trait ให้ค่า "เริ่มต้น" ที่เหมาะสมสำหรับแต่ละ type:
- ตัวเลข → 0
- bool → false
- String → ""
- Vec → []

---

## 1. ใช้ Default

<RustPlayground>

```rust
fn main() {
 // Default สำหรับ primitive types
 let n: i32 = Default::default();
 let f: f64 = Default::default();
 let b: bool = Default::default();
 let s: String = Default::default();
 let v: Vec<i32> = Default::default();
 
 println!("i32 default: {}", n); // 0
 println!("f64 default: {}", f); // 0.0
 println!("bool default: {}", b); // false
 println!("String default: '{}'", s); // ""
 println!("Vec default: {:?}", v); // []
 
 // หรือใช้ ::default() ตรงๆ
 let s2 = String::default();
 let v2 = Vec::<i32>::default();
 println!("String::default(): '{}'", s2);
 println!("Vec::default(): {:?}", v2);
}
```

</RustPlayground>

---

## 2. Derive Default

<RustPlayground>

```rust
#[derive(Debug, Default)]
struct Config {
 debug: bool,
 max_connections: u32,
 timeout_ms: u64,
 name: String,
}

fn main() {
 // สร้างด้วย Default
 let config = Config::default();
 
 println!("Default config: {:?}", config);
 // Config { debug: false, max_connections: 0, timeout_ms: 0, name: "" }
 
 // Struct update syntax - สร้างจาก default แล้วแก้บางค่า
 let custom = Config {
 debug: true,
 max_connections: 100,
 ..Default::default()
 };
 
 println!("Custom config: {:?}", custom);
}
```

</RustPlayground>

---

## 3. Implement Default เอง

<RustPlayground>

```rust
#[derive(Debug)]
struct Server {
 host: String,
 port: u16,
 max_clients: usize,
}

impl Default for Server {
 fn default() -> Self {
 Server {
 host: "localhost".to_string(),
 port: 8080,
 max_clients: 100,
 }
 }
}

fn main() {
 let server = Server::default();
 println!("Default server: {:?}", server);
 
 // แก้ไขบางค่า
 let prod = Server {
 host: "0.0.0.0".to_string(),
 port: 443,
 ..Server::default()
 };
 println!("Production server: {:?}", prod);
}
```

</RustPlayground>

---

## 4. Default กับ Option

<RustPlayground>

```rust
fn main() {
 // unwrap_or_default ใช้ Default ถ้า None
 let some: Option<i32> = Some(42);
 let none: Option<i32> = None;
 
 println!("Some(42).unwrap_or_default() = {}", some.unwrap_or_default());
 println!("None.unwrap_or_default() = {}", none.unwrap_or_default());
 
 // ใช้กับ String
 let name: Option<String> = None;
 let display = name.unwrap_or_default();
 println!("name: '{}'", display); // ""
 
 // ใช้กับ Vec
 let items: Option<Vec<i32>> = None;
 let list = items.unwrap_or_default();
 println!("items: {:?}", list); // []
}
```

</RustPlayground>

---

## 5. Default กับ Result

<RustPlayground>

```rust
fn main() {
 // unwrap_or_default สำหรับ Result
 let ok: Result<i32, &str> = Ok(42);
 let err: Result<i32, &str> = Err("error");
 
 println!("Ok(42).unwrap_or_default() = {}", ok.unwrap_or_default());
 println!("Err.unwrap_or_default() = {}", err.unwrap_or_default());
 
 // ใช้กับ parse
 fn safe_parse(s: &str) -> i32 {
 s.parse().unwrap_or_default()
 }
 
 println!("parse '123': {}", safe_parse("123"));
 println!("parse 'abc': {}", safe_parse("abc")); // 0
}
```

</RustPlayground>

---

## 6. Default กับ Entry API

<RustPlayground>

```rust
use std::collections::HashMap;

fn main() {
 let mut counts: HashMap<&str, i32> = HashMap::new();
 
 // or_default() ใส่ Default ถ้าไม่มี
 *counts.entry("apple").or_default() += 1;
 *counts.entry("apple").or_default() += 1;
 *counts.entry("banana").or_default() += 1;
 
 println!("counts: {:?}", counts);
 
 // ใช้กับ Vec
 let mut groups: HashMap<&str, Vec<i32>> = HashMap::new();
 
 groups.entry("a").or_default().push(1);
 groups.entry("a").or_default().push(2);
 groups.entry("b").or_default().push(3);
 
 println!("groups: {:?}", groups);
}
```

</RustPlayground>

---

## 7. Default กับ Generics

<RustPlayground>

```rust
// Generic function ที่ใช้ Default
fn create_or_default<T: Default>(value: Option<T>) -> T {
 value.unwrap_or_default()
}

// Generic struct กับ Default
#[derive(Debug)]
struct Container<T: Default> {
 value: T,
 count: usize,
}

impl<T: Default> Default for Container<T> {
 fn default() -> Self {
 Container {
 value: T::default(),
 count: 0,
 }
 }
}

fn main() {
 let x: i32 = create_or_default(Some(42));
 let y: i32 = create_or_default(None);
 
 println!("x: {}, y: {}", x, y);
 
 let c1: Container<String> = Container::default();
 let c2: Container<Vec<i32>> = Container::default();
 
 println!("c1: {:?}", c1);
 println!("c2: {:?}", c2);
}
```

</RustPlayground>

---

## Quick Reference

### Default Values
| Type | Default Value |
|------|---------------|
| `i32`, `u32`, etc. | `0` |
| `f32`, `f64` | `0.0` |
| `bool` | `false` |
| `char` | `'\0'` |
| `String` | `""` |
| `Vec<T>` | `[]` |
| `Option<T>` | `None` |
| `HashMap<K,V>` | `{}` |

### Methods ที่ใช้ Default
| Method | ใช้กับ | คำอธิบาย |
|--------|-------|---------|
| `unwrap_or_default()` | Option, Result | ได้ Default ถ้าว่าง/error |
| `or_default()` | Entry | ใส่ Default ถ้าไม่มี |
| `take()` | Cell, Option | ดึงค่า ใส่ Default |

### Derive vs Implement
| เมื่อไหร่ | วิธี |
|---------|-----|
| ทุก field มี Default | `#[derive(Default)]` |
| ต้องการค่าเฉพาะ | `impl Default` |

### Pattern
```rust
// Builder pattern กับ Default
let config = Config {
 debug: true,
 ..Default::default()
};
```

---

[← Hash](./hash) | [Borrow →](./borrow)
