# Strings Deep Dive

String กับ &str ต่างกันยังไง? มาเจาะลึกกัน! 🔤

:::tip สำคัญมาก! 
String คือหนึ่งในหัวข้อที่สร้างความสับสนมากที่สุดสำหรับมือใหม่ Rust แต่พอเข้าใจแล้วจะรู้ว่ามันเจ๋งมาก!
:::

---

## 1. String vs &str

### 1.1 ความแตกต่าง

| | `String` | `&str` |
|---|----------|--------|
| **Ownership** | เป็นเจ้าของข้อมูล | ยืมมาดู (borrow) |
| **ความยืดหยุ่น** | เปลี่ยนแปลงได้ | อ่านอย่างเดียว |
| **เก็บที่ไหน** | Heap | Stack หรือ Heap |
| **ขนาด** | Dynamic | Fixed |
| **ใช้เมื่อ** | ต้องการเป็นเจ้าของ | อ่านอย่างเดียว |

<RustPlayground>

```rust
fn main() {
    // String - เป็นเจ้าของ เก็บใน Heap
    let owned: String = String::from("ฉันเป็นเจ้าของ");
    
    // &str - ยืมมาดู
    let borrowed: &str = "ฉันแค่ยืมมา";
    
    // แปลงไปมาได้
    let to_borrowed: &str = &owned;      // String -> &str (ง่าย)
    let to_owned: String = borrowed.to_string();  // &str -> String
    
    println!("owned: {}", owned);
    println!("borrowed: {}", borrowed);
    println!("to_borrowed: {}", to_borrowed);
    println!("to_owned: {}", to_owned);
}
```

</RustPlayground>

### 1.2 เปรียบเทียบกับภาษาอื่น

| Rust | Java | Python | JavaScript |
|------|------|--------|------------|
| `String` | `StringBuilder` | - | - |
| `&str` | `String` | `str` | `string` |

---

## 2. การสร้าง String

<RustPlayground>

```rust
fn main() {
    // วิธีสร้าง String
    let s1 = String::new();                    // ว่างเปล่า
    let s2 = String::from("hello");            // จาก &str
    let s3 = "hello".to_string();              // จาก &str (อีกวิธี)
    let s4 = "hello".to_owned();               // จาก &str (อีกวิธี)
    let s5 = format!("{} {}", "hello", "world"); // จาก format!
    
    println!("s1: '{}'", s1);
    println!("s2: '{}'", s2);
    println!("s3: '{}'", s3);
    println!("s4: '{}'", s4);
    println!("s5: '{}'", s5);
}
```

</RustPlayground>

---

## 3. การแก้ไข String

<RustPlayground>

```rust
fn main() {
    let mut s = String::from("Hello");
    
    // เพิ่มท้าย
    s.push_str(", World");     // เพิ่ม &str
    s.push('!');               // เพิ่ม char
    println!("After push: {}", s);
    
    // แทรก
    s.insert(0, '🎉');         // แทรก char ที่ byte 0
    s.insert_str(0, "Start: "); // แทรก &str
    println!("After insert: {}", s);
    
    // ลบ
    s.pop();                   // ลบตัวท้าย
    println!("After pop: {}", s);
    
    // แทนที่
    let replaced = s.replace("Hello", "Hi");
    println!("After replace: {}", replaced);
    
    // Clear
    s.clear();
    println!("After clear: '{}'", s);
}
```

</RustPlayground>

---

## 4. UTF-8 และภาษาไทย 🇹🇭

### 4.1 Rust ใช้ UTF-8 เสมอ!

<RustPlayground>

```rust
fn main() {
    let thai = "สวัสดี";
    
    // len() คือจำนวน bytes ไม่ใช่ตัวอักษร!
    println!("bytes: {}", thai.len());        // 18 bytes!
    
    // chars() คือ Unicode code points
    println!("chars: {}", thai.chars().count()); // 6 chars
    
    // แสดง char แต่ละตัว
    println!("\nEach character:");
    for (i, c) in thai.chars().enumerate() {
        println!("  {}: {} (U+{:04X})", i, c, c as u32);
    }
}
```

</RustPlayground>

### 4.2 ระวัง! Indexing ไม่ทำงานแบบที่คิด

<RustPlayground>

```rust
fn main() {
    let s = "สวัสดี";
    
    // ❌ ทำไม่ได้! (compile error)
    // let first = s[0];
    
    // ✅ ใช้ chars() แทน
    let first_char = s.chars().next().unwrap();
    println!("First char: {}", first_char);
    
    // ✅ หรือใช้ slice ด้วยความระวัง (ต้องรู้ byte boundaries)
    let first_3_bytes = &s[0..3];  // "ส" ใช้ 3 bytes
    println!("First 3 bytes: {}", first_3_bytes);
}
```

</RustPlayground>

### 4.3 วิธีวนลูป String

<RustPlayground>

```rust
fn main() {
    let s = "Hello สวัสดี";
    
    // วนเป็น characters
    println!("Characters:");
    for c in s.chars() {
        print!("{} ", c);
    }
    println!();
    
    // วนเป็น bytes
    println!("\nBytes:");
    for b in s.bytes() {
        print!("{:02X} ", b);
    }
    println!();
    
    // วนพร้อม index
    println!("\nWith index:");
    for (i, c) in s.char_indices() {
        println!("  byte {}: {}", i, c);
    }
}
```

</RustPlayground>

---

## 5. String Methods ที่ใช้บ่อย

<RustPlayground>

```rust
fn main() {
    let s = "  Hello, World!  ";
    
    // ตัด whitespace
    println!("trim: '{}'", s.trim());
    
    // ตรวจสอบ
    println!("contains 'World': {}", s.contains("World"));
    println!("starts_with '  H': {}", s.starts_with("  H"));
    println!("ends_with '!  ': {}", s.ends_with("!  "));
    println!("is_empty: {}", s.is_empty());
    
    // แปลงตัวอักษร
    println!("to_uppercase: {}", s.to_uppercase());
    println!("to_lowercase: {}", s.to_lowercase());
    
    // แยก
    let parts: Vec<&str> = "a,b,c".split(',').collect();
    println!("split: {:?}", parts);
    
    // แยกเป็นบรรทัด
    let lines: Vec<&str> = "line1\nline2\nline3".lines().collect();
    println!("lines: {:?}", lines);
}
```

</RustPlayground>

---

## 6. Concatenation (การรวม String)

<RustPlayground>

```rust
fn main() {
    let s1 = String::from("Hello");
    let s2 = String::from(" World");
    
    // วิธีที่ 1: + operator (ใช้ ownership ของ s1)
    let s3 = s1 + &s2;  // s1 ถูก move, s2 ถูก borrow
    // println!("{}", s1);  // ❌ s1 ถูก move แล้ว
    println!("s3: {}", s3);
    
    // วิธีที่ 2: format! (ไม่ใช้ ownership)
    let a = String::from("Hello");
    let b = String::from(" World");
    let c = format!("{}{}", a, b);  // a, b ยังใช้ได้
    println!("a: {}, b: {}, c: {}", a, b, c);
    
    // วิธีที่ 3: push_str (ต้อง mut)
    let mut d = String::from("Hello");
    d.push_str(" World");
    println!("d: {}", d);
}
```

</RustPlayground>

:::tip ใช้ format! ดีที่สุด! 🌟
`format!` ไม่ยุ่งกับ ownership ทำให้โค้ดอ่านง่ายกว่า!
:::

---

## 7. Function Parameters: String vs &str

<RustPlayground>

```rust
// ✅ ดี! รับ &str (ยืดหยุ่น)
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

// ❌ ไม่ค่อยดี รับ String (ต้อง move ownership)
fn greet_owned(name: String) {
    println!("Hello, {}!", name);
}

fn main() {
    let s = String::from("Alice");
    let slice = "Bob";
    
    // greet รับได้ทั้ง String (as &str) และ &str
    greet(&s);
    greet(slice);
    
    // greet_owned ต้อง move String
    greet_owned(s);  // s ถูก move
    // greet_owned(s);  // ❌ ใช้ s อีกไม่ได้
}
```

</RustPlayground>

:::tip Best Practice 💡
ถ้า function แค่อ่านค่า ให้รับ `&str` เสมอ! จะได้รับได้ทั้ง `String` และ `&str`
:::

---

## 8. สรุป

| Concept | Description |
|---------|-------------|
| `String` | Owned, mutable, heap |
| `&str` | Borrowed, immutable |
| `.to_string()` | &str → String |
| `&s` | String → &str |
| `.len()` | Bytes count |
| `.chars()` | Character iterator |
| `format!()` | Safe concatenation |
| UTF-8 | Rust's encoding |

---

[บทถัดไป: Serde & JSON](/intermediate/serde)
