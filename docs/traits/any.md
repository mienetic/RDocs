# Any Trait & Reflection

`Any` trait สำหรับเช็ค types ตอน Runtime (Reflection)! 

---

## Any and TypeId

ใช้ `Any` เพื่อจำลอง Dynamic typing หรือ Downcasting

<RustPlayground>

```rust
use std::any::{Any, TypeId};
use std::fmt::Debug;

fn print_if_string(s: &dyn Any) {
 if let Some(string) = s.downcast_ref::<String>() {
 println!("It's a string: '{}'", string);
 } else {
 println!("Not a string");
 }
}

fn log_type<T: Any + Debug>(value: &T) {
 let type_id = TypeId::of::<T>();
 println!("Value: {:?}, TypeId: {:?}", value, type_id);
}

fn main() {
 let my_string = String::from("Hello World");
 let my_int = 42;
 
 print_if_string(&my_string);
 print_if_string(&my_int);
 
 log_type(&my_string);
 log_type(&my_int);
}
```

</RustPlayground>

---

## Type Name

`std::any::type_name` สำหรับดูชื่อ type (เพื่อ debug)

<RustPlayground>

```rust
use std::any::type_name;

fn print_type_of<T>(_: &T) {
 println!("Type is: {}", type_name::<T>());
}

fn main() {
 let s = "Hello";
 let i = 42;
 let v = vec![1, 2, 3];
 
 print_type_of(&s);
 print_type_of(&i);
 print_type_of(&v);
}
```

</RustPlayground>

---

## Quick Reference

### Any Trait
| Item | คำอธิบาย |
|------|---------|
| `Any` | Trait สำหรับ type ที่มี static lifetime (เพื่อใช้ reflection) |
| `TypeId` | Unique ID สำหรับ type |
| `downcast_ref` | แปลง `&dyn Any` กลับเป็น `&T` |
| `downcast_mut` | แปลง `&mut dyn Any` กลับเป็น `&mut T` |
| `type_name` | ชื่อของ Type (string) |

---

[← Error](./error) | [Advanced Iterators →](./iterator-ext)
