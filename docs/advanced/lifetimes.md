# Lifetimes

Lifetimes คือวิธีที่ Rust ใช้ติดตามว่า reference จะใช้งานได้นานเท่าไหร่

:::tip เปรียบเทียบกับชีวิตจริง
ลองนึกถึง **บัตรห้องสมุด** 📚:
- ยืมหนังสือได้ = ได้ reference ไปใช้
- มีวันคืน = lifetime (ต้องคืนก่อนหมดเขต)
- ถ้าหนังสือถูกนำออก = dangling reference (ชี้ไปที่ไม่มีหนังสืออยู่)

**Rust ตรวจสอบ:** "reference นี้จะยังใช้ได้อยู่ไหม ตอนที่เราจะใช้มัน?"
- ถ้าใช้ได้ ✅ = compile สำเร็จ
- ถ้าไม่ได้ ❌ = compile error (ช่วยเราก่อน runtime!)
:::

## ทำไมต้องมี Lifetimes?

ปัญหาหลักที่ Lifetimes แก้ไขคือ **Dangling References** - reference ที่ชี้ไปยังข้อมูลที่ไม่มีอยู่แล้ว

<RustPlayground>

```rust
fn main() {
    // ตัวอย่างที่ทำให้เกิด dangling reference (แบบนี้ Rust ไม่อนุญาต!)
    // let r;
    // {
    //     let x = 5;
    //     r = &x;  // x จะหมด scope ก่อน r
    // }
    // println!("{}", r);  // ERROR: x ไม่มีอยู่แล้ว!
    
    // แบบที่ถูกต้อง
    let x = 5;
    let r = &x;
    println!("r = {}", r);  // OK: x ยังอยู่
}
```

</RustPlayground>

## Lifetime Annotation Syntax

Lifetime ใช้ `'` (apostrophe) ตามด้วยชื่อ (มักใช้ `'a`, `'b`, `'c`)

<RustPlayground>

```rust
// ฟังก์ชันที่ต้องการ lifetime annotation
// 'a บอกว่า: return reference จะมีชีวิตอยู่ได้ไม่นานกว่า
// reference ที่ pass เข้ามา
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string is long");
    let string2 = String::from("xyz");
    
    let result = longest(&string1, &string2);
    println!("Longest: {}", result);
}
```

</RustPlayground>

### ทำไมต้องมี Lifetime Annotation?

เมื่อฟังก์ชัน return reference, Rust ต้องรู้ว่า reference นั้นมาจากไหน:

<RustPlayground>

```rust
// ไม่ต้องมี lifetime: return reference จาก parameter ตัวเดียว
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

fn main() {
    let sentence = "Hello world";
    let word = first_word(sentence);
    println!("First word: {}", word);
}
```

</RustPlayground>

<RustPlayground>

```rust
// ต้องมี lifetime: return อาจมาจาก parameter ตัวไหนก็ได้
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// ERROR: ไม่รู้ว่า return มาจากไหน
// fn invalid_longest(x: &str, y: &str) -> &str {
//     if x.len() > y.len() { x } else { y }
// }

fn main() {
    let a = "hello";
    let b = "hi";
    println!("Longest: {}", longest(a, b));
}
```

</RustPlayground>

## Lifetime Elision Rules

Rust มี 3 กฎที่ช่วยให้ไม่ต้องเขียน lifetime ทุกที่:

### กฎ 1: แต่ละ reference parameter ได้ lifetime แยกกัน

```rust
// เขียน:
fn foo(x: &str)
// Compiler เข้าใจเป็น:
fn foo<'a>(x: &'a str)

// เขียน:
fn foo(x: &str, y: &str)
// Compiler เข้าใจเป็น:
fn foo<'a, 'b>(x: &'a str, y: &'b str)
```

### กฎ 2: ถ้ามี input lifetime เดียว ใช้กับ output ทั้งหมด

```rust
// เขียน:
fn foo(x: &str) -> &str
// Compiler เข้าใจเป็น:
fn foo<'a>(x: &'a str) -> &'a str
```

### กฎ 3: ถ้ามี `&self` หรือ `&mut self`, ใช้ lifetime ของ self กับ output

```rust
// เขียน:
impl Foo {
    fn bar(&self, x: &str) -> &str
}
// Compiler เข้าใจเป็น:
impl Foo {
    fn bar<'a, 'b>(&'a self, x: &'b str) -> &'a str
}
```

## Struct กับ Lifetimes

ถ้า struct มี reference field ต้องระบุ lifetime:

<RustPlayground>

```rust
// 'a บอกว่า ImportantExcerpt มีชีวิตอยู่ได้ไม่นานกว่า part
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    // กฎ 3: return ใช้ lifetime ของ self
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention: {}", announcement);
        self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    
    let excerpt = ImportantExcerpt {
        part: first_sentence,
    };
    
    println!("Excerpt: {}", excerpt.part);
    
    let result = excerpt.announce_and_return_part("Hello!");
    println!("Result: {}", result);
}
```

</RustPlayground>

## Static Lifetime

`'static` หมายความว่า reference มีชีวิตอยู่ตลอด program:

<RustPlayground>

```rust
fn main() {
    // String literals มี 'static lifetime
    let s: &'static str = "I have a static lifetime.";
    
    // เพราะ string literals ถูกเก็บใน binary โดยตรง
    println!("{}", s);
    
    // Constants ก็มี 'static lifetime
    const MESSAGE: &str = "Hello, World!";
    println!("{}", MESSAGE);
}
```

</RustPlayground>

:::warning ใช้ 'static ด้วยความระวัง
อย่าใช้ `'static` เพื่อแก้ปัญหา lifetime errors โดยไม่เข้าใจ
มักจะเป็นสัญญาณว่า design มีปัญหา
:::

## Multiple Lifetimes

<RustPlayground>

```rust
// lifetime หลายตัว: คนละ scope
fn complex<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    // return ต้องมี lifetime 'a เท่านั้น
    println!("y = {}", y);
    x
}

fn main() {
    let x = String::from("hello");
    let result;
    
    {
        let y = String::from("world");
        result = complex(&x, &y);
        // y ออกจาก scope ที่นี่ แต่ result ยังใช้ได้
        // เพราะ result มี lifetime 'a ซึ่งผูกกับ x
    }
    
    println!("result = {}", result);
}
```

</RustPlayground>

## เปรียบเทียบกับภาษาอื่น

| ภาษา | การจัดการ Reference |
|------|---------------------|
| **Rust** | Compile-time lifetime checking |
| **C/C++** | ไม่มี (dangling pointers ได้) |
| **Java/Python** | Garbage Collector |
| **Go** | Garbage Collector |
| **Swift** | ARC (Automatic Reference Counting) |

## Common Lifetime Patterns

<RustPlayground>

```rust
// Pattern 1: Return reference from single input
fn first_char(s: &str) -> Option<char> {
    s.chars().next()
}

// Pattern 2: Return reference from one of multiple inputs
fn choose_first<'a>(a: &'a str, _b: &str) -> &'a str {
    a
}

// Pattern 3: Method returning reference to self
struct Container {
    data: String,
}

impl Container {
    fn get_data(&self) -> &str {
        &self.data
    }
}

fn main() {
    println!("First char: {:?}", first_char("hello"));
    println!("Choose: {}", choose_first("first", "second"));
    
    let c = Container { data: String::from("content") };
    println!("Data: {}", c.get_data());
}
```

</RustPlayground>

## สรุป

| Concept | คำอธิบาย |
|---------|---------|
| Lifetime | ช่วง scope ที่ reference valid |
| `'a` | Lifetime parameter |
| `'static` | อยู่ตลอด program |
| Elision | Compiler เดา lifetime ให้ |
| Borrow Checker | ตรวจสอบ lifetime ตอน compile |

---

[บทถัดไป: Smart Pointers](./smart-pointers)
