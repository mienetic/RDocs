# tuple - กลุ่มค่าหลายชนิด

`(T, U, ...)` คือ tuple - รวมค่าหลาย type เข้าด้วยกัน! 

---

## tuple คืออะไร?

Tuple คือ collection ที่:
- **หลาย types** ได้ในตัวเดียว
- **ขนาดคงที่** - รู้ตอน compile
- **Access ด้วย index** - `.0`, `.1`, `.2`

---

## 1. การประกาศ

<RustPlayground>

```rust
fn main() {
 // Tuple หลาย types
 let person: (&str, i32, bool) = ("Alice", 30, true);
 println!("person = {:?}", person);
 
 // Type inference
 let point = (10, 20);
 println!("point = {:?}", point);
 
 // Single element tuple (ต้องมี comma!)
 let single = (42,);
 println!("single = {:?}", single);
 
 // Empty tuple = unit
 let empty: () = ();
 println!("empty = {:?}", empty);
}
```

</RustPlayground>

---

## 2. Accessing Elements

<RustPlayground>

```rust
fn main() {
 let tuple = ("hello", 42, 3.14, true);
 
 // Access ด้วย .N
 println!("tuple.0 = {}", tuple.0);
 println!("tuple.1 = {}", tuple.1);
 println!("tuple.2 = {}", tuple.2);
 println!("tuple.3 = {}", tuple.3);
 
 // Mutable tuple
 let mut pair = (1, 2);
 pair.0 = 100;
 pair.1 = 200;
 println!("pair = {:?}", pair);
}
```

</RustPlayground>

---

## 3. Destructuring

<RustPlayground>

```rust
fn main() {
 let person = ("Bob", 25, true);
 
 // Destructure ทั้งหมด
 let (name, age, active) = person;
 println!("name = {}", name);
 println!("age = {}", age);
 println!("active = {}", active);
 
 // ใช้ _ เพื่อ ignore
 let (name, _, _) = person;
 println!("just name = {}", name);
 
 // Destructure บางส่วน
 let (first, rest @ ..) = (1, 2, 3, 4, 5);
 println!("first = {}", first);
 println!("rest = {:?}", rest);
}
```

</RustPlayground>

---

## 4. Function Returns

<RustPlayground>

```rust
// Return หลายค่าด้วย tuple
fn divide(a: i32, b: i32) -> (i32, i32) {
 (a / b, a % b) // (quotient, remainder)
}

fn minmax(nums: &[i32]) -> Option<(i32, i32)> {
 if nums.is_empty() {
 return None;
 }
 let min = *nums.iter().min().unwrap();
 let max = *nums.iter().max().unwrap();
 Some((min, max))
}

fn main() {
 let (quot, rem) = divide(17, 5);
 println!("17 / 5 = {} remainder {}", quot, rem);
 
 let nums = [3, 1, 4, 1, 5, 9];
 if let Some((min, max)) = minmax(&nums) {
 println!("min = {}, max = {}", min, max);
 }
}
```

</RustPlayground>

---

## 5. Pattern Matching

<RustPlayground>

```rust
fn main() {
 let result: (bool, i32) = (true, 42);
 
 match result {
 (true, n) => println!("success with {}", n),
 (false, code) => println!("error code {}", code),
 }
 
 // Guards
 let point = (3, 4);
 match point {
 (0, 0) => println!("origin"),
 (x, 0) => println!("on x-axis at {}", x),
 (0, y) => println!("on y-axis at {}", y),
 (x, y) if x == y => println!("diagonal at {}", x),
 (x, y) => println!("at ({}, {})", x, y),
 }
}
```

</RustPlayground>

---

## 6. Tuple Comparisons

<RustPlayground>

```rust
fn main() {
 // Tuples compare element by element
 let a = (1, 2, 3);
 let b = (1, 2, 3);
 let c = (1, 2, 4);
 
 println!("a == b: {}", a == b); // true
 println!("a < c: {}", a < c); // true (compare 3rd element)
 
 // Sorting by tuple
 let mut pairs = vec![(2, 'b'), (1, 'a'), (2, 'a'), (1, 'b')];
 pairs.sort();
 println!("sorted: {:?}", pairs); // [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
}
```

</RustPlayground>

---

## 7. Common Use Cases

<RustPlayground>

```rust
fn main() {
 // 1. Swap values
 let mut a = 1;
 let mut b = 2;
 (a, b) = (b, a);
 println!("swapped: a={}, b={}", a, b);
 
 // 2. Enumerate
 let items = ["a", "b", "c"];
 for (index, item) in items.iter().enumerate() {
 println!("{}: {}", index, item);
 }
 
 // 3. Zip
 let names = ["Alice", "Bob"];
 let scores = [95, 87];
 for (name, score) in names.iter().zip(scores.iter()) {
 println!("{}: {}", name, score);
 }
 
 // 4. Multiple assignment
 let (x, y, z) = (1, 2, 3);
 println!("x={}, y={}, z={}", x, y, z);
}
```

</RustPlayground>

---

## Quick Reference

### Creation
| Syntax | คำอธิบาย |
|--------|---------|
| `(a, b)` | Pair |
| `(a, b, c)` | Triple |
| `(a,)` | Single (ต้องมี comma) |
| `()` | Unit (empty) |

### Access
| Syntax | คำอธิบาย |
|--------|---------|
| `t.0, t.1, t.2` | By index |
| `let (a, b) = t` | Destructure |
| `let (a, _) = t` | Ignore some |

### Limits
- Maximum 12 elements สำหรับ traits บางอัน
- ใช้ struct ถ้าต้องการมากกว่า

### Common Patterns
| Pattern | ใช้กับ |
|---------|-------|
| `(i, v)` | enumerate() |
| `(a, b)` | zip() |
| `(Ok(v), Err(e))` | Result pair |

---

[← slice](./slice) | [reference →](./reference)
