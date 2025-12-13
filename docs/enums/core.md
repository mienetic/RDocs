# Core Enums - Option & Result

`Option` และ `Result` - สอง enums ที่สำคัญที่สุดใน Rust! 

---

## Option - ค่าที่อาจมีหรือไม่มี

<RustPlayground>

```rust
fn main() {
 // Option มี 2 variants
 let some_value: Option<i32> = Some(42);
 let no_value: Option<i32> = None;
 
 println!("some: {:?}", some_value);
 println!("none: {:?}", no_value);
 
 // Pattern matching
 match some_value {
 Some(n) => println!("มีค่า: {}", n),
 None => println!("ไม่มีค่า"),
 }
 
 // if let
 if let Some(n) = some_value {
 println!("if let: {}", n);
 }
 
 // Methods
 println!("unwrap_or: {}", no_value.unwrap_or(0));
 println!("is_some: {}", some_value.is_some());
 println!("is_none: {}", no_value.is_none());
}
```

</RustPlayground>

---

## Option Methods

<RustPlayground>

```rust
fn main() {
 let x = Some(5);
 let y: Option<i32> = None;
 
 // map - แปลงค่าถ้ามี
 let doubled = x.map(|n| n * 2);
 println!("map: {:?}", doubled);
 
 // and_then - chain Option
 let result = x.and_then(|n| Some(n + 10));
 println!("and_then: {:?}", result);
 
 // or - ใช้ค่าสำรอง
 let backup = y.or(Some(100));
 println!("or: {:?}", backup);
 
 // filter
 let filtered = x.filter(|n| *n > 3);
 println!("filter: {:?}", filtered);
 
 // take - เอาค่าออก
 let mut opt = Some("hello");
 let taken = opt.take();
 println!("taken: {:?}, remaining: {:?}", taken, opt);
}
```

</RustPlayground>

::: tip รู้หรือไม่? `Option::take()`
วิธีเอาค่าออกจาก `Option` ที่อยู่ในตัวแปร mutable reference (`&mut Option<T>`) โดยไม่ต้อง clone!
มันจะเปลี่ยนค่าเดิมเป็น `None` แล้วคืนค่า `Some(T)` ออกมาให้เรา
:::

---

## Result - ผลลัพธ์ที่อาจสำเร็จหรือล้มเหลว

<RustPlayground>

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
 if b == 0 {
 Err("ห้ามหารด้วยศูนย์!".to_string())
 } else {
 Ok(a / b)
 }
}

fn main() {
 // Result มี 2 variants
 let success: Result<i32, &str> = Ok(42);
 let failure: Result<i32, &str> = Err("failed");
 
 println!("success: {:?}", success);
 println!("failure: {:?}", failure);
 
 // Pattern matching
 match divide(10, 2) {
 Ok(result) => println!("10 / 2 = {}", result),
 Err(e) => println!("Error: {}", e),
 }
 
 // ? operator ต้องใช้ในฟังก์ชันที่ return Result
 println!("divide(10, 0): {:?}", divide(10, 0));
}
```

</RustPlayground>

---

## Result Methods

<RustPlayground>

```rust
fn main() {
 let ok: Result<i32, &str> = Ok(10);
 let err: Result<i32, &str> = Err("error");
 
 // is_ok / is_err
 println!("ok.is_ok(): {}", ok.is_ok());
 println!("err.is_err(): {}", err.is_err());
 
 // unwrap_or
 println!("err.unwrap_or(0): {}", err.unwrap_or(0));
 
 // map / map_err
 let doubled = ok.map(|n| n * 2);
 println!("map: {:?}", doubled);
 
 let mapped_err = err.map_err(|e| format!("Error: {}", e));
 println!("map_err: {:?}", mapped_err);
 
 // ok() / err() - แปลงเป็น Option
 println!("ok.ok(): {:?}", ok.ok());
 println!("err.err(): {:?}", err.err());
 
 // and_then
 let chained = ok.and_then(|n| Ok(n + 5));
 println!("and_then: {:?}", chained);
}
```

</RustPlayground>

---

## Quick Reference

### Option
| Variant | คำอธิบาย |
|---------|---------|
| `Some(T)` | มีค่า |
| `None` | ไม่มีค่า |

### Option Methods
| Method | คำอธิบาย |
|--------|---------|
| `is_some()` | มีค่าไหม |
| `is_none()` | ว่างไหม |
| `unwrap()` | ดึงค่า (panic ถ้า None) |
| `unwrap_or(v)` | ดึงค่าหรือใช้ default |
| `map(f)` | แปลงค่า |
| `and_then(f)` | chain |
| `or(opt)` | ใช้ค่าสำรอง |

### Result
| Variant | คำอธิบาย |
|---------|---------|
| `Ok(T)` | สำเร็จ |
| `Err(E)` | ล้มเหลว |

### Result Methods
| Method | คำอธิบาย |
|--------|---------|
| `is_ok()` | สำเร็จไหม |
| `is_err()` | ล้มเหลวไหม |
| `unwrap()` | ดึงค่า (panic ถ้า Err) |
| `map(f)` | แปลง Ok |
| `map_err(f)` | แปลง Err |
| `ok()` | แปลงเป็น Option |
| `?` | propagate error |

---

[← Index](./index) | [Cmp →](./cmp)
