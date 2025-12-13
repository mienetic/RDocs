# Range Structs - ช่วง

`Range`, `RangeInclusive`, `RangeFull` สำหรับช่วงตัวเลข! 

---

## Range - ช่วงเปิด (a..b)

<RustPlayground>

```rust
use std::ops::Range;

fn main() {
 // สร้าง Range
 let range: Range<i32> = 1..5; // 1, 2, 3, 4 (ไม่รวม 5)
 
 println!("range = {:?}", range);
 println!("start = {}", range.start);
 println!("end = {}", range.end);
 
 // ใช้ใน for loop
 for i in 1..5 {
 print!("{} ", i);
 }
 println!();
 
 // ใช้กับ slice
 let arr = [10, 20, 30, 40, 50];
 println!("arr[1..4] = {:?}", &arr[1..4]);
 
 // methods
 let r = 0..10;
 println!("contains 5: {}", r.contains(&5));
 println!("is_empty: {}", (5..5).is_empty());
}
```

</RustPlayground>

---

## RangeInclusive - ช่วงปิด (a..=b)

<RustPlayground>

```rust
use std::ops::RangeInclusive;

fn main() {
 // รวมตัวท้ายด้วย
 let range: RangeInclusive<i32> = 1..=5; // 1, 2, 3, 4, 5
 
 println!("range = {:?}", range);
 println!("start = {}", range.start());
 println!("end = {}", range.end());
 
 // for loop
 for i in 1..=5 {
 print!("{} ", i);
 }
 println!();
 
 // slice
 let arr = [10, 20, 30, 40, 50];
 println!("arr[1..=3] = {:?}", &arr[1..=3]);
 
 // ใช้กับ char
 for c in 'a'..='e' {
 print!("{} ", c);
 }
 println!();
}
```

</RustPlayground>

---

## Other Range Types

<RustPlayground>

```rust
fn main() {
 let arr = [1, 2, 3, 4, 5];
 
 // RangeFrom (a..)
 println!("arr[2..] = {:?}", &arr[2..]);
 
 // RangeTo (..b)
 println!("arr[..3] = {:?}", &arr[..3]);
 
 // RangeToInclusive (..=b)
 println!("arr[..=3] = {:?}", &arr[..=3]);
 
 // RangeFull (..)
 println!("arr[..] = {:?}", &arr[..]);
 
 // Bounds
 use std::ops::Bound;
 let range = (Bound::Included(1), Bound::Excluded(5));
 println!("bounds = {:?}", range);
}
```

</RustPlayground>

---

## Quick Reference

| Type | Syntax | ตัวอย่าง | รวมท้าย |
|------|--------|---------|--------|
| `Range` | `a..b` | `1..5` | |
| `RangeInclusive` | `a..=b` | `1..=5` | |
| `RangeFrom` | `a..` | `1..` | - |
| `RangeTo` | `..b` | `..5` | |
| `RangeToInclusive` | `..=b` | `..=5` | |
| `RangeFull` | `..` | `..` | - |

### Common Uses
```rust
// For loop
for i in 0..10 { }

// Slice
&arr[1..4]

// Match
match x {
 0..=9 => "digit",
 _ => "other"
}
```

---

[← Thread](./thread) | [Channel →](./channel)
