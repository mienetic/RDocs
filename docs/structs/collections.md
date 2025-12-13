# Collections - โครงสร้างข้อมูล

`String`, `Vec`, `HashMap`, `HashSet` และอื่นๆ! 

---

## String - ข้อความ

::: best-practice
**รับค่าด้วย `&str` ถ้าแค่ต้องการอ่าน**
ถ้า function ไม่ต้องการ ownership ของ string ให้รับค่าเป็น `&str` เสมอ เพื่อให้คนเรียกไม่ต้อง clone!
:::

<RustPlayground>

```rust
fn main() {
 // วิธีสร้าง String
 let s1 = String::new();
 let s2 = String::from("hello");
 let s3 = "world".to_string();
 
 println!("s1 = '{}'", s1);
 println!("s2 = '{}'", s2);
 println!("s3 = '{}'", s3);
 
 // เพิ่มข้อความ
 let mut s = String::from("Hello");
 s.push(' ');
 s.push_str("World!");
 println!("s = {}", s);
 
 // ความยาว
 println!("len = {} bytes", s.len());
 println!("chars = {}", s.chars().count());
}
```

</RustPlayground>

---

## Vec - Dynamic Array

::: best-practice
**รู้ขนาดล่วงหน้า? ใช้ `Vec::with_capacity`!**
ถ้ามีข้อมูล 1000 ตัว การใช้ `Vec::with_capacity(1000)` จะเร็วกว่า `Vec::new()` มาก เพราะไม่ต้องขยาย memory หลายรอบ
:::

::: caution
**ระวัง Panic!**
การใช้ `v[index]` จะทำให้โปรแกรมพังถ้า index เกิน ควรใช้ `v.get(index)` ที่คืนค่าเป็น `Option` ปลอดภัยกว่า
:::

<RustPlayground>

```rust
fn main() {
 // วิธีสร้าง Vec
 let v1: Vec<i32> = Vec::new();
 let v2 = vec![1, 2, 3, 4, 5];
 let v3 = vec![0; 10]; // 10 zeros
 
 println!("v1 = {:?}", v1);
 println!("v2 = {:?}", v2);
 println!("v3 = {:?}", v3);
 
 // เพิ่ม/ลบ
 let mut v = Vec::new();
 v.push(1);
 v.push(2);
 v.push(3);
 println!("after push: {:?}", v);
 
 let popped = v.pop();
 println!("popped: {:?}, vec: {:?}", popped, v);
 
 // Access
 println!("v[0] = {}", v[0]);
 println!("v.get(10) = {:?}", v.get(10));
}
```

</RustPlayground>

---

## HashMap - Key-Value Map

::: best-practice
**ใช้ Entry API เช็คค่าก่อนใส่**
แทนที่จะเช็ค `if contains_key` แล้วค่อย `insert` ให้ใช้ `.entry().or_insert()` สั้นและเร็วกว่า!
:::

<RustPlayground>

```rust
use std::collections::HashMap;

fn main() {
 let mut scores = HashMap::new();
 
 // เพิ่มค่า
 scores.insert("Alice", 95);
 scores.insert("Bob", 87);
 scores.insert("Charlie", 92);
 
 // อ่านค่า
 if let Some(score) = scores.get("Alice") {
 println!("Alice's score: {}", score);
 }
 
 // ตรวจสอบว่ามี key ไหม
 println!("has Bob: {}", scores.contains_key("Bob"));
 println!("has Dave: {}", scores.contains_key("Dave"));
 
 // วนลูป
 for (name, score) in &scores {
 println!("{}: {}", name, score);
 }
 
 // entry API
 scores.entry("Dave").or_insert(80);
 println!("Dave: {:?}", scores.get("Dave"));
}
```

</RustPlayground>

---

## HashSet - Unique Values

<RustPlayground>

```rust
use std::collections::HashSet;

fn main() {
 let mut set = HashSet::new();
 
 // เพิ่มค่า
 set.insert(1);
 set.insert(2);
 set.insert(3);
 set.insert(2); // ซ้ำ - ไม่เพิ่ม
 
 println!("set = {:?}", set);
 println!("len = {}", set.len());
 
 // ตรวจสอบ
 println!("contains 2: {}", set.contains(&2));
 println!("contains 5: {}", set.contains(&5));
 
 // Set operations
 let a: HashSet<_> = [1, 2, 3].into();
 let b: HashSet<_> = [2, 3, 4].into();
 
 println!("union: {:?}", a.union(&b).collect::<Vec<_>>());
 println!("intersection: {:?}", a.intersection(&b).collect::<Vec<_>>());
 println!("difference: {:?}", a.difference(&b).collect::<Vec<_>>());
}
```

</RustPlayground>

---

## VecDeque - Double-ended Queue

<RustPlayground>

```rust
use std::collections::VecDeque;

fn main() {
 let mut deque = VecDeque::new();
 
 // เพิ่มหน้า/หลัง
 deque.push_back(1);
 deque.push_back(2);
 deque.push_front(0);
 println!("deque = {:?}", deque); // [0, 1, 2]
 
 // ดึงหน้า/หลัง
 println!("front = {:?}", deque.pop_front()); // Some(0)
 println!("back = {:?}", deque.pop_back()); // Some(2)
 println!("deque = {:?}", deque); // [1]
 
 // ใช้เป็น Queue
 let mut queue = VecDeque::new();
 queue.push_back("first");
 queue.push_back("second");
 queue.push_back("third");
 
 while let Some(item) = queue.pop_front() {
 println!("processing: {}", item);
 }
}
```

</RustPlayground>

---

## BTreeMap - Sorted Map

<RustPlayground>

```rust
use std::collections::BTreeMap;

fn main() {
 let mut map = BTreeMap::new();
 
 map.insert(3, "three");
 map.insert(1, "one");
 map.insert(2, "two");
 
 // Keys จะถูก sort อัตโนมัติ
 for (key, value) in &map {
 println!("{}: {}", key, value);
 }
 
 // Range queries
 for (k, v) in map.range(1..=2) {
 println!("range: {} = {}", k, v);
 }
}
```

</RustPlayground>

---

## Quick Reference

### Creation
| Struct | วิธีสร้าง |
|--------|---------|
| `String` | `String::new()`, `String::from("x")`, `"x".to_string()` |
| `Vec<T>` | `Vec::new()`, `vec![]`, `vec![0; 10]` |
| `HashMap<K,V>` | `HashMap::new()` |
| `HashSet<T>` | `HashSet::new()` |
| `VecDeque<T>` | `VecDeque::new()` |
| `BTreeMap<K,V>` | `BTreeMap::new()` |

### Common Methods
| Method | คำอธิบาย |
|--------|---------|
| `len()` | จำนวน elements |
| `is_empty()` | ว่างไหม |
| `clear()` | ล้างทั้งหมด |
| `contains()` | มีค่านี้ไหม |
| `iter()` | Iterator |

---

[← Index](./index) | [Smart Pointers →](./smart-pointers)
