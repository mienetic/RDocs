# Option & Result Basics

ทำความเข้าใจ Option และ Result - types ที่ใช้บ่อยที่สุดใน Rust! 

:::tip ไม่มี null ใน Rust!
แทนที่จะใช้ null, Rust ใช้ `Option` และ `Result` เพื่อจัดการค่าที่อาจไม่มี หรืออาจ error
:::

---

## 1. Option - ค่าที่อาจมีหรือไม่มี

### 1.1 Option คืออะไร?

::: observation
**Rust บังคับให้เช็คเสมอ!**
คุณไม่สามารถเอาค่าใน `Option<T>` ไปบวกเลข หรือใช้งานได้ทันที ต้อง "แกะ" (unwrap/match) ออกมาก่อน 
นี่คือเหตุผลที่ Rust แทบไม่มี Runtime Errors เลย!
:::

<RustPlayground>

```rust
// Option คือ enum ที่มี 2 variants
// enum Option<T> {
// Some(T), // มีค่า
// None, // ไม่มีค่า
// }

fn main() {
 let some_number: Option<i32> = Some(42);
 let no_number: Option<i32> = None;
 
 println!("some_number: {:?}", some_number);
 println!("no_number: {:?}", no_number);
}
```

</RustPlayground>

### 1.2 ใช้งาน Option

<RustPlayground>

```rust
fn find_user(id: u32) -> Option<String> {
 if id == 1 {
 Some(String::from("Alice"))
 } else if id == 2 {
 Some(String::from("Bob"))
 } else {
 None
 }
}

fn main() {
 // ใช้ match
 match find_user(1) {
 Some(name) => println!("Found: {}", name),
 None => println!("User not found"),
 }
 
 // ใช้ if let
 if let Some(name) = find_user(2) {
 println!("Found: {}", name);
 }
 
 // ใช้ unwrap_or
 let name = find_user(999).unwrap_or(String::from("Unknown"));
 println!("Name: {}", name);
}
```

</RustPlayground>

### 1.3 Option Methods

::: pitfall
**อย่าใช้ `.unwrap()` ใน Production!**
ถ้าค่าเป็น `None` โปรแกรมจะ Panic (พัง) ทันที! ควรใช้ `match`, `if let`, หรือ `unwrap_or` เพื่อจัดการกรณีฉุกเฉินเสมอ
:::

<RustPlayground>

```rust
fn main() {
 let x: Option<i32> = Some(5);
 let y: Option<i32> = None;
 
 // is_some / is_none
 println!("x.is_some(): {}", x.is_some());
 println!("y.is_none(): {}", y.is_none());
 
 // unwrap (panic if None!)
 // println!("{}", y.unwrap()); // panic!
 
 // unwrap_or (default value)
 println!("x: {}", x.unwrap_or(0));
 println!("y: {}", y.unwrap_or(0));
 
 // unwrap_or_else (lazy default)
 let val = y.unwrap_or_else(|| {
 println!("Computing default...");
 42
 });
 println!("val: {}", val);
 
 // map
 let doubled = x.map(|n| n * 2);
 println!("doubled: {:?}", doubled);
 
 // and_then (flatMap)
 let result = x.and_then(|n| {
 if n > 0 { Some(n * 10) } else { None }
 });
 println!("result: {:?}", result);
}
```

</RustPlayground>

---

## 2. Result - สำเร็จหรือ Error

### 2.1 Result คืออะไร?

<RustPlayground>

```rust
// Result คือ enum ที่มี 2 variants
// enum Result<T, E> {
// Ok(T), // สำเร็จ
// Err(E), // error
// }

fn divide(a: i32, b: i32) -> Result<i32, String> {
 if b == 0 {
 Err(String::from("Cannot divide by zero!"))
 } else {
 Ok(a / b)
 }
}

fn main() {
 let result1 = divide(10, 2);
 let result2 = divide(10, 0);
 
 println!("10 / 2 = {:?}", result1);
 println!("10 / 0 = {:?}", result2);
}
```

</RustPlayground>

### 2.2 ใช้งาน Result

<RustPlayground>

```rust
fn parse_number(s: &str) -> Result<i32, String> {
 s.parse::<i32>()
 .map_err(|_| format!("'{}' is not a valid number", s))
}

fn main() {
 // ใช้ match
 match parse_number("42") {
 Ok(n) => println!("Parsed: {}", n),
 Err(e) => println!("Error: {}", e),
 }
 
 // ใช้ if let
 if let Ok(n) = parse_number("123") {
 println!("Got: {}", n);
 }
 
 // ใช้ unwrap_or
 let n = parse_number("abc").unwrap_or(0);
 println!("Number: {}", n);
 
 // ใช้ is_ok / is_err
 println!("Is OK: {}", parse_number("42").is_ok());
 println!("Is Err: {}", parse_number("abc").is_err());
}
```

</RustPlayground>

### 2.3 Result Methods

<RustPlayground>

```rust
fn main() {
 let ok: Result<i32, &str> = Ok(5);
 let err: Result<i32, &str> = Err("error!");
 
 // unwrap (panic if Err!)
 // println!("{}", err.unwrap()); // panic!
 
 // unwrap_or
 println!("ok: {}", ok.unwrap_or(0));
 println!("err: {}", err.unwrap_or(0));
 
 // expect (panic with custom message)
 // println!("{}", err.expect("Failed!")); // panic with message
 
 // map (transform Ok value)
 let doubled = ok.map(|n| n * 2);
 println!("doubled: {:?}", doubled);
 
 // map_err (transform Err value)
 let new_err = err.map_err(|e| format!("ERROR: {}", e));
 println!("new_err: {:?}", new_err);
 
 // ok() - convert Result to Option
 let opt: Option<i32> = ok.ok();
 println!("as option: {:?}", opt);
}
```

</RustPlayground>

---

## 3. The ? Operator

### 3.1 Propagating Errors

::: best-practice
**ใช้ `?` แทนการ match error เอง**
เครื่องหมาย `?` ช่วยลด code ที่ซ้ำซ้อน (boilerplate) ได้มหาศาล และทำให้อ่าน logic หลักได้ง่ายขึ้น
:::

<RustPlayground>

```rust
fn parse_and_double(s: &str) -> Result<i32, std::num::ParseIntError> {
 let n = s.parse::<i32>()?; // ถ้า Err จะ return ทันที
 Ok(n * 2)
}

fn main() {
 println!("Result: {:?}", parse_and_double("21"));
 println!("Result: {:?}", parse_and_double("abc"));
}
```

</RustPlayground>

### 3.2 ? กับ Option

<RustPlayground>

```rust
fn get_first_char(s: &str) -> Option<char> {
 let first = s.chars().next()?; // ถ้า None จะ return ทันที
 Some(first)
}

fn main() {
 println!("First: {:?}", get_first_char("Hello"));
 println!("First: {:?}", get_first_char(""));
}
```

</RustPlayground>

---

## 4. Converting Between Option and Result

<RustPlayground>

```rust
fn main() {
 // Option -> Result
 let opt: Option<i32> = Some(42);
 let result: Result<i32, &str> = opt.ok_or("No value!");
 println!("Option to Result: {:?}", result);
 
 let none: Option<i32> = None;
 let err: Result<i32, &str> = none.ok_or("No value!");
 println!("None to Result: {:?}", err);
 
 // Result -> Option
 let ok: Result<i32, &str> = Ok(42);
 let opt2: Option<i32> = ok.ok();
 println!("Result to Option: {:?}", opt2);
 
 // Get Err as Option
 let err2: Result<i32, &str> = Err("error!");
 let err_opt: Option<&str> = err2.err();
 println!("Err as Option: {:?}", err_opt);
}
```

</RustPlayground>

---

## 5. Common Patterns

### 5.1 Chain Operations

<RustPlayground>

```rust
fn main() {
 let numbers = vec!["1", "2", "three", "4"];
 
 // Parse all, skip errors
 let parsed: Vec<i32> = numbers
 .iter()
 .filter_map(|s| s.parse().ok())
 .collect();
 println!("Parsed: {:?}", parsed);
 
 // Get first valid number
 let first = numbers
 .iter()
 .find_map(|s| s.parse::<i32>().ok());
 println!("First valid: {:?}", first);
}
```

</RustPlayground>

### 5.2 Default Values

<RustPlayground>

```rust
fn main() {
 let name: Option<&str> = None;
 
 // Using unwrap_or
 let display = name.unwrap_or("Guest");
 println!("Hello, {}!", display);
 
 // Using unwrap_or_default (for types that impl Default)
 let count: Option<i32> = None;
 let n = count.unwrap_or_default(); // 0
 println!("Count: {}", n);
}
```

</RustPlayground>

---

## 6. เมื่อไหร่ใช้อะไร?

| Situation | Use |
|-----------|-----|
| ค่าอาจมีหรือไม่มี | `Option<T>` |
| อาจ success หรือ fail | `Result<T, E>` |
| ต้องการ error message | `Result<T, E>` |
| ค่า optional (เช่น config) | `Option<T>` |
| I/O operations | `Result<T, io::Error>` |
| Parsing | `Result<T, ParseError>` |

---

## 7. สรุป

| Type | Variants | Use Case |
|------|----------|----------|
| `Option<T>` | `Some(T)`, `None` | ค่าที่อาจมีหรือไม่มี |
| `Result<T, E>` | `Ok(T)`, `Err(E)` | Operation ที่อาจ fail |

| Method | Description |
|--------|-------------|
| `.unwrap()` | Get value or panic |
| `.unwrap_or(default)` | Get value or default |
| `.map(f)` | Transform inner value |
| `.and_then(f)` | Chain operations |
| `.ok_or(err)` | Option → Result |
| `.ok()` | Result → Option |
| `?` | Early return on None/Err |

---

[บทถัดไป: Control Flow](/beginner/control-flow)
