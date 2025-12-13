# Any - ทุกชนิดข้อมูล

**std::any** สำหรับทำงานกับ types แบบ dynamic ที่ runtime! 

---

## Any คืออะไร?

`Any` trait ให้ความสามารถ:
- เก็บ type ใดๆ ก็ได้ใน `Box<dyn Any>`
- ตรวจสอบ type ที่ runtime
- Downcast กลับเป็น type จริง

:::tip เมื่อไหร่ใช้ Any?
- Plugin systems
- Heterogeneous collections (เก็บหลาย types รวมกัน)
- Type erasure
- Dynamic dispatch
:::

---

## 1. Any Trait พื้นฐาน

<RustPlayground>

```rust
use std::any::Any;

fn main() {
 // Box<dyn Any> เก็บ type ใดก็ได้
 let values: Vec<Box<dyn Any>> = vec![
 Box::new(42_i32), // i32
 Box::new("สวัสดี"), // &str
 Box::new(vec![1, 2, 3]), // Vec<i32>
 Box::new(3.14_f64), // f64
 ];
 
 for (i, value) in values.iter().enumerate() {
 print!("ค่าที่ {}: ", i);
 
 // downcast_ref ลอง cast เป็น type ที่ต้องการ
 if let Some(n) = value.downcast_ref::<i32>() {
 println!("i32 = {}", n);
 } else if let Some(s) = value.downcast_ref::<&str>() {
 println!("&str = \"{}\"", s);
 } else if let Some(v) = value.downcast_ref::<Vec<i32>>() {
 println!("Vec = {:?}", v);
 } else if let Some(f) = value.downcast_ref::<f64>() {
 println!("f64 = {}", f);
 } else {
 println!("ไม่รู้จัก type");
 }
 }
}
```

</RustPlayground>

---

## 2. TypeId - เปรียบเทียบ Types

<RustPlayground>

```rust
use std::any::{Any, TypeId};

fn print_type_info<T: 'static>() {
 let id = TypeId::of::<T>();
 let name = std::any::type_name::<T>();
 println!("Type: {} -> TypeId: {:?}", name, id);
}

fn main() {
 println!("=== TypeId ของ types ต่างๆ ===");
 print_type_info::<i32>();
 print_type_info::<String>();
 print_type_info::<Vec<i32>>();
 print_type_info::<Option<bool>>();
 
 println!("\n=== เปรียบเทียบ TypeId ===");
 let a = TypeId::of::<i32>();
 let b = TypeId::of::<i32>();
 let c = TypeId::of::<i64>();
 
 println!("i32 == i32: {}", a == b); // true
 println!("i32 == i64: {}", a == c); // false
 
 // ตรวจสอบ type ของ Box<dyn Any>
 let boxed: Box<dyn Any> = Box::new(42_i32);
 let is_i32 = (*boxed).type_id() == TypeId::of::<i32>();
 println!("\nboxed เป็น i32 ไหม: {}", is_i32);
}
```

</RustPlayground>

---

## 3. type_name - ชื่อ Type

<RustPlayground>

```rust
use std::any::type_name;

fn print_type_of<T>(_: &T) {
 println!("Type: {}", type_name::<T>());
}

fn main() {
 // แสดงชื่อ type
 print_type_of(&42_i32);
 print_type_of(&"hello");
 print_type_of(&vec![1, 2, 3]);
 print_type_of(&Some(42));
 
 // types ซับซ้อน
 let complex: Option<Vec<Result<i32, String>>> = None;
 print_type_of(&complex);
 
 // closure ก็มีชื่อ type
 let closure = |x: i32| x + 1;
 print_type_of(&closure);
 
 // functions
 fn my_func(x: i32) -> i32 { x * 2 }
 print_type_of(&my_func);
}
```

</RustPlayground>

:::info type_name สำหรับ debugging
ชื่อที่ได้อาจเปลี่ยนได้ในแต่ละ version ของ Rust ไม่ควรใช้ในการตรวจสอบจริงๆ
:::

---

## 4. downcast - แปลง Any กลับ

<RustPlayground>

```rust
use std::any::Any;

fn main() {
 let boxed: Box<dyn Any> = Box::new(42_i32);
 
 // downcast_ref - ได้ Option<&T>
 if let Some(n) = boxed.downcast_ref::<i32>() {
 println!("downcast_ref: i32 = {}", n);
 }
 
 // downcast_mut - ได้ Option<&mut T>
 let mut boxed2: Box<dyn Any> = Box::new(String::from("hello"));
 if let Some(s) = boxed2.downcast_mut::<String>() {
 s.push_str(" world");
 println!("downcast_mut: {}", s);
 }
 
 // downcast - ได้ Result<Box<T>, Box<dyn Any>>
 let boxed3: Box<dyn Any> = Box::new(vec![1, 2, 3]);
 match boxed3.downcast::<Vec<i32>>() {
 Ok(vec) => println!("downcast สำเร็จ: {:?}", vec),
 Err(boxed) => println!("downcast ล้มเหลว"),
 }
 
 // ลอง downcast ผิด type
 let boxed4: Box<dyn Any> = Box::new(100_i32);
 if boxed4.downcast_ref::<String>().is_none() {
 println!("i32 ไม่ใช่ String");
 }
}
```

</RustPlayground>

---

## 5. is() - ตรวจสอบ Type

<RustPlayground>

```rust
use std::any::Any;

fn check_type(value: &dyn Any) {
 print!("ค่านี้เป็น: ");
 
 if value.is::<i32>() {
 println!("i32");
 } else if value.is::<String>() {
 println!("String");
 } else if value.is::<Vec<i32>>() {
 println!("Vec<i32>");
 } else if value.is::<f64>() {
 println!("f64");
 } else {
 println!("ไม่รู้จัก");
 }
}

fn main() {
 check_type(&42_i32);
 check_type(&String::from("hello"));
 check_type(&vec![1, 2, 3]);
 check_type(&3.14_f64);
 check_type(&true); // ไม่รู้จัก
}
```

</RustPlayground>

---

## 6. Any กับ Traits

<RustPlayground>

```rust
use std::any::Any;
use std::fmt::Debug;

// รวม Any กับ traits อื่น
trait Printable: Any + Debug {
 fn print(&self);
 
 // helper method สำหรับ downcast
 fn as_any(&self) -> &dyn Any;
}

#[derive(Debug)]
struct Dog { name: String }

#[derive(Debug)]
struct Cat { name: String }

impl Printable for Dog {
 fn print(&self) { println!(" Dog: {}", self.name); }
 fn as_any(&self) -> &dyn Any { self }
}

impl Printable for Cat {
 fn print(&self) { println!(" Cat: {}", self.name); }
 fn as_any(&self) -> &dyn Any { self }
}

fn main() {
 let animals: Vec<Box<dyn Printable>> = vec![
 Box::new(Dog { name: "โกลเด้น".to_string() }),
 Box::new(Cat { name: "มิ้นท์".to_string() }),
 ];
 
 for animal in &animals {
 animal.print();
 
 // downcast ผ่าน as_any()
 if let Some(dog) = animal.as_any().downcast_ref::<Dog>() {
 println!(" -> เป็นหมา: {:?}", dog);
 }
 if let Some(cat) = animal.as_any().downcast_ref::<Cat>() {
 println!(" -> เป็นแมว: {:?}", cat);
 }
 }
}
```

</RustPlayground>

---

## 7. ตัวอย่างใช้งานจริง: Plugin System

<RustPlayground>

```rust
use std::any::Any;
use std::collections::HashMap;

// Registry เก็บ plugins หลาย types
struct Registry {
 plugins: HashMap<String, Box<dyn Any>>,
}

impl Registry {
 fn new() -> Self {
 Registry { plugins: HashMap::new() }
 }
 
 fn register<T: 'static>(&mut self, name: &str, plugin: T) {
 self.plugins.insert(name.to_string(), Box::new(plugin));
 }
 
 fn get<T: 'static>(&self, name: &str) -> Option<&T> {
 self.plugins.get(name)?.downcast_ref::<T>()
 }
}

// ตัวอย่าง plugins
struct Logger { prefix: String }
struct Counter { value: i32 }

impl Logger {
 fn log(&self, msg: &str) {
 println!("{}: {}", self.prefix, msg);
 }
}

impl Counter {
 fn count(&self) -> i32 { self.value }
}

fn main() {
 let mut registry = Registry::new();
 
 // ลงทะเบียน plugins
 registry.register("logger", Logger { prefix: "INFO".to_string() });
 registry.register("counter", Counter { value: 42 });
 
 // ดึง plugins ออกมาใช้
 if let Some(logger) = registry.get::<Logger>("logger") {
 logger.log("Hello from plugin!");
 }
 
 if let Some(counter) = registry.get::<Counter>("counter") {
 println!("Count: {}", counter.count());
 }
 
 // type ผิดจะได้ None
 let wrong: Option<&String> = registry.get("logger");
 println!("wrong type: {:?}", wrong); // None
}
```

</RustPlayground>

---

## Quick Reference

### Any Trait
| Method | คำอธิบาย |
|--------|---------|
| `type_id()` | ได้ TypeId |
| `is::<T>()` | ตรวจว่าเป็น T ไหม |
| `downcast_ref::<T>()` | `Option<&T>` |
| `downcast_mut::<T>()` | `Option<&mut T>` |

### `Box<dyn Any>`
| Method | คำอธิบาย |
|--------|---------|
| `downcast::<T>()` | `Result<Box<T>, Box<dyn Any>>` |

### Functions
| Function | คำอธิบาย |
|----------|---------|
| `TypeId::of::<T>()` | ได้ TypeId ของ T |
| `type_name::<T>()` | ได้ชื่อ type เป็น &str |

### ข้อจำกัด
| ข้อจำกัด | เหตุผล |
|---------|--------|
| ต้องเป็น `'static` | Any ต้องรู้ type ตลอด lifetime |
| Performance | downcast ช้ากว่า static dispatch |
| Type safety | เสีย compile-time checks |

### เมื่อไหร่ใช้ Any
| ใช้ | ไม่ใช้ |
|-----|------|
| Plugin systems | ปกติทั่วไป |
| Heterogeneous collections | รู้ types ล่วงหน้า |
| Dynamic configuration | Performance critical |

---

[← Marker](./marker) | [FFI →](./ffi)
