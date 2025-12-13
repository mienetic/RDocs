# Vec - Dynamic Array

**Vec** (เวกเตอร์) คืออาเรย์ที่ขยายขนาดได้ เป็น type ที่ใช้บ่อยที่สุดใน Rust! 

---

## Vec คืออะไร?

`Vec<T>` คือโครงสร้างข้อมูลแบบ **dynamic array** ที่:
- เก็บข้อมูลชนิดเดียวกัน (`T`) เรียงต่อกันในหน่วยความจำ
- ขยายขนาดอัตโนมัติเมื่อเพิ่มข้อมูล
- เข้าถึงด้วย index ได้รวดเร็ว O(1)
- เป็นเจ้าของข้อมูล (owns its data)

:::tip เมื่อไหร่ใช้ Vec?
ใช้ Vec เมื่อต้องการเก็บข้อมูลหลายชิ้นที่ไม่รู้จำนวนล่วงหน้า หรือต้องเพิ่ม/ลบข้อมูลได้
:::

---

## 1. สร้าง Vec

<RustPlayground>

```rust
fn main() {
 // วิธีที่ 1: ใช้ macro vec![] (นิยมที่สุด!)
 let numbers = vec![1, 2, 3, 4, 5];
 println!("numbers: {:?}", numbers);
 
 // วิธีที่ 2: สร้างว่างแล้วค่อยเพิ่ม
 let mut fruits: Vec<String> = Vec::new();
 fruits.push("Apple".to_string());
 fruits.push("Banana".to_string());
 println!("fruits: {:?}", fruits);
 
 // วิธีที่ 3: สร้างพร้อมกำหนด capacity (เร็วกว่าถ้ารู้ขนาดล่วงหน้า)
 let mut big_vec: Vec<i32> = Vec::with_capacity(1000);
 println!("capacity: {}, length: {}", big_vec.capacity(), big_vec.len());
 
 // วิธีที่ 4: สร้างซ้ำค่าเดิม
 let zeros = vec![0; 10]; // สร้าง 10 ศูนย์
 println!("zeros: {:?}", zeros);
}
```

</RustPlayground>

---

## 2. เพิ่มและลบข้อมูล

<RustPlayground>

```rust
fn main() {
 let mut v = vec![1, 2, 3];
 println!("เริ่มต้น: {:?}", v);
 
 // push - เพิ่มท้าย
 v.push(4);
 v.push(5);
 println!("หลัง push: {:?}", v);
 
 // pop - ลบท้าย (return Option)
 let last = v.pop(); // ได้ Some(5)
 println!("pop ได้: {:?}, เหลือ: {:?}", last, v);
 
 // insert - แทรกตำแหน่งที่ต้องการ
 v.insert(0, 0); // แทรกที่ต้น
 println!("หลัง insert(0, 0): {:?}", v);
 
 // remove - ลบตำแหน่งที่ต้องการ
 let removed = v.remove(2); // ลบ index 2
 println!("remove(2) ได้: {}, เหลือ: {:?}", removed, v);
 
 // clear - ลบทั้งหมด
 v.clear();
 println!("หลัง clear: {:?}, len: {}", v, v.len());
}
```

</RustPlayground>

---

## 3. เข้าถึงข้อมูล

<RustPlayground>

```rust
fn main() {
 let v = vec![10, 20, 30, 40, 50];
 
 // วิธีที่ 1: ใช้ index (panic ถ้าเกิน!)
 let second = v[1];
 println!("v[1] = {}", second);
 
 // วิธีที่ 2: ใช้ get() (ปลอดภัยกว่า - return Option)
 match v.get(10) {
 Some(val) => println!("v[10] = {}", val),
 None => println!("v[10] ไม่มี! (index เกิน)"),
 }
 
 // ตัวแรกและตัวสุดท้าย
 println!("ตัวแรก: {:?}", v.first()); // Some(&10)
 println!("ตัวสุดท้าย: {:?}", v.last()); // Some(&50)
 
 // ตรวจว่าว่างไหม
 println!("ว่างไหม: {}", v.is_empty());
 println!("มีกี่ตัว: {}", v.len());
}
```

</RustPlayground>

---

## 4. วนซ้ำ (Iteration)

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // วิธีที่ 1: for loop (ยืมค่า)
 println!("=== ยืมค่า ===");
 for n in &numbers {
 print!("{} ", n); // numbers ยังใช้ได้หลัง loop
 }
 println!();
 
 // วิธีที่ 2: for loop (ยืมแบบแก้ไขได้)
 let mut nums = vec![1, 2, 3];
 println!("=== แก้ไขค่า ===");
 for n in &mut nums {
 *n *= 2; // คูณ 2 ทุกตัว
 }
 println!("{:?}", nums); // [2, 4, 6]
 
 // วิธีที่ 3: iter() กับ method chaining
 let sum: i32 = numbers.iter().sum();
 println!("ผลรวม: {}", sum);
 
 // วิธีที่ 4: enumerate (ได้ index ด้วย)
 println!("=== พร้อม index ===");
 for (i, n) in numbers.iter().enumerate() {
 println!("index {}: {}", i, n);
 }
}
```

</RustPlayground>

---

## 5. แปลงข้อมูล (Map, Filter, Collect)

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // map - แปลงทุกตัว
 let doubled: Vec<i32> = numbers
 .iter()
 .map(|n| n * 2) // คูณ 2 ทุกตัว
 .collect();
 println!("doubled: {:?}", doubled);
 
 // filter - เลือกเฉพาะที่ต้องการ
 let evens: Vec<i32> = numbers
 .iter()
 .filter(|n| *n % 2 == 0) // เฉพาะเลขคู่
 .cloned()
 .collect();
 println!("evens: {:?}", evens);
 
 // map + filter รวมกัน
 let result: Vec<i32> = numbers
 .iter()
 .filter(|n| **n > 2) // เลือกที่มากกว่า 2
 .map(|n| n * 10) // คูณ 10
 .collect();
 println!("result: {:?}", result); // [30, 40, 50]
 
 // filter_map - แปลงและกรองพร้อมกัน
 let strings = vec!["1", "two", "3", "four", "5"];
 let nums: Vec<i32> = strings
 .iter()
 .filter_map(|s| s.parse().ok()) // แปลงเป็น i32 ถ้าทำได้
 .collect();
 println!("parsed nums: {:?}", nums); // [1, 3, 5]
}
```

</RustPlayground>

---

## 6. ค้นหาข้อมูล

<RustPlayground>

```rust
fn main() {
 let numbers = vec![10, 20, 30, 40, 50];
 
 // contains - มีค่านี้ไหม?
 println!("มี 30 ไหม: {}", numbers.contains(&30)); // true
 println!("มี 99 ไหม: {}", numbers.contains(&99)); // false
 
 // find - หาตัวแรกที่ตรงเงื่อนไข
 let first_big = numbers.iter().find(|&&n| n > 25);
 println!("ตัวแรกที่ > 25: {:?}", first_big); // Some(30)
 
 // position - หา index ของตัวแรกที่ตรงเงื่อนไข
 let pos = numbers.iter().position(|&n| n == 30);
 println!("30 อยู่ index: {:?}", pos); // Some(2)
 
 // binary_search - ค้นหาใน vec ที่เรียงแล้ว (เร็วมาก!)
 let sorted = vec![1, 3, 5, 7, 9];
 match sorted.binary_search(&5) {
 Ok(index) => println!("พบ 5 ที่ index {}", index),
 Err(index) => println!("ไม่พบ แต่ควรแทรกที่ {}", index),
 }
}
```

</RustPlayground>

---

## 7. จัดเรียง (Sorting)

<RustPlayground>

```rust
fn main() {
 // sort - เรียงน้อยไปมาก (ต้อง mut)
 let mut nums = vec![3, 1, 4, 1, 5, 9, 2, 6];
 nums.sort();
 println!("เรียงแล้ว: {:?}", nums);
 
 // sort_by - กำหนดวิธีเปรียบเทียบเอง
 let mut words = vec!["banana", "Apple", "cherry"];
 words.sort_by(|a, b| a.to_lowercase().cmp(&b.to_lowercase()));
 println!("เรียงไม่สน case: {:?}", words);
 
 // sort_by_key - เรียงตาม key ที่คำนวณ
 let mut items = vec!["aaa", "b", "cc"];
 items.sort_by_key(|s| s.len()); // เรียงตามความยาว
 println!("เรียงตามความยาว: {:?}", items);
 
 // reverse - กลับลำดับ
 nums.reverse();
 println!("กลับลำดับ: {:?}", nums);
}
```

</RustPlayground>

---

## 8. Slice - ดึงส่วนของ Vec

<RustPlayground>

```rust
fn main() {
 let v = vec![0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
 
 // slice ด้วย range
 let slice1 = &v[2..5]; // index 2, 3, 4
 println!("[2..5]: {:?}", slice1);
 
 let slice2 = &v[..3]; // ตั้งแต่ต้นถึง 2
 println!("[..3]: {:?}", slice2);
 
 let slice3 = &v[7..]; // ตั้งแต่ 7 ถึงท้าย
 println!("[7..]: {:?}", slice3);
 
 // split - แบ่งออกเป็นส่วน
 let (left, right) = v.split_at(5);
 println!("ซ้าย: {:?}, ขวา: {:?}", left, right);
 
 // chunks - แบ่งเป็นก้อนๆ
 println!("=== แบ่งทีละ 3 ===");
 for chunk in v.chunks(3) {
 println!("{:?}", chunk);
 }
}
```

</RustPlayground>

---

## 9. รวม Vec และการแปลง

<RustPlayground>

```rust
fn main() {
 // extend - รวม vec เข้าด้วยกัน
 let mut a = vec![1, 2, 3];
 let b = vec![4, 5, 6];
 a.extend(b);
 println!("รวมแล้ว: {:?}", a);
 
 // append - ย้าย (move) อีก vec มารวม
 let mut x = vec![1, 2];
 let mut y = vec![3, 4];
 x.append(&mut y);
 println!("x: {:?}, y: {:?}", x, y); // y ว่างแล้ว!
 
 // concat - รวมหลาย slice
 let slices: Vec<&[i32]> = vec![&[1, 2], &[3, 4], &[5]];
 let combined: Vec<i32> = slices.concat();
 println!("concat: {:?}", combined);
 
 // join - รวมพร้อมตัวคั่น (สำหรับ String)
 let words = vec!["hello", "world", "rust"];
 let sentence = words.join(" ");
 println!("join: {}", sentence); // "hello world rust"
}
```

</RustPlayground>

---

## 10. Capacity และ Performance

<RustPlayground>

```rust
fn main() {
 let mut v = Vec::new();
 
 println!("เริ่มต้น - len: {}, capacity: {}", v.len(), v.capacity());
 
 // เพิ่มข้อมูลไปเรื่อยๆ
 for i in 0..10 {
 v.push(i);
 println!("push {} - len: {}, capacity: {}", i, v.len(), v.capacity());
 }
 
 // reserve - จองพื้นที่ล่วงหน้า (หลีกเลี่ยง reallocation)
 v.reserve(100);
 println!("หลัง reserve(100) - capacity: {}", v.capacity());
 
 // shrink_to_fit - ลดขนาดให้พอดีกับข้อมูล
 v.shrink_to_fit();
 println!("หลัง shrink - len: {}, capacity: {}", v.len(), v.capacity());
}
```

</RustPlayground>

:::warning Performance Tip
ถ้ารู้ขนาดล่วงหน้า ใช้ `Vec::with_capacity(n)` หรือ `reserve()` เพื่อหลีกเลี่ยงการ reallocate บ่อยๆ!
:::

---

## Quick Reference

### สร้าง Vec
| วิธี | ตัวอย่าง | หมายเหตุ |
|------|---------|---------|
| `vec![]` | `vec![1, 2, 3]` | แบบง่าย นิยมที่สุด |
| `Vec::new()` | `Vec::new()` | สร้างว่าง |
| `with_capacity()` | `Vec::with_capacity(100)` | จองพื้นที่ล่วงหน้า |
| `vec![val; n]` | `vec![0; 10]` | ซ้ำค่าเดิม n ตัว |

### เพิ่ม/ลบ
| Method | คำอธิบาย |
|--------|---------|
| `push(x)` | เพิ่มท้าย |
| `pop()` | ลบท้าย return `Option<T>` |
| `insert(i, x)` | แทรกที่ตำแหน่ง i |
| `remove(i)` | ลบตำแหน่ง i |
| `clear()` | ลบทั้งหมด |

### เข้าถึง
| Method | คำอธิบาย |
|--------|---------|
| `[i]` | index (panic ถ้าเกิน!) |
| `get(i)` | return `Option<&T>` (ปลอดภัย) |
| `first()` | ตัวแรก |
| `last()` | ตัวสุดท้าย |
| `len()` | จำนวนข้อมูล |
| `is_empty()` | ว่างไหม? |

### วนซ้ำ
| Method | คำอธิบาย |
|--------|---------|
| `iter()` | ยืมอ่านอย่างเดียว |
| `iter_mut()` | ยืมแก้ไขได้ |
| `into_iter()` | ย้าย ownership |

---

[ถัดไป: String →](./string)
