# Iterator - วนซ้ำข้อมูล

**Iterator** คือวิธีวนซ้ำข้อมูลแบบ lazy ไม่คำนวณจนกว่าจะใช้จริง ประหยัดหน่วยความจำ! 

---

## Iterator คืออะไร?

Iterator คือ trait ที่มี method หลัก `next()` ซึ่ง return `Option<Item>`:
- `Some(item)` - ยังมีข้อมูล
- `None` - หมดแล้ว

```rust
trait Iterator {
 type Item;
 fn next(&mut self) -> Option<Self::Item>;
}
```

:::tip ทำไม Iterator ดี?
- **Lazy** - ไม่คำนวณจนกว่าจะใช้
- **Composable** - chain หลาย operations ได้
- **Memory efficient** - ไม่สร้าง collection กลาง
:::

---

## 1. สร้าง Iterator

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // iter() - ยืมค่า (&T)
 println!("=== iter() ===");
 for n in numbers.iter() {
 print!("{} ", n); // n คือ &i32
 }
 println!();
 println!("vec ยังใช้ได้: {:?}", numbers);
 
 // iter_mut() - ยืมแบบแก้ไขได้ (&mut T)
 let mut nums = vec![1, 2, 3];
 for n in nums.iter_mut() {
 *n *= 2; // แก้ไขค่าได้
 }
 println!("หลังแก้ไข: {:?}", nums);
 
 // into_iter() - ย้าย ownership (T)
 let words = vec!["hello", "world"];
 for w in words.into_iter() {
 print!("{} ", w);
 }
 println!();
 // words ใช้ไม่ได้แล้ว! (ถูกย้าย)
}
```

</RustPlayground>

---

## 2. Adapters พื้นฐาน

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
 // map - แปลงค่าทุกตัว
 let doubled: Vec<i32> = numbers.iter()
 .map(|n| n * 2)
 .collect();
 println!("doubled: {:?}", doubled);
 
 // filter - เลือกเฉพาะที่ต้องการ
 let evens: Vec<&i32> = numbers.iter()
 .filter(|n| *n % 2 == 0)
 .collect();
 println!("evens: {:?}", evens);
 
 // take - เอาแค่ n ตัวแรก
 let first_three: Vec<&i32> = numbers.iter()
 .take(3)
 .collect();
 println!("first 3: {:?}", first_three);
 
 // skip - ข้าม n ตัวแรก
 let skip_five: Vec<&i32> = numbers.iter()
 .skip(5)
 .collect();
 println!("skip 5: {:?}", skip_five);
}
```

</RustPlayground>

---

## 3. Chain Adapters

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
 // รวมหลาย adapters
 let result: Vec<i32> = numbers.iter()
 .filter(|n| *n % 2 == 0) // เลือกเลขคู่: [2,4,6,8,10]
 .map(|n| n * 10) // คูณ 10: [20,40,60,80,100]
 .take(3) // เอา 3 ตัวแรก: [20,40,60]
 .collect();
 println!("chain result: {:?}", result);
 
 // enumerate - ได้ index ด้วย
 let fruits = vec!["apple", "banana", "cherry"];
 for (i, fruit) in fruits.iter().enumerate() {
 println!("{}: {}", i, fruit);
 }
 
 // zip - จับคู่ 2 iterators
 let names = vec!["Alice", "Bob", "Charlie"];
 let ages = vec![25, 30, 35];
 let pairs: Vec<_> = names.iter().zip(ages.iter()).collect();
 println!("zipped: {:?}", pairs);
}
```

</RustPlayground>

---

## 4. Consumers (ทำให้ iterator ทำงาน)

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // collect - รวมเป็น collection
 let doubled: Vec<i32> = numbers.iter().map(|n| n * 2).collect();
 println!("collected: {:?}", doubled);
 
 // sum - รวมค่า
 let total: i32 = numbers.iter().sum();
 println!("sum: {}", total);
 
 // product - คูณทุกค่า
 let product: i32 = numbers.iter().product();
 println!("product: {}", product);
 
 // count - นับจำนวน
 let count = numbers.iter().filter(|n| *n > 2).count();
 println!("count > 2: {}", count);
 
 // for_each - ทำกับทุกตัว (ไม่ return)
 numbers.iter().for_each(|n| print!("{} ", n));
 println!();
}
```

</RustPlayground>

---

## 5. Find และ Search

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5, 6];
 
 // find - หาตัวแรกที่ตรงเงื่อนไข
 let first_even = numbers.iter().find(|n| *n % 2 == 0);
 println!("first even: {:?}", first_even); // Some(&2)
 
 // position - หา index ของตัวแรกที่ตรง
 let pos = numbers.iter().position(|n| *n == 4);
 println!("position of 4: {:?}", pos); // Some(3)
 
 // any - มีตัวไหนตรงไหม?
 let has_big = numbers.iter().any(|n| *n > 10);
 println!("has > 10: {}", has_big); // false
 
 // all - ทุกตัวตรงไหม?
 let all_positive = numbers.iter().all(|n| *n > 0);
 println!("all positive: {}", all_positive); // true
 
 // max / min
 println!("max: {:?}", numbers.iter().max());
 println!("min: {:?}", numbers.iter().min());
}
```

</RustPlayground>

---

## 6. Fold และ Reduce

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // fold - รวมค่าด้วย initial value และ closure
 let sum = numbers.iter().fold(0, |acc, n| acc + n);
 println!("fold sum: {}", sum); // 15
 
 // fold สามารถทำอะไรก็ได้!
 let concat = numbers.iter()
 .fold(String::new(), |acc, n| format!("{}{}", acc, n));
 println!("fold concat: {}", concat); // "12345"
 
 // reduce - เหมือน fold แต่ใช้ตัวแรกเป็น initial
 let product = numbers.iter().cloned().reduce(|acc, n| acc * n);
 println!("reduce product: {:?}", product); // Some(120)
 
 // scan - fold ที่ปล่อย intermediate values
 let running_sum: Vec<i32> = numbers.iter()
 .scan(0, |acc, n| {
 *acc += n;
 Some(*acc)
 })
 .collect();
 println!("running sum: {:?}", running_sum); // [1, 3, 6, 10, 15]
}
```

</RustPlayground>

---

## 7. Flatten และ FlatMap

<RustPlayground>

```rust
fn main() {
 // flatten - ทำให้ nested แบน
 let nested = vec![vec![1, 2], vec![3, 4], vec![5]];
 let flat: Vec<i32> = nested.into_iter().flatten().collect();
 println!("flattened: {:?}", flat); // [1, 2, 3, 4, 5]
 
 // flatten กับ Option
 let options = vec![Some(1), None, Some(2), None, Some(3)];
 let values: Vec<i32> = options.into_iter().flatten().collect();
 println!("flatten options: {:?}", values); // [1, 2, 3]
 
 // flat_map - map + flatten ในคำสั่งเดียว
 let words = vec!["hello", "world"];
 let chars: Vec<char> = words.iter()
 .flat_map(|s| s.chars())
 .collect();
 println!("flat_map chars: {:?}", chars);
}
```

</RustPlayground>

---

## 8. สร้าง Iterator ด้วยตัวเอง

<RustPlayground>

```rust
// Range - สร้างลำดับตัวเลข
fn main() {
 // ranges
 let r1: Vec<i32> = (0..5).collect(); // 0,1,2,3,4
 let r2: Vec<i32> = (0..=5).collect(); // 0,1,2,3,4,5
 println!("0..5: {:?}", r1);
 println!("0..=5: {:?}", r2);
 
 // step_by - กระโดด
 let stepped: Vec<i32> = (0..10).step_by(2).collect();
 println!("step_by(2): {:?}", stepped); // [0, 2, 4, 6, 8]
 
 // repeat - ซ้ำค่าเดิม
 let fives: Vec<i32> = std::iter::repeat(5).take(4).collect();
 println!("repeat 5: {:?}", fives); // [5, 5, 5, 5]
 
 // once - iterator ที่มีค่าเดียว
 let one: Vec<i32> = std::iter::once(42).collect();
 println!("once: {:?}", one); // [42]
 
 // empty - iterator ว่าง
 let nothing: Vec<i32> = std::iter::empty().collect();
 println!("empty: {:?}", nothing); // []
 
 // successors - สร้างจากฟังก์ชัน
 let powers: Vec<i32> = std::iter::successors(Some(1), |n| Some(n * 2))
 .take(5)
 .collect();
 println!("powers of 2: {:?}", powers); // [1, 2, 4, 8, 16]
}
```

</RustPlayground>

---

## Quick Reference

### สร้าง Iterator
| Method | ได้ | Vec หลังใช้ |
|--------|-----|------------|
| `iter()` | `&T` | ใช้ได้ |
| `iter_mut()` | `&mut T` | ใช้ได้ |
| `into_iter()` | `T` | ใช้ไม่ได้ |

### Adapters (lazy - ไม่ทำจนกว่าจะ consume)
| Method | คำอธิบาย |
|--------|---------|
| `map(f)` | แปลงค่า |
| `filter(f)` | กรอง |
| `take(n)` | เอา n ตัวแรก |
| `skip(n)` | ข้าม n ตัว |
| `enumerate()` | เพิ่ม index |
| `zip(iter)` | จับคู่ |
| `chain(iter)` | ต่อกัน |
| `flatten()` | ทำให้แบน |
| `flat_map(f)` | map แล้ว flatten |

### Consumers (ทำให้ทำงาน)
| Method | คำอธิบาย |
|--------|---------|
| `collect()` | รวมเป็น collection |
| `sum()` | รวมค่า |
| `count()` | นับ |
| `find(f)` | หาตัวแรก |
| `any(f)` | มีที่ตรงไหม? |
| `all(f)` | ทุกตัวตรงไหม? |
| `fold(init, f)` | reduce ด้วย initial |
| `for_each(f)` | ทำกับทุกตัว |

---

[← Result](./result) | [Collections →](./collections-ref)
