# Interior Mutability

เปลี่ยนแปลงข้อมูลผ่าน immutable reference! 

:::tip ทำไมต้องมี Interior Mutability?
บางครั้งเราต้องการเปลี่ยนแปลงข้อมูลภายใน struct ที่ถูก share ผ่าน `&self` ไม่ใช่ `&mut self`
:::

---

## 1. ปัญหาที่ Interior Mutability แก้ได้

<RustPlayground>

```rust
struct Counter {
 count: i32,
}

impl Counter {
 fn new() -> Self {
 Counter { count: 0 }
 }
 
 // ต้องใช้ &mut self
 fn increment(&mut self) {
 self.count += 1;
 }
 
 fn get(&self) -> i32 {
 self.count
 }
}

fn main() {
 let mut counter = Counter::new();
 counter.increment();
 counter.increment();
 println!("Count: {}", counter.get());
}
```

</RustPlayground>

**ปัญหา:** ถ้าเรามี shared reference (`&Counter`) หลายตัว เราจะ increment ไม่ได้!

---

## 2. Cell

### 2.1 Basic Usage

<RustPlayground>

```rust
use std::cell::Cell;

struct Counter {
 count: Cell<i32>, // Interior mutability!
}

impl Counter {
 fn new() -> Self {
 Counter { count: Cell::new(0) }
 }
 
 // ใช้ &self ได้แล้ว!
 fn increment(&self) {
 self.count.set(self.count.get() + 1);
 }
 
 fn get(&self) -> i32 {
 self.count.get()
 }
}

fn main() {
 let counter = Counter::new(); // ไม่ต้อง mut!
 
 counter.increment();
 counter.increment();
 counter.increment();
 
 println!("Count: {}", counter.get());
}
```

</RustPlayground>

### 2.2 Cell Methods

| Method | Description |
|--------|-------------|
| `Cell::new(value)` | Create new Cell |
| `.get()` | Get copy of value |
| `.set(value)` | Set value |
| `.replace(value)` | Set and return old value |
| `.take()` | Take value, replace with default |

### 2.3 Limitations of Cell

<RustPlayground>

```rust
use std::cell::Cell;

fn main() {
 // Cell works with Copy types
 let cell_i32 = Cell::new(42);
 let value = cell_i32.get(); // Copy ออกมา
 println!("Value: {}", value);
 
 // Cell ไม่เหมาะกับ non-Copy types
 // เพราะ get() ต้อง Copy
 // let cell_string = Cell::new(String::from("hello"));
 // let s = cell_string.get(); // Error! String ไม่ Copy
 
 // ใช้ RefCell แทนสำหรับ non-Copy types
}
```

</RustPlayground>

:::tip Cell สำหรับ Copy types เท่านั้น!
ใช้ `Cell<T>` เมื่อ T implements Copy (integers, bool, etc.)
ใช้ `RefCell<T>` เมื่อ T ไม่ Copy (String, Vec, etc.)
:::

---

## 3. RefCell

### 3.1 Basic Usage

<RustPlayground>

```rust
use std::cell::RefCell;

struct Logger {
 messages: RefCell<Vec<String>>,
}

impl Logger {
 fn new() -> Self {
 Logger { messages: RefCell::new(Vec::new()) }
 }
 
 // ใช้ &self แต่เปลี่ยน messages ได้!
 fn log(&self, msg: &str) {
 self.messages.borrow_mut().push(msg.to_string());
 }
 
 fn print_all(&self) {
 for msg in self.messages.borrow().iter() {
 println!("{}", msg);
 }
 }
 
 fn count(&self) -> usize {
 self.messages.borrow().len()
 }
}

fn main() {
 let logger = Logger::new();
 
 logger.log("Starting...");
 logger.log("Processing...");
 logger.log("Done!");
 
 println!("Total messages: {}", logger.count());
 println!("\nAll messages:");
 logger.print_all();
}
```

</RustPlayground>

### 3.2 borrow() vs borrow_mut()

<RustPlayground>

```rust
use std::cell::RefCell;

fn main() {
 let data = RefCell::new(vec![1, 2, 3]);
 
 // borrow() = immutable borrow
 {
 let r1 = data.borrow();
 let r2 = data.borrow(); // หลาย immutable OK
 println!("r1: {:?}, r2: {:?}", *r1, *r2);
 }
 
 // borrow_mut() = mutable borrow
 {
 let mut r = data.borrow_mut();
 r.push(4);
 // let r2 = data.borrow(); // Panic! ยัง borrow_mut อยู่
 }
 
 println!("Final: {:?}", data.borrow());
}
```

</RustPlayground>

### 3.3 Runtime Borrow Checking

:::warning RefCell ตรวจสอบตอน Runtime! 
ถ้าละเมิด borrow rules → **panic!** (ไม่ใช่ compile error)
:::

<RustPlayground>

```rust
use std::cell::RefCell;

fn main() {
 let data = RefCell::new(42);
 
 // ดู borrow state
 // (ใน real code ใช้ try_borrow แทน)
 
 // Safe way
 match data.try_borrow_mut() {
 Ok(mut r) => {
 *r = 100;
 println!("Set to 100");
 }
 Err(_) => {
 println!("Already borrowed!");
 }
 }
 
 println!("Value: {}", data.borrow());
}
```

</RustPlayground>

### 3.4 RefCell Methods

| Method | Returns | Panics if |
|--------|---------|-----------|
| `.borrow()` | `Ref<T>` | Already mutably borrowed |
| `.borrow_mut()` | `RefMut<T>` | Already borrowed |
| `.try_borrow()` | `Result<Ref<T>, _>` | Never |
| `.try_borrow_mut()` | `Result<RefMut<T>, _>` | Never |

---

## 4. Rc + RefCell Pattern

### 4.1 Shared Mutable State

<RustPlayground>

```rust
use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
struct Node {
 value: i32,
 children: RefCell<Vec<Rc<Node>>>,
}

impl Node {
 fn new(value: i32) -> Rc<Self> {
 Rc::new(Node {
 value,
 children: RefCell::new(Vec::new()),
 })
 }
 
 fn add_child(&self, child: Rc<Node>) {
 self.children.borrow_mut().push(child);
 }
 
 fn print(&self, indent: usize) {
 println!("{}{}", " ".repeat(indent), self.value);
 for child in self.children.borrow().iter() {
 child.print(indent + 1);
 }
 }
}

fn main() {
 let root = Node::new(1);
 let child1 = Node::new(2);
 let child2 = Node::new(3);
 let grandchild = Node::new(4);
 
 child1.add_child(grandchild);
 root.add_child(child1);
 root.add_child(child2);
 
 println!("Tree:");
 root.print(0);
}
```

</RustPlayground>

---

## 5. OnceCell & Lazy

### 5.1 OnceCell (Initialize Once)

<RustPlayground>

```rust
use std::cell::OnceCell;

struct Config {
 data: OnceCell<String>,
}

impl Config {
 fn new() -> Self {
 Config { data: OnceCell::new() }
 }
 
 fn get_data(&self) -> &str {
 self.data.get_or_init(|| {
 println!("Initializing...");
 String::from("Loaded config!")
 })
 }
}

fn main() {
 let config = Config::new();
 
 println!("First call:");
 println!(" {}", config.get_data()); // Initializes
 
 println!("\nSecond call:");
 println!(" {}", config.get_data()); // Uses cached
 
 println!("\nThird call:");
 println!(" {}", config.get_data()); // Uses cached
}
```

</RustPlayground>

### 5.2 LazyCell (Lazy Initialization)

```rust
use std::cell::LazyCell;

fn expensive_computation() -> String {
 println!("Computing...");
 String::from("Expensive result")
}

fn main() {
 let lazy = LazyCell::new(|| expensive_computation());
 
 println!("Before access:");
 println!("Value: {}", *lazy); // Computes here
 println!("Value: {}", *lazy); // Uses cached
}
```

---

## 6. Thread-Safe Alternatives

| Single-threaded | Multi-threaded |
|-----------------|----------------|
| `Cell<T>` | `AtomicXxx` |
| `RefCell<T>` | `Mutex<T>` / `RwLock<T>` |
| `Rc<T>` | `Arc<T>` |
| `OnceCell<T>` | `OnceLock<T>` |

<RustPlayground>

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
 // Thread-safe interior mutability
 let counter = Arc::new(Mutex::new(0));
 let mut handles = vec![];
 
 for _ in 0..5 {
 let counter = Arc::clone(&counter);
 let handle = thread::spawn(move || {
 let mut num = counter.lock().unwrap();
 *num += 1;
 });
 handles.push(handle);
 }
 
 for handle in handles {
 handle.join().unwrap();
 }
 
 println!("Counter: {}", *counter.lock().unwrap());
}
```

</RustPlayground>

---

## 7. Common Patterns

### 7.1 Caching

<RustPlayground>

```rust
use std::cell::RefCell;
use std::collections::HashMap;

struct Cache {
 data: RefCell<HashMap<String, i32>>,
}

impl Cache {
 fn new() -> Self {
 Cache { data: RefCell::new(HashMap::new()) }
 }
 
 fn get_or_compute(&self, key: &str, compute: impl Fn() -> i32) -> i32 {
 // ลอง get ก่อน
 if let Some(&value) = self.data.borrow().get(key) {
 return value;
 }
 
 // ไม่มี = compute แล้ว cache
 let value = compute();
 self.data.borrow_mut().insert(key.to_string(), value);
 value
 }
}

fn main() {
 let cache = Cache::new();
 
 let v1 = cache.get_or_compute("expensive", || {
 println!("Computing...");
 42
 });
 
 let v2 = cache.get_or_compute("expensive", || {
 println!("Computing again..."); // จะไม่ print
 42
 });
 
 println!("v1 = {}, v2 = {}", v1, v2);
}
```

</RustPlayground>

### 7.2 Memoization

<RustPlayground>

```rust
use std::cell::RefCell;

struct Fibonacci {
 cache: RefCell<Vec<Option<u64>>>,
}

impl Fibonacci {
 fn new(max: usize) -> Self {
 Fibonacci {
 cache: RefCell::new(vec![None; max + 1]),
 }
 }
 
 fn compute(&self, n: usize) -> u64 {
 if n <= 1 {
 return n as u64;
 }
 
 if let Some(cached) = self.cache.borrow()[n] {
 return cached;
 }
 
 let result = self.compute(n - 1) + self.compute(n - 2);
 self.cache.borrow_mut()[n] = Some(result);
 result
 }
}

fn main() {
 let fib = Fibonacci::new(50);
 
 for i in [10, 20, 30, 40] {
 println!("fib({}) = {}", i, fib.compute(i));
 }
}
```

</RustPlayground>

---

## 8. สรุป

| Type | Thread-safe | Use Case |
|------|-------------|----------|
| `Cell<T>` | | Copy types, simple values |
| `RefCell<T>` | | Non-Copy types, complex data |
| `OnceCell<T>` | | Initialize once |
| `Mutex<T>` | | Multi-threaded mutable access |
| `RwLock<T>` | | Multi-threaded, many readers |
| `Atomic*` | | Lock-free primitives |

---

[บทถัดไป: Pinning](/advanced/pinning)
