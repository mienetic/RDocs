# Typestate Pattern

Pattern สำหรับ encode state ลงใน type system! 

---

## ทำไมต้องใช้ Typestate?

- ป้องกัน invalid state ตอน compile time
- ไม่มี runtime overhead
- Type checker ช่วยตรวจสอบ

---

## ตัวอย่าง: State Machine

<RustPlayground>

```rust
// Define states as zero-sized types
struct Draft;
struct PendingReview;
struct Published;

// Post ที่มี state เป็น type parameter
struct Post<State> {
 content: String,
 state: std::marker::PhantomData<State>,
}

// Draft state - สามารถ edit และ request review
impl Post<Draft> {
 fn new(content: &str) -> Self {
 Post {
 content: content.to_string(),
 state: std::marker::PhantomData,
 }
 }
 
 fn edit(&mut self, content: &str) {
 self.content = content.to_string();
 }
 
 fn request_review(self) -> Post<PendingReview> {
 Post {
 content: self.content,
 state: std::marker::PhantomData,
 }
 }
}

// PendingReview state - สามารถ approve หรือ reject
impl Post<PendingReview> {
 fn approve(self) -> Post<Published> {
 Post {
 content: self.content,
 state: std::marker::PhantomData,
 }
 }
 
 fn reject(self) -> Post<Draft> {
 Post {
 content: self.content,
 state: std::marker::PhantomData,
 }
 }
}

// Published state - สามารถอ่านได้เท่านั้น
impl Post<Published> {
 fn content(&self) -> &str {
 &self.content
 }
}

fn main() {
 let post = Post::<Draft>::new("Hello, world!");
 
 // Transition: Draft -> PendingReview -> Published
 let post = post.request_review();
 let post = post.approve();
 
 println!("Published: {}", post.content());
 
 // Compile error! ไม่สามารถ edit Published post
 // post.edit("New content");
}
```

</RustPlayground>

---

## File Builder Pattern

<RustPlayground>

```rust
use std::marker::PhantomData;

// States
struct NeedsPath;
struct NeedsMode;
struct Ready;

struct FileBuilder<State> {
 path: Option<String>,
 read: bool,
 write: bool,
 state: PhantomData<State>,
}

impl FileBuilder<NeedsPath> {
 fn new() -> Self {
 FileBuilder {
 path: None,
 read: false,
 write: false,
 state: PhantomData,
 }
 }
 
 fn path(self, path: &str) -> FileBuilder<NeedsMode> {
 FileBuilder {
 path: Some(path.to_string()),
 read: self.read,
 write: self.write,
 state: PhantomData,
 }
 }
}

impl FileBuilder<NeedsMode> {
 fn read(mut self) -> FileBuilder<Ready> {
 self.read = true;
 FileBuilder {
 path: self.path,
 read: true,
 write: self.write,
 state: PhantomData,
 }
 }
 
 fn write(mut self) -> FileBuilder<Ready> {
 self.write = true;
 FileBuilder {
 path: self.path,
 read: self.read,
 write: true,
 state: PhantomData,
 }
 }
}

impl FileBuilder<Ready> {
 fn open(self) -> String {
 format!("Opening {} (read={}, write={})", 
 self.path.unwrap(), self.read, self.write)
 }
}

fn main() {
 let result = FileBuilder::new()
 .path("/tmp/test.txt")
 .read()
 .open();
 
 println!("{}", result);
 
 // Compile error! ต้องเรียก path ก่อน
 // FileBuilder::new().read();
}
```

</RustPlayground>

---

## Quick Reference

| Pattern | Use Case |
|---------|----------|
| State as Type Parameter | State machine transitions |
| PhantomData | Zero-cost state marker |
| Consuming self | Force state transition |
| Method returns different type | State change |

---

[← Iterator](/patterns/iterator) | [Trait Objects →](/patterns/trait-objects)
