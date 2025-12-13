# Any Functions (std::any)

Functions สำหรับ Runtime Type Information! 

---

## type_name

ดึงชื่อ Type เป็น String

<RustPlayground>

```rust
use std::any;

fn main() {
 println!("i32: {}", any::type_name::<i32>());
 println!("String: {}", any::type_name::<String>());
 println!("Vec<u8>: {}", any::type_name::<Vec<u8>>());
 println!("Option<i32>: {}", any::type_name::<Option<i32>>());
 
 // Custom struct
 struct MyStruct { x: i32, y: i32 }
 println!("MyStruct: {}", any::type_name::<MyStruct>());
}
```

</RustPlayground>

---

## type_name_of_val

ดึงชื่อ Type จากค่า

<RustPlayground>

```rust
use std::any;

fn main() {
 let x = 42;
 let s = String::from("hello");
 let v = vec![1, 2, 3];
 
 println!("x: {}", any::type_name_of_val(&x));
 println!("s: {}", any::type_name_of_val(&s));
 println!("v: {}", any::type_name_of_val(&v));
 
 // ใช้กับ closures
 let closure = |n: i32| n * 2;
 println!("closure: {}", any::type_name_of_val(&closure));
}
```

</RustPlayground>

---

## TypeId

ดึง Unique ID ของ Type

<RustPlayground>

```rust
use std::any::TypeId;

fn main() {
 let id_i32 = TypeId::of::<i32>();
 let id_u32 = TypeId::of::<u32>();
 let id_i32_2 = TypeId::of::<i32>();
 
 println!("i32 == u32? {}", id_i32 == id_u32); // false
 println!("i32 == i32? {}", id_i32 == id_i32_2); // true
 
 // ใช้ใน generic function
 fn check_type<T: 'static>() {
 if TypeId::of::<T>() == TypeId::of::<String>() {
 println!("It's a String!");
 } else {
 println!("Not a String");
 }
 }
 
 check_type::<String>();
 check_type::<i32>();
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `type_name::<T>()` | ชื่อ type | `&'static str` |
| `type_name_of_val(&v)` | ชื่อจากค่า | `&'static str` |
| `TypeId::of::<T>()` | Unique ID | `TypeId` |

---

[← Panic](./panic) | [Hint →](./hint)
