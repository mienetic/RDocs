# Comparison Traits

`Eq`, `PartialEq`, `Ord`, `PartialOrd`, `Hash` สำหรับเปรียบเทียบ! 

---

## PartialEq - เปรียบเทียบ ==

<RustPlayground>

```rust
#[derive(Debug, PartialEq)]
struct Point {
 x: i32,
 y: i32,
}

fn main() {
 let p1 = Point { x: 1, y: 2 };
 let p2 = Point { x: 1, y: 2 };
 let p3 = Point { x: 3, y: 4 };
 
 println!("p1 == p2: {}", p1 == p2); // true
 println!("p1 == p3: {}", p1 == p3); // false
 println!("p1 != p3: {}", p1 != p3); // true
}
```

</RustPlayground>

::: pitfall
**Float ไม่เป็น `Eq`!**
`f32` และ `f64` implement แค่ `PartialEq` แต่ **ไม่ implement `Eq`**
เพราะ `NaN != NaN` (ตามมาตรฐาน IEEE 754) ทำให้มันขาดคุณสมบัติ Reflexive
(นี่เป็นเหตุผลว่าทำไมใช้ Float เป็น Key ใน HashMap ไม่ได้!)
:::

---

## Ord - เปรียบเทียบลำดับ

<RustPlayground>

```rust
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Score {
 points: i32,
}

fn main() {
 let scores = vec![
 Score { points: 100 },
 Score { points: 50 },
 Score { points: 75 },
 ];
 
 // เปรียบเทียบลำดับ
 println!("50 < 100: {}", Score { points: 50 } < Score { points: 100 });
 
 // Sorting
 let mut sorted = scores.clone();
 sorted.sort();
 println!("\nSorted: {:?}", sorted);
 
 // Max/Min
 println!("Max: {:?}", scores.iter().max());
 println!("Min: {:?}", scores.iter().min());
}
```

</RustPlayground>

---

## Hash - สร้าง Hash Value

<RustPlayground>

```rust
use std::collections::HashSet;
use std::hash::{Hash, Hasher};

#[derive(Debug, PartialEq, Eq, Hash)]
struct User {
 id: u32,
 name: String,
}

fn main() {
 let mut users = HashSet::new();
 
 users.insert(User { id: 1, name: "Alice".to_string() });
 users.insert(User { id: 2, name: "Bob".to_string() });
 users.insert(User { id: 1, name: "Alice".to_string() }); // duplicate!
 
 println!("Users: {:?}", users);
 println!("Count: {}", users.len()); // 2, not 3
 
 // Check contains
 let alice = User { id: 1, name: "Alice".to_string() };
 println!("Contains Alice: {}", users.contains(&alice));
}
```

</RustPlayground>

---

## Custom Implementation

<RustPlayground>

```rust
#[derive(Debug)]
struct Person {
 id: u32,
 name: String,
 age: u32,
}

// เปรียบเทียบ by id only
impl PartialEq for Person {
 fn eq(&self, other: &Self) -> bool {
 self.id == other.id
 }
}

impl Eq for Person {}

fn main() {
 let p1 = Person { id: 1, name: "Alice".to_string(), age: 30 };
 let p2 = Person { id: 1, name: "Alicia".to_string(), age: 25 };
 
 // Same id = equal, even with different name/age
 println!("p1 == p2: {}", p1 == p2); // true
}
```

</RustPlayground>

---

## Quick Reference

### Comparison Traits
| Trait | Requires | คำอธิบาย |
|-------|----------|---------|
| `PartialEq` | - | `==`, `!=` |
| `Eq` | `PartialEq` | reflexive equality |
| `PartialOrd` | `PartialEq` | `<`, `>`, `<=`, `>=` |
| `Ord` | `Eq + PartialOrd` | total ordering |
| `Hash` | `Eq` | hash value |

### Trait Hierarchy
```
PartialEq
 ↓
 Eq → Hash
 ↓
PartialOrd
 ↓
 Ord
```

---

[← Core](./core) | [Conversion →](./conversion)
