# Comparison - เปรียบเทียบค่า

**std::cmp** มี traits สำหรับเปรียบเทียบค่าต่างๆ! 

---

## cmp มีอะไร?

| Trait | ใช้ทำอะไร | ต้องการ |
|-------|---------|--------|
| `PartialEq` | `==`, `!=` | - |
| `Eq` | equality สมบูรณ์ | PartialEq |
| `PartialOrd` | `<`, `>`, `<=`, `>=` | PartialEq |
| `Ord` | total ordering | Eq + PartialOrd |

:::tip Partial vs Full
- `Partial` = บาง values เปรียบเทียบไม่ได้ (เช่น `NaN`)
- `Full` (Eq/Ord) = ทุก values เปรียบเทียบได้
:::

---

## 1. PartialEq

<RustPlayground>

```rust
#[derive(Debug)]
struct Point {
 x: i32,
 y: i32,
}

// Implement PartialEq เอง
impl PartialEq for Point {
 fn eq(&self, other: &Self) -> bool {
 self.x == other.x && self.y == other.y
 }
 // ne ได้ฟรีจาก default implementation
}

fn main() {
 let p1 = Point { x: 1, y: 2 };
 let p2 = Point { x: 1, y: 2 };
 let p3 = Point { x: 3, y: 4 };
 
 println!("p1 == p2: {}", p1 == p2); // true
 println!("p1 == p3: {}", p1 == p3); // false
 println!("p1 != p3: {}", p1 != p3); // true
 
 // NaN เป็นตัวอย่างของ Partial
 let nan = f64::NAN;
 println!("NaN == NaN: {}", nan == nan); // false!
}
```

</RustPlayground>

---

## 2. Eq

<RustPlayground>

```rust
// Eq = marker trait (ไม่มี methods เพิ่ม)
// บอกว่า: a == a เสมอ (reflexive)

#[derive(Debug, PartialEq, Eq)] // Eq ง่ายๆ derive ได้
struct UserId(u64);

fn main() {
 let id1 = UserId(42);
 let id2 = UserId(42);
 let id3 = UserId(100);
 
 println!("id1 == id2: {}", id1 == id2);
 println!("id1 == id3: {}", id1 == id3);
 
 // Eq ทำให้ใช้เป็น key ใน HashMap ได้
 use std::collections::HashMap;
 let mut map = HashMap::new();
 map.insert(id1, "user 42");
 map.insert(id3, "user 100");
 println!("map: {:?}", map);
 
 // f64 ไม่มี Eq เพราะ NaN != NaN
 // let mut bad_map: HashMap<f64, &str> = HashMap::new(); // Error!
}
```

</RustPlayground>

---

## 3. PartialOrd

<RustPlayground>

```rust
use std::cmp::Ordering;

#[derive(Debug, PartialEq)]
struct Version {
 major: u32,
 minor: u32,
 patch: u32,
}

impl PartialOrd for Version {
 fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
 // เปรียบเทียบ major ก่อน
 match self.major.partial_cmp(&other.major) {
 Some(Ordering::Equal) => {}
 ord => return ord,
 }
 // ถ้าเท่ากัน เปรียบเทียบ minor
 match self.minor.partial_cmp(&other.minor) {
 Some(Ordering::Equal) => {}
 ord => return ord,
 }
 // สุดท้าย patch
 self.patch.partial_cmp(&other.patch)
 }
}

fn main() {
 let v1 = Version { major: 1, minor: 0, patch: 0 };
 let v2 = Version { major: 1, minor: 2, patch: 0 };
 let v3 = Version { major: 2, minor: 0, patch: 0 };
 
 println!("v1 < v2: {}", v1 < v2);
 println!("v2 < v3: {}", v2 < v3);
 println!("v1 <= v1: {}", v1 <= v1);
 
 // NaN ไม่สามารถเปรียบเทียบ
 let nan = f64::NAN;
 println!("NaN < 1.0: {}", nan < 1.0); // false
 println!("NaN > 1.0: {}", nan > 1.0); // false
 println!("NaN comparison: {:?}", nan.partial_cmp(&1.0)); // None
}
```

</RustPlayground>

---

## 4. Ord

<RustPlayground>

```rust
use std::cmp::Ordering;

#[derive(Debug, PartialEq, Eq)]
struct Score {
 points: i32,
 time_ms: u32, // เร็วกว่า = ดีกว่า
}

impl PartialOrd for Score {
 fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
 Some(self.cmp(other))
 }
}

impl Ord for Score {
 fn cmp(&self, other: &Self) -> Ordering {
 // เปรียบเทียบ points ก่อน (มาก = ดี)
 match self.points.cmp(&other.points) {
 Ordering::Equal => {
 // ถ้าเท่ากัน ดูเวลา (น้อย = ดี ดังนั้นกลับลำดับ)
 other.time_ms.cmp(&self.time_ms)
 }
 ord => ord,
 }
 }
}

fn main() {
 let mut scores = vec![
 Score { points: 100, time_ms: 5000 },
 Score { points: 100, time_ms: 3000 },
 Score { points: 150, time_ms: 8000 },
 Score { points: 80, time_ms: 2000 },
 ];
 
 scores.sort(); // ใช้ Ord
 println!("Sorted (worst to best):");
 for s in &scores {
 println!(" {:?}", s);
 }
 
 // max, min ใช้ Ord
 println!("\nBest: {:?}", scores.iter().max());
 println!("Worst: {:?}", scores.iter().min());
}
```

</RustPlayground>

---

## 5. Derive ง่ายๆ

<RustPlayground>

```rust
// Derive ทั้ง 4 traits ได้เลย!
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Student {
 grade: u8, // เรียงตาม grade ก่อน
 name: String, // ถ้าเท่ากัน เรียงตาม name
}

fn main() {
 let mut students = vec![
 Student { grade: 3, name: "Charlie".to_string() },
 Student { grade: 1, name: "Alice".to_string() },
 Student { grade: 2, name: "Bob".to_string() },
 Student { grade: 1, name: "Zara".to_string() },
 ];
 
 students.sort();
 
 println!("Sorted:");
 for s in &students {
 println!(" Grade {}: {}", s.grade, s.name);
 }
}
```

</RustPlayground>

---

## 6. Ordering Enum

<RustPlayground>

```rust
use std::cmp::Ordering;

fn main() {
 // Ordering มี 3 ค่า
 let less = Ordering::Less;
 let equal = Ordering::Equal;
 let greater = Ordering::Greater;
 
 // ใช้ใน match
 let a = 5;
 let b = 10;
 
 match a.cmp(&b) {
 Ordering::Less => println!("{} < {}", a, b),
 Ordering::Equal => println!("{} == {}", a, b),
 Ordering::Greater => println!("{} > {}", a, b),
 }
 
 // reverse() กลับลำดับ
 println!("reversed: {:?}", Ordering::Less.reverse());
 
 // then() chain comparisons
 let cmp1 = 1.cmp(&1); // Equal
 let cmp2 = 2.cmp(&3); // Less
 println!("chain: {:?}", cmp1.then(cmp2)); // Less (ใช้ cmp2 เพราะ cmp1 = Equal)
}
```

</RustPlayground>

---

## 7. min, max, clamp

<RustPlayground>

```rust
use std::cmp::{min, max};

fn main() {
 // min, max functions
 println!("min(3, 7) = {}", min(3, 7));
 println!("max(3, 7) = {}", max(3, 7));
 
 // Ord::min, Ord::max methods
 let a = 10;
 println!("a.min(5) = {}", a.min(5));
 println!("a.max(15) = {}", a.max(15));
 
 // clamp - จำกัดในช่วง
 for x in [0, 5, 10, 15, 20] {
 let clamped = x.clamp(5, 15);
 println!("{} clamped to [5,15] = {}", x, clamped);
 }
 
 // minmax ใน iterators
 let numbers = vec![3, 1, 4, 1, 5, 9, 2, 6];
 println!("\nmin: {:?}", numbers.iter().min());
 println!("max: {:?}", numbers.iter().max());
}
```

</RustPlayground>

---

## Quick Reference

### Traits
| Trait | Methods | Requirements |
|-------|---------|--------------|
| `PartialEq` | `eq()`, `ne()` | - |
| `Eq` | (marker) | PartialEq |
| `PartialOrd` | `partial_cmp()`, `lt()`, `le()`, `gt()`, `ge()` | PartialEq |
| `Ord` | `cmp()`, `max()`, `min()`, `clamp()` | Eq + PartialOrd |

### Ordering
| Value | ความหมาย |
|-------|----------|
| `Less` | น้อยกว่า |
| `Equal` | เท่ากัน |
| `Greater` | มากกว่า |

### Derive Guidelines
| Situation | Derive |
|-----------|--------|
| ทุก field เปรียบเทียบได้ | `#[derive(PartialEq, Eq, PartialOrd, Ord)]` |
| มี floats | `#[derive(PartialEq, PartialOrd)]` เท่านั้น |
| custom logic | implement เอง |

### Helper Functions
| Function | คำอธิบาย |
|----------|---------|
| `min(a, b)` | ค่าน้อยกว่า |
| `max(a, b)` | ค่ามากกว่า |
| `x.clamp(lo, hi)` | จำกัดในช่วง |

---

[← Convert](./convert) | [Hash →](./hash)
