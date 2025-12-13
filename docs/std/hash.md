# Hash - สร้างค่าแฮช

**std::hash** มี traits สำหรับคำนวณค่า hash ของข้อมูล! #

---

## hash คืออะไร?

Hash คือการแปลงข้อมูลเป็นตัวเลขคงที่ ใช้ใน:
- `HashMap` และ `HashSet`
- เปรียบเทียบข้อมูลเร็ว
- ตรวจสอบความซ้ำ

:::tip กฎสำคัญ
ถ้า `a == b` แล้ว `hash(a) == hash(b)` **ต้องเป็นจริง**
:::

---

## 1. Derive Hash

<RustPlayground>

```rust
use std::collections::HashMap;

#[derive(Debug, Hash, PartialEq, Eq)]
struct User {
 id: u64,
 name: String,
}

fn main() {
 // Derive Hash ง่ายๆ
 let user1 = User { id: 1, name: "Alice".to_string() };
 let user2 = User { id: 2, name: "Bob".to_string() };

 // ใช้เป็น key ใน HashMap
 let mut scores = HashMap::new();
 scores.insert(user1, 100);
 scores.insert(user2, 95);

 // ค้นหาด้วย User
 let lookup = User { id: 1, name: "Alice".to_string() };
 println!("Alice's score: {:?}", scores.get(&lookup));
}
```

</RustPlayground>

---

## 2. Implement Hash เอง

<RustPlayground>

```rust
use std::hash::{Hash, Hasher};
use std::collections::hash_map::DefaultHasher;

struct Point {
 x: i32,
 y: i32,
 // label ไม่นับใน hash
 label: String,
}

impl Hash for Point {
 fn hash<H: Hasher>(&self, state: &mut H) {
 // hash เฉพาะ x และ y
 self.x.hash(state);
 self.y.hash(state);
 // ไม่ hash label
 }
}

// ต้อง implement PartialEq ให้ตรงกับ Hash!
impl PartialEq for Point {
 fn eq(&self, other: &Self) -> bool {
 // เปรียบเทียบเฉพาะ x และ y เหมือน hash
 self.x == other.x && self.y == other.y
 }
}

impl Eq for Point {}

fn main() {
 let p1 = Point { x: 1, y: 2, label: "first".to_string() };
 let p2 = Point { x: 1, y: 2, label: "second".to_string() };

 // p1 == p2 เพราะ x, y เท่ากัน
 println!("p1 == p2: {}", p1 == p2);

 // คำนวณ hash
 fn calculate_hash<T: Hash>(t: &T) -> u64 {
 let mut hasher = DefaultHasher::new();
 t.hash(&mut hasher);
 hasher.finish()
 }

 println!("hash(p1) = {}", calculate_hash(&p1));
 println!("hash(p2) = {}", calculate_hash(&p2)); // เท่ากัน!
}
```

</RustPlayground>

---

## 3. Hasher Trait

<RustPlayground>

```rust
use std::hash::Hasher;
use std::collections::hash_map::DefaultHasher;

fn main() {
 let mut hasher = DefaultHasher::new();

 // write methods เขียน bytes เข้า hasher
 hasher.write(b"hello");
 hasher.write_u32(42);
 hasher.write_i64(-100);

 // finish() ได้ค่า hash
 let hash = hasher.finish();
 println!("Hash: {}", hash);

 // hasher ใหม่ = hash ใหม่
 let mut hasher2 = DefaultHasher::new();
 hasher2.write(b"hello");
 hasher2.write_u32(42);
 hasher2.write_i64(-100);

 let hash2 = hasher2.finish();
 println!("Hash2: {} (same!)", hash2);

 // ลำดับสำคัญ!
 let mut hasher3 = DefaultHasher::new();
 hasher3.write_u32(42);
 hasher3.write(b"hello"); // สลับลำดับ
 hasher3.write_i64(-100);

 let hash3 = hasher3.finish();
 println!("Hash3: {} (different!)", hash3);
}
```

</RustPlayground>

---

## 4. BuildHasher

<RustPlayground>

```rust
use std::collections::HashMap;
use std::hash::BuildHasherDefault;
use std::collections::hash_map::DefaultHasher;

fn main() {
 // HashMap ใช้ RandomState เป็น default (secure)
 let map1: HashMap<&str, i32> = HashMap::new();

 // กำหนด hasher เอง
 type MyHashMap<K, V> = HashMap<K, V, BuildHasherDefault<DefaultHasher>>;
 let map2: MyHashMap<&str, i32> = HashMap::default();

 println!("map1 hasher: RandomState (ปลอดภัย แต่ช้ากว่า)");
 println!("map2 hasher: DefaultHasher (deterministic)");

 // with_capacity_and_hasher
 let map3: MyHashMap<&str, i32> = HashMap::with_capacity_and_hasher(
 100,
 BuildHasherDefault::default()
 );
 println!("map3 capacity: {}", map3.capacity());
}
```

</RustPlayground>

---

## 5. Hash ใน Collections

<RustPlayground>

```rust
use std::collections::{HashMap, HashSet};

#[derive(Debug, Hash, PartialEq, Eq, Clone)]
struct Product {
 id: u32,
 name: String,
}

fn main() {
 // HashMap ใช้ hash ของ key
 let mut inventory: HashMap<Product, u32> = HashMap::new();

 let apple = Product { id: 1, name: "Apple".to_string() };
 let banana = Product { id: 2, name: "Banana".to_string() };

 inventory.insert(apple.clone(), 100);
 inventory.insert(banana.clone(), 50);

 println!("Apple stock: {:?}", inventory.get(&apple));

 // HashSet ใช้ hash ตรวจความซ้ำ
 let mut seen: HashSet<Product> = HashSet::new();

 println!("Insert apple: {}", seen.insert(apple.clone())); // true
 println!("Insert apple again: {}", seen.insert(apple)); // false (ซ้ำ!)
 println!("Insert banana: {}", seen.insert(banana)); // true

 println!("Set size: {}", seen.len());
}
```

</RustPlayground>

---

## 6. Hash กับ Floats

<RustPlayground>

```rust
use std::hash::{Hash, Hasher};
use std::collections::HashMap;

// Wrapper สำหรับ f64 ที่ hash ได้ (ระวัง NaN!)
#[derive(Debug, Clone, Copy)]
struct HashableFloat(f64);

impl Hash for HashableFloat {
 fn hash<H: Hasher>(&self, state: &mut H) {
 // แปลงเป็น bits แล้ว hash
 self.0.to_bits().hash(state);
 }
}

impl PartialEq for HashableFloat {
 fn eq(&self, other: &Self) -> bool {
 self.0.to_bits() == other.0.to_bits()
 }
}

impl Eq for HashableFloat {}

fn main() {
 let mut map: HashMap<HashableFloat, &str> = HashMap::new();

 map.insert(HashableFloat(1.5), "one and half");
 map.insert(HashableFloat(3.14), "pi");

 println!("1.5 -> {:?}", map.get(&HashableFloat(1.5)));
 println!("3.14 -> {:?}", map.get(&HashableFloat(3.14)));

 // NaN ยังมีปัญหา!
 let nan = f64::NAN;
 println!("NaN == NaN: {}", nan == nan); // false
}
```

</RustPlayground>

---

## Quick Reference

### Traits
| Trait | คำอธิบาย |
|-------|---------|
| `Hash` | สร้างค่า hash |
| `Hasher` | คำนวณ hash |
| `BuildHasher` | สร้าง Hasher |

### Hash Methods
| Method | คำอธิบาย |
|--------|---------|
| `hash(state)` | เขียนไป Hasher |
| `hash_slice(slice, state)` | hash ทั้ง slice |

### Hasher Methods
| Method | คำอธิบาย |
|--------|---------|
| `write(bytes)` | เขียน bytes |
| `write_u8(n)` | เขียน u8 |
| `write_u32(n)` | เขียน u32 |
| `finish()` | ได้ค่า hash |

### กฎสำคัญ
| กฎ | คำอธิบาย |
|----|---------|
| Consistency | `a == b` → `hash(a) == hash(b)` |
| Deterministic | hash เดิมทุกครั้ง (ใน run เดียวกัน) |
| ไม่สมมาตร | `hash(a) == hash(b)` ไม่ได้หมายความว่า `a == b` |

---

[← Comparison](./cmp) | [Default →](./default)
