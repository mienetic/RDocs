# Memory Traits

`Borrow`, `ToOwned` สำหรับจัดการ Memory และ Ownership! 

---

## Borrow Trait

`Borrow` ช่วยให้เราใช้ `Borrow<T>` แทน `&T` ใน generics เพื่อความยืดหยุ่น

<RustPlayground>

```rust
use std::borrow::Borrow;

fn check<K: Borrow<str>>(key: K) {
 println!("Key: {}", key.borrow());
}

fn main() {
 let s = String::from("Hello");
 let str_slice = "World";
 
 // ใช้ได้ทั้ง String และ &str
 check(s); // String impl Borrow<str>
 check(str_slice); // &str impl Borrow<str>
 
 // ประโยชน์ใน Collections
 use std::collections::HashMap;
 let mut map = HashMap::new();
 map.insert(String::from("k1"), 1);
 
 // get รับ Borrow<Q> ดังนั้นส่ง &str แทน &String ได้
 println!("Value: {:?}", map.get("k1"));
}
```

</RustPlayground>



---

## BorrowMut

`BorrowMut` เหมือน `Borrow` แต่สำหรับ Mutable Reference

<RustPlayground>

```rust
use std::borrow::BorrowMut;

fn check_mut<T: BorrowMut<[i32]>>(mut v: T) {
 let data = v.borrow_mut();
 data[0] = 999;
}

fn main() {
 let mut v = vec![1, 2, 3];
 check_mut(&mut v);
 println!("Modified: {:?}", v);
}
```

</RustPlayground>

---

---

## Drop Trait

`Drop` คือ Destructor ของ Rust (ทำงานอัตโนมัติเมื่อ value ออกจาก scope)

<RustPlayground>

```rust
struct CustomSmartPointer {
 data: String,
}

impl Drop for CustomSmartPointer {
 fn drop(&mut self) {
 println!("Dropping CustomSmartPointer with data `{}`!", self.data);
 }
}

fn main() {
 let c = CustomSmartPointer {
 data: String::from("stuff"),
 };
 
 println!("CustomSmartPointer created.");
 // c จะถูก drop โดยอัตโนมัติที่นี่ (จบ scope)
}
```

</RustPlayground>

::: tip Drop Order
ตัวแปรจะถูก Drop ย้อนกลับตามลำดับที่ประกาศ (LIFO - Last In First Out)
:::

---

## ToOwned Trait

`ToOwned` คือ generalization ของ `Clone` (สำหรับการสร้าง Owned data จาก Borrowed data)

<RustPlayground>

```rust
fn main() {
 let s: &str = "hello";
 
 // .to_owned() สร้าง String จาก &str
 let string: String = s.to_owned();
 
 println!("Borrowed: {}", s);
 println!("Owned: {}", string);
 
 // Vec
 let v_slice: &[i32] = &[1, 2, 3];
 let v_owned: Vec<i32> = v_slice.to_owned();
 
 println!("Vec: {:?}", v_owned);
}
```

</RustPlayground>

---

## Cow (Clone on Write)

`Cow` เป็น enum ที่เก็บได้ทั้ง Owned และ Borrowed data

<RustPlayground>

```rust
use std::borrow::Cow;

fn remove_spaces(input: &str) -> Cow<str> {
 if input.contains(' ') {
 // มีช่องว่าง ต้องสร้าง String ใหม่ (Clone)
 Cow::Owned(input.replace(' ', ""))
 } else {
 // ไม่มีช่องว่าง Return reference เดิม (No allocation)
 Cow::Borrowed(input)
 }
}

fn main() {
 let s1 = "hello_world";
 let result1 = remove_spaces(s1);
 
 match result1 {
 Cow::Borrowed(b) => println!("Borrowed: {}", b),
 Cow::Owned(o) => println!("Owned: {}", o),
 }
 
 let s2 = "hello world";
 let result2 = remove_spaces(s2);
 
 match result2 {
 Cow::Borrowed(b) => println!("Borrowed: {}", b),
 Cow::Owned(o) => println!("Owned: {}", o),
 }
}
```

</RustPlayground>

::: recommendation
**ใช้ `Cow` เพื่อลด Allocation**
ใน function ที่รับ `&str` และส่งคืน `String` ลองพิจารณาเปลี่ยนไปใช้ `Cow<'a, str>`
ถ้ากรณีส่วนใหญ่ไม่ต้องแก้ไข string (เช่น trim, replace ที่ไม่เจอ match) `Cow` จะช่วยประหยัด Memory Allocation ได้มหาศาล เพราะมันจะคืน Reference เดิมกลับไปแทน
:::

---

## Quick Reference

### Memory Traits
| Trait | คำอธิบาย | ตัวอย่าง Conversion |
|-------|---------|---------------------|
| `Borrow<T>` | ยืมเป็น &T | `String` → `&str` |
| `ToOwned` | สร้าง Owned data | `&str` → `String` |

### Smart Pointers
| Type | คำอธิบาย |
|------|---------|
| `Cow` | Ownership แบบขี้เกียจ (Clone เมื่อจำเป็น) |
| `Box` | Heap allocation |
| `Rc` | Reference Counting (Single thread) |
| `Arc` | Atomic Reference Counting (Thread safe) |

---

[← Ops](./ops) | [Future →](./future)
