# ฟังก์ชัน

ฟังก์ชันเป็นหัวใจสำคัญของการเขียนโปรแกรม Rust!

## การประกาศฟังก์ชัน

### รูปแบบพื้นฐาน

```rust
fn function_name(parameter: Type) -> ReturnType {
    // body
}
```

### ฟังก์ชันง่ายๆ ไม่มี Parameter

<RustPlayground>

```rust
fn main() {
    greet();  // เรียกใช้ฟังก์ชัน
}

fn greet() {
    println!("สวัสดีครับ!");
}
```

</RustPlayground>

### ฟังก์ชันรับ Parameter

<RustPlayground>

```rust
fn main() {
    say_hello("Alex");
    say_hello("Ferris");
}

fn say_hello(name: &str) {
    println!("สวัสดี {}!", name);
}
```

</RustPlayground>

:::tip Parameter ต้องระบุ Type เสมอ!
ต่างจาก Python/JavaScript ที่ไม่ต้องบอก type

```rust
// Rust - ต้องระบุ type
fn greet(name: &str) { ... }

// Python - ไม่ต้องระบุ
// def greet(name): ...

// JavaScript - ไม่ต้องระบุ
// function greet(name) { ... }
```
:::

## Parameters หลายตัว

### หลาย Parameters เหมือน Type

<RustPlayground>

```rust
fn main() {
    print_sum(10, 20);
}

// ต่างจาก C: ต้องระบุ type ทุกตัว
fn print_sum(a: i32, b: i32) {
    println!("{} + {} = {}", a, b, a + b);
}
```

</RustPlayground>

### หลาย Parameters ต่าง Type

<RustPlayground>

```rust
fn main() {
    print_info("Alex", 25);
    calculate(10, 20, 3.5);
}

fn print_info(name: &str, age: u32) {
    println!("{} อายุ {} ปี", name, age);
}

fn calculate(a: i32, b: i32, multiplier: f64) {
    let sum = a + b;
    let result = (sum as f64) * multiplier;
    println!("{} + {} = {}, x {} = {}", a, b, sum, multiplier, result);
}
```

</RustPlayground>

## Return Value

<RustPlayground>

```rust
fn main() {
    let result = add(5, 3);
    println!("5 + 3 = {}", result);
    
    let product = multiply(4, 7);
    println!("4 * 7 = {}", product);
    
    let square = get_square(9);
    println!("9^2 = {}", square);
}

// วิธีที่ 1: ไม่ใส่ ; บรรทัดสุดท้าย = return โดยอัตโนมัติ
fn add(a: i32, b: i32) -> i32 {
    a + b  // ไม่มี ; = return ค่านี้
}

// วิธีที่ 2: ใช้ return keyword
fn multiply(a: i32, b: i32) -> i32 {
    return a * b;  // explicit return
}

// ใช้ return ตรงกลางฟังก์ชัน (early return)
fn get_square(n: i32) -> i32 {
    if n < 0 {
        return 0; // early return
    }
    n * n  // implicit return
}
```

</RustPlayground>

### เปรียบเทียบ Return Syntax

| Rust | JavaScript | Python |
|------|------------|--------|
| `fn add(a: i32, b: i32) -> i32 { a + b }` | `function add(a, b) { return a + b; }` | `def add(a, b): return a + b` |
| `fn add(a: i32, b: i32) -> i32 { return a + b; }` | เหมือนกัน | เหมือนกัน |

## Expression vs Statement

<RustPlayground>

```rust
fn main() {
    // Statement: ไม่ return ค่า
    let x = 5;  // นี่คือ statement
    
    // Expression: return ค่า
    let y = {
        let temp = 3;
        temp + 1  // ไม่มี ; = expression, return 4
    };
    println!("y = {}", y);  // 4
    
    // if เป็น expression
    let number = 7;
    let description = if number > 5 { "big" } else { "small" };
    println!("number is {}", description);
    
    // match เป็น expression
    let day = 3;
    let day_name = match day {
        1 => "Monday",
        2 => "Tuesday",
        3 => "Wednesday",
        _ => "Other",
    };
    println!("Day: {}", day_name);
}
```

</RustPlayground>

### Statement vs Expression

| | Statement | Expression |
|---|-----------|------------|
| Return ค่า | ไม่ | ใช่ |
| มี `;` | มักมี | มักไม่มี (ถ้า return) |
| ตัวอย่าง | `let x = 5;` | `5 + 3`, `if`, `match`, `{}` block |

## Multiple Return Values (Tuple)

<RustPlayground>

```rust
fn main() {
    let (quotient, remainder) = divide(10, 3);
    println!("10 / 3 = {} เศษ {}", quotient, remainder);
    
    let (min, max) = min_max(5, 10, 3, 8);
    println!("min: {}, max: {}", min, max);
    
    // Destructure บางส่วน
    let (_, rem) = divide(17, 5);
    println!("17 mod 5 = {}", rem);
}

fn divide(a: i32, b: i32) -> (i32, i32) {
    (a / b, a % b)  // return tuple
}

fn min_max(a: i32, b: i32, c: i32, d: i32) -> (i32, i32) {
    let min = a.min(b).min(c).min(d);
    let max = a.max(b).max(c).max(d);
    (min, max)
}
```

</RustPlayground>

## Unit Type ()

<RustPlayground>

```rust
fn main() {
    let result = print_message();
    println!("Return value: {:?}", result);  // ()
    
    // explicit unit return
    let result2 = do_nothing();
    println!("Return value: {:?}", result2);  // ()
}

// ฟังก์ชันที่ไม่ return ค่า จริงๆ return () (unit)
fn print_message() {
    println!("Hello!");
}  // -> ()

// เขียน return type ชัดเจน
fn do_nothing() -> () {
    // ไม่ทำอะไร
}
```

</RustPlayground>

## Function Scope

<RustPlayground>

```rust
fn main() {
    let x = 5;
    
    // ฟังก์ชันไม่เห็นตัวแปรข้างนอก (ต้องส่งเป็น parameter)
    let result = add_to_x(x, 10);
    println!("Result: {}", result);
    
    // Nested function (ไม่ค่อยใช้)
    fn inner() {
        println!("I'm nested!");
    }
    inner();
}

fn add_to_x(x: i32, y: i32) -> i32 {
    x + y
}
```

</RustPlayground>

## Higher-Order Functions

<RustPlayground>

```rust
fn main() {
    // ส่งฟังก์ชันเป็น argument
    let result = apply_operation(5, 3, add);
    println!("5 + 3 = {}", result);
    
    let result = apply_operation(5, 3, multiply);
    println!("5 * 3 = {}", result);
    
    // Closure (anonymous function)
    let subtract = |a: i32, b: i32| -> i32 { a - b };
    let result = apply_operation(5, 3, subtract);
    println!("5 - 3 = {}", result);
}

fn add(a: i32, b: i32) -> i32 { a + b }
fn multiply(a: i32, b: i32) -> i32 { a * b }

// รับ function เป็น parameter
fn apply_operation(a: i32, b: i32, op: fn(i32, i32) -> i32) -> i32 {
    op(a, b)
}
```

</RustPlayground>

## เปรียบเทียบ Function Syntax

| ภาษา | Syntax |
|------|--------|
| **Rust** | `fn add(a: i32, b: i32) -> i32 { a + b }` |
| **JavaScript** | `function add(a, b) { return a + b; }` |
| **Python** | `def add(a, b): return a + b` |
| **Java** | `int add(int a, int b) { return a + b; }` |
| **Go** | `func add(a int, b int) int { return a + b }` |
| **C** | `int add(int a, int b) { return a + b; }` |

## สรุป

ในบทนี้เราได้เรียนรู้:

- ประกาศฟังก์ชันด้วย `fn`
- Parameters ต้องระบุ type
- Return type ใช้ `-> Type`
- Expression vs Statement
- Multiple returns ด้วย Tuple
- Unit type `()`
- Higher-order functions และ Closures

---

[บทถัดไป: Control Flow](./control-flow)
