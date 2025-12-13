# Ops Types (std::ops)

Types สำหรับ Operations และ Operators! 

---

## Bound

กำหนดขอบเขตของ Range

<RustPlayground>

```rust
use std::ops::Bound;

fn main() {
 // Bound แสดงขอบเขต
 let start: Bound<i32> = Bound::Included(0);
 let end: Bound<i32> = Bound::Excluded(10);
 
 // ใช้กับ range_bounds()
 let range = (Bound::Included(1), Bound::Excluded(5));
 
 match range.0 {
 Bound::Included(x) => println!("Start >= {}", x),
 Bound::Excluded(x) => println!("Start > {}", x),
 Bound::Unbounded => println!("No start bound"),
 }
 
 // ตัวอย่าง: ใช้กับ slice
 let arr = [1, 2, 3, 4, 5];
 println!("{:?}", &arr[1..4]); // [2, 3, 4]
}
```

</RustPlayground>

---

## ControlFlow

Control flow สำหรับ loops และ iterators

<RustPlayground>

```rust
use std::ops::ControlFlow;

fn find_first_even(numbers: &[i32]) -> Option<i32> {
 for &num in numbers {
 match process(num) {
 ControlFlow::Break(found) => return Some(found),
 ControlFlow::Continue(()) => continue,
 }
 }
 None
}

fn process(n: i32) -> ControlFlow<i32, ()> {
 if n % 2 == 0 {
 ControlFlow::Break(n) // หยุดและ return ค่า
 } else {
 ControlFlow::Continue(()) // ทำต่อ
 }
}

fn main() {
 let nums = [1, 3, 5, 6, 7, 8];
 match find_first_even(&nums) {
 Some(n) => println!("First even: {}", n),
 None => println!("No even numbers"),
 }
}
```

</RustPlayground>

---

## ControlFlow กับ try_for_each

<RustPlayground>

```rust
use std::ops::ControlFlow;

fn main() {
 let numbers = [1, 2, 3, 4, 5];
 
 // try_for_each ใช้ ControlFlow
 let result = numbers.iter().try_for_each(|&x| {
 if x > 3 {
 ControlFlow::Break(x) // หยุด
 } else {
 println!("Processing: {}", x);
 ControlFlow::Continue(()) // ต่อ
 }
 });
 
 match result {
 ControlFlow::Break(n) => println!("Stopped at: {}", n),
 ControlFlow::Continue(()) => println!("Completed all"),
 }
}
```

</RustPlayground>

---

## RangeBounds Trait

<RustPlayground>

```rust
use std::ops::{Bound, RangeBounds};

fn print_bounds<R: RangeBounds<i32>>(range: &R) {
 println!("Start: {:?}", range.start_bound());
 println!("End: {:?}", range.end_bound());
}

fn main() {
 print_bounds(&(1..5)); // Included(1) to Excluded(5)
 println!("---");
 print_bounds(&(1..=5)); // Included(1) to Included(5)
 println!("---");
 print_bounds(&(..5)); // Unbounded to Excluded(5)
 println!("---");
 print_bounds(&(3..)); // Included(3) to Unbounded
}
```

</RustPlayground>

---

## Quick Reference

| Type | คำอธิบาย |
|------|---------|
| `Bound::Included(x)` | รวม x |
| `Bound::Excluded(x)` | ไม่รวม x |
| `Bound::Unbounded` | ไม่จำกัด |
| `ControlFlow::Continue(c)` | ทำต่อ |
| `ControlFlow::Break(b)` | หยุด |

---

[← Range](/structs/range) | [Lazy →](/structs/lazy)
