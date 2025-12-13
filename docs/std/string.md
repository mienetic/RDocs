# String - ข้อความ

**String** คือข้อความที่แก้ไขได้ เก็บเป็น UTF-8 ซึ่งรองรับทุกภาษารวมถึงภาษาไทย! 

---

## String คืออะไร?

Rust มี 2 ประเภทข้อความหลัก:

| Type | คำอธิบาย | ขนาด | แก้ไขได้ |
|------|---------|------|---------|
| `String` | ข้อความที่เป็นเจ้าของ (owned) | ไม่จำกัด | |
| `&str` | ข้อความที่ยืมมา (borrowed) | คงที่ | |

:::tip เมื่อไหร่ใช้ String vs &str?
- ใช้ `String` เมื่อต้องสร้างหรือแก้ไขข้อความ
- ใช้ `&str` เมื่อแค่อ่านหรือส่งต่อข้อความ
:::

---

## 1. สร้าง String

<RustPlayground>

```rust
fn main() {
 // วิธีที่ 1: จาก &str ใช้ to_string()
 let s1 = "สวัสดี".to_string();
 println!("s1: {}", s1);
 
 // วิธีที่ 2: จาก &str ใช้ String::from()
 let s2 = String::from("Hello, World!");
 println!("s2: {}", s2);
 
 // วิธีที่ 3: สร้างว่าง
 let s3 = String::new();
 println!("s3 ว่างไหม: {}", s3.is_empty());
 
 // วิธีที่ 4: กำหนด capacity ล่วงหน้า
 let s4 = String::with_capacity(100);
 println!("s4 capacity: {}", s4.capacity());
 
 // วิธีที่ 5: ใช้ format! macro (รวมหลายค่า)
 let name = "Rust";
 let age = 9;
 let s5 = format!("{} อายุ {} ปี", name, age);
 println!("s5: {}", s5);
}
```

</RustPlayground>

---

## 2. เพิ่มข้อความ

<RustPlayground>

```rust
fn main() {
 let mut s = String::from("Hello");
 
 // push_str - เพิ่ม &str
 s.push_str(", World");
 println!("หลัง push_str: {}", s);
 
 // push - เพิ่มตัวอักษรเดียว
 s.push('!');
 println!("หลัง push: {}", s);
 
 // ใช้ + operator (ต้องเป็น String + &str)
 let s1 = String::from("Hello");
 let s2 = String::from(" World");
 let s3 = s1 + &s2; // s1 ถูกย้าย! ใช้อีกไม่ได้
 // println!("{}", s1); // Error! s1 moved
 println!("s3: {}", s3);
 
 // ใช้ format! (ไม่ย้าย ownership)
 let a = String::from("tic");
 let b = String::from("tac");
 let c = String::from("toe");
 let result = format!("{}-{}-{}", a, b, c);
 println!("result: {}", result);
 // a, b, c ยังใช้ได้!
}
```

</RustPlayground>

---

## 3. เข้าถึงและ Slice

<RustPlayground>

```rust
fn main() {
 let s = String::from("Hello, สวัสดี!");
 
 // ความยาว (bytes ไม่ใช่ตัวอักษร!)
 println!("bytes: {}", s.len()); // 20 bytes
 println!("chars: {}", s.chars().count()); // 13 ตัวอักษร
 
 // เข้าถึงแบบ byte (ระวัง! อาจเจอปัญหากับ UTF-8)
 let hello = &s[0..5]; // ASCII OK
 println!("slice: {}", hello);
 
 // จะ panic ถ้า slice กลางตัวอักษร UTF-8
 // let bad = &s[0..8]; // panic! ตัดกลางตัวอักษรไทย
 
 // วนซ้ำตัวอักษร (ปลอดภัย!)
 println!("=== ตัวอักษร ===");
 for c in s.chars() {
 print!("{} ", c);
 }
 println!();
 
 // วนซ้ำ bytes
 println!("=== bytes แรก 5 ตัว ===");
 for b in s.bytes().take(5) {
 print!("{} ", b);
 }
 println!();
}
```

</RustPlayground>

:::warning ระวังกับ UTF-8!
ตัวอักษรไทยใช้ 3 bytes ต่อตัว ใช้ `.chars()` แทน index จะปลอดภัยกว่า
:::

---

## 4. ค้นหาและตรวจสอบ

<RustPlayground>

```rust
fn main() {
 let s = String::from("Hello, World!");
 
 // contains - มีคำนี้ไหม?
 println!("มี 'World' ไหม: {}", s.contains("World"));
 
 // starts_with / ends_with
 println!("เริ่มต้นด้วย 'Hello': {}", s.starts_with("Hello"));
 println!("ลงท้ายด้วย '!': {}", s.ends_with("!"));
 
 // find - หาตำแหน่ง (return Option)
 match s.find('W') {
 Some(pos) => println!("'W' อยู่ตำแหน่ง byte {}", pos),
 None => println!("ไม่พบ"),
 }
 
 // is_empty
 println!("ว่างไหม: {}", s.is_empty());
 
 // ตรวจสอบตัวอักษร
 let text = "Hello123";
 println!("เป็นตัวอักษรหมด: {}", text.chars().all(|c| c.is_alphabetic()));
 println!("เป็นตัวเลขหมด: {}", text.chars().all(|c| c.is_numeric()));
 println!("เป็น alphanumeric: {}", text.chars().all(|c| c.is_alphanumeric()));
}
```

</RustPlayground>

---

## 5. แก้ไขและแปลง

<RustPlayground>

```rust
fn main() {
 let mut s = String::from(" Hello, World! ");
 
 // trim - ตัดช่องว่างหัวท้าย (return &str)
 let trimmed = s.trim();
 println!("trimmed: '{}'", trimmed);
 
 // to_uppercase / to_lowercase
 println!("uppercase: {}", s.to_uppercase());
 println!("lowercase: {}", s.to_lowercase());
 
 // replace - แทนที่ (return String ใหม่)
 let replaced = s.replace("World", "Rust");
 println!("replaced: {}", replaced);
 
 // insert_str - แทรกที่ตำแหน่ง byte
 s.insert_str(0, ">>> ");
 println!("inserted: {}", s);
 
 // clear - ลบทั้งหมด
 s.clear();
 println!("cleared, len: {}", s.len());
}
```

</RustPlayground>

---

## 6. Split และ Join

<RustPlayground>

```rust
fn main() {
 let s = "apple,banana,cherry,durian";
 
 // split - แยกด้วยตัวคั่น
 println!("=== split ===");
 for fruit in s.split(',') {
 println!("- {}", fruit);
 }
 
 // collect เป็น Vec
 let fruits: Vec<&str> = s.split(',').collect();
 println!("fruits: {:?}", fruits);
 
 // split_whitespace - แยกด้วยช่องว่าง
 let sentence = "Hello World Rust";
 let words: Vec<&str> = sentence.split_whitespace().collect();
 println!("words: {:?}", words);
 
 // lines - แยกตามบรรทัด
 let text = "line 1\nline 2\nline 3";
 for line in text.lines() {
 println!(">> {}", line);
 }
 
 // join - รวมกลับ
 let joined = fruits.join(" | ");
 println!("joined: {}", joined);
}
```

</RustPlayground>

---

## 7. แปลงระหว่าง Types

<RustPlayground>

```rust
fn main() {
 // String -> &str
 let s = String::from("hello");
 let slice: &str = &s; // หรือ s.as_str()
 println!("slice: {}", slice);
 
 // &str -> String
 let s2 = "world".to_string();
 let s3 = String::from("rust");
 println!("s2: {}, s3: {}", s2, s3);
 
 // String <-> bytes
 let bytes = s.as_bytes(); // -> &[u8]
 println!("bytes: {:?}", bytes);
 
 let from_bytes = String::from_utf8(vec![104, 101, 108, 108, 111]);
 println!("from bytes: {:?}", from_bytes); // Ok("hello")
 
 // parse - แปลงเป็นตัวเลข
 let num: i32 = "42".parse().expect("ควรเป็นตัวเลข");
 println!("parsed: {}", num);
 
 // ตัวเลข -> String
 let num_str = 42.to_string();
 println!("number as string: {}", num_str);
}
```

</RustPlayground>

---

## 8. Repeat และ Format

<RustPlayground>

```rust
fn main() {
 // repeat - ทำซ้ำ
 let stars = "*".repeat(10);
 println!("stars: {}", stars);
 
 let pattern = "ab".repeat(5);
 println!("pattern: {}", pattern);
 
 // format! - จัดรูปแบบซับซ้อน
 let name = "Alice";
 let score = 95.5;
 
 // แบบพื้นฐาน
 let msg = format!("{} ได้ {} คะแนน", name, score);
 println!("{}", msg);
 
 // แบบกำหนดความกว้าง
 println!("|{:>10}|", name); // ชิดขวา
 println!("|{:<10}|", name); // ชิดซ้าย
 println!("|{:^10}|", name); // กึ่งกลาง
 
 // แบบกำหนดทศนิยม
 println!("คะแนน: {:.1}", score); // 1 ทศนิยม
 println!("คะแนน: {:08.2}", score); // เติม 0 ข้างหน้า
}
```

</RustPlayground>

---

## Quick Reference

### สร้าง String
| วิธี | ตัวอย่าง |
|------|---------|
| `to_string()` | `"hello".to_string()` |
| `String::from()` | `String::from("hello")` |
| `String::new()` | สร้างว่าง |
| `format!()` | `format!("{} {}", a, b)` |

### แก้ไข
| Method | คำอธิบาย |
|--------|---------|
| `push(ch)` | เพิ่มตัวอักษร |
| `push_str(s)` | เพิ่มข้อความ |
| `insert_str(i, s)` | แทรกที่ตำแหน่ง |
| `replace(a, b)` | แทนที่ |
| `clear()` | ลบทั้งหมด |

### ค้นหา
| Method | คำอธิบาย |
|--------|---------|
| `contains(s)` | มีไหม? |
| `starts_with(s)` | เริ่มด้วย? |
| `ends_with(s)` | ลงท้ายด้วย? |
| `find(s)` | หาตำแหน่ง |

### แปลง
| Method | คำอธิบาย |
|--------|---------|
| `as_str()` | `String` → `&str` |
| `as_bytes()` | `String` → `&[u8]` |
| `trim()` | ตัดช่องว่าง |
| `to_uppercase()` | ตัวพิมพ์ใหญ่ |
| `to_lowercase()` | ตัวพิมพ์เล็ก |
| `parse()` | แปลงเป็น type อื่น |

---

[← Vec](./vec) | [Option →](./option)
