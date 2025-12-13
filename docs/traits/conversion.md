# Conversion Traits

`From`, `Into`, `TryFrom`, `TryInto`, `AsRef`, `Deref` สำหรับแปลง types! 

---

## From / Into

<RustPlayground>

```rust
fn main() {
 // From กำหนดการแปลง
 let s: String = String::from("hello");
 let n: i64 = i64::from(42i32);
 
 println!("String: {}", s);
 println!("i64: {}", n);
 
 // Into ได้มาฟรีเมื่อ implement From
 let s2: String = "world".into();
 let n2: i64 = 100i32.into();
 
 println!("String (into): {}", s2);
 println!("i64 (into): {}", n2);
}
```

</RustPlayground>

::: best-practice
**Implement `From` แล้วได้ `Into` ฟรี!**
แนะนำให้ implement `From` trait เสมอ เพราะ Rust จะแถม `Into` ให้เราใช้อัตโนมัติ (Reverse blanket implementation) ไม่ต้องเสียเวลาเขียนเอง
:::

---

## Custom From Implementation

<RustPlayground>

```rust
#[derive(Debug)]
struct Point {
 x: i32,
 y: i32,
}

// From tuple
impl From<(i32, i32)> for Point {
 fn from(tuple: (i32, i32)) -> Self {
 Point { x: tuple.0, y: tuple.1 }
 }
}

// From array
impl From<[i32; 2]> for Point {
 fn from(arr: [i32; 2]) -> Self {
 Point { x: arr[0], y: arr[1] }
 }
}

fn main() {
 let p1: Point = (10, 20).into();
 let p2: Point = [30, 40].into();
 let p3 = Point::from((50, 60));
 
 println!("p1: {:?}", p1);
 println!("p2: {:?}", p2);
 println!("p3: {:?}", p3);
}
```

</RustPlayground>

---

## TryFrom / TryInto

<RustPlayground>

```rust
use std::convert::TryFrom;

fn main() {
 // TryFrom สำหรับ conversion ที่อาจ fail
 let big: i64 = 1000;
 let small: Result<i32, _> = i32::try_from(big);
 println!("1000 to i32: {:?}", small); // Ok(1000)
 
 let bigger: i64 = 10_000_000_000;
 let small2: Result<i32, _> = i32::try_from(bigger);
 println!("10 billion to i32: {:?}", small2); // Err
 
 // TryInto
 let result: Result<u8, _> = 255i32.try_into();
 println!("255 to u8: {:?}", result); // Ok(255)
 
 let result2: Result<u8, _> = 256i32.try_into();
 println!("256 to u8: {:?}", result2); // Err
}
```

</RustPlayground>

---

## FromStr

`FromStr` สำหรับการแปลง String เป็น Type อื่น (มักใช้กับ `.parse()`)

<RustPlayground>

```rust
use std::str::FromStr;
use std::num::ParseIntError;

#[derive(Debug)]
struct Point {
 x: i32,
 y: i32,
}

impl FromStr for Point {
 type Err = ParseIntError;

 fn from_str(s: &str) -> Result<Self, Self::Err> {
 // คาดหวัง format "x,y"
 let parts: Vec<&str> = s.split(',').collect();
 let x = parts[0].trim().parse()?;
 let y = parts[1].trim().parse()?;
 
 Ok(Point { x, y })
 }
}

fn main() {
 let p: Point = "10, 20".parse().unwrap();
 println!("Parsed: {:?}", p);
 
 let p2 = Point::from_str("30,40").unwrap();
 println!("FromStr: {:?}", p2);
}
```

</RustPlayground>

---

## AsRef / AsMut

<RustPlayground>

```rust
fn print_bytes<T: AsRef<[u8]>>(data: T) {
 let bytes = data.as_ref();
 println!("Bytes: {:?}", bytes);
}

fn main() {
 // AsRef ให้ยืมเป็น reference
 let s = String::from("hello");
 print_bytes(s.as_bytes()); // String -> &[u8]
 
 // AsMut ให้ยืมเป็น mutable reference
 fn zero_out<T: AsMut<[u8]>>(mut data: T) {
 let bytes = data.as_mut();
 for b in bytes {
 *b = 0;
 }
 }
 
 let mut v = vec![1, 2, 3];
 zero_out(&mut v);
 println!("Zeroed: {:?}", v);
}
```

</RustPlayground>

---

## Deref / DerefMut

<RustPlayground>

```rust
use std::ops::{Deref, DerefMut};

struct MyBox<T>(T);

impl<T> MyBox<T> {
 fn new(x: T) -> MyBox<T> { MyBox(x) }
}

impl<T> Deref for MyBox<T> {
 type Target = T;
 fn deref(&self) -> &T { &self.0 }
}

impl<T> DerefMut for MyBox<T> {
 fn deref_mut(&mut self) -> &mut T { &mut self.0 }
}

fn main() {
 let mut y = MyBox::new(5);
 
 // Deref: *y (อ่าน)
 println!("Value: {}", *y);
 
 // DerefMut: *y = ... (เขียน)
 *y = 10;
 println!("New Value: {}", *y);
 
 // Deref Coercion (Mut)
 let mut s = MyBox::new(String::from("hello"));
 s.push_str(" world"); // ทำงานได้เพราะ DerefMut -> &mut String
 println!("{}", *s);
}
```

</RustPlayground>

::: pitfall
**อย่าใช้ `Deref` เพื่อทำ Inheritance**
มือใหม่มักใช้ `Deref` เพื่อให้ struct ลูกเรียก method ของ struct แม่ได้เหมือน OOP (Polymorphism)
**ผิดวัตถุประสงค์!** `Deref` มีไว้สำหรับ Smart Pointers เท่านั้น
:::

---

## Quick Reference

### Conversion Traits
| Trait | คำอธิบาย | ตัวอย่าง |
|-------|---------|---------|
| `From<T>` | แปลงจาก T | `String::from("hi")` |
| `Into<T>` | แปลงเป็น T | `"hi".into()` |
| `TryFrom<T>` | แปลงที่อาจ fail | `i8::try_from(256)` |
| `TryInto<T>` | แปลงเป็น T ที่อาจ fail | `256.try_into()` |
| `FromStr` | String → T | `"10".parse()` |
| `AsRef<T>` | ยืมเป็น &T | `s.as_ref()` |
| `AsMut<T>` | ยืมเป็น &mut T | `s.as_mut()` |
| `Deref` | dereference `*x` | smart pointers |
| `DerefMut` | deref mutable | mutable access |

---

[← Comparison](./comparison) | [Iterator →](./iterator)
