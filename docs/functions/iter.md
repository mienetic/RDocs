# Iterator Functions (std::iter)

Functions สำหรับสร้างและจัดการ Iterators! 

---

## once

สร้าง Iterator ที่ให้ค่าเพียง 1 ครั้ง

<RustPlayground>

```rust
use std::iter;

fn main() {
 let mut one = iter::once(42);
 
 println!("{:?}", one.next()); // Some(42)
 println!("{:?}", one.next()); // None
 
 // ใช้ chain กับ iterators อื่น
 let combined: Vec<i32> = iter::once(0)
 .chain(1..5)
 .collect();
 
 println!("Combined: {:?}", combined); // [0, 1, 2, 3, 4]
}
```

</RustPlayground>

---

## empty

สร้าง Iterator ที่ว่างเปล่า

<RustPlayground>

```rust
use std::iter;

fn main() {
 let empty: iter::Empty<i32> = iter::empty();
 
 let items: Vec<i32> = empty.collect();
 println!("Empty: {:?}", items); // []
 
 // ใช้เป็น fallback
 fn maybe_items(condition: bool) -> impl Iterator<Item = i32> {
 if condition {
 Box::new(1..5) as Box<dyn Iterator<Item = i32>>
 } else {
 Box::new(iter::empty())
 }
 }
 
 let result: Vec<i32> = maybe_items(false).collect();
 println!("Result: {:?}", result);
}
```

</RustPlayground>

---

## repeat

สร้าง Iterator ที่ให้ค่าเดิมซ้ำๆ ไม่จบ

<RustPlayground>

```rust
use std::iter;

fn main() {
 // repeat ให้ค่าเดิมไม่จบ
 let mut fives = iter::repeat(5);
 
 println!("{}", fives.next().unwrap()); // 5
 println!("{}", fives.next().unwrap()); // 5
 println!("{}", fives.next().unwrap()); // 5
 
 // ใช้กับ take เพื่อจำกัดจำนวน
 let vec: Vec<i32> = iter::repeat(0).take(5).collect();
 println!("Repeated: {:?}", vec); // [0, 0, 0, 0, 0]
 
 // repeat_with ใช้ closure
 let mut counter = 0;
 let increments: Vec<i32> = iter::repeat_with(|| {
 counter += 1;
 counter
 }).take(5).collect();
 
 println!("Increments: {:?}", increments); // [1, 2, 3, 4, 5]
}
```

</RustPlayground>

---

## from_fn

สร้าง Iterator จาก closure

<RustPlayground>

```rust
use std::iter;

fn main() {
 let mut count = 0;
 
 let counter = iter::from_fn(|| {
 count += 1;
 if count <= 5 {
 Some(count)
 } else {
 None // หยุด iterator
 }
 });
 
 let vec: Vec<i32> = counter.collect();
 println!("From fn: {:?}", vec); // [1, 2, 3, 4, 5]
 
 // Fibonacci
 let mut a = 0;
 let mut b = 1;
 let fib: Vec<u64> = iter::from_fn(move || {
 let current = a;
 a = b;
 b = current + b;
 Some(current)
 }).take(10).collect();
 
 println!("Fibonacci: {:?}", fib);
}
```

</RustPlayground>

---

## successors

สร้าง Iterator จาก initial value และ successor function

<RustPlayground>

```rust
use std::iter;

fn main() {
 // successors: เริ่มจากค่า แล้ว apply function
 let powers: Vec<u32> = iter::successors(Some(1), |n| {
 n.checked_mul(2) // คูณ 2 จนกว่าจะ overflow
 }).take(10).collect();
 
 println!("Powers of 2: {:?}", powers);
 
 // Countdown
 let countdown: Vec<i32> = iter::successors(Some(10), |n| {
 if *n > 0 { Some(n - 1) } else { None }
 }).collect();
 
 println!("Countdown: {:?}", countdown);
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `once(value)` | 1 ค่าแล้วจบ | `Once<T>` |
| `empty()` | Iterator ว่าง | `Empty<T>` |
| `repeat(value)` | ค่าเดิมซ้ำๆ | `Repeat<T>` |
| `repeat_with(f)` | closure ซ้ำๆ | `RepeatWith<F>` |
| `from_fn(f)` | จาก closure | `FromFn<F>` |
| `successors(init, f)` | initial + function | `Successors<T, F>` |
| `zip(a, b)` | รวม 2 iterators | `Zip<A, B>` |

---

[← Pointer](./ptr) | [Panic →](./panic)
