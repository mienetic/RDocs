# Collections - โครงสร้างข้อมูล

นอกจาก Vec แล้ว Rust มี Collections อื่นๆ ให้เลือกใช้ตามความเหมาะสม! 

---

## เลือก Collection ไหนดี?

| ต้องการ | ใช้ | O(operation) |
|--------|-----|--------------|
| เรียงลำดับ, index | `Vec<T>` | O(1) access |
| key-value | `HashMap<K, V>` | O(1) avg |
| ไม่ซ้ำ | `HashSet<T>` | O(1) avg |
| เรียงลำดับ key | `BTreeMap<K, V>` | O(log n) |
| เรียงลำดับ ไม่ซ้ำ | `BTreeSet<T>` | O(log n) |
| เพิ่ม/ลบหัวท้าย | `VecDeque<T>` | O(1) |
| ค่าสูงสุดก่อน | `BinaryHeap<T>` | O(log n) |

---

## 1. HashMap - Key-Value

<RustPlayground>

```rust
use std::collections::HashMap;

fn main() {
 // สร้าง HashMap
 let mut scores = HashMap::new();
 
 // เพิ่มข้อมูล
 scores.insert("Alice", 95);
 scores.insert("Bob", 87);
 scores.insert("Charlie", 92);
 println!("scores: {:?}", scores);
 
 // เข้าถึง (return Option)
 let alice_score = scores.get("Alice");
 println!("Alice: {:?}", alice_score); // Some(&95)
 
 // ตรวจว่ามี key ไหม
 println!("has Alice: {}", scores.contains_key("Alice"));
 
 // ลบ
 let removed = scores.remove("Bob");
 println!("removed Bob: {:?}", removed);
 
 // วนซ้ำ
 println!("=== ทุกคน ===");
 for (name, score) in &scores {
 println!("{}: {}", name, score);
 }
}
```

</RustPlayground>

---

## 2. HashMap - Entry API

<RustPlayground>

```rust
use std::collections::HashMap;

fn main() {
 let mut word_counts: HashMap<&str, i32> = HashMap::new();
 let text = "hello world hello rust hello";
 
 // นับคำด้วย entry API
 for word in text.split_whitespace() {
 // or_insert: ถ้าไม่มีให้ใส่ค่านี้
 let count = word_counts.entry(word).or_insert(0);
 *count += 1;
 }
 println!("word counts: {:?}", word_counts);
 
 // or_insert_with: ถ้าไม่มีให้คำนวณค่า
 let mut cache: HashMap<&str, Vec<i32>> = HashMap::new();
 cache.entry("data").or_insert_with(Vec::new).push(1);
 cache.entry("data").or_insert_with(Vec::new).push(2);
 println!("cache: {:?}", cache);
 
 // and_modify: แก้ไขถ้ามี
 word_counts.entry("hello").and_modify(|c| *c *= 2);
 println!("after modify: {:?}", word_counts);
}
```

</RustPlayground>

---

## 3. HashSet - ไม่ซ้ำ

<RustPlayground>

```rust
use std::collections::HashSet;

fn main() {
 // สร้าง HashSet
 let mut fruits: HashSet<&str> = HashSet::new();
 
 // เพิ่ม (return true ถ้าเป็นค่าใหม่)
 println!("insert apple: {}", fruits.insert("apple")); // true
 println!("insert banana: {}", fruits.insert("banana")); // true
 println!("insert apple again: {}", fruits.insert("apple")); // false!
 
 // ตรวจว่ามีไหม
 println!("has apple: {}", fruits.contains("apple"));
 
 // ลบ
 fruits.remove("banana");
 println!("after remove: {:?}", fruits);
 
 // Set operations
 let set1: HashSet<i32> = [1, 2, 3, 4].iter().cloned().collect();
 let set2: HashSet<i32> = [3, 4, 5, 6].iter().cloned().collect();
 
 // union - รวมกัน
 let union: HashSet<_> = set1.union(&set2).collect();
 println!("union: {:?}", union);
 
 // intersection - ส่วนที่ซ้ำ
 let intersect: HashSet<_> = set1.intersection(&set2).collect();
 println!("intersection: {:?}", intersect);
 
 // difference - มีใน set1 แต่ไม่มีใน set2
 let diff: HashSet<_> = set1.difference(&set2).collect();
 println!("difference: {:?}", diff);
}
```

</RustPlayground>

---

## 4. BTreeMap - เรียงลำดับ key

<RustPlayground>

```rust
use std::collections::BTreeMap;

fn main() {
 let mut scores = BTreeMap::new();
 
 scores.insert("Charlie", 92);
 scores.insert("Alice", 95);
 scores.insert("Bob", 87);
 
 // วนซ้ำ - ได้ลำดับตาม key!
 println!("=== เรียงตามชื่อ ===");
 for (name, score) in &scores {
 println!("{}: {}", name, score);
 }
 
 // range - เลือก range ของ keys
 println!("=== A-B ===");
 for (name, score) in scores.range("A".."C") {
 println!("{}: {}", name, score);
 }
 
 // first/last key
 println!("first: {:?}", scores.first_key_value());
 println!("last: {:?}", scores.last_key_value());
}
```

</RustPlayground>

---

## 5. VecDeque - หัวท้าย

<RustPlayground>

```rust
use std::collections::VecDeque;

fn main() {
 let mut queue: VecDeque<&str> = VecDeque::new();
 
 // เพิ่มท้าย (เหมือน Vec)
 queue.push_back("first");
 queue.push_back("second");
 queue.push_back("third");
 println!("queue: {:?}", queue);
 
 // เพิ่มหน้า
 queue.push_front("zero");
 println!("after push_front: {:?}", queue);
 
 // ลบหน้า
 let front = queue.pop_front();
 println!("pop_front: {:?}", front);
 
 // ลบท้าย
 let back = queue.pop_back();
 println!("pop_back: {:?}", back);
 
 // เข้าถึงด้วย index
 println!("[0]: {:?}", queue.get(0));
 
 // ใช้เป็น Queue (FIFO)
 println!("=== Queue demo ===");
 queue.push_back("task1");
 queue.push_back("task2");
 while let Some(task) = queue.pop_front() {
 println!("processing: {}", task);
 }
}
```

</RustPlayground>

---

## 6. BinaryHeap - Priority Queue

<RustPlayground>

```rust
use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn main() {
 // Max-heap (ค่าสูงสุดออกก่อน)
 let mut heap = BinaryHeap::new();
 heap.push(3);
 heap.push(1);
 heap.push(4);
 heap.push(1);
 heap.push(5);
 
 println!("=== Max-heap ===");
 while let Some(n) = heap.pop() {
 print!("{} ", n); // 5 4 3 1 1
 }
 println!();
 
 // Min-heap (ค่าน้อยสุดออกก่อน) - ใช้ Reverse
 let mut min_heap = BinaryHeap::new();
 min_heap.push(Reverse(3));
 min_heap.push(Reverse(1));
 min_heap.push(Reverse(4));
 
 println!("=== Min-heap ===");
 while let Some(Reverse(n)) = min_heap.pop() {
 print!("{} ", n); // 1 3 4
 }
 println!();
 
 // peek - ดูค่าสูงสุดโดยไม่ลบ
 let mut h = BinaryHeap::from(vec![1, 5, 2]);
 println!("peek: {:?}", h.peek()); // Some(&5)
}
```

</RustPlayground>

---

## 7. สร้างจาก Iterator

<RustPlayground>

```rust
use std::collections::{HashMap, HashSet, VecDeque, BinaryHeap};

fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // Vec -> HashSet
 let set: HashSet<i32> = numbers.iter().cloned().collect();
 println!("HashSet: {:?}", set);
 
 // Vec ของ pairs -> HashMap
 let pairs = vec![("a", 1), ("b", 2), ("c", 3)];
 let map: HashMap<&str, i32> = pairs.into_iter().collect();
 println!("HashMap: {:?}", map);
 
 // Vec -> VecDeque
 let deque: VecDeque<i32> = numbers.iter().cloned().collect();
 println!("VecDeque: {:?}", deque);
 
 // Vec -> BinaryHeap
 let heap: BinaryHeap<i32> = numbers.iter().cloned().collect();
 println!("BinaryHeap: {:?}", heap);
 
 // from macro
 let map2: HashMap<_, _> = [("x", 10), ("y", 20)].into_iter().collect();
 println!("from array: {:?}", map2);
}
```

</RustPlayground>

---

## Quick Reference

### HashMap
| Method | คำอธิบาย |
|--------|---------|
| `insert(k, v)` | เพิ่ม/แก้ไข |
| `get(&k)` | ดึงค่า (Option) |
| `remove(&k)` | ลบ |
| `contains_key(&k)` | มี key ไหม? |
| `entry(k)` | Entry API |
| `keys()` / `values()` | iterate |

### HashSet
| Method | คำอธิบาย |
|--------|---------|
| `insert(v)` | เพิ่ม |
| `remove(&v)` | ลบ |
| `contains(&v)` | มีไหม? |
| `union()` | รวม |
| `intersection()` | ส่วนซ้ำ |
| `difference()` | ต่าง |

### VecDeque
| Method | คำอธิบาย |
|--------|---------|
| `push_front(v)` | เพิ่มหน้า |
| `push_back(v)` | เพิ่มท้าย |
| `pop_front()` | ลบหน้า |
| `pop_back()` | ลบท้าย |

### BinaryHeap
| Method | คำอธิบาย |
|--------|---------|
| `push(v)` | เพิ่ม |
| `pop()` | ลบสูงสุด |
| `peek()` | ดูสูงสุด |
| `Reverse(v)` | ทำ min-heap |

---

[← Iterator](./iter) | [Formatting →](./fmt)
