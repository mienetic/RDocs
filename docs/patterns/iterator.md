# Iterator Patterns

Pattern สำหรับใช้ Iterators อย่างมีประสิทธิภาพ! 

---

## Transform: map / filter / filter_map

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // map: แปลงทุกค่า
 let doubled: Vec<_> = numbers.iter()
 .map(|x| x * 2)
 .collect();
 println!("Doubled: {:?}", doubled);
 
 // filter: เลือกบางค่า
 let evens: Vec<_> = numbers.iter()
 .filter(|x| *x % 2 == 0)
 .collect();
 println!("Evens: {:?}", evens);
 
 // filter_map: filter + map รวมกัน
 let strings = vec!["1", "two", "3", "four", "5"];
 let parsed: Vec<i32> = strings.iter()
 .filter_map(|s| s.parse().ok())
 .collect();
 println!("Parsed: {:?}", parsed);
}
```

</RustPlayground>

---

## Reduce: fold / reduce / sum

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // sum
 let total: i32 = numbers.iter().sum();
 println!("Sum: {}", total);
 
 // product
 let product: i32 = numbers.iter().product();
 println!("Product: {}", product);
 
 // fold: custom reduction
 let sum_of_squares = numbers.iter()
 .fold(0, |acc, x| acc + x * x);
 println!("Sum of squares: {}", sum_of_squares);
 
 // reduce: like fold แต่ใช้ตัวแรกเป็น initial
 let max = numbers.iter()
 .copied()
 .reduce(|a, b| if a > b { a } else { b });
 println!("Max: {:?}", max);
}
```

</RustPlayground>

---

## Chain: chain / zip / enumerate

<RustPlayground>

```rust
fn main() {
 let a = vec![1, 2, 3];
 let b = vec![4, 5, 6];
 
 // chain: ต่อ iterators
 let chained: Vec<_> = a.iter().chain(b.iter()).collect();
 println!("Chained: {:?}", chained);
 
 // zip: รวมคู่กัน
 let zipped: Vec<_> = a.iter().zip(b.iter()).collect();
 println!("Zipped: {:?}", zipped);
 
 // enumerate: เพิ่ม index
 for (i, val) in a.iter().enumerate() {
 println!("Index {}: {}", i, val);
 }
}
```

</RustPlayground>

---

## Take / Skip / Chunk

<RustPlayground>

```rust
fn main() {
 let numbers: Vec<i32> = (0..10).collect();
 
 // take: เอาแค่ n ตัวแรก
 let first_three: Vec<_> = numbers.iter().take(3).collect();
 println!("First 3: {:?}", first_three);
 
 // skip: ข้าม n ตัวแรก
 let skip_three: Vec<_> = numbers.iter().skip(3).collect();
 println!("Skip 3: {:?}", skip_three);
 
 // take_while: เอาจนกว่าจะ false
 let under_five: Vec<_> = numbers.iter()
 .take_while(|x| **x < 5)
 .collect();
 println!("Under 5: {:?}", under_five);
 
 // chunks
 for chunk in numbers.chunks(3) {
 println!("Chunk: {:?}", chunk);
 }
}
```

</RustPlayground>

---

## Find / Any / All

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // find: หาตัวแรกที่ match
 let first_even = numbers.iter().find(|x| *x % 2 == 0);
 println!("First even: {:?}", first_even);
 
 // position: หา index
 let pos = numbers.iter().position(|x| *x == 3);
 println!("Position of 3: {:?}", pos);
 
 // any: มีตัวใดตัวหนึ่ง match ไหม
 let has_even = numbers.iter().any(|x| x % 2 == 0);
 println!("Has even: {}", has_even);
 
 // all: ทุกตัว match ไหม
 let all_positive = numbers.iter().all(|x| *x > 0);
 println!("All positive: {}", all_positive);
}
```

</RustPlayground>

---

## Flatten / Flat Map

<RustPlayground>

```rust
fn main() {
 let nested = vec![vec![1, 2], vec![3, 4], vec![5, 6]];
 
 // flatten: ลด level
 let flat: Vec<_> = nested.iter()
 .flatten()
 .collect();
 println!("Flattened: {:?}", flat);
 
 // flat_map: map แล้ว flatten
 let words = vec!["hello", "world"];
 let chars: Vec<_> = words.iter()
 .flat_map(|s| s.chars())
 .collect();
 println!("Chars: {:?}", chars);
}
```

</RustPlayground>

---

## Custom Iterator

<RustPlayground>

```rust
struct Counter {
 count: u32,
 max: u32,
}

impl Counter {
 fn new(max: u32) -> Counter {
 Counter { count: 0, max }
 }
}

impl Iterator for Counter {
 type Item = u32;
 
 fn next(&mut self) -> Option<Self::Item> {
 if self.count < self.max {
 self.count += 1;
 Some(self.count)
 } else {
 None
 }
 }
}

fn main() {
 let counter = Counter::new(5);
 
 for n in counter {
 print!("{} ", n);
 }
 println!();
}
```

</RustPlayground>

---

## Quick Reference

| Method | คำอธิบาย |
|--------|---------|
| `map` | แปลงทุกค่า |
| `filter` | เลือกบางค่า |
| `filter_map` | filter + map |
| `fold` | reduce ด้วย initial |
| `sum`, `product` | รวม/คูณ |
| `chain` | ต่อ iterators |
| `zip` | รวมคู่ |
| `enumerate` | เพิ่ม index |
| `take`, `skip` | ตัด/ข้าม |
| `find`, `position` | หา |
| `any`, `all` | เช็ค |
| `flatten` | ลด nesting |
| `collect` | สร้าง collection |

---

[← Smart Pointers](/patterns/smart-pointers) | [Patterns Index →](/patterns/)
