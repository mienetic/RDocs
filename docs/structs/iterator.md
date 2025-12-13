# Iterator Structs - Iterators

`Iter`, `IntoIter`, `Map`, `Filter`, `Enumerate`, `Zip` และ adapters อื่นๆ! 

---

## Iterator คืออะไร?

Iterator คือ pattern สำหรับวนลูปผ่าน collection โดย:
- **Lazy** - ไม่คำนวณจนกว่าจะใช้
- **Chainable** - ต่อ methods ได้หลายตัว
- **Zero-cost** - ไม่มี runtime overhead

---

## 3 วิธีสร้าง Iterator

<RustPlayground>

```rust
fn main() {
 let vec = vec![1, 2, 3];
 
 // 1. iter() - borrow &T
 println!("iter() - borrow:");
 for x in vec.iter() {
 println!(" &{}", x);
 }
 println!("vec ยังใช้ได้: {:?}", vec);
 
 // 2. iter_mut() - mutable borrow &mut T
 let mut vec2 = vec![1, 2, 3];
 for x in vec2.iter_mut() {
 *x *= 10;
 }
 println!("\niter_mut() แก้ค่า: {:?}", vec2);
 
 // 3. into_iter() - ownership T
 let vec3 = vec![1, 2, 3];
 let sum: i32 = vec3.into_iter().sum();
 println!("\ninto_iter() sum: {}", sum);
 // vec3 ใช้ไม่ได้แล้ว - ownership ถูกย้าย
}
```

</RustPlayground>

---

## map() - แปลงค่า

<RustPlayground>

```rust
fn main() {
 let nums = vec![1, 2, 3, 4, 5];
 
 // map แปลงทุกตัว
 let doubled: Vec<_> = nums.iter()
 .map(|x| x * 2)
 .collect();
 println!("doubled: {:?}", doubled);
 
 // map เป็น struct
 let strings: Vec<_> = nums.iter()
 .map(|x| format!("num_{}", x))
 .collect();
 println!("strings: {:?}", strings);
 
 // chain หลาย map
 let result: Vec<_> = nums.iter()
 .map(|x| x + 1)
 .map(|x| x * 2)
 .collect();
 println!("(x+1)*2: {:?}", result);
}
```

</RustPlayground>

---

## filter() - กรองค่า

<RustPlayground>

```rust
fn main() {
 let nums = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
 // filter เอาเฉพาะคู่
 let evens: Vec<_> = nums.iter()
 .filter(|x| *x % 2 == 0)
 .collect();
 println!("เลขคู่: {:?}", evens);
 
 // filter + map
 let even_squares: Vec<_> = nums.iter()
 .filter(|x| *x % 2 == 0)
 .map(|x| x * x)
 .collect();
 println!("เลขคู่ยกกำลัง2: {:?}", even_squares);
 
 // filter_map รวมทั้งสอง
 let parsed: Vec<i32> = ["1", "two", "3", "4", "five"]
 .iter()
 .filter_map(|s| s.parse().ok())
 .collect();
 println!("parsed numbers: {:?}", parsed);
}
```

</RustPlayground>

---

## enumerate() - index + value

<RustPlayground>

```rust
fn main() {
 let fruits = vec!["แอปเปิล", "กล้วย", "ส้ม", "มะม่วง"];
 
 // enumerate ให้ (index, value)
 for (i, fruit) in fruits.iter().enumerate() {
 println!("{}. {}", i + 1, fruit);
 }
 
 // หา position
 let pos = fruits.iter()
 .enumerate()
 .find(|(_, &f)| f == "ส้ม")
 .map(|(i, _)| i);
 println!("\nส้มอยู่ index: {:?}", pos);
}
```

</RustPlayground>

---

## zip() - รวม 2 iterators

<RustPlayground>

```rust
fn main() {
 let names = vec!["Alice", "Bob", "Charlie"];
 let ages = vec![25, 30, 35];
 let cities = vec!["Bangkok", "Tokyo", "London"];
 
 // zip 2 ตัว
 println!("zip 2:");
 for (name, age) in names.iter().zip(ages.iter()) {
 println!(" {} อายุ {}", name, age);
 }
 
 // zip 3 ตัว
 println!("\nzip 3:");
 for ((name, age), city) in names.iter().zip(ages.iter()).zip(cities.iter()) {
 println!(" {} อายุ {} อยู่ {}", name, age, city);
 }
}
```

</RustPlayground>

---

## take(), skip(), chain()

<RustPlayground>

```rust
fn main() {
 let nums: Vec<i32> = (1..=10).collect();
 
 // take - เอา n ตัวแรก
 let first3: Vec<_> = nums.iter().take(3).collect();
 println!("take(3): {:?}", first3);
 
 // skip - ข้าม n ตัว
 let skip5: Vec<_> = nums.iter().skip(5).collect();
 println!("skip(5): {:?}", skip5);
 
 // take + skip = slice
 let middle: Vec<_> = nums.iter().skip(3).take(4).collect();
 println!("skip(3).take(4): {:?}", middle);
 
 // chain - ต่อกัน
 let a = vec![1, 2];
 let b = vec![3, 4];
 let combined: Vec<_> = a.iter().chain(b.iter()).collect();
 println!("chain: {:?}", combined);
}
```

</RustPlayground>

---

## Consuming Methods

<RustPlayground>

```rust
fn main() {
 let nums = vec![1, 2, 3, 4, 5];
 
 // sum / product
 let sum: i32 = nums.iter().sum();
 let product: i32 = nums.iter().product();
 println!("sum: {}, product: {}", sum, product);
 
 // min / max
 println!("min: {:?}, max: {:?}", nums.iter().min(), nums.iter().max());
 
 // count
 let count = nums.iter().filter(|x| *x > 2).count();
 println!("count > 2: {}", count);
 
 // find
 let first_even = nums.iter().find(|x| *x % 2 == 0);
 println!("first even: {:?}", first_even);
 
 // any / all
 println!("any > 4: {}", nums.iter().any(|x| *x > 4));
 println!("all > 0: {}", nums.iter().all(|x| *x > 0));
 
 // fold
 let sum_fold = nums.iter().fold(0, |acc, x| acc + x);
 println!("fold sum: {}", sum_fold);
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | จาก | คำอธิบาย |
|------|-----|---------|
| `Iter<T>` | `.iter()` | borrow &T |
| `IterMut<T>` | `.iter_mut()` | borrow &mut T |
| `IntoIter<T>` | `.into_iter()` | owned T |

### Adapters (Lazy)
| Method | คำอธิบาย |
|--------|---------|
| `map(f)` | แปลงค่า |
| `filter(p)` | กรอง |
| `enumerate()` | เพิ่ม index |
| `zip(other)` | รวม 2 iterators |
| `chain(other)` | ต่อกัน |
| `take(n)` | เอา n ตัวแรก |
| `skip(n)` | ข้าม n ตัว |
| `flatten()` | ยุบ nested |
| `rev()` | กลับลำดับ |

### Consumers (Eager)
| Method | คำอธิบาย |
|--------|---------|
| `collect()` | รวมเป็น collection |
| `sum()` | รวมค่า |
| `product()` | คูณค่า |
| `count()` | นับจำนวน |
| `min() / max()` | ค่าน้อย/มากสุด |
| `find(p)` | หาตัวแรกที่ match |
| `any(p) / all(p)` | ตรวจสอบ condition |
| `fold(init, f)` | reduce ค่า |

---

[← Error](./error) | [Process →](./process)
