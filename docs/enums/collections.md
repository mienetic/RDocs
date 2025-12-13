# Collections Enums

`Entry` สำหรับจัดการ HashMap/BTreeMap! 

---

## Entry - Occupied or Vacant

`Entry` enum ใช้สำหรับ:
- ตรวจสอบว่า key มีอยู่หรือไม่
- Insert หรือ update อย่างมีประสิทธิภาพ
- หลีกเลี่ยงการ lookup ซ้ำ

<RustPlayground>

```rust
use std::collections::HashMap;

fn main() {
 let mut scores = HashMap::new();
 scores.insert("Alice", 100);
 
 // entry() returns Entry enum
 // มี 2 variants: Occupied และ Vacant
 
 // or_insert - insert ถ้ายังไม่มี
 scores.entry("Bob").or_insert(50);
 scores.entry("Alice").or_insert(999); // ไม่เปลี่ยน เพราะมีอยู่แล้ว
 
 println!("scores: {:?}", scores);
}
```

</RustPlayground>

---

## Entry Pattern - Word Count

<RustPlayground>

```rust
use std::collections::HashMap;

fn main() {
 let text = "hello world hello rust world world";
 let mut word_count: HashMap<&str, i32> = HashMap::new();
 
 for word in text.split_whitespace() {
 // or_insert returns &mut V
 let count = word_count.entry(word).or_insert(0);
 *count += 1;
 }
 
 println!("word counts: {:?}", word_count);
 
 // or_insert_with - lazy initialization
 let mut expensive = HashMap::new();
 expensive.entry("data").or_insert_with(|| {
 println!("Computing expensive value...");
 42
 });
 
 // ไม่ compute อีก เพราะมีอยู่แล้ว
 expensive.entry("data").or_insert_with(|| {
 println!("This won't print");
 999
 });
 
 println!("expensive: {:?}", expensive);
}
```

</RustPlayground>

---

## Entry Methods

<RustPlayground>

```rust
use std::collections::HashMap;
use std::collections::hash_map::Entry;

fn main() {
 let mut map: HashMap<&str, i32> = HashMap::new();
 map.insert("existing", 100);
 
 // and_modify - แก้ไขถ้ามีอยู่
 map.entry("existing")
 .and_modify(|v| *v += 10)
 .or_insert(0);
 println!("after and_modify: {:?}", map.get("existing"));
 
 // key() - ดู key
 let entry = map.entry("new_key");
 println!("entry key: {}", entry.key());
 
 // or_default - ใช้ default value
 let mut counts: HashMap<&str, i32> = HashMap::new();
 *counts.entry("a").or_default() += 1;
 *counts.entry("a").or_default() += 1;
 println!("counts: {:?}", counts);
 
 // Pattern match Entry
 match map.entry("test") {
 Entry::Occupied(o) => {
 println!("Occupied: {}", o.get());
 }
 Entry::Vacant(v) => {
 v.insert(42);
 println!("Inserted new value");
 }
 }
 
 println!("final map: {:?}", map);
}
```

</RustPlayground>

---

## OccupiedEntry Methods

<RustPlayground>

```rust
use std::collections::HashMap;
use std::collections::hash_map::Entry;

fn main() {
 let mut map = HashMap::new();
 map.insert("key", 100);
 
 if let Entry::Occupied(mut o) = map.entry("key") {
 println!("key: {}", o.key());
 println!("get: {}", o.get());
 
 // get_mut - ได้ &mut V
 *o.get_mut() += 50;
 println!("after get_mut: {}", o.get());
 
 // insert - แทนที่และได้ค่าเก่า
 let old = o.insert(999);
 println!("old value: {}", old);
 
 // remove - ลบและได้ค่า
 let removed = o.remove();
 println!("removed: {}", removed);
 }
 
 println!("map after remove: {:?}", map);
}
```

</RustPlayground>

---

## VacantEntry Methods

<RustPlayground>

```rust
use std::collections::HashMap;
use std::collections::hash_map::Entry;

fn main() {
 let mut map: HashMap<String, i32> = HashMap::new();
 
 if let Entry::Vacant(v) = map.entry("new".to_string()) {
 println!("key: {}", v.key());
 
 // insert - ใส่ค่าและได้ &mut V
 let value = v.insert(42);
 *value += 8;
 println!("inserted value: {}", value);
 }
 
 println!("map: {:?}", map);
 
 // into_key - take ownership of key
 let mut map2: HashMap<String, i32> = HashMap::new();
 if let Entry::Vacant(v) = map2.entry("owned".to_string()) {
 let key = v.into_key();
 println!("took key: {}", key);
 }
}
```

</RustPlayground>

---

## Quick Reference

### Entry
| Variant | คำอธิบาย |
|---------|---------|
| `Occupied(OccupiedEntry)` | Key มีอยู่ |
| `Vacant(VacantEntry)` | Key ยังไม่มี |

### Entry Methods
| Method | คำอธิบาย |
|--------|---------|
| `or_insert(v)` | Insert ถ้า vacant |
| `or_insert_with(f)` | Insert ด้วย closure |
| `or_default()` | Insert default value |
| `and_modify(f)` | แก้ไขถ้า occupied |
| `key()` | ดู key |

### OccupiedEntry Methods
| Method | คำอธิบาย |
|--------|---------|
| `get()` | ได้ &V |
| `get_mut()` | ได้ &mut V |
| `insert(v)` | แทนที่ ได้ค่าเก่า |
| `remove()` | ลบ ได้ค่า |

---

[← Cmp](./cmp) | [I/O →](./io)
