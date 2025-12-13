# Lifetime Patterns

Pattern สำหรับจัดการ Lifetimes ใน Rust!

---

## Basic Lifetime Annotation

<RustPlayground>

```rust
// ฟังก์ชันที่ return reference ต้องมี lifetime
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
 if x.len() > y.len() { x } else { y }
}

fn main() {
 let s1 = String::from("hello");
 let s2 = String::from("world!");

 let result = longest(&s1, &s2);
 println!("Longest: {}", result);
}
```

</RustPlayground>

---

## Struct with Lifetime

<RustPlayground>

```rust
// Struct ที่เก็บ reference
struct Excerpt<'a> {
 part: &'a str,
}

impl<'a> Excerpt<'a> {
 fn level(&self) -> i32 {
 3
 }

 // Return reference จาก self
 fn part(&self) -> &str {
 self.part
 }

 // Return reference จาก parameter
 fn announce(&self, announcement: &str) -> &str {
 println!("Attention: {}", announcement);
 self.part
 }
}

fn main() {
 let novel = String::from("Call me Ishmael. Some years ago...");
 let first_sentence = novel.split('.').next().unwrap();

 let excerpt = Excerpt { part: first_sentence };
 println!("Excerpt: {}", excerpt.part());
}
```

</RustPlayground>

---

## Multiple Lifetimes

<RustPlayground>

```rust
// หลาย lifetimes ที่แตกต่างกัน
fn first_word<'a, 'b>(s: &'a str, _: &'b str) -> &'a str {
 s.split_whitespace().next().unwrap_or("")
}

// 'b outlives 'a
fn with_constraint<'a, 'b: 'a>(x: &'a str, y: &'b str) -> &'a str {
 if x.len() > 0 { x } else { y }
}

fn main() {
 let s1 = "hello world";
 let s2 = "foo";

 let result = first_word(s1, s2);
 println!("First word: {}", result);
}
```

</RustPlayground>

---

## Static Lifetime

<RustPlayground>

```rust
// 'static - lives for entire program
static GREETING: &str = "Hello, World!";

fn get_static() -> &'static str {
 "I live forever!"
}

fn main() {
 println!("{}", GREETING);
 println!("{}", get_static());

 // String literals are 'static
 let s: &'static str = "I'm also static!";
 println!("{}", s);
}
```

</RustPlayground>

---

## Lifetime Elision

<RustPlayground>

```rust
// Compiler สามารถ infer lifetimes ได้

// Rule 1: แต่ละ input reference ได้ lifetime ของตัวเอง
// fn foo(x: &str, y: &str) -> fn foo<'a, 'b>(x: &'a str, y: &'b str)

// Rule 2: ถ้ามี input lifetime เดียว ใช้กับ output
// fn foo(x: &str) -> &str => fn foo<'a>(x: &'a str) -> &'a str

// Rule 3: ถ้ามี &self หรือ &mut self ใช้ lifetime ของ self
// fn foo(&self) -> &str => fn foo<'a>(&'a self) -> &'a str

struct Parser<'a> {
 input: &'a str,
}

impl<'a> Parser<'a> {
 // Elision: output gets lifetime of &self
 fn parse(&self) -> &str {
 &self.input[0..5]
 }
}

fn main() {
 let input = String::from("hello world");
 let parser = Parser { input: &input };
 println!("{}", parser.parse());
}
```

</RustPlayground>

---

## Higher-Ranked Trait Bounds (HRTB)

<RustPlayground>

```rust
// for<'a> - works for ANY lifetime
fn apply_once<F>(f: F) -> i32
where
 F: for<'a> Fn(&'a str) -> i32,
{
 let s = String::from("hello");
 f(&s)
}

fn main() {
 let result = apply_once(|s| s.len() as i32);
 println!("Length: {}", result);
}
```

</RustPlayground>

---

## Common Patterns

<RustPlayground>

```rust
// 1. Returning owned data instead of borrow
fn create_string() -> String {
 String::from("owned!")
}

// 2. Cloning to avoid lifetime issues
fn process(input: &str) -> String {
 input.to_string() // Clone the data
}

// 3. Using Cow for flexibility
use std::borrow::Cow;

fn maybe_modify(input: &str) -> Cow<str> {
 if input.contains("bad") {
 Cow::Owned(input.replace("bad", "good"))
 } else {
 Cow::Borrowed(input)
 }
}

fn main() {
 println!("{}", create_string());
 println!("{}", process("hello"));
 println!("{}", maybe_modify("bad word"));
 println!("{}", maybe_modify("good word"));
}
```

</RustPlayground>

---

## Quick Reference

| Pattern | Use Case |
|---------|----------|
| `'a` | Single lifetime parameter |
| `'a, 'b` | Multiple lifetimes |
| `'b: 'a` | 'b outlives 'a |
| `'static` | Lives forever |
| `for<'a>` | Any lifetime (HRTB) |
| `Cow<'a, T>` | Borrowed or owned |

---

[← FFI](/patterns/ffi) | [Patterns Index →](/patterns/)
