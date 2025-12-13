# Iterators & Closures

Functional programming ใน Rust!

```mermaid
flowchart LR
 DATA["Data"] --> ITER["Iterator"]
 ITER --> MAP["map()"]
 MAP --> FILTER["filter()"]
 FILTER --> COLLECT["collect()"]
 COLLECT --> RESULT["Result"]
 
 style DATA fill:#3b82f6,stroke:#1d4ed8,color:#fff
 style ITER fill:#8b5cf6,stroke:#6d28d9,color:#fff
 style MAP fill:#22c55e,stroke:#15803d,color:#fff
 style FILTER fill:#f59e0b,stroke:#d97706,color:#fff
 style COLLECT fill:#ec4899,stroke:#be185d,color:#fff
 style RESULT fill:#ef4444,stroke:#b91c1c,color:#fff
```

---

## 1. Closures

### 1.1 Closure คืออะไร?

Closure คือ anonymous function ที่สามารถ capture ค่าจาก environment ได้

<RustPlayground>

```rust
fn main() {
 // Regular function
 fn add_one_fn(x: i32) -> i32 {
 x + 1
 }
 
 // Closure - anonymous function
 let add_one = |x: i32| -> i32 { x + 1 };
 
 // Closure with type inference
 let add_two = |x| x + 2;
 
 // Closure with multiple params
 let add = |a, b| a + b;
 
 println!("add_one_fn(5) = {}", add_one_fn(5));
 println!("add_one(5) = {}", add_one(5));
 println!("add_two(5) = {}", add_two(5));
 println!("add(2, 3) = {}", add(2, 3));
}
```

</RustPlayground>

### 1.2 Capturing Environment

<RustPlayground>

```rust
fn main() {
 let x = 4;
 
 // Closure captures x from environment
 let equal_to_x = |z| z == x;
 
 let y = 4;
 println!("y == x? {}", equal_to_x(y));
 
 // Capture multiple values
 let multiplier = 3;
 let offset = 10;
 let transform = |n| n * multiplier + offset;
 
 println!("transform(5) = {}", transform(5)); // 5 * 3 + 10 = 25
}
```

</RustPlayground>

### 1.3 Closure Traits

| Trait | Description | Capture |
|-------|-------------|---------|
| `Fn` | Borrow immutably | `&T` |
| `FnMut` | Borrow mutably | `&mut T` |
| `FnOnce` | Take ownership | `T` |

<RustPlayground>

```rust
fn main() {
 // FnOnce - moves captured value
 let s = String::from("hello");
 let consume = move || {
 println!("Consumed: {}", s);
 // s is moved into closure
 };
 consume();
 // consume(); // Error: already moved
 
 // FnMut - mutably borrows
 let mut count = 0;
 let mut increment = || {
 count += 1;
 println!("Count: {}", count);
 };
 increment();
 increment();
 
 // Fn - immutably borrows
 let name = String::from("Ferris");
 let greet = || println!("Hello, {}!", name);
 greet();
 greet();
 println!("Name still valid: {}", name);
}
```

</RustPlayground>

### 1.4 move Keyword

<RustPlayground>

```rust
fn main() {
 let data = vec![1, 2, 3];
 
 // Without move: borrows data
 let print_ref = || println!("{:?}", data);
 print_ref();
 println!("Data still here: {:?}", data);
 
 // With move: takes ownership
 let data2 = vec![4, 5, 6];
 let print_owned = move || println!("{:?}", data2);
 print_owned();
 // println!("{:?}", data2); // Error: data2 moved
}
```

</RustPlayground>

---

## 2. Iterators

### 2.1 Iterator Trait

```rust
pub trait Iterator {
 type Item;
 fn next(&mut self) -> Option<Self::Item>;
 // ... other methods
}
```

<RustPlayground>

```rust
fn main() {
 let v = vec![1, 2, 3];
 
 // สร้าง iterator
 let mut iter = v.iter();
 
 // เรียก next() ทีละตัว
 println!("{:?}", iter.next()); // Some(&1)
 println!("{:?}", iter.next()); // Some(&2)
 println!("{:?}", iter.next()); // Some(&3)
 println!("{:?}", iter.next()); // None
}
```

</RustPlayground>

### 2.2 Iterator Types

| Method | Returns | Ownership |
|--------|---------|-----------|
| `.iter()` | `Iterator<Item = &T>` | Borrows |
| `.iter_mut()` | `Iterator<Item = &mut T>` | Mutable borrow |
| `.into_iter()` | `Iterator<Item = T>` | Takes ownership |

<RustPlayground>

```rust
fn main() {
 let v = vec![1, 2, 3];
 
 // iter() - borrows
 for val in v.iter() {
 println!("val: {}", val); // &i32
 }
 println!("v still exists: {:?}", v);
 
 // into_iter() - takes ownership
 let v2 = vec![4, 5, 6];
 for val in v2.into_iter() {
 println!("val: {}", val); // i32
 }
 // println!("{:?}", v2); // Error: moved
}
```

</RustPlayground>

---

## 3. Iterator Adaptors

### 3.1 map()

แปลงแต่ละ element:

<RustPlayground>

```rust
fn main() {
 let v = vec![1, 2, 3, 4, 5];
 
 // map() transforms each element
 let doubled: Vec<i32> = v.iter()
 .map(|x| x * 2)
 .collect();
 
 println!("Original: {:?}", v);
 println!("Doubled: {:?}", doubled);
 
 // Chain multiple maps
 let result: Vec<i32> = v.iter()
 .map(|x| x * 2)
 .map(|x| x + 1)
 .collect();
 
 println!("Result: {:?}", result);
}
```

</RustPlayground>

### 3.2 filter()

กรอง elements:

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
 // filter() keeps elements matching predicate
 let evens: Vec<&i32> = numbers.iter()
 .filter(|x| *x % 2 == 0)
 .collect();
 
 println!("Original: {:?}", numbers);
 println!("Evens: {:?}", evens);
 
 // Combine map and filter
 let even_squares: Vec<i32> = numbers.iter()
 .filter(|x| *x % 2 == 0)
 .map(|x| x * x)
 .collect();
 
 println!("Even squares: {:?}", even_squares);
}
```

</RustPlayground>

### 3.3 filter_map()

Filter และ map ในขั้นตอนเดียว:

<RustPlayground>

```rust
fn main() {
 let strings = vec!["1", "two", "3", "four", "5"];
 
 // filter_map: parse only valid numbers
 let numbers: Vec<i32> = strings.iter()
 .filter_map(|s| s.parse().ok())
 .collect();
 
 println!("Parsed: {:?}", numbers); // [1, 3, 5]
}
```

</RustPlayground>

### 3.4 Other Adaptors

<RustPlayground>

```rust
fn main() {
 let v = vec![1, 2, 3, 4, 5];
 
 // take() - first n elements
 let first_three: Vec<_> = v.iter().take(3).collect();
 println!("First 3: {:?}", first_three);
 
 // skip() - skip first n elements
 let skip_two: Vec<_> = v.iter().skip(2).collect();
 println!("Skip 2: {:?}", skip_two);
 
 // enumerate() - with index
 for (i, val) in v.iter().enumerate() {
 println!("Index {}: {}", i, val);
 }
 
 // zip() - combine two iterators
 let a = vec![1, 2, 3];
 let b = vec!["one", "two", "three"];
 let zipped: Vec<_> = a.iter().zip(b.iter()).collect();
 println!("Zipped: {:?}", zipped);
 
 // rev() - reverse
 let reversed: Vec<_> = v.iter().rev().collect();
 println!("Reversed: {:?}", reversed);
}
```

</RustPlayground>

---

## 4. Consuming Adaptors

### 4.1 collect()

<RustPlayground>

```rust
use std::collections::HashMap;

fn main() {
 let v = vec![1, 2, 3, 4, 5];
 
 // Collect to Vec
 let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect();
 println!("Vec: {:?}", doubled);
 
 // Collect to HashMap
 let pairs = vec![("a", 1), ("b", 2), ("c", 3)];
 let map: HashMap<_, _> = pairs.into_iter().collect();
 println!("HashMap: {:?}", map);
 
 // Collect to String
 let chars = vec!['h', 'e', 'l', 'l', 'o'];
 let s: String = chars.into_iter().collect();
 println!("String: {}", s);
}
```

</RustPlayground>

### 4.2 Aggregation Methods

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // sum()
 let sum: i32 = numbers.iter().sum();
 println!("Sum: {}", sum);
 
 // product()
 let product: i32 = numbers.iter().product();
 println!("Product: {}", product);
 
 // count()
 let count = numbers.iter().count();
 println!("Count: {}", count);
 
 // max() and min()
 let max = numbers.iter().max();
 let min = numbers.iter().min();
 println!("Max: {:?}, Min: {:?}", max, min);
 
 // any() and all()
 let has_even = numbers.iter().any(|x| x % 2 == 0);
 let all_positive = numbers.iter().all(|x| *x > 0);
 println!("Has even: {}, All positive: {}", has_even, all_positive);
}
```

</RustPlayground>

### 4.3 fold() และ reduce()

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // fold() with initial value
 let sum = numbers.iter().fold(0, |acc, x| acc + x);
 println!("Sum (fold): {}", sum);
 
 // fold() for string concatenation
 let words = vec!["hello", " ", "world"];
 let sentence = words.iter().fold(String::new(), |mut acc, s| {
 acc.push_str(s);
 acc
 });
 println!("Sentence: {}", sentence);
 
 // reduce() - no initial value
 let product = numbers.iter().copied().reduce(|acc, x| acc * x);
 println!("Product (reduce): {:?}", product);
}
```

</RustPlayground>

---

## 5. Lazy Evaluation

<RustPlayground>

```rust
fn main() {
 let v = vec![1, 2, 3, 4, 5];
 
 // Iterators are LAZY - nothing happens yet
 let iter = v.iter()
 .map(|x| {
 println!("Processing {}", x);
 x * 2
 });
 
 println!("Iterator created, nothing processed yet");
 
 // Now we consume it
 println!("Collecting...");
 let result: Vec<_> = iter.collect();
 println!("Result: {:?}", result);
}
```

</RustPlayground>

::: observation
**Iterators เป็น Lazy!**
อย่าลืมว่า Iterator จะไม่ทำอะไรเลยจนกว่าคุณจะเรียก Consuming Adaptor (เช่น `collect`, `sum`, `for_each`)
Code อย่าง `.map(...)` เฉยๆ โดยไม่เก็บค่า จะถูก Compiler ตัดทิ้ง (No-op)
:::

---

## 6. Custom Iterators

<RustPlayground>

```rust
struct Counter {
 current: u32,
 max: u32,
}

impl Counter {
 fn new(max: u32) -> Counter {
 Counter { current: 0, max }
 }
}

impl Iterator for Counter {
 type Item = u32;
 
 fn next(&mut self) -> Option<Self::Item> {
 if self.current < self.max {
 self.current += 1;
 Some(self.current)
 } else {
 None
 }
 }
}

fn main() {
 let counter = Counter::new(5);
 
 for num in counter {
 println!("{}", num);
 }
 
 // Can use all iterator methods
 let sum: u32 = Counter::new(5).sum();
 println!("Sum: {}", sum);
 
 let doubled: Vec<u32> = Counter::new(3)
 .map(|x| x * 2)
 .collect();
 println!("Doubled: {:?}", doubled);
}
```

</RustPlayground>

---

## 7. Performance

### 7.1 Zero-Cost Abstraction

```rust
// These compile to the same machine code!

// Iterator style
let sum: i32 = (0..1000).filter(|x| x % 2 == 0).sum();

// Loop style
let mut sum = 0;
for x in 0..1000 {
 if x % 2 == 0 {
 sum += x;
 }
}
```

### 7.2 Comparison with Other Languages

| Feature | Rust | Python | JavaScript |
|---------|------|--------|------------|
| Lazy | Yes | Generator | Some |
| Zero-cost | Yes | No | No |
| Type-safe | Yes | No | No |
| Parallel | rayon | multiprocessing | Workers |

---

## 8. สรุป

| Concept | Description |
|---------|-------------|
| Closure | Anonymous function with environment capture |
| `move` | Transfer ownership to closure |
| `iter()` | Borrow iterator |
| `into_iter()` | Owning iterator |
| `map()` | Transform elements |
| `filter()` | Keep matching elements |
| `collect()` | Consume into collection |
| `fold()` | Accumulate with initial value |

---

[บทถัดไป: Concurrency](/advanced/concurrency)
