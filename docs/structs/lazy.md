# Lazy Types (std::cell)

Types สำหรับ Lazy Initialization! 

---

## LazyCell

Single-threaded lazy initialization

<RustPlayground>

```rust
use std::cell::LazyCell;

fn main() {
 // LazyCell: คำนวณครั้งแรกที่เข้าถึง
 let lazy: LazyCell<String> = LazyCell::new(|| {
 println!("Computing...");
 "Hello, Lazy!".to_string()
 });
 
 println!("Before access");
 
 // เข้าถึงครั้งแรก - คำนวณ
 println!("Value: {}", *lazy);
 
 // เข้าถึงครั้งที่สอง - ใช้ค่าที่ cache ไว้
 println!("Value again: {}", *lazy);
}
```

</RustPlayground>

---

## OnceCell

Single-threaded one-time initialization

<RustPlayground>

```rust
use std::cell::OnceCell;

fn main() {
 let cell: OnceCell<String> = OnceCell::new();
 
 // ตั้งค่าครั้งแรก
 cell.set("Hello".to_string()).unwrap();
 
 // ตั้งค่าอีกครั้ง - fail!
 let result = cell.set("World".to_string());
 println!("Second set: {:?}", result.is_err());
 
 // get
 println!("Value: {:?}", cell.get());
 
 // get_or_init: ตั้งค่าถ้ายังไม่มี
 let cell2: OnceCell<i32> = OnceCell::new();
 let value = cell2.get_or_init(|| 42);
 println!("Initialized: {}", value);
}
```

</RustPlayground>

---

## OnceLock (Thread-safe)

<RustPlayground>

```rust
use std::sync::OnceLock;

// Global constant ที่คำนวณตอน runtime
static CONFIG: OnceLock<String> = OnceLock::new();

fn get_config() -> &'static str {
 CONFIG.get_or_init(|| {
 println!("Initializing config...");
 "Production".to_string()
 })
}

fn main() {
 println!("First call: {}", get_config());
 println!("Second call: {}", get_config());
}
```

</RustPlayground>

---

## LazyLock (Thread-safe Lazy)

<RustPlayground>

```rust
use std::sync::LazyLock;
use std::collections::HashMap;

// Global map ที่ initialize ตอน runtime
static LOOKUP: LazyLock<HashMap<&str, i32>> = LazyLock::new(|| {
 println!("Building lookup table...");
 let mut m = HashMap::new();
 m.insert("one", 1);
 m.insert("two", 2);
 m.insert("three", 3);
 m
});

fn main() {
 println!("Before first access");
 
 // เข้าถึงครั้งแรก - initialize
 println!("one = {}", LOOKUP.get("one").unwrap());
 
 // ใช้ cached value
 println!("two = {}", LOOKUP.get("two").unwrap());
}
```

</RustPlayground>

---

## เปรียบเทียบ

| Type | Thread-Safe | Use Case |
|------|-------------|----------|
| `LazyCell<T>` | | Single-thread lazy |
| `OnceCell<T>` | | Single-thread one-time |
| `LazyLock<T>` | | Multi-thread lazy |
| `OnceLock<T>` | | Multi-thread one-time |

---

## Pattern: Lazy Regex

<RustPlayground>

```rust
use std::sync::LazyLock;

// Regex pattern (จำลอง)
static EMAIL_PATTERN: LazyLock<String> = LazyLock::new(|| {
 // สมมติว่า compile regex ที่นี่
 r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$".to_string()
});

fn validate_email(email: &str) -> bool {
 // ใช้ pattern ที่ compile แล้ว
 email.contains('@') && email.contains('.')
}

fn main() {
 println!("Pattern: {}", &*EMAIL_PATTERN);
 println!("Valid: {}", validate_email("test@example.com"));
}
```

</RustPlayground>

---

## Quick Reference

| Method | คำอธิบาย |
|--------|---------|
| `new(f)` | สร้างด้วย initializer |
| `get()` | ดึงค่า (Option) |
| `get_or_init(f)` | ดึงหรือ initialize |
| `set(v)` | ตั้งค่า (OnceCell) |
| `force()` | บังคับ initialize |

---

[← Ops](/structs/ops) | [Backtrace →](/structs/backtrace)
