# Pattern Matching

Pattern Matching ใน Rust ทรงพลังมาก! ไม่ใช่แค่ switch-case ธรรมดา 🎯

:::tip Pattern Matching คือ superpower!
มันสามารถ destructure, bind values, และ guard conditions ได้ในที่เดียว!
:::

---

## 1. Match Expression

### 1.1 Basic Match

<RustPlayground>

```rust
fn main() {
    let number = 3;
    
    match number {
        1 => println!("หนึ่ง"),
        2 => println!("สอง"),
        3 => println!("สาม"),
        _ => println!("อื่นๆ"),  // _ = wildcard (catch all)
    }
    
    // Match is an expression! (มีค่า return)
    let result = match number {
        1 => "one",
        2 => "two",
        3 => "three",
        _ => "other",
    };
    println!("Result: {}", result);
}
```

</RustPlayground>

### 1.2 Multiple Patterns

<RustPlayground>

```rust
fn main() {
    let x = 5;
    
    match x {
        // หลาย patterns ด้วย |
        1 | 2 | 3 => println!("1, 2, or 3"),
        
        // Range patterns
        4..=10 => println!("4 ถึง 10"),
        
        _ => println!("อื่นๆ"),
    }
}
```

</RustPlayground>

---

## 2. Destructuring

### 2.1 Destructure Tuples

<RustPlayground>

```rust
fn main() {
    let point = (3, 5);
    
    match point {
        (0, 0) => println!("Origin!"),
        (x, 0) => println!("บน x-axis ที่ x={}", x),
        (0, y) => println!("บน y-axis ที่ y={}", y),
        (x, y) => println!("จุด ({}, {})", x, y),
    }
    
    // ใช้ let destructuring ก็ได้
    let (x, y) = point;
    println!("x={}, y={}", x, y);
}
```

</RustPlayground>

### 2.2 Destructure Structs

<RustPlayground>

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 10, y: 20 };
    
    // Destructure ใน match
    match p {
        Point { x: 0, y: 0 } => println!("Origin!"),
        Point { x, y: 0 } => println!("บน x-axis ที่ {}", x),
        Point { x: 0, y } => println!("บน y-axis ที่ {}", y),
        Point { x, y } => println!("Point({}, {})", x, y),
    }
    
    // Destructure ด้วย let
    let Point { x, y } = p;
    println!("x={}, y={}", x, y);
    
    // Rename
    let Point { x: a, y: b } = p;
    println!("a={}, b={}", a, b);
}
```

</RustPlayground>

### 2.3 Destructure Enums

<RustPlayground>

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    Color(u8, u8, u8),
}

fn main() {
    let msg = Message::Color(255, 128, 0);
    
    match msg {
        Message::Quit => println!("Quit!"),
        Message::Move { x, y } => {
            println!("Move to ({}, {})", x, y);
        }
        Message::Write(text) => {
            println!("Text: {}", text);
        }
        Message::Color(r, g, b) => {
            println!("RGB({}, {}, {})", r, g, b);
        }
    }
}
```

</RustPlayground>

---

## 3. if let และ while let

### 3.1 if let (ง่ายกว่า match)

<RustPlayground>

```rust
fn main() {
    let some_value = Some(42);
    
    // แบบ match (verbose)
    match some_value {
        Some(x) => println!("Got: {}", x),
        None => (),  // ไม่ทำอะไร
    }
    
    // แบบ if let (กระชับกว่า)
    if let Some(x) = some_value {
        println!("Got: {}", x);
    }
    
    // if let กับ else
    if let Some(x) = some_value {
        println!("Got: {}", x);
    } else {
        println!("Got nothing!");
    }
}
```

</RustPlayground>

### 3.2 while let

<RustPlayground>

```rust
fn main() {
    let mut stack = vec![1, 2, 3];
    
    // ทำซ้ำจนกว่า pop() จะได้ None
    while let Some(top) = stack.pop() {
        println!("Got: {}", top);
    }
    
    println!("Stack is now empty!");
}
```

</RustPlayground>

### 3.3 let else (Rust 1.65+)

<RustPlayground>

```rust
fn main() {
    let some_value = Some(42);
    
    // let-else: ต้อง match หรือ return/break/panic
    let Some(x) = some_value else {
        println!("No value!");
        return;
    };
    
    println!("Got: {}", x);
}
```

</RustPlayground>

---

## 4. Match Guards

<RustPlayground>

```rust
fn main() {
    let num = Some(5);
    
    match num {
        Some(x) if x < 5 => println!("น้อยกว่า 5"),
        Some(x) if x == 5 => println!("เท่ากับ 5 พอดี!"),
        Some(x) => println!("มากกว่า 5: {}", x),
        None => println!("ไม่มีค่า"),
    }
    
    // Guard กับหลาย conditions
    let pair = (2, -2);
    match pair {
        (x, y) if x == y => println!("เท่ากัน"),
        (x, y) if x + y == 0 => println!("บวกกันได้ 0"),
        (x, _) if x % 2 == 1 => println!("{} เป็นเลขคี่", x),
        _ => println!("อื่นๆ"),
    }
}
```

</RustPlayground>

---

## 5. @ Bindings

<RustPlayground>

```rust
fn main() {
    let age = 25;
    
    match age {
        // Bind value ขณะ match
        n @ 0..=12 => println!("เด็ก: {} ปี", n),
        n @ 13..=19 => println!("วัยรุ่น: {} ปี", n),
        n @ 20..=59 => println!("ผู้ใหญ่: {} ปี", n),
        n @ 60.. => println!("ผู้สูงอายุ: {} ปี", n),
    }
}
```

</RustPlayground>

---

## 6. Nested Patterns

<RustPlayground>

```rust
enum Message {
    Hello { id: i32 },
}

fn main() {
    let msg = Message::Hello { id: 42 };
    
    match msg {
        Message::Hello { 
            id: id_var @ 3..=7 
        } => println!("Found id in range: {}", id_var),
        
        Message::Hello { id: 10..=12 } => {
            println!("Found id in another range");
        }
        
        Message::Hello { id } => {
            println!("Found some other id: {}", id);
        }
    }
}
```

</RustPlayground>

---

## 7. Ignoring Values

<RustPlayground>

```rust
fn main() {
    let numbers = (1, 2, 3, 4, 5);
    
    match numbers {
        // _ = ignore single value
        (first, _, third, _, fifth) => {
            println!("first={}, third={}, fifth={}", first, third, fifth);
        }
    }
    
    // .. = ignore multiple values
    match numbers {
        (first, .., last) => {
            println!("first={}, last={}", first, last);
        }
    }
    
    // _name = ignore but still bind (no unused warning)
    let _unused = 42;
}
```

</RustPlayground>

---

## 8. Practical Examples

### 8.1 Config Parser

<RustPlayground>

```rust
#[derive(Debug)]
enum Config {
    Database { host: String, port: u16 },
    Cache { enabled: bool },
    Server { port: u16 },
}

fn process_config(config: Config) {
    match config {
        Config::Database { host, port } => {
            println!("DB: {}:{}", host, port);
        }
        Config::Cache { enabled: true } => {
            println!("Cache enabled!");
        }
        Config::Cache { enabled: false } => {
            println!("Cache disabled");
        }
        Config::Server { port } if port < 1024 => {
            println!("Warning: privileged port {}", port);
        }
        Config::Server { port } => {
            println!("Server on port {}", port);
        }
    }
}

fn main() {
    process_config(Config::Database { 
        host: String::from("localhost"), 
        port: 5432 
    });
    process_config(Config::Cache { enabled: true });
    process_config(Config::Server { port: 80 });
}
```

</RustPlayground>

### 8.2 Result/Option Handling

<RustPlayground>

```rust
fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 { None } else { Some(a / b) }
}

fn main() {
    // Chained pattern matching
    let results = vec![
        divide(10, 2),
        divide(10, 0),
        divide(20, 4),
    ];
    
    for (i, result) in results.iter().enumerate() {
        match result {
            Some(n) if *n > 4 => println!("#{}: Large result: {}", i, n),
            Some(n) => println!("#{}: Result: {}", i, n),
            None => println!("#{}: Division by zero!", i),
        }
    }
}
```

</RustPlayground>

---

## 9. สรุป

| Pattern | Example | Description |
|---------|---------|-------------|
| Literal | `1`, `"hello"` | Match exact value |
| Variable | `x` | Bind value |
| Wildcard | `_` | Match anything |
| Range | `1..=5` | Match range |
| Multiple | `1 \| 2 \| 3` | Match any of |
| Struct | `Point { x, y }` | Destructure struct |
| Tuple | `(a, b)` | Destructure tuple |
| Guard | `x if x > 5` | Conditional match |
| @ Binding | `n @ 1..=5` | Bind while matching |
| Rest | `..` | Ignore remaining |

---

[บทถัดไป: Debugging](/beginner/debugging)
