# array - อาเรย์ขนาดคงที่

`[T; N]` คืออาเรย์ที่รู้ขนาดตอน compile! 

---

## array คืออะไร?

Array คือ collection ขนาดคงที่:
- **ขนาดอยู่ใน type**: `[i32; 5]` ≠ `[i32; 3]`
- **อยู่บน stack** (ถ้าไม่ Box)
- **รู้ขนาดตอน compile**

---

## 1. การประกาศ

<RustPlayground>

```rust
fn main() {
 // ประกาศพร้อมค่าเริ่มต้น
 let arr = [1, 2, 3, 4, 5];
 println!("arr = {:?}", arr);
 
 // ระบุ type และขนาด
 let explicit: [i32; 5] = [1, 2, 3, 4, 5];
 println!("explicit = {:?}", explicit);
 
 // สร้างจากค่าซ้ำ
 let zeros = [0; 10]; // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
 println!("zeros = {:?}", zeros);
 
 let hello = ['a'; 5]; // ['a', 'a', 'a', 'a', 'a']
 println!("hello = {:?}", hello);
}
```

</RustPlayground>

---

## 2. Accessing Elements

<RustPlayground>

```rust
fn main() {
 let arr = [10, 20, 30, 40, 50];
 
 // Index (จาก 0)
 println!("arr[0] = {}", arr[0]);
 println!("arr[4] = {}", arr[4]);
 
 // Index out of bounds = panic!
 // println!("{}", arr[10]); // panic!
 
 // Safe access with get()
 match arr.get(2) {
 Some(val) => println!("arr[2] = {}", val),
 None => println!("index out of bounds"),
 }
 
 match arr.get(10) {
 Some(val) => println!("arr[10] = {}", val),
 None => println!("index 10 out of bounds"),
 }
}
```

</RustPlayground>

---

## 3. Mutating Arrays

<RustPlayground>

```rust
fn main() {
 let mut arr = [1, 2, 3, 4, 5];
 println!("before: {:?}", arr);
 
 // เปลี่ยนค่า
 arr[0] = 100;
 arr[4] = 500;
 println!("after: {:?}", arr);
 
 // เปลี่ยนทั้งหมด
 for elem in &mut arr {
 *elem *= 2;
 }
 println!("doubled: {:?}", arr);
}
```

</RustPlayground>

---

## 4. Iteration

<RustPlayground>

```rust
fn main() {
 let arr = [10, 20, 30, 40, 50];
 
 // วนด้วย for
 println!("values:");
 for val in arr {
 print!("{} ", val);
 }
 println!();
 
 // วนด้วย index
 println!("with index:");
 for (i, val) in arr.iter().enumerate() {
 println!(" arr[{}] = {}", i, val);
 }
 
 // วนด้วย reference
 println!("with references:");
 for val in &arr {
 print!("{} ", val);
 }
 println!();
}
```

</RustPlayground>

---

## 5. Array Methods

<RustPlayground>

```rust
fn main() {
 let arr = [3, 1, 4, 1, 5, 9, 2, 6];
 
 // len
 println!("len = {}", arr.len());
 
 // is_empty
 println!("is_empty = {}", arr.is_empty());
 
 // contains
 println!("contains 5: {}", arr.contains(&5));
 
 // first / last
 println!("first = {:?}", arr.first());
 println!("last = {:?}", arr.last());
 
 // iter methods
 let sum: i32 = arr.iter().sum();
 let max = arr.iter().max();
 let min = arr.iter().min();
 println!("sum = {}", sum);
 println!("max = {:?}", max);
 println!("min = {:?}", min);
}
```

</RustPlayground>

---

## 6. Sorting

<RustPlayground>

```rust
fn main() {
 let mut arr = [3, 1, 4, 1, 5, 9, 2, 6];
 println!("before: {:?}", arr);
 
 // sort in place
 arr.sort();
 println!("sorted: {:?}", arr);
 
 // reverse
 arr.reverse();
 println!("reversed: {:?}", arr);
 
 // sort by custom
 let mut words = ["banana", "apple", "cherry"];
 words.sort_by(|a, b| a.len().cmp(&b.len()));
 println!("by length: {:?}", words);
}
```

</RustPlayground>

---

## 7. Slicing

<RustPlayground>

```rust
fn main() {
 let arr = [1, 2, 3, 4, 5];
 
 // Slice (&[T]) จาก array
 let slice: &[i32] = &arr[1..4];
 println!("slice [1..4]: {:?}", slice);
 
 let all: &[i32] = &arr[..];
 println!("all: {:?}", all);
 
 let first_three: &[i32] = &arr[..3];
 println!("first 3: {:?}", first_three);
 
 let last_two: &[i32] = &arr[3..];
 println!("last 2: {:?}", last_two);
}
```

</RustPlayground>

---

## 8. Multi-dimensional Arrays

<RustPlayground>

```rust
fn main() {
 // 2D array (3x4)
 let matrix: [[i32; 4]; 3] = [
 [1, 2, 3, 4],
 [5, 6, 7, 8],
 [9, 10, 11, 12],
 ];
 
 println!("matrix:");
 for row in &matrix {
 println!(" {:?}", row);
 }
 
 // Access element
 println!("matrix[1][2] = {}", matrix[1][2]); // 7
 
 // Flatten
 for row in &matrix {
 for val in row {
 print!("{:3} ", val);
 }
 println!();
 }
}
```

</RustPlayground>

---

## Quick Reference

### Creation
| Syntax | คำอธิบาย |
|--------|---------|
| `[1, 2, 3]` | จากค่า |
| `[0; 10]` | ค่าซ้ำ 10 ตัว |
| `[T; N]` | Type annotation |

### Access
| Method | คำอธิบาย |
|--------|---------|
| `arr[i]` | Index (panic ถ้าเกิน) |
| `arr.get(i)` | Safe access → Option |
| `arr.first()` | ตัวแรก → Option |
| `arr.last()` | ตัวสุดท้าย → Option |

### Iteration
| Method | คำอธิบาย |
|--------|---------|
| `for x in arr` | By value |
| `for x in &arr` | By reference |
| `for x in &mut arr` | Mutable ref |
| `arr.iter()` | Iterator |

### Modification
| Method | คำอธิบาย |
|--------|---------|
| `arr.sort()` | เรียงลำดับ |
| `arr.reverse()` | กลับด้าน |
| `arr.fill(val)` | เติมค่าเดียว |

---

[← bool & unit](./bool-unit) | [slice →](./slice)
