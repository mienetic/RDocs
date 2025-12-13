# Comparison & Control Enums

`Ordering`, `ControlFlow`, `Bound` สำหรับเปรียบเทียบและควบคุม! 

---

## Ordering - ผลการเปรียบเทียบ

<RustPlayground>

```rust
use std::cmp::Ordering;

fn main() {
 // Ordering มี 3 variants
 let less = 1.cmp(&2);
 let equal = 2.cmp(&2);
 let greater = 3.cmp(&2);
 
 println!("1.cmp(&2) = {:?}", less);
 println!("2.cmp(&2) = {:?}", equal);
 println!("3.cmp(&2) = {:?}", greater);
 
 // Pattern matching
 let a = 5;
 let b = 10;
 match a.cmp(&b) {
 Ordering::Less => println!("{} < {}", a, b),
 Ordering::Equal => println!("{} == {}", a, b),
 Ordering::Greater => println!("{} > {}", a, b),
 }
 
 // ใช้กับ sort
 let mut numbers = vec![3, 1, 4, 1, 5, 9, 2, 6];
 numbers.sort_by(|a, b| a.cmp(b));
 println!("sorted: {:?}", numbers);
 
 // reverse sort
 numbers.sort_by(|a, b| b.cmp(a));
 println!("reversed: {:?}", numbers);
}
```

</RustPlayground>

---

## Ordering Methods

<RustPlayground>

```rust
use std::cmp::Ordering;

fn main() {
 let ord = Ordering::Less;
 
 // is_* methods
 println!("is_lt: {}", ord.is_lt());
 println!("is_eq: {}", ord.is_eq());
 println!("is_gt: {}", ord.is_gt());
 println!("is_le: {}", ord.is_le());
 println!("is_ge: {}", ord.is_ge());
 
 // reverse
 let reversed = ord.reverse();
 println!("Less.reverse() = {:?}", reversed);
 
 // then - chain comparisons
 let people = vec![
 ("Alice", 30),
 ("Bob", 25),
 ("Alice", 25),
 ];
 
 let mut sorted = people.clone();
 sorted.sort_by(|a, b| {
 a.0.cmp(b.0).then(a.1.cmp(&b.1))
 });
 println!("sorted by name then age: {:?}", sorted);
}
```

</RustPlayground>

---

## ControlFlow - ควบคุม Loop

<RustPlayground>

```rust
use std::ops::ControlFlow;

fn find_first_even(numbers: &[i32]) -> Option<i32> {
 let result = numbers.iter().try_for_each(|&n| {
 if n % 2 == 0 {
 ControlFlow::Break(n)
 } else {
 ControlFlow::Continue(())
 }
 });
 
 match result {
 ControlFlow::Break(n) => Some(n),
 ControlFlow::Continue(()) => None,
 }
}

fn main() {
 let nums = vec![1, 3, 5, 4, 7, 8];
 
 match find_first_even(&nums) {
 Some(n) => println!("First even: {}", n),
 None => println!("No even number"),
 }
 
 // ControlFlow variants
 let cont: ControlFlow<i32, ()> = ControlFlow::Continue(());
 let brk: ControlFlow<i32, ()> = ControlFlow::Break(42);
 
 println!("continue: {:?}", cont);
 println!("break: {:?}", brk);
}
```

</RustPlayground>

---

## Bound - Range Boundaries

<RustPlayground>

```rust
use std::ops::Bound;

fn main() {
 // Bound variants
 let included: Bound<i32> = Bound::Included(5);
 let excluded: Bound<i32> = Bound::Excluded(10);
 let unbounded: Bound<i32> = Bound::Unbounded;
 
 println!("Included(5): {:?}", included);
 println!("Excluded(10): {:?}", excluded);
 println!("Unbounded: {:?}", unbounded);
 
 // ใช้กับ range_bounds
 use std::ops::RangeBounds;
 
 fn describe_range<R: RangeBounds<i32>>(range: R) {
 println!("start: {:?}, end: {:?}", 
 range.start_bound(), 
 range.end_bound());
 }
 
 describe_range(1..5); // Included(1), Excluded(5)
 describe_range(1..=5); // Included(1), Included(5)
 describe_range(..5); // Unbounded, Excluded(5)
 describe_range(1..); // Included(1), Unbounded
}
```

</RustPlayground>

---

## Quick Reference

### Ordering
| Variant | คำอธิบาย |
|---------|---------|
| `Less` | น้อยกว่า |
| `Equal` | เท่ากัน |
| `Greater` | มากกว่า |

### ControlFlow
| Variant | คำอธิบาย |
|---------|---------|
| `Continue(C)` | ทำต่อ |
| `Break(B)` | หยุด |

### Bound
| Variant | คำอธิบาย |
|---------|---------|
| `Included(T)` | รวม T |
| `Excluded(T)` | ไม่รวม T |
| `Unbounded` | ไม่จำกัด |

---

[← Core](./core) | [Collections →](./collections)
