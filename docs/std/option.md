# Option - ค่าที่อาจมีหรือไม่มี

**Option** ใช้แทน null/nil ในภาษาอื่น ปลอดภัยกว่าเพราะต้องจัดการกรณีว่างเสมอ! 

---

## Option คืออะไร?

`Option<T>` มี 2 แบบ:
- `Some(value)` - มีค่า
- `None` - ไม่มีค่า

```rust
enum Option<T> {
 Some(T), // มีค่า
 None, // ไม่มีค่า
}
```

:::tip ทำไมใช้ Option?
Rust ไม่มี null ใช้ Option แทน ซึ่งบังคับให้จัดการกรณีว่างทุกครั้ง ป้องกัน null pointer exception!
:::

---

## 1. สร้าง Option

<RustPlayground>

```rust
fn main() {
 // Some - มีค่า
 let some_number = Some(42);
 let some_text = Some("hello");
 
 // None - ไม่มีค่า (ต้องระบุ type)
 let none_number: Option<i32> = None;
 
 println!("some_number: {:?}", some_number);
 println!("some_text: {:?}", some_text);
 println!("none_number: {:?}", none_number);
 
 // ได้จากฟังก์ชันที่อาจไม่มีค่า
 let vec = vec![1, 2, 3];
 let first = vec.first(); // Option<&i32>
 let tenth = vec.get(10); // Option<&i32>
 
 println!("first: {:?}", first); // Some(&1)
 println!("tenth: {:?}", tenth); // None
}
```

</RustPlayground>

---

## 2. ตรวจสอบและเข้าถึง

<RustPlayground>

```rust
fn main() {
 let x = Some(42);
 let y: Option<i32> = None;
 
 // is_some() / is_none()
 println!("x มีค่าไหม: {}", x.is_some()); // true
 println!("y ว่างไหม: {}", y.is_none()); // true
 
 // unwrap - ดึงค่า (panic ถ้า None!)
 let value = x.unwrap();
 println!("unwrap x: {}", value);
 // y.unwrap(); // จะ panic!
 
 // expect - เหมือน unwrap แต่กำหนดข้อความ error
 let value2 = x.expect("ควรมีค่า!");
 println!("expect x: {}", value2);
 
 // unwrap_or - ใช้ค่า default ถ้า None
 let a = y.unwrap_or(0);
 println!("y unwrap_or(0): {}", a); // 0
 
 // unwrap_or_else - คำนวณค่า default (lazy)
 let b = y.unwrap_or_else(|| {
 println!("กำลังคำนวณค่า default...");
 100
 });
 println!("y unwrap_or_else: {}", b); // 100
 
 // unwrap_or_default - ใช้ค่า default ของ type
 let c: Option<String> = None;
 let d = c.unwrap_or_default(); // ""
 println!("default string: '{}'", d);
}
```

</RustPlayground>

---

## 3. Pattern Matching

<RustPlayground>

```rust
fn main() {
 let number = Some(42);
 
 // match - จัดการทุกกรณี
 match number {
 Some(n) => println!("มีค่า: {}", n),
 None => println!("ไม่มีค่า"),
 }
 
 // if let - สนใจแค่กรณีเดียว
 if let Some(n) = number {
 println!("พบค่า: {}", n);
 }
 
 // if let else
 let empty: Option<i32> = None;
 if let Some(n) = empty {
 println!("พบ: {}", n);
 } else {
 println!("ไม่พบค่า");
 }
 
 // while let - วนจนกว่าจะ None
 let mut stack = vec![1, 2, 3];
 println!("=== while let ===");
 while let Some(top) = stack.pop() {
 println!("pop: {}", top);
 }
}
```

</RustPlayground>

---

## 4. แปลงค่า (map, and_then)

<RustPlayground>

```rust
fn main() {
 let number = Some(5);
 
 // map - แปลงค่าถ้า Some
 let doubled = number.map(|n| n * 2);
 println!("doubled: {:?}", doubled); // Some(10)
 
 // map บน None ได้ None
 let none: Option<i32> = None;
 let doubled_none = none.map(|n| n * 2);
 println!("doubled none: {:?}", doubled_none); // None
 
 // and_then (flatMap) - สำหรับฟังก์ชันที่ return Option
 fn half_if_even(n: i32) -> Option<i32> {
 if n % 2 == 0 { Some(n / 2) } else { None }
 }
 
 let ten = Some(10);
 let result = ten.and_then(half_if_even);
 println!("half of 10: {:?}", result); // Some(5)
 
 let five = Some(5);
 let result2 = five.and_then(half_if_even);
 println!("half of 5: {:?}", result2); // None (5 ไม่ใช่เลขคู่)
 
 // filter - เก็บค่าถ้าผ่านเงื่อนไข
 let even = number.filter(|n| n % 2 == 0);
 println!("5 is even? {:?}", even); // None
}
```

</RustPlayground>

---

## 5. รวม Option

<RustPlayground>

```rust
fn main() {
 let a = Some(5);
 let b = Some(10);
 let c: Option<i32> = None;
 
 // and - ได้ค่าที่ 2 ถ้าทั้งคู่เป็น Some
 println!("a.and(b): {:?}", a.and(b)); // Some(10)
 println!("a.and(c): {:?}", a.and(c)); // None
 
 // or - ได้ค่าแรกที่เป็น Some
 println!("a.or(b): {:?}", a.or(b)); // Some(5)
 println!("c.or(a): {:?}", c.or(a)); // Some(5)
 println!("c.or(c): {:?}", c.or(c)); // None
 
 // xor - ได้ค่าถ้ามีแค่ตัวเดียวที่เป็น Some
 println!("a.xor(b): {:?}", a.xor(b)); // None (ทั้งคู่มีค่า)
 println!("a.xor(c): {:?}", a.xor(c)); // Some(5)
 
 // zip - รวม 2 Option เป็น tuple
 let zipped = a.zip(b);
 println!("zip: {:?}", zipped); // Some((5, 10))
}
```

</RustPlayground>

---

## 6. ใช้กับ ? Operator

<RustPlayground>

```rust
// ฟังก์ชันที่ return Option สามารถใช้ ? ได้
fn get_first_char(s: &str) -> Option<char> {
 let trimmed = s.trim(); // ตัดช่องว่าง
 if trimmed.is_empty() {
 return None;
 }
 trimmed.chars().next() // ตัวอักษรแรก
}

fn get_first_letter_uppercase(s: &str) -> Option<char> {
 let c = get_first_char(s)?; // ถ้า None จะ return None ทันที
 
 if c.is_alphabetic() {
 Some(c.to_uppercase().next()?)
 } else {
 None
 }
}

fn main() {
 println!("'hello': {:?}", get_first_letter_uppercase("hello")); // Some('H')
 println!("'123': {:?}", get_first_letter_uppercase("123")); // None
 println!("'': {:?}", get_first_letter_uppercase("")); // None
 println!("' ': {:?}", get_first_letter_uppercase(" ")); // None
}
```

</RustPlayground>

---

## 7. แปลงเป็น/จาก Result

<RustPlayground>

```rust
fn main() {
 let some = Some(42);
 let none: Option<i32> = None;
 
 // Option -> Result
 let ok = some.ok_or("ไม่มีค่า");
 println!("some.ok_or: {:?}", ok); // Ok(42)
 
 let err = none.ok_or("ไม่มีค่า");
 println!("none.ok_or: {:?}", err); // Err("ไม่มีค่า")
 
 // Result -> Option (ทิ้ง error)
 let result: Result<i32, &str> = Ok(100);
 let option = result.ok();
 println!("Ok(100).ok(): {:?}", option); // Some(100)
 
 let result2: Result<i32, &str> = Err("error");
 let option2 = result2.ok();
 println!("Err.ok(): {:?}", option2); // None
}
```

</RustPlayground>

---

## 8. Ownership และ Reference

<RustPlayground>

```rust
fn main() {
 let text = Some(String::from("hello"));
 
 // as_ref - ยืมค่าโดยไม่ย้าย ownership
 if let Some(s) = text.as_ref() {
 println!("ยืมดู: {}", s);
 }
 println!("text ยังใช้ได้: {:?}", text);
 
 // as_mut - ยืมแบบแก้ไขได้
 let mut num = Some(10);
 if let Some(n) = num.as_mut() {
 *n += 5;
 }
 println!("แก้ไขแล้ว: {:?}", num); // Some(15)
 
 // take - ดึงค่าออก ทิ้ง None ไว้
 let mut opt = Some(42);
 let taken = opt.take();
 println!("taken: {:?}, opt: {:?}", taken, opt); // Some(42), None
 
 // replace - ใส่ค่าใหม่ ได้ค่าเก่า
 let mut opt2 = Some(1);
 let old = opt2.replace(2);
 println!("old: {:?}, opt2: {:?}", old, opt2); // Some(1), Some(2)
}
```

</RustPlayground>

---

## Quick Reference

### ตรวจสอบ
| Method | คำอธิบาย |
|--------|---------|
| `is_some()` | มีค่าไหม? |
| `is_none()` | ว่างไหม? |

### ดึงค่า
| Method | คำอธิบาย |
|--------|---------|
| `unwrap()` | ดึงค่า (panic ถ้า None) |
| `expect(msg)` | เหมือน unwrap + ข้อความ |
| `unwrap_or(default)` | ใช้ default ถ้า None |
| `unwrap_or_else(f)` | คำนวณ default |
| `unwrap_or_default()` | ใช้ Default trait |

### แปลง
| Method | คำอธิบาย |
|--------|---------|
| `map(f)` | แปลงค่า |
| `and_then(f)` | แปลงเป็น Option อื่น |
| `filter(f)` | กรองตามเงื่อนไข |
| `ok_or(e)` | แปลงเป็น Result |

### รวม
| Method | คำอธิบาย |
|--------|---------|
| `and(opt)` | ได้ที่ 2 ถ้าทั้งคู่ Some |
| `or(opt)` | ได้ตัวแรกที่ Some |
| `zip(opt)` | รวมเป็น tuple |

---

[← String](./string) | [Result →](./result)
