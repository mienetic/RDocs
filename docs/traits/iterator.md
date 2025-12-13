# Iterator Traits

`Iterator`, `IntoIterator`, `FromIterator` สำหรับ loop และ collect! 

---

## Iterator Trait

<RustPlayground>

```rust
fn main() {
 let v = vec![1, 2, 3, 4, 5];
 
 // Iterator methods
 let sum: i32 = v.iter().sum();
 println!("Sum: {}", sum);
 
 let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect();
 println!("Doubled: {:?}", doubled);
 
 let evens: Vec<&i32> = v.iter().filter(|x| *x % 2 == 0).collect();
 println!("Evens: {:?}", evens);
 
 // Chaining
 let result: i32 = v.iter()
 .filter(|x| *x % 2 == 1)
 .map(|x| x * x)
 .sum();
 println!("Sum of odd squares: {}", result);
}
```

::: best-practice
**ใช้ Iterator Chain ดีกว่า Loop**
Iterator ใน Rust เป็น **Lazy Evaluation** (ไม่ทำงานจนกว่าจะสั่ง collect/sum) ทำให้ Compiler optimize ได้ดีเยี่ยม บางครั้งเร็วกว่าเขียน for loop เองด้วยซ้ำ!
:::

</RustPlayground>

---

## Custom Iterator

<RustPlayground>

```rust
struct Counter {
 current: u32,
 max: u32,
}

impl Counter {
 fn new(max: u32) -> Counter {
 Counter { current: 0, max }
 }
}

impl Iterator for Counter {
 type Item = u32;
 
 fn next(&mut self) -> Option<Self::Item> {
 if self.current < self.max {
 self.current += 1;
 Some(self.current)
 } else {
 None
 }
 }
}

fn main() {
 let counter = Counter::new(5);
 
 for i in counter {
 println!("{}", i);
 }
 
 // Iterator methods work!
 let sum: u32 = Counter::new(10).sum();
 println!("\nSum 1-10: {}", sum);
}
```

</RustPlayground>

---

## IntoIterator

<RustPlayground>

```rust
fn main() {
 let v = vec![1, 2, 3];
 
 // for loop ใช้ IntoIterator
 for x in &v {
 println!("ref: {}", x);
 }
 
 // Different iterator types
 println!("\n.iter() - borrows:");
 for x in v.iter() { println!(" {}", x); }
 
 println!("\n.iter_mut() - mutable:");
 let mut v2 = vec![1, 2, 3];
 for x in v2.iter_mut() { *x *= 2; }
 println!(" {:?}", v2);
 
 println!("\n.into_iter() - consumes:");
 for x in v.into_iter() { println!(" {}", x); }
 // v is moved, can't use anymore
}
```

</RustPlayground>

---

## FromIterator

<RustPlayground>

```rust
fn main() {
 // collect() ใช้ FromIterator
 let v: Vec<i32> = (1..=5).collect();
 println!("Vec: {:?}", v);
 
 let s: String = ['H', 'e', 'l', 'l', 'o'].iter().collect();
 println!("String: {}", s);
 
 // HashMap from tuples
 use std::collections::HashMap;
 let pairs = vec![("a", 1), ("b", 2), ("c", 3)];
 let map: HashMap<_, _> = pairs.into_iter().collect();
 println!("HashMap: {:?}", map);
 
 // Result<Vec<_>, E>
 let results: Vec<Result<i32, &str>> = vec![Ok(1), Ok(2), Ok(3)];
 let collected: Result<Vec<i32>, &str> = results.into_iter().collect();
 println!("Collected Results: {:?}", collected);
}
```

::: pitfall
**Collect ต้องระบุ Type เสมอ!**
ถ้าเขียนแค่ `.collect()` เฉยๆ Rust จะงงว่าอยากได้ `Vec`, `HashMap`, หรือ `String`?
ต้องระบุ type เช่น `let v: Vec<_> = ...` หรือใช้ turbofish syntax `.collect::<Vec<_>>()`
:::

</RustPlayground>

---

## Quick Reference

### Iterator Traits
| Trait | คำอธิบาย |
|-------|---------|
| `Iterator` | `.next()` returns Option |
| `IntoIterator` | แปลงเป็น iterator (for loop) |
| `FromIterator` | `.collect()` สร้างจาก iterator |
| `ExactSizeIterator` | รู้ขนาดแน่นอน |
| `DoubleEndedIterator` | iterate จากท้าย |

### Common Iterator Methods
| Method | คำอธิบาย |
|--------|---------|
| `map(f)` | transform items |
| `filter(p)` | keep matching items |
| `fold(init, f)` | reduce to single value |
| `collect()` | สร้าง collection |
| `take(n)` | first n items |
| `skip(n)` | skip first n |
| `chain(iter)` | รวม iterators |
| `zip(iter)` | pair items |

---

[← Conversion](./conversion) | [Display →](./display)
