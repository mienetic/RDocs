# ตัวแปรและชนิดข้อมูล

ตัวแปรใน Rust มีความพิเศษ เพราะ **ไม่สามารถเปลี่ยนค่าได้** โดย default!

## 1. Mutability (การเปลี่ยนแปลงค่า)

### 1.1 Immutable by Default

<RustPlayground>

```rust
fn main() {
    // ประกาศตัวแปรด้วย let
    let x = 5;
    println!("x = {}", x);
    
    // ❌ ERROR! ไม่สามารถเปลี่ยนค่าได้
    // x = 6; // cannot assign twice to immutable variable
}
```

</RustPlayground>

### 1.2 Mutable Variables (mut)

<RustPlayground>

```rust
fn main() {
    // mut = mutable (เปลี่ยนค่าได้)
    let mut x = 5;
    println!("x = {}", x);
    
    // ✅ OK! เพราะใช้ mut
    x = 6;
    println!("x = {}", x);
    
    // เพิ่มค่าก็ได้
    x += 1;
    println!("x = {}", x); // 7
}
```

</RustPlayground>

### 1.3 ทำไมต้อง Immutable?

:::info ข้อดีของ Immutable by Default

**1. ปลอดภัยกว่า** - ป้องกันการเปลี่ยนค่าโดยไม่ตั้งใจ:
```rust
let config = "production";
// ไม่มีใครเปลี่ยน config ได้ = ปลอดภัย!
```

**2. อ่านง่ายกว่า** - รู้ว่าค่าจะไม่เปลี่ยน:
```rust
let pi = 3.14159;
// เห็นปุ๊บ รู้เลยว่า pi จะเป็น 3.14159 ตลอด
```

**3. Concurrency** - ปลอดภัยกว่าในโปรแกรม multi-thread

**4. Optimization** - Compiler optimize ได้ดีกว่า
:::

### 1.4 เปรียบเทียบกับภาษาอื่น

| ภาษา | Mutable | Immutable |
|------|---------|-----------|
| **Rust** | `let mut x = 5` | `let x = 5` (default) |
| **JavaScript** | `let x = 5` (default) | `const x = 5` |
| **Python** | `x = 5` (ทุกตัว mutable) | ไม่มี built-in |
| **Java** | `int x = 5` (default) | `final int x = 5` |
| **C++** | `int x = 5` (default) | `const int x = 5` |
| **Kotlin** | `var x = 5` | `val x = 5` |
| **Swift** | `var x = 5` | `let x = 5` |

---

## 2. Shadowing

### 2.1 Shadowing คืออะไร?

การประกาศตัวแปรชื่อเดิมซ้ำ (สร้างตัวแปรใหม่):

<RustPlayground>

```rust
fn main() {
    let x = 5;
    println!("x = {}", x);  // 5
    
    // Shadow ตัวแปร x ด้วยค่าใหม่
    let x = x + 1;
    println!("x = {}", x);  // 6
    
    // Shadow อีกครั้ง
    let x = x * 2;
    println!("x = {}", x);  // 12
}
```

</RustPlayground>

### 2.2 Shadowing vs mut

<RustPlayground>

```rust
fn main() {
    // Shadowing: เปลี่ยน type ได้!
    let spaces = "   ";        // &str
    let spaces = spaces.len(); // usize
    println!("spaces = {}", spaces);
    
    // mut: เปลี่ยน type ไม่ได้!
    // let mut spaces = "   ";
    // spaces = spaces.len();  // ❌ ERROR: type mismatch
}
```

</RustPlayground>

### 2.3 เปรียบเทียบ Shadowing vs mut

| | Shadowing | mut |
|---|-----------|-----|
| เปลี่ยน type ได้ | ✅ Yes | ❌ No |
| สร้างตัวแปรใหม่ | ✅ Yes (let ใหม่) | ❌ No (ตัวเดิม) |
| ใช้เมื่อ | Transform ข้อมูล | Update ค่า |

---

## 3. Scalar Types (ค่าเดี่ยว)

### 3.1 Integers (จำนวนเต็ม)

#### Signed Integers (มีค่าลบได้)

| Type | Size | Range |
|------|------|-------|
| `i8` | 8-bit | -128 ถึง 127 |
| `i16` | 16-bit | -32,768 ถึง 32,767 |
| `i32` | 32-bit | -2.1 พันล้าน ถึง 2.1 พันล้าน |
| `i64` | 64-bit | ใหญ่มาก |
| `i128` | 128-bit | ใหญ่มากมาก |
| `isize` | arch | 32 หรือ 64 bit (ตามระบบ) |

#### Unsigned Integers (ไม่มีค่าลบ)

| Type | Size | Range |
|------|------|-------|
| `u8` | 8-bit | 0 ถึง 255 |
| `u16` | 16-bit | 0 ถึง 65,535 |
| `u32` | 32-bit | 0 ถึง 4.3 พันล้าน |
| `u64` | 64-bit | ใหญ่มาก |
| `u128` | 128-bit | ใหญ่มากมาก |
| `usize` | arch | ใช้กับ index และ pointer |

<RustPlayground>

```rust
fn main() {
    let a: i32 = -42;     // Signed (มีลบได้)
    let b: u32 = 42;      // Unsigned (บวกเท่านั้น)
    let c: i64 = 1_000_000;  // _ ช่วยอ่านง่าย
    
    println!("a={}, b={}, c={}", a, b, c);
    
    // Literal formats
    let decimal = 98_222;
    let hex = 0xff;
    let octal = 0o77;
    let binary = 0b1111_0000;
    let byte = b'A';  // u8 only
    
    println!("dec={}, hex={}, oct={}, bin={}, byte={}", 
             decimal, hex, octal, binary, byte);
}
```

</RustPlayground>

### 3.2 Floating-Point Numbers (ทศนิยม)

| Type | Size | Precision |
|------|------|-----------|
| `f32` | 32-bit | ~6-7 digits |
| `f64` | 64-bit | ~15-16 digits (default) |

<RustPlayground>

```rust
fn main() {
    let x = 2.0;        // f64 (default)
    let y: f32 = 3.0;   // f32
    
    println!("x={}, y={}", x, y);
    
    // Operations
    let sum = 5.0 + 10.0;
    let difference = 95.5 - 4.3;
    let product = 4.0 * 30.0;
    let quotient = 56.7 / 32.2;
    
    println!("sum={}, diff={}, prod={}, quot={}", 
             sum, difference, product, quotient);
}
```

</RustPlayground>

### 3.3 Boolean

<RustPlayground>

```rust
fn main() {
    let t: bool = true;
    let f: bool = false;
    
    println!("t={}, f={}", t, f);
    
    // Boolean operations
    println!("AND: {}", t && f);
    println!("OR: {}", t || f);
    println!("NOT: {}", !t);
}
```

</RustPlayground>

### 3.4 Character

Rust `char` คือ Unicode Scalar Value (4 bytes):

<RustPlayground>

```rust
fn main() {
    let c = 'z';
    let z: char = 'ℤ';
    let heart = '❤';
    let thai = 'ก';
    let emoji = '😀';
    
    println!("c={}, z={}, heart={}, thai={}, emoji={}", 
             c, z, heart, thai, emoji);
    
    // char size = 4 bytes (Unicode)
    println!("char size: {} bytes", std::mem::size_of::<char>());
}
```

</RustPlayground>

---

## 4. Compound Types (ค่าหลายตัว)

### 4.1 Tuples

Tuple รวมค่าหลายตัวที่มี type ต่างกันได้:

<RustPlayground>

```rust
fn main() {
    // สร้าง tuple
    let tup: (i32, f64, bool) = (500, 6.4, true);
    
    // Destructuring
    let (x, y, z) = tup;
    println!("x={}, y={}, z={}", x, y, z);
    
    // Access by index
    println!("tup.0={}, tup.1={}, tup.2={}", tup.0, tup.1, tup.2);
    
    // Unit tuple (ไม่มีค่า)
    let unit: () = ();
    println!("unit={:?}", unit);
}
```

</RustPlayground>

### 4.2 Arrays

Array มีขนาดคงที่ และทุก element มี type เดียวกัน:

<RustPlayground>

```rust
fn main() {
    // สร้าง array
    let a: [i32; 5] = [1, 2, 3, 4, 5];
    println!("array: {:?}", a);
    
    // Access by index
    println!("a[0]={}, a[4]={}", a[0], a[4]);
    
    // Array with same value
    let zeros = [0; 5];  // [0, 0, 0, 0, 0]
    println!("zeros: {:?}", zeros);
    
    // Length
    println!("length: {}", a.len());
    
    // Iterate
    for element in &a {
        print!("{} ", element);
    }
    println!();
}
```

</RustPlayground>

### 4.3 Array vs Vec

| | Array `[T; N]` | Vec `Vec<T>` |
|---|---------------|--------------|
| Size | คงที่ (compile-time) | เปลี่ยนได้ (runtime) |
| Memory | Stack | Heap |
| ใช้เมื่อ | รู้ขนาดล่วงหน้า | ขนาดเปลี่ยนได้ |

---

## 5. Type Inference

### 5.1 Rust เดา Type ให้

<RustPlayground>

```rust
fn main() {
    // Rust เดา type ได้
    let x = 5;          // i32 (default for integers)
    let y = 2.0;        // f64 (default for floats)
    let z = true;       // bool
    let s = "hello";    // &str
    
    println!("x={}, y={}, z={}, s={}", x, y, z, s);
}
```

</RustPlayground>

### 5.2 เมื่อต้องระบุ Type

<RustPlayground>

```rust
fn main() {
    // ต้องระบุ type เมื่อ:
    
    // 1. Parse string to number
    let guess: u32 = "42".parse().expect("Not a number");
    println!("guess: {}", guess);
    
    // 2. Collection ที่ยังไม่มี element
    let numbers: Vec<i32> = Vec::new();
    println!("numbers: {:?}", numbers);
    
    // 3. Function parameters (บังคับเสมอ)
    fn add(a: i32, b: i32) -> i32 {
        a + b
    }
    println!("1 + 2 = {}", add(1, 2));
}
```

</RustPlayground>

---

## 6. Constants

### 6.1 const vs let

<RustPlayground>

```rust
// Constants: ต้องระบุ type, ใช้ได้ทุกที่
const MAX_POINTS: u32 = 100_000;
const PI: f64 = 3.14159265359;

fn main() {
    println!("MAX_POINTS: {}", MAX_POINTS);
    println!("PI: {}", PI);
    
    // let: runtime, อยู่ใน scope
    let x = 5;
    println!("x: {}", x);
}
```

</RustPlayground>

### 6.2 const vs static

| | `const` | `static` |
|---|---------|----------|
| Memory | Inline everywhere | Fixed address |
| Mutable | ❌ Never | ✅ With `static mut` (unsafe) |
| ใช้เมื่อ | ค่าคงที่ทั่วไป | Global state (rare) |

---

## 7. Common Errors

:::danger Error: Cannot assign twice to immutable variable

```rust
let x = 5;
x = 6;  // ❌ ERROR!
```

**วิธีแก้:**
```rust
let mut x = 5;  // ✅ เพิ่ม mut
x = 6;
```
:::

:::danger Error: Mismatched types

```rust
let x: i32 = "hello";  // ❌ ERROR!
```

**วิธีแก้:**
```rust
let x: i32 = 42;           // ✅ ใส่ค่าที่ถูก type
let y: &str = "hello";     // ✅ หรือเปลี่ยน type
```
:::

:::warning Warning: Unused mut

```rust
let mut x = 5;  // ⚠️ warning: variable does not need to be mutable
println!("{}", x);
```

**วิธีแก้:** ลบ `mut` ถ้าไม่ได้ใช้เปลี่ยนค่า
:::

---

## 8. สรุป

| Concept | คำอธิบาย | ตัวอย่าง |
|---------|---------|---------|
| Immutable | ค่าคงที่ (default) | `let x = 5;` |
| Mutable | เปลี่ยนค่าได้ | `let mut x = 5;` |
| Shadowing | ประกาศใหม่ชื่อเดิม | `let x = x + 1;` |
| Integer | เลขจำนวนเต็ม | `i32`, `u64` |
| Float | เลขทศนิยม | `f32`, `f64` |
| Boolean | จริง/เท็จ | `true`, `false` |
| Char | Unicode character | `'a'`, `'ก'` |
| Tuple | ค่าหลาย type | `(1, "hi", true)` |
| Array | ค่าเดียวกัน, ขนาดคงที่ | `[1, 2, 3]` |

---

[บทถัดไป: Functions](/beginner/functions)
