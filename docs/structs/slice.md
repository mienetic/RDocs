# Slice Structs - Slice Iterators

`Chunks`, `Windows`, `Split` สำหรับ slice operations! 

---

## Chunks - แบ่งเป็นกลุ่ม

<RustPlayground>

```rust
fn main() {
 let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
 // chunks - แบ่งเป็นกลุ่มละ n
 println!("=== chunks(3) ===");
 for chunk in data.chunks(3) {
 println!(" {:?}", chunk);
 }
 
 // chunks_exact - แบ่งเท่าๆ กัน (เศษทิ้ง)
 println!("\n=== chunks_exact(3) ===");
 let chunks = data.chunks_exact(3);
 println!(" remainder: {:?}", chunks.remainder());
 for chunk in chunks {
 println!(" {:?}", chunk);
 }
}
```

</RustPlayground>

---

## Windows - Sliding Window

<RustPlayground>

```rust
fn main() {
 let data = [1, 2, 3, 4, 5];
 
 // windows - sliding window
 println!("=== windows(3) ===");
 for window in data.windows(3) {
 println!(" {:?}", window);
 }
 
 // ใช้หาค่าที่เพิ่มขึ้น
 println!("\n=== Find increasing pairs ===");
 for window in data.windows(2) {
 if window[1] > window[0] {
 println!(" {} < {} (increasing)", window[0], window[1]);
 }
 }
}
```

</RustPlayground>

---

## Split - แยกตามเงื่อนไข

<RustPlayground>

```rust
fn main() {
 let data = [1, 0, 2, 0, 0, 3, 4, 0, 5];
 
 // split - แยกตาม predicate
 println!("=== split by 0 ===");
 for part in data.split(|&x| x == 0) {
 println!(" {:?}", part);
 }
 
 // splitn - แยก n ครั้ง
 println!("\n=== splitn(3, 0) ===");
 for part in data.splitn(3, |&x| x == 0) {
 println!(" {:?}", part);
 }
 
 // split_first / split_last
 if let Some((first, rest)) = data.split_first() {
 println!("\nfirst: {}, rest: {:?}", first, rest);
 }
}
```

</RustPlayground>

---

## Str Iterators

<RustPlayground>

```rust
fn main() {
 let text = "Hello\nWorld\nRust";
 
 // lines
 println!("=== lines() ===");
 for line in text.lines() {
 println!(" '{}'", line);
 }
 
 // chars
 let word = "สวัสดี";
 println!("\n=== chars() ===");
 for (i, c) in word.chars().enumerate() {
 println!(" {}: '{}'", i, c);
 }
 
 // bytes
 println!("\n=== bytes() ===");
 for b in "Hi!".bytes() {
 println!(" {}", b);
 }
 
 // split_whitespace
 let sentence = " hello world ";
 println!("\n=== split_whitespace() ===");
 for word in sentence.split_whitespace() {
 println!(" '{}'", word);
 }
}
```

</RustPlayground>

---

## Array Chunks

<RustPlayground>

```rust
fn main() {
 let data = [1, 2, 3, 4, 5, 6, 7, 8];
 
 // array_chunks (nightly feature)
 // แบ่งเป็น fixed-size arrays
 
 // ใช้ chunks + try_into แทน
 for chunk in data.chunks(2) {
 if chunk.len() == 2 {
 let arr: [i32; 2] = chunk.try_into().unwrap();
 println!("pair: {:?}, sum: {}", arr, arr[0] + arr[1]);
 }
 }
}
```

</RustPlayground>

---

## Quick Reference

### Slice Methods
| Method | คำอธิบาย |
|--------|---------|
| `chunks(n)` | แบ่งเป็นกลุ่ม |
| `chunks_exact(n)` | แบ่งเท่าๆ กัน |
| `windows(n)` | Sliding window |
| `split(pred)` | แยกตาม predicate |
| `splitn(n, pred)` | แยก n ครั้ง |
| `split_first()` | แยก first + rest |
| `split_last()` | แยก init + last |

### Str Methods
| Method | คำอธิบาย |
|--------|---------|
| `chars()` | Iterator of chars |
| `bytes()` | Iterator of bytes |
| `lines()` | Iterator of lines |
| `split(pat)` | Split by pattern |
| `split_whitespace()` | Split by whitespace |

### Types
| Type | คำอธิบาย |
|------|---------|
| `Chunks&lt;T&gt;` | Chunk iterator |
| `ChunksExact&lt;T&gt;` | Exact chunk iterator |
| `Windows&lt;T&gt;` | Window iterator |
| `Split&lt;T, P&gt;` | Split iterator |
| `Lines&lt;'a&gt;` | Line iterator |
| `Chars&lt;'a&gt;` | Char iterator |

---

[← Num](./num) | [กลับ Index →](./index)
