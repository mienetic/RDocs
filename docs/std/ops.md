# Operators - ตัวดำเนินการ

**std::ops** มี traits สำหรับ overload operators เช่น `+`, `-`, `*`, `[]` และอื่นๆ! 

---

## ops คืออะไร?

เมื่อ implement traits เหล่านี้ คุณสามารถใช้ operators กับ types ของคุณได้:

| Operator | Trait | ตัวอย่าง |
|----------|-------|---------|
| `+` | `Add` | `a + b` |
| `-` | `Sub` | `a - b` |
| `*` | `Mul` | `a * b` |
| `/` | `Div` | `a / b` |
| `[]` | `Index` | `a[i]` |
| `*x` | `Deref` | `*ptr` |

---

## 1. Add และ Sub

<RustPlayground>

```rust
use std::ops::{Add, Sub};

#[derive(Debug, Clone, Copy)]
struct Point {
 x: i32,
 y: i32,
}

// Implement + operator
impl Add for Point {
 type Output = Point; // ผลลัพธ์เป็น Point
 
 fn add(self, other: Point) -> Point {
 Point {
 x: self.x + other.x,
 y: self.y + other.y,
 }
 }
}

// Implement - operator
impl Sub for Point {
 type Output = Point;
 
 fn sub(self, other: Point) -> Point {
 Point {
 x: self.x - other.x,
 y: self.y - other.y,
 }
 }
}

fn main() {
 let p1 = Point { x: 1, y: 2 };
 let p2 = Point { x: 3, y: 4 };
 
 let sum = p1 + p2;
 let diff = p1 - p2;
 
 println!("{:?} + {:?} = {:?}", p1, p2, sum);
 println!("{:?} - {:?} = {:?}", p1, p2, diff);
}
```

</RustPlayground>

---

## 2. Mul และ Div

<RustPlayground>

```rust
use std::ops::{Mul, Div};

#[derive(Debug, Clone, Copy)]
struct Vector2 {
 x: f64,
 y: f64,
}

// คูณ Vector ด้วย scalar
impl Mul<f64> for Vector2 {
 type Output = Vector2;
 
 fn mul(self, scalar: f64) -> Vector2 {
 Vector2 {
 x: self.x * scalar,
 y: self.y * scalar,
 }
 }
}

// หาร Vector ด้วย scalar
impl Div<f64> for Vector2 {
 type Output = Vector2;
 
 fn div(self, scalar: f64) -> Vector2 {
 Vector2 {
 x: self.x / scalar,
 y: self.y / scalar,
 }
 }
}

fn main() {
 let v = Vector2 { x: 3.0, y: 4.0 };
 
 let doubled = v * 2.0;
 let halved = v / 2.0;
 
 println!("{:?} * 2 = {:?}", v, doubled);
 println!("{:?} / 2 = {:?}", v, halved);
}
```

</RustPlayground>

---

## 3. Index และ IndexMut

<RustPlayground>

```rust
use std::ops::{Index, IndexMut};

struct Matrix {
 data: Vec<Vec<i32>>,
}

// Index สำหรับอ่าน: matrix[row]
impl Index<usize> for Matrix {
 type Output = Vec<i32>;
 
 fn index(&self, row: usize) -> &Vec<i32> {
 &self.data[row]
 }
}

// IndexMut สำหรับแก้ไข: matrix[row][col] = value
impl IndexMut<usize> for Matrix {
 fn index_mut(&mut self, row: usize) -> &mut Vec<i32> {
 &mut self.data[row]
 }
}

fn main() {
 let mut matrix = Matrix {
 data: vec![
 vec![1, 2, 3],
 vec![4, 5, 6],
 vec![7, 8, 9],
 ],
 };
 
 // อ่านด้วย []
 println!("matrix[1]: {:?}", matrix[1]);
 println!("matrix[1][2]: {}", matrix[1][2]);
 
 // แก้ไขด้วย []
 matrix[0][0] = 100;
 println!("หลังแก้ไข: {:?}", matrix[0]);
}
```

</RustPlayground>

---

## 4. Deref และ DerefMut

<RustPlayground>

```rust
use std::ops::{Deref, DerefMut};

// Smart pointer อย่างง่าย
struct MyBox<T>(T);

impl<T> MyBox<T> {
 fn new(value: T) -> MyBox<T> {
 MyBox(value)
 }
}

// Deref = ใช้ * operator อ่านค่า
impl<T> Deref for MyBox<T> {
 type Target = T;
 
 fn deref(&self) -> &T {
 &self.0
 }
}

// DerefMut = ใช้ * operator แก้ไขค่า
impl<T> DerefMut for MyBox<T> {
 fn deref_mut(&mut self) -> &mut T {
 &mut self.0
 }
}

fn main() {
 let boxed = MyBox::new(5);
 
 // ใช้ * เข้าถึงค่าภายใน
 println!("value: {}", *boxed);
 
 // Deref coercion: &MyBox<T> -> &T อัตโนมัติ
 fn takes_ref(n: &i32) {
 println!("got: {}", n);
 }
 
 takes_ref(&boxed); // works! deref coercion
 
 // แก้ไขผ่าน DerefMut
 let mut mutable = MyBox::new(10);
 *mutable = 20;
 println!("mutable: {}", *mutable);
}
```

</RustPlayground>

---

## 5. Neg และ Not

<RustPlayground>

```rust
use std::ops::{Neg, Not};

#[derive(Debug, Clone, Copy)]
struct Point { x: i32, y: i32 }

// -point = กลับทิศ
impl Neg for Point {
 type Output = Point;
 
 fn neg(self) -> Point {
 Point { x: -self.x, y: -self.y }
 }
}

#[derive(Debug)]
struct Flags(u8);

// !flags = กลับทุก bit
impl Not for Flags {
 type Output = Flags;
 
 fn not(self) -> Flags {
 Flags(!self.0)
 }
}

fn main() {
 let p = Point { x: 3, y: 4 };
 let negated = -p;
 println!("{:?} -> {:?}", p, negated);
 
 let f = Flags(0b00001111);
 let inverted = !f;
 println!("flags: {:08b} -> {:08b}", 0b00001111u8, inverted.0);
}
```

</RustPlayground>

---

## 6. Assign Operators (+=, -=, etc.)

<RustPlayground>

```rust
use std::ops::{AddAssign, SubAssign};

#[derive(Debug)]
struct Counter {
 value: i32,
}

// += operator
impl AddAssign<i32> for Counter {
 fn add_assign(&mut self, rhs: i32) {
 self.value += rhs;
 }
}

// -= operator
impl SubAssign<i32> for Counter {
 fn sub_assign(&mut self, rhs: i32) {
 self.value -= rhs;
 }
}

fn main() {
 let mut counter = Counter { value: 0 };
 
 counter += 5;
 println!("หลัง += 5: {:?}", counter);
 
 counter += 3;
 println!("หลัง += 3: {:?}", counter);
 
 counter -= 2;
 println!("หลัง -= 2: {:?}", counter);
}
```

</RustPlayground>

---

## 7. Fn, FnMut, FnOnce

<RustPlayground>

```rust
// Closures implement Fn traits อัตโนมัติ

fn call_fn<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
 f(x) // เรียกหลายครั้งได้
}

fn call_fn_mut<F: FnMut(i32) -> i32>(mut f: F, x: i32) -> i32 {
 f(x) // อาจแก้ไข captured values
}

fn call_fn_once<F: FnOnce(i32) -> i32>(f: F, x: i32) -> i32 {
 f(x) // เรียกได้ครั้งเดียว
}

fn main() {
 // Fn - ไม่แก้ไขอะไร
 let multiplier = 3;
 let triple = |x| x * multiplier;
 println!("triple(5) = {}", call_fn(triple, 5));
 
 // FnMut - แก้ไข captured value
 let mut sum = 0;
 let mut add_to_sum = |x| { sum += x; sum };
 println!("add 5: {}", call_fn_mut(&mut add_to_sum, 5));
 println!("add 10: {}", call_fn_mut(&mut add_to_sum, 10));
 
 // FnOnce - move ownership
 let data = vec![1, 2, 3];
 let consume = move |x| {
 println!("data: {:?}", data);
 x
 };
 println!("consume(42) = {}", call_fn_once(consume, 42));
 // consume ใช้อีกไม่ได้
}
```

</RustPlayground>

---

## Quick Reference

### Arithmetic
| Trait | Operator | Method |
|-------|----------|--------|
| `Add` | `+` | `add(self, rhs)` |
| `Sub` | `-` | `sub(self, rhs)` |
| `Mul` | `*` | `mul(self, rhs)` |
| `Div` | `/` | `div(self, rhs)` |
| `Rem` | `%` | `rem(self, rhs)` |
| `Neg` | `-x` | `neg(self)` |

### Assignment
| Trait | Operator | Method |
|-------|----------|--------|
| `AddAssign` | `+=` | `add_assign(&mut self, rhs)` |
| `SubAssign` | `-=` | `sub_assign(&mut self, rhs)` |
| `MulAssign` | `*=` | `mul_assign(&mut self, rhs)` |
| `DivAssign` | `/=` | `div_assign(&mut self, rhs)` |

### Access
| Trait | Operator | Method |
|-------|----------|--------|
| `Index` | `[]` | `index(&self, idx)` |
| `IndexMut` | `[]` | `index_mut(&mut self, idx)` |
| `Deref` | `*` | `deref(&self)` |
| `DerefMut` | `*` | `deref_mut(&mut self)` |

### Function
| Trait | Usage |
|-------|-------|
| `Fn` | เรียกหลายครั้ง ไม่แก้ไข |
| `FnMut` | เรียกหลายครั้ง อาจแก้ไข |
| `FnOnce` | เรียกครั้งเดียว |

---

[← Cell](./cell) | [Convert →](./convert)
