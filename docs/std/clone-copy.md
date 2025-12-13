# Clone & Copy - คัดลอกค่า

**Clone** และ **Copy** คือ traits สำหรับคัดลอกค่า แต่ทำงานต่างกัน! 

---

## Clone vs Copy

| Trait | วิธีคัดลอก | ต้องเรียก | ราคา |
|-------|----------|---------|------|
| `Copy` | คัดลอกอัตโนมัติ (bitwise) | ไม่ต้อง | ถูก |
| `Clone` | คัดลอกแบบ explicit | ต้องเรียก `.clone()` | อาจแพง |

:::tip กฎง่ายๆ
- `Copy` = types ที่คัดลอกถูก (ตัวเลข, bool, char)
- `Clone` = ทุก type ที่คัดลอกได้ (รวม String, Vec)
- `Copy` ต้อง implement `Clone` ด้วย
:::

---

## 1. Copy Trait

<RustPlayground>

```rust
fn main() {
 // Copy types - คัดลอกอัตโนมัติ
 let a = 42;
 let b = a; // คัดลอก! ไม่ใช่ move
 println!("a: {}, b: {}", a, b); // ใช้ได้ทั้งคู่!
 
 // Copy types อื่นๆ
 let x: i32 = 10; // ตัวเลขทั้งหมด
 let y: f64 = 3.14; // float
 let z: bool = true; // boolean
 let c: char = 'ก'; // character
 let tuple = (1, 2, 3); // tuple ของ Copy types
 let arr = [1, 2, 3]; // array ของ Copy types
 
 // ทั้งหมดนี้สามารถ copy ได้
 let x2 = x;
 let y2 = y;
 println!("x: {}, x2: {}", x, x2);
 
 // Non-Copy types - ถูก move
 let s1 = String::from("hello");
 let s2 = s1; // move! ไม่ใช่ copy
 // println!("{}", s1); // Error! s1 ถูก move แล้ว
 println!("s2: {}", s2);
}
```

</RustPlayground>

---

## 2. Clone Trait

<RustPlayground>

```rust
fn main() {
 // Clone ต้องเรียก .clone() เอง
 let s1 = String::from("hello");
 let s2 = s1.clone(); // คัดลอกข้อมูลบน heap
 println!("s1: {}, s2: {}", s1, s2); // ใช้ได้ทั้งคู่!
 
 // Vec ก็ต้อง clone
 let v1 = vec![1, 2, 3];
 let v2 = v1.clone();
 println!("v1: {:?}, v2: {:?}", v1, v2);
 
 // Clone complex types
 let nested = vec![vec![1, 2], vec![3, 4]];
 let nested_copy = nested.clone(); // deep copy
 println!("nested: {:?}", nested);
 
 // clone_from - clone แบบ reuse memory
 let mut target = String::with_capacity(100);
 let source = String::from("hello");
 target.clone_from(&source); // reuse capacity ถ้าทำได้
 println!("target: {}", target);
}
```

</RustPlayground>

---

## 3. Derive Clone และ Copy

<RustPlayground>

```rust
// Derive Copy + Clone สำหรับ struct ง่ายๆ
#[derive(Debug, Clone, Copy)]
struct Point {
 x: i32,
 y: i32,
}

// Derive Clone เท่านั้น (มี String เป็น field)
#[derive(Debug, Clone)]
struct Person {
 name: String,
 age: u32,
}

fn main() {
 // Point เป็น Copy
 let p1 = Point { x: 1, y: 2 };
 let p2 = p1; // copy อัตโนมัติ
 println!("p1: {:?}, p2: {:?}", p1, p2);
 
 // Person ไม่ใช่ Copy (เพราะมี String)
 let person1 = Person {
 name: "Alice".to_string(),
 age: 25,
 };
 let person2 = person1.clone(); // ต้อง clone
 // let person3 = person1; // นี่จะ move ไม่ใช่ copy
 println!("person1: {:?}", person1);
 println!("person2: {:?}", person2);
}
```

</RustPlayground>

---

## 4. กฎของ Copy

<RustPlayground>

```rust
// Copy ได้เมื่อ:
// 1. ทุก field เป็น Copy
// 2. ไม่ implement Drop

// Copy ได้
#[derive(Clone, Copy)]
struct Copyable {
 a: i32,
 b: bool,
 c: char,
}

// Copy ไม่ได้ - มี String
// #[derive(Clone, Copy)] // Error!
#[derive(Clone)]
struct NotCopyable {
 a: i32,
 b: String, // String ไม่ใช่ Copy
}

// Copy ไม่ได้ - มี Vec
#[derive(Clone)]
struct AlsoNotCopyable {
 data: Vec<i32>, // Vec ไม่ใช่ Copy
}

fn main() {
 let c = Copyable { a: 1, b: true, c: 'x' };
 let c2 = c; // copy
 println!("{:?} {:?}", c, c2);
 
 let n = NotCopyable { a: 1, b: "hi".to_string() };
 let n2 = n.clone(); // ต้อง clone
 println!("{:?}", n2);
}
```

</RustPlayground>

---

## 5. Implement Clone เอง

<RustPlayground>

```rust
#[derive(Debug)]
struct Counter {
 value: i32,
 history: Vec<i32>,
}

impl Clone for Counter {
 fn clone(&self) -> Self {
 println!("กำลัง clone Counter...");
 Counter {
 value: self.value,
 history: self.history.clone(),
 }
 }
 
 // clone_from สามารถ optimize ได้
 fn clone_from(&mut self, source: &Self) {
 println!("กำลัง clone_from Counter...");
 self.value = source.value;
 self.history.clone_from(&source.history);
 }
}

fn main() {
 let c1 = Counter {
 value: 10,
 history: vec![1, 2, 3],
 };
 
 // ใช้ clone()
 let c2 = c1.clone();
 println!("c1: {:?}", c1);
 println!("c2: {:?}", c2);
 
 // ใช้ clone_from()
 let mut c3 = Counter {
 value: 0,
 history: Vec::with_capacity(100), // มี capacity อยู่แล้ว
 };
 c3.clone_from(&c1); // reuse capacity
 println!("c3: {:?}", c3);
}
```

</RustPlayground>

---

## 6. เมื่อไหร่ใช้ Clone

<RustPlayground>

```rust
fn main() {
 // กรณีที่ 1: ต้องการ 2 copies แยกกัน
 let original = vec![1, 2, 3];
 let backup = original.clone();
 
 // แก้ไข original ไม่กระทบ backup
 let mut original = original;
 original.push(4);
 println!("original: {:?}", original);
 println!("backup: {:?}", backup);
 
 // กรณีที่ 2: ส่งเข้าฟังก์ชันโดยไม่ต้องการ move
 fn process(data: Vec<i32>) {
 println!("processing: {:?}", data);
 }
 
 let data = vec![1, 2, 3];
 process(data.clone()); // ส่ง clone เข้าไป
 println!("data ยังมี: {:?}", data); // ยังใช้ได้
 
 // กรณีที่ 3: เก็บ copy ของ borrowed data
 fn get_copy(s: &String) -> String {
 s.clone() // ต้อง clone เพราะยืมมา
 }
 
 let text = String::from("hello");
 let copy = get_copy(&text);
 println!("copy: {}", copy);
}
```

</RustPlayground>

---

## 7. Cow - Clone on Write

<RustPlayground>

```rust
use std::borrow::Cow;

// Cow: ไม่ clone จนกว่าจะต้องแก้ไข
fn maybe_modify(input: &str) -> Cow<str> {
 if input.contains("bad") {
 // ต้องแก้ไข - clone แล้วแก้
 Cow::Owned(input.replace("bad", "good"))
 } else {
 // ไม่ต้องแก้ไข - แค่ยืม
 Cow::Borrowed(input)
 }
}

fn main() {
 let s1 = maybe_modify("hello world");
 println!("s1: {} (borrowed: {})", s1, matches!(s1, Cow::Borrowed(_)));
 
 let s2 = maybe_modify("bad word");
 println!("s2: {} (borrowed: {})", s2, matches!(s2, Cow::Borrowed(_)));
}
```

</RustPlayground>

---

## Quick Reference

### Copy vs Clone
| | Copy | Clone |
|-|------|-------|
| เรียกใช้ | อัตโนมัติ | ต้องเรียก `.clone()` |
| ราคา | ถูก (bitwise) | อาจแพง (allocate) |
| ตัวอย่าง type | i32, bool, char | String, Vec |
| Derive | `#[derive(Copy, Clone)]` | `#[derive(Clone)]` |

### Copy Types
| Type | Copy? |
|------|-------|
| `i32, u64, f32` ฯลฯ | |
| `bool` | |
| `char` | |
| `(A, B)` ถ้า A, B เป็น Copy | |
| `[T; N]` ถ้า T เป็น Copy | |
| `&T` | |
| `*const T` | |
| `String` | |
| `Vec<T>` | |
| `Box<T>` | |

### Methods
| Method | คำอธิบาย |
|--------|---------|
| `.clone()` | สร้าง copy |
| `.clone_from(&src)` | clone แบบ reuse memory |
| `Cow::Borrowed` | ยืมไม่ clone |
| `Cow::Owned` | clone เมื่อจำเป็น |

---

[← Formatting](./fmt) | [I/O →](./io)
