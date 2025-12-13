# Result - สำเร็จหรือผิดพลาด

**Result** ใช้จัดการผลลัพธ์ที่อาจสำเร็จหรือล้มเหลว เป็นหัวใจของ error handling ใน Rust! 

---

## Result คืออะไร?

`Result<T, E>` มี 2 แบบ:
- `Ok(value)` - สำเร็จ พร้อมค่าผลลัพธ์
- `Err(error)` - ล้มเหลว พร้อมข้อมูล error

```rust
enum Result<T, E> {
 Ok(T), // สำเร็จ
 Err(E), // ล้มเหลว
}
```

:::tip เมื่อไหร่ใช้ Result?
- อ่านเขียนไฟล์
- เชื่อมต่อเครือข่าย
- แปลงข้อมูล (parse)
- ทุกอย่างที่อาจล้มเหลว!
:::

---

## 1. สร้าง Result

<RustPlayground>

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
 if b == 0 {
 Err("หารด้วยศูนย์ไม่ได้!".to_string())
 } else {
 Ok(a / b)
 }
}

fn main() {
 // ฟังก์ชันที่ return Result
 let result1 = divide(10, 2);
 let result2 = divide(10, 0);
 
 println!("10/2: {:?}", result1); // Ok(5)
 println!("10/0: {:?}", result2); // Err("หารด้วยศูนย์ไม่ได้!")
 
 // สร้างโดยตรง
 let ok: Result<i32, &str> = Ok(42);
 let err: Result<i32, &str> = Err("something went wrong");
 
 println!("ok: {:?}", ok);
 println!("err: {:?}", err);
}
```

</RustPlayground>

---

## 2. ตรวจสอบและเข้าถึง

<RustPlayground>

```rust
fn main() {
 let ok: Result<i32, &str> = Ok(42);
 let err: Result<i32, &str> = Err("error");
 
 // is_ok() / is_err()
 println!("ok สำเร็จไหม: {}", ok.is_ok()); // true
 println!("err ล้มเหลวไหม: {}", err.is_err()); // true
 
 // unwrap - ดึงค่า (panic ถ้า Err!)
 let value = ok.unwrap();
 println!("unwrap ok: {}", value);
 // err.unwrap(); // จะ panic!
 
 // expect - เหมือน unwrap + ข้อความ
 let value2 = ok.expect("ควรสำเร็จ!");
 println!("expect ok: {}", value2);
 
 // unwrap_or - ใช้ค่า default ถ้า Err
 let a = err.unwrap_or(0);
 println!("err unwrap_or(0): {}", a); // 0
 
 // unwrap_or_else - คำนวณ default
 let b = err.unwrap_or_else(|e| {
 println!("error: {}", e);
 -1
 });
 println!("unwrap_or_else: {}", b); // -1
 
 // unwrap_err - ดึง error (panic ถ้า Ok)
 let error = err.unwrap_err();
 println!("unwrap_err: {}", error);
}
```

</RustPlayground>

---

## 3. Pattern Matching

<RustPlayground>

```rust
fn fetch_data(id: u32) -> Result<String, String> {
 if id > 0 {
 Ok(format!("Data for id {}", id))
 } else {
 Err("Invalid id".to_string())
 }
}

fn main() {
 let result = fetch_data(1);
 
 // match - จัดการทุกกรณี
 match result {
 Ok(data) => println!("สำเร็จ: {}", data),
 Err(e) => println!("ล้มเหลว: {}", e),
 }
 
 // if let - สนใจแค่กรณีสำเร็จ
 if let Ok(data) = fetch_data(2) {
 println!("ได้ข้อมูล: {}", data);
 }
 
 // if let else
 if let Ok(data) = fetch_data(0) {
 println!("ได้: {}", data);
 } else {
 println!("ไม่ได้ข้อมูล");
 }
 
 // match กับ error types
 let result2: Result<i32, &str> = Err("timeout");
 match result2 {
 Ok(n) => println!("ค่า: {}", n),
 Err("timeout") => println!("หมดเวลา! ลองใหม่..."),
 Err(e) => println!("error อื่น: {}", e),
 }
}
```

</RustPlayground>

---

## 4. ? Operator (ที่ใช้บ่อยสุด!)

<RustPlayground>

```rust
use std::num::ParseIntError;

// ? ช่วย propagate error อัตโนมัติ
fn parse_and_double(s: &str) -> Result<i32, ParseIntError> {
 let n = s.parse::<i32>()?; // ถ้า Err จะ return ทันที
 Ok(n * 2)
}

fn parse_multiply(a: &str, b: &str) -> Result<i32, ParseIntError> {
 let x = a.parse::<i32>()?;
 let y = b.parse::<i32>()?;
 Ok(x * y)
}

fn main() {
 // สำเร็จ
 println!("'21' * 2 = {:?}", parse_and_double("21"));
 
 // ล้มเหลว
 println!("'abc' * 2 = {:?}", parse_and_double("abc"));
 
 // หลาย operations
 println!("'3' * '4' = {:?}", parse_multiply("3", "4"));
 println!("'3' * 'x' = {:?}", parse_multiply("3", "x"));
}
```

</RustPlayground>

:::tip ? Operator
- `?` ทำงานเหมือน match แต่สั้นกว่า
- ถ้า Ok จะดึงค่าออกมา
- ถ้า Err จะ return Err ทันที
- ใช้ได้ในฟังก์ชันที่ return Result เท่านั้น!
:::

---

## 5. แปลงค่า (map, and_then)

<RustPlayground>

```rust
fn main() {
 let ok: Result<i32, &str> = Ok(5);
 let err: Result<i32, &str> = Err("error");
 
 // map - แปลงค่าถ้า Ok
 let doubled = ok.map(|n| n * 2);
 println!("doubled: {:?}", doubled); // Ok(10)
 
 // map_err - แปลง error
 let new_err = err.map_err(|e| format!("Error: {}", e));
 println!("new_err: {:?}", new_err); // Err("Error: error")
 
 // and_then - สำหรับฟังก์ชันที่ return Result
 fn check_positive(n: i32) -> Result<i32, &'static str> {
 if n > 0 { Ok(n) } else { Err("ต้องมากกว่า 0") }
 }
 
 let result = ok.and_then(check_positive);
 println!("check positive: {:?}", result);
 
 // chain หลาย operations
 let final_result = Ok(10)
 .map(|n| n * 2) // 20
 .and_then(check_positive) // Ok(20)
 .map(|n| n + 1); // Ok(21)
 println!("chained: {:?}", final_result);
}
```

</RustPlayground>

---

## 6. รวม Result

<RustPlayground>

```rust
fn main() {
 let ok1: Result<i32, &str> = Ok(1);
 let ok2: Result<i32, &str> = Ok(2);
 let err: Result<i32, &str> = Err("error");
 
 // and - ได้ที่ 2 ถ้าทั้งคู่ Ok
 println!("ok1.and(ok2): {:?}", ok1.and(ok2)); // Ok(2)
 println!("ok1.and(err): {:?}", ok1.and(err)); // Err
 
 // or - ได้ตัวแรกที่ Ok
 println!("err.or(ok1): {:?}", err.or(ok1)); // Ok(1)
 println!("ok1.or(ok2): {:?}", ok1.or(ok2)); // Ok(1)
 
 // unwrap_or_default
 let result: Result<Vec<i32>, &str> = Err("error");
 let vec = result.unwrap_or_default(); // Vec ว่าง
 println!("default vec: {:?}", vec);
}
```

</RustPlayground>

---

## 7. แปลงเป็น/จาก Option

<RustPlayground>

```rust
fn main() {
 let ok: Result<i32, &str> = Ok(42);
 let err: Result<i32, &str> = Err("error");
 
 // Result -> Option
 let some = ok.ok(); // Some(42)
 let none = err.ok(); // None (ทิ้ง error)
 println!("ok.ok(): {:?}", some);
 println!("err.ok(): {:?}", none);
 
 // err() ได้ error เป็น Option
 let some_err = err.err(); // Some("error")
 println!("err.err(): {:?}", some_err);
 
 // Option -> Result
 let option: Option<i32> = Some(100);
 let result = option.ok_or("ไม่มีค่า");
 println!("Some.ok_or: {:?}", result); // Ok(100)
 
 let none_opt: Option<i32> = None;
 let result2 = none_opt.ok_or("ไม่มีค่า");
 println!("None.ok_or: {:?}", result2); // Err("ไม่มีค่า")
}
```

</RustPlayground>

---

## 8. Collect Result

<RustPlayground>

```rust
fn main() {
 let strings = vec!["1", "2", "3"];
 
 // collect สามารถแปลง Vec<Result> เป็น Result<Vec>!
 let numbers: Result<Vec<i32>, _> = strings
 .iter()
 .map(|s| s.parse::<i32>())
 .collect();
 println!("all valid: {:?}", numbers); // Ok([1, 2, 3])
 
 let mixed = vec!["1", "two", "3"];
 let result: Result<Vec<i32>, _> = mixed
 .iter()
 .map(|s| s.parse::<i32>())
 .collect();
 println!("has error: {:?}", result); // Err (เจอ "two")
 
 // ถ้าต้องการเก็บเฉพาะที่สำเร็จ
 let valid_only: Vec<i32> = mixed
 .iter()
 .filter_map(|s| s.parse().ok())
 .collect();
 println!("valid only: {:?}", valid_only); // [1, 3]
}
```

</RustPlayground>

---

## Quick Reference

### ตรวจสอบ
| Method | คำอธิบาย |
|--------|---------|
| `is_ok()` | สำเร็จไหม? |
| `is_err()` | ล้มเหลวไหม? |

### ดึงค่า
| Method | คำอธิบาย |
|--------|---------|
| `unwrap()` | ดึงค่า (panic ถ้า Err) |
| `expect(msg)` | เหมือน unwrap + ข้อความ |
| `unwrap_or(default)` | ใช้ default ถ้า Err |
| `unwrap_or_else(f)` | คำนวณ default |
| `unwrap_err()` | ดึง error |
| `?` | propagate error อัตโนมัติ |

### แปลง
| Method | คำอธิบาย |
|--------|---------|
| `map(f)` | แปลงค่า Ok |
| `map_err(f)` | แปลง error |
| `and_then(f)` | chain operations |
| `ok()` | แปลงเป็น Option |

### รวม
| Method | คำอธิบาย |
|--------|---------|
| `and(res)` | ได้ที่ 2 ถ้าทั้งคู่ Ok |
| `or(res)` | ได้ตัวแรกที่ Ok |

---

[← Option](./option) | [Iterator →](./iter)
