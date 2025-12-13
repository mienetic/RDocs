# Data Macros - สร้างข้อมูล

`vec!` และ `matches!` สำหรับสร้างและตรวจสอบข้อมูล! 

---

## vec! - สร้าง Vector

<RustPlayground>

```rust
fn main() {
 // สร้างจากค่า
 let nums = vec![1, 2, 3, 4, 5];
 println!("nums = {:?}", nums);
 
 // สร้างจากค่าซ้ำ
 let zeros = vec![0; 10]; // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
 println!("zeros = {:?}", zeros);
 
 // Empty vector
 let empty: Vec<i32> = vec![];
 println!("empty = {:?}", empty);
 
 // Mixed types (ต้องเป็น type เดียวกัน)
 let strs = vec!["hello", "world", "rust"];
 println!("strs = {:?}", strs);
}
```

</RustPlayground>

---

## vec! vs Vec::new()

<RustPlayground>

```rust
fn main() {
 // vec! สะดวกสำหรับค่าเริ่มต้น
 let v1 = vec![1, 2, 3];
 
 // Vec::new() สำหรับ empty แล้ว push ทีหลัง
 let mut v2 = Vec::new();
 v2.push(1);
 v2.push(2);
 v2.push(3);
 
 // ผลลัพธ์เหมือนกัน
 assert_eq!(v1, v2);
 
 // Vec::with_capacity() สำหรับ pre-allocate
 let mut v3 = Vec::with_capacity(100);
 for i in 0..100 {
 v3.push(i); // ไม่ต้อง reallocate
 }
 println!("v3.len() = {}", v3.len());
}
```

</RustPlayground>

---

## matches! - ตรวจสอบ pattern

<RustPlayground>

```rust
fn main() {
 let x = Some(5);
 
 // matches! return bool
 let is_some = matches!(x, Some(_));
 println!("is Some? {}", is_some);
 
 let is_some_5 = matches!(x, Some(5));
 println!("is Some(5)? {}", is_some_5);
 
 let is_none = matches!(x, None);
 println!("is None? {}", is_none);
}
```

</RustPlayground>

---

## matches! กับ Enums

<RustPlayground>

```rust
#[derive(Debug)]
enum Status {
 Active,
 Inactive,
 Pending(u32),
}

fn main() {
 let status = Status::Pending(5);
 
 // ตรวจสอบ variant
 if matches!(status, Status::Active) {
 println!("Active!");
 }
 
 if matches!(status, Status::Pending(_)) {
 println!("Pending with some value");
 }
 
 // ตรวจสอบค่าด้วย
 if matches!(status, Status::Pending(n) if n > 3) {
 println!("Pending with value > 3");
 }
 
 // ใช้ใน filter
 let statuses = vec![
 Status::Active,
 Status::Inactive,
 Status::Pending(1),
 Status::Pending(5),
 ];
 
 let pending_count = statuses
 .iter()
 .filter(|s| matches!(s, Status::Pending(_)))
 .count();
 println!("pending count: {}", pending_count);
}
```

</RustPlayground>

---

## matches! vs if let

<RustPlayground>

```rust
fn main() {
 let value = Some(42);
 
 // if let - เมื่อต้องการใช้ค่า
 if let Some(n) = value {
 println!("got value: {}", n);
 }
 
 // matches! - เมื่อต้องการแค่ bool
 let has_value = matches!(value, Some(_));
 println!("has value: {}", has_value);
 
 // matches! สะดวกใน expressions
 let numbers = vec![Some(1), None, Some(3), None, Some(5)];
 let some_count = numbers.iter().filter(|x| matches!(x, Some(_))).count();
 println!("some count: {}", some_count);
}
```

</RustPlayground>

---

## matches! กับ Ranges

<RustPlayground>

```rust
fn main() {
 let c = 'g';
 
 // ตรวจสอบ character range
 let is_lowercase = matches!(c, 'a'..='z');
 let is_uppercase = matches!(c, 'A'..='Z');
 let is_digit = matches!(c, '0'..='9');
 let is_hex = matches!(c, '0'..='9' | 'a'..='f' | 'A'..='F');
 
 println!("'{}' is lowercase: {}", c, is_lowercase);
 println!("'{}' is uppercase: {}", c, is_uppercase);
 println!("'{}' is digit: {}", c, is_digit);
 println!("'{}' is hex: {}", c, is_hex);
 
 // ตรวจสอบ number range
 let n = 42;
 let is_small = matches!(n, 0..=10);
 let is_medium = matches!(n, 11..=50);
 let is_large = matches!(n, 51..=100);
 
 println!("{} is small: {}", n, is_small);
 println!("{} is medium: {}", n, is_medium);
 println!("{} is large: {}", n, is_large);
}
```

</RustPlayground>

---

## Quick Reference

### vec!
| Syntax | ผลลัพธ์ |
|--------|--------|
| `vec![1, 2, 3]` | Vec ของค่า |
| `vec![0; 10]` | Vec ของค่าซ้ำ |
| `vec![]` | Empty Vec |

### matches!
| Syntax | ตรวจสอบ |
|--------|--------|
| `matches!(x, Some(_))` | เป็น Some ไหม |
| `matches!(x, 1..=10)` | อยู่ใน range ไหม |
| `matches!(x, A \| B)` | เป็น A หรือ B |
| `matches!(x, P if cond)` | Pattern + guard |

---

[← Panic](./panic) | [Compile-time →](./compile-time)
