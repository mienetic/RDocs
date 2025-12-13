# Operator Traits

`Add`, `Sub`, `Index`, `Fn` และอื่นๆ ใน `std::ops`! 

---

## Arithmetic Operators

`Add`, `Sub`, `Mul`, `Div`, `Rem` สำหรับการคำนวณ

<RustPlayground>

```rust
use std::ops::Add;

#[derive(Debug, Copy, Clone, PartialEq)]
struct Point {
 x: i32,
 y: i32,
}

impl Add for Point {
 type Output = Point;

 fn add(self, other: Point) -> Point {
 Point {
 x: self.x + other.x,
 y: self.y + other.y,
 }
 }
}

fn main() {
 let p1 = Point { x: 1, y: 0 };
 let p2 = Point { x: 2, y: 3 };
 
 // ใช้เครื่องหมาย + ได้เลย
 let p3 = p1 + p2;
 
 println!("p1: {:?}", p1);
 println!("p2: {:?}", p2);
 println!("p1 + p2 = {:?}", p3);
}
```

</RustPlayground>

---

## Indexing Operators

`Index` (immutable) และ `IndexMut` (mutable) สำหรับ `[]`

<RustPlayground>

```rust
use std::ops::{Index, IndexMut};

#[derive(Debug)]
struct Matrix {
 data: [f64; 4],
}

// Read-only access: matrix[i]
impl Index<usize> for Matrix {
 type Output = f64;

 fn index(&self, index: usize) -> &Self::Output {
 &self.data[index]
 }
}

// Mutable access: matrix[i] = x
impl IndexMut<usize> for Matrix {
 fn index_mut(&mut self, index: usize) -> &mut Self::Output {
 &mut self.data[index]
 }
}

fn main() {
 let mut m = Matrix { data: [1.0, 2.0, 3.0, 4.0] };
 
 println!("Before: {:?}", m.data);
 
 // Read
 println!("Index 1: {}", m[1]);
 
 // Write
 m[1] = 5.0;
 println!("After: {:?}", m.data);
}
```

</RustPlayground>

---

## Closure Traits

`Fn`, `FnMut`, `FnOnce` สำหรับ function objects และ closures

<RustPlayground>

```rust
fn apply_twice<F>(mut f: F, x: i32) -> i32 
where F: FnMut(i32) -> i32 
{
 let temp = f(x);
 f(temp)
}

fn main() {
 let mut multiplier = 2;
 
 // Closure capture `multiplier` แบบ mutable
 let mut double = |x| {
 println!("Multiplying {} by {}", x, multiplier);
 x * multiplier
 };
 
 let result = apply_twice(double, 5);
 println!("Result: {}", result);
 
 // FnOnce example
 let s = String::from("Consumed");
 let consume = || {
 println!("Eating: {}", s);
 // s ถูก drop ที่นี่ ใช้ได้ครั้งเดียว
 };
 
 consume();
 // consume(); // Error! เรียกซ้ำไม่ได้
}
```

</RustPlayground>

---

## Deref Coercion

`Deref` ช่วยให้ compiler แปลง types อัตโนมัติ

<RustPlayground>

```rust
use std::ops::Deref;

struct Wrapper<T>(T);

impl<T> Deref for Wrapper<T> {
 type Target = T;
 
 fn deref(&self) -> &T {
 &self.0
 }
}

fn show_str(s: &str) {
 println!("String: {}", s);
}

fn main() {
 let w = Wrapper(String::from("Hello"));
 
 // Deref coercion: &Wrapper<String> -> &String -> &str
 show_str(&w);
 
 // เรียก method ของ String บน Wrapper ได้เลย
 println!("Length: {}", w.len());
}
```

</RustPlayground>

---

## Quick Reference

### Operator Traits
| Trait | Operator | คำอธิบาย |
|-------|----------|---------|
| `Add` | `+` | บวก |
| `Sub` | `-` | ลบ |
| `Mul` | `*` | คูณ |
| `Div` | `/` | หาร |
| `Rem` | `%` | หารเอาเศษ |
| `Neg` | `-x` | ลบค่า (unary) |
| `Not` | `!x` | นิเสธ (unary) |
| `Index` | `x[i]` | เข้าถึงสมาชิก |
| `IndexMut` | `x[i] = v` | แก้ไขสมาชิก |

### Closure Traits
| Trait | Capture | คำอธิบาย |
|-------|---------|---------|
| `Fn` | `&T` | เรียกได้หลายครั้ง (immutable) |
| `FnMut` | `&mut T` | เรียกได้หลายครั้ง (mutable) |
| `FnOnce` | `T` | เรียกได้ครั้งเดียว (consume) |

---

[← Concurrency](./concurrency) | [Memory →](./memory)
