# Compare Functions (std::cmp)

Functions สำหรับเปรียบเทียบค่า! 

---

## min

หาค่าน้อยกว่า

<RustPlayground>

```rust
use std::cmp;

fn main() {
 // ตัวเลข
 println!("min(5, 3) = {}", cmp::min(5, 3));
 println!("min(-1, 1) = {}", cmp::min(-1, 1));
 
 // Strings (ตาม lexicographic order)
 println!("min(\"apple\", \"banana\") = {}", cmp::min("apple", "banana"));
 
 // กับ char
 println!("min('a', 'z') = {}", cmp::min('a', 'z'));
}
```

</RustPlayground>

---

## max

หาค่ามากกว่า

<RustPlayground>

```rust
use std::cmp;

fn main() {
 println!("max(5, 3) = {}", cmp::max(5, 3));
 println!("max(-1, 1) = {}", cmp::max(-1, 1));
 
 // ใช้กับ Vec ผ่าน iterator
 let numbers = vec![3, 1, 4, 1, 5, 9, 2, 6];
 
 if let Some(max_val) = numbers.iter().max() {
 println!("Max in vec: {}", max_val);
 }
}
```

</RustPlayground>

---

## min_by / max_by

เปรียบเทียบด้วย custom comparator

<RustPlayground>

```rust
use std::cmp;

fn main() {
 // min_by: เปรียบเทียบ absolute value
 let a = -10;
 let b = 5;
 
 let min_abs = cmp::min_by(a, b, |x: &i32, y: &i32| {
 x.abs().cmp(&y.abs())
 });
 println!("min by abs({}, {}) = {}", a, b, min_abs); // 5 (|5| < |-10|)
 
 // max_by
 let max_abs = cmp::max_by(a, b, |x: &i32, y: &i32| {
 x.abs().cmp(&y.abs())
 });
 println!("max by abs({}, {}) = {}", a, b, max_abs); // -10
}
```

</RustPlayground>

---

## min_by_key / max_by_key

เปรียบเทียบด้วย key function

<RustPlayground>

```rust
use std::cmp;

fn main() {
 #[derive(Debug)]
 struct Person { name: String, age: u32 }
 
 let alice = Person { name: "Alice".into(), age: 30 };
 let bob = Person { name: "Bob".into(), age: 25 };
 
 // หา min โดยดูจาก age
 let younger = cmp::min_by_key(&alice, &bob, |p| p.age);
 println!("Younger: {} ({})", younger.name, younger.age);
 
 // หา max โดยดูจาก name length
 let longer_name = cmp::max_by_key(&alice, &bob, |p| p.name.len());
 println!("Longer name: {}", longer_name.name);
}
```

</RustPlayground>

---

## minmax

หาทั้ง min และ max พร้อมกัน

<RustPlayground>

```rust
use std::cmp;

fn main() {
 let (min, max) = cmp::minmax(5, 3);
 println!("minmax(5, 3) = ({}, {})", min, max);
 
 let (min2, max2) = cmp::minmax(-10, 10);
 println!("minmax(-10, 10) = ({}, {})", min2, max2);
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `min(a, b)` | ค่าน้อยกว่า | `T` |
| `max(a, b)` | ค่ามากกว่า | `T` |
| `min_by(a, b, f)` | min ด้วย comparator | `T` |
| `max_by(a, b, f)` | max ด้วย comparator | `T` |
| `min_by_key(a, b, f)` | min ด้วย key | `T` |
| `max_by_key(a, b, f)` | max ด้วย key | `T` |
| `minmax(a, b)` | ทั้ง min และ max | `(T, T)` |
| `minmax_by(a, b, f)` | minmax ด้วย comparator | `(T, T)` |

---

[← Thread](./thread) | [Index →](./index)
