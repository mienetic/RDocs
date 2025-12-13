# slice - มุมมองเข้า Array

`[T]` คือ slice - view เข้าไปใน contiguous sequence! 

---

## slice คืออะไร?

Slice คือ "มุมมอง" เข้าไปใน array หรือ Vec:
- **Unsized type** - ใช้ผ่าน reference เท่านั้น (`&[T]`, `&mut [T]`)
- **ไม่เป็นเจ้าของ** - แค่ยืมดู
- **Fat pointer** - เก็บ (ptr, len)

---

## 1. การสร้าง Slice

<RustPlayground>

```rust
fn main() {
 let arr = [1, 2, 3, 4, 5];
 
 // Slice จาก array
 let slice: &[i32] = &arr[1..4]; // [2, 3, 4]
 println!("slice: {:?}", slice);
 
 // Whole array as slice
 let all: &[i32] = &arr[..];
 println!("all: {:?}", all);
 
 // Mutable slice
 let mut arr2 = [1, 2, 3, 4, 5];
 let mutable_slice: &mut [i32] = &mut arr2[..];
 mutable_slice[0] = 100;
 println!("modified: {:?}", arr2);
}
```

</RustPlayground>

---

## 2. Slice Ranges

<RustPlayground>

```rust
fn main() {
 let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
 
 // Different range types
 let a = &arr[2..5]; // [2, 3, 4]
 let b = &arr[..3]; // [0, 1, 2]
 let c = &arr[7..]; // [7, 8, 9]
 let d = &arr[..]; // all
 let e = &arr[2..=5]; // [2, 3, 4, 5] (inclusive)
 
 println!("[2..5]: {:?}", a);
 println!("[..3]: {:?}", b);
 println!("[7..]: {:?}", c);
 println!("[..]: {:?}", d);
 println!("[2..=5]: {:?}", e);
}
```

</RustPlayground>

---

## 3. Slice Methods

<RustPlayground>

```rust
fn main() {
 let arr = [3, 1, 4, 1, 5, 9, 2, 6];
 let slice: &[i32] = &arr;
 
 // Basic info
 println!("len = {}", slice.len());
 println!("is_empty = {}", slice.is_empty());
 
 // Access
 println!("first = {:?}", slice.first());
 println!("last = {:?}", slice.last());
 println!("get(2) = {:?}", slice.get(2));
 
 // Search
 println!("contains(&5) = {}", slice.contains(&5));
 
 // Iterator
 let sum: i32 = slice.iter().sum();
 println!("sum = {}", sum);
}
```

</RustPlayground>

---

## 4. Splitting Slices

<RustPlayground>

```rust
fn main() {
 let arr = [1, 2, 3, 4, 5, 6];
 
 // split_at
 let (left, right) = arr.split_at(3);
 println!("split_at(3):");
 println!(" left: {:?}", left);
 println!(" right: {:?}", right);
 
 // split_first / split_last
 if let Some((first, rest)) = arr.split_first() {
 println!("first: {}, rest: {:?}", first, rest);
 }
 
 // chunks
 println!("chunks(2):");
 for chunk in arr.chunks(2) {
 println!(" {:?}", chunk);
 }
 
 // windows (overlapping)
 println!("windows(3):");
 for window in arr.windows(3) {
 println!(" {:?}", window);
 }
}
```

</RustPlayground>

---

## 5. Mutable Slice Operations

<RustPlayground>

```rust
fn main() {
 let mut arr = [3, 1, 4, 1, 5, 9, 2, 6];
 let slice: &mut [i32] = &mut arr;
 
 // sort
 slice.sort();
 println!("sorted: {:?}", slice);
 
 // reverse
 slice.reverse();
 println!("reversed: {:?}", slice);
 
 // fill
 let mut zeros = [0; 5];
 zeros.fill(42);
 println!("filled: {:?}", zeros);
 
 // swap
 let mut nums = [1, 2, 3, 4, 5];
 nums.swap(0, 4);
 println!("swapped: {:?}", nums);
 
 // rotate
 let mut rot = [1, 2, 3, 4, 5];
 rot.rotate_left(2);
 println!("rotate_left(2): {:?}", rot);
}
```

</RustPlayground>

---

## 6. Binary Search

<RustPlayground>

```rust
fn main() {
 let arr = [1, 2, 3, 5, 8, 13, 21, 34];
 
 // binary_search (ต้อง sorted!)
 match arr.binary_search(&13) {
 Ok(index) => println!("13 found at index {}", index),
 Err(index) => println!("13 would be at index {}", index),
 }
 
 match arr.binary_search(&10) {
 Ok(index) => println!("10 found at index {}", index),
 Err(index) => println!("10 not found, would be at index {}", index),
 }
}
```

</RustPlayground>

---

## 7. Slice from Vec

<RustPlayground>

```rust
fn main() {
 let vec = vec![1, 2, 3, 4, 5];
 
 // Vec -> &[T]
 let slice: &[i32] = &vec;
 println!("from vec: {:?}", slice);
 
 // Partial slice
 let partial = &vec[1..4];
 println!("partial: {:?}", partial);
 
 // Function ที่รับ slice
 fn sum_slice(s: &[i32]) -> i32 {
 s.iter().sum()
 }
 
 println!("sum of vec: {}", sum_slice(&vec));
 println!("sum of [1..4]: {}", sum_slice(&vec[1..4]));
}
```

</RustPlayground>

---

## 8. Copy & Clone

<RustPlayground>

```rust
fn main() {
 let src = [1, 2, 3, 4, 5];
 let mut dst = [0; 5];
 
 // copy_from_slice (same length required)
 dst.copy_from_slice(&src);
 println!("copied: {:?}", dst);
 
 // clone_from_slice
 let mut dst2 = [0; 3];
 dst2.clone_from_slice(&src[0..3]);
 println!("cloned partial: {:?}", dst2);
 
 // to_vec - convert to Vec
 let vec: Vec<i32> = src.to_vec();
 println!("to_vec: {:?}", vec);
}
```

</RustPlayground>

---

## Quick Reference

### Range Syntax
| Syntax | คำอธิบาย |
|--------|---------|
| `&arr[a..b]` | a ถึง b-1 |
| `&arr[a..]` | a ถึงสุด |
| `&arr[..b]` | ต้นถึง b-1 |
| `&arr[..]` | ทั้งหมด |
| `&arr[a..=b]` | a ถึง b (inclusive) |

### Methods
| Method | คำอธิบาย |
|--------|---------|
| `len()` | ความยาว |
| `first()` / `last()` | ตัวแรก/สุดท้าย |
| `get(i)` | Safe access |
| `contains(&val)` | มีค่าไหม |
| `split_at(mid)` | แบ่งครึ่ง |
| `chunks(n)` | แบ่งเป็นกลุ่ม |
| `windows(n)` | Sliding window |

### Mutable Methods
| Method | คำอธิบาย |
|--------|---------|
| `sort()` | เรียงลำดับ |
| `reverse()` | กลับด้าน |
| `fill(val)` | เติมค่า |
| `swap(i, j)` | สลับ |
| `rotate_left(n)` | หมุน |

---

[← array](./array) | [tuple →](./tuple)
