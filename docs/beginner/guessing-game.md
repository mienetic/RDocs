# Guessing Game

มาสร้างเกมทายตัวเลขกัน! 🎮

โปรเจกต์นี้จะช่วยให้คุณเข้าใจ:
- รับ input จากผู้ใช้
- สร้างตัวเลขสุ่ม
- Control flow (loop, match)
- Error handling

---

## 1. สร้างโปรเจกต์

```bash
cargo new guessing_game
cd guessing_game
```

---

## 2. เพิ่ม Dependency

แก้ไข `Cargo.toml`:

```toml
[package]
name = "guessing_game"
version = "0.1.0"
edition = "2024"

[dependencies]
rand = "0.8"
```

---

## 3. เขียน Code

<RustPlayground>

```rust
use std::io;
use std::cmp::Ordering;

fn main() {
    println!("=== เกมทายตัวเลข ===");
    
    // สร้างตัวเลขสุ่ม 1-100
    // ใน Playground ใช้ค่าคงที่แทน
    let secret_number = 42;  // rand::thread_rng().gen_range(1..=100);
    
    println!("ผมคิดตัวเลข 1-100 ไว้แล้ว");
    println!("(Hint: คำตอบคือ 42 สำหรับ demo นี้)");
    
    // Demo: ทาย 50 ก่อน
    let guesses = [50, 25, 42];
    
    for guess in guesses {
        println!("\nคุณทาย: {}", guess);
        
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("น้อยไป! ↑"),
            Ordering::Greater => println!("มากไป! ↓"),
            Ordering::Equal => {
                println!("🎉 ถูกต้อง! คุณชนะแล้ว!");
                break;
            }
        }
    }
}
```

</RustPlayground>

---

## 4. Code เต็มรูปแบบ

```rust
use std::io;
use std::cmp::Ordering;
use rand::Rng;

fn main() {
    println!("=== เกมทายตัวเลข ===");
    
    // สร้างตัวเลขสุ่ม 1-100
    let secret_number = rand::thread_rng().gen_range(1..=100);
    
    println!("ผมคิดตัวเลข 1-100 ไว้แล้ว ลองทายดู!");
    
    loop {
        println!("\nใส่ตัวเลขที่ทาย:");
        
        // รับ input
        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");
        
        // แปลงเป็นตัวเลข (handle error)
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("❌ กรุณาใส่ตัวเลข!");
                continue;
            }
        };
        
        println!("คุณทาย: {}", guess);
        
        // เปรียบเทียบ
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("น้อยไป! ↑"),
            Ordering::Greater => println!("มากไป! ↓"),
            Ordering::Equal => {
                println!("🎉 ถูกต้อง! คุณชนะแล้ว!");
                break;
            }
        }
    }
}
```

---

## 5. อธิบาย Code

### 5.1 รับ Input

```rust
let mut guess = String::new();
io::stdin()
    .read_line(&mut guess)
    .expect("Failed to read line");
```

| Part | Description |
|------|-------------|
| `String::new()` | สร้าง String ว่าง |
| `io::stdin()` | Standard input |
| `.read_line(&mut guess)` | อ่านทั้งบรรทัดเข้า `guess` |
| `.expect()` | Handle error (panic if fail) |

### 5.2 แปลง String เป็นตัวเลข

```rust
let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => continue,
};
```

| Part | Description |
|------|-------------|
| `.trim()` | ลบ whitespace และ newline |
| `.parse()` | แปลงเป็น type ที่ระบุ |
| `match` | Handle Ok/Err |
| `continue` | ข้ามรอบนี้ ทำ loop ใหม่ |

### 5.3 เปรียบเทียบ

```rust
match guess.cmp(&secret_number) {
    Ordering::Less => println!("น้อยไป!"),
    Ordering::Greater => println!("มากไป!"),
    Ordering::Equal => {
        println!("ถูกต้อง!");
        break;
    }
}
```

| Ordering | Meaning |
|----------|---------|
| `Less` | `guess < secret` |
| `Greater` | `guess > secret` |
| `Equal` | `guess == secret` |

---

## 6. เพิ่มฟีเจอร์

### 6.1 นับจำนวนครั้งที่ทาย

```rust
let mut attempts = 0;

loop {
    attempts += 1;
    // ... game logic ...
    
    if guess == secret_number {
        println!("คุณทาย {} ครั้ง", attempts);
        break;
    }
}
```

### 6.2 จำกัดจำนวนครั้ง

```rust
const MAX_ATTEMPTS: u32 = 7;
let mut attempts = 0;

loop {
    attempts += 1;
    
    if attempts > MAX_ATTEMPTS {
        println!("หมดโอกาส! คำตอบคือ {}", secret_number);
        break;
    }
    
    println!("ครั้งที่ {}/{}", attempts, MAX_ATTEMPTS);
    // ... game logic ...
}
```

### 6.3 เล่นอีกครั้ง

```rust
fn main() {
    loop {
        play_game();
        
        println!("\nเล่นอีกครั้ง? (y/n)");
        let mut answer = String::new();
        io::stdin().read_line(&mut answer).unwrap();
        
        if answer.trim().to_lowercase() != "y" {
            println!("ขอบคุณที่เล่น! 👋");
            break;
        }
    }
}

fn play_game() {
    // ... game code ...
}
```

---

## 7. รัน Game

```bash
cargo run
```

```
=== เกมทายตัวเลข ===
ผมคิดตัวเลข 1-100 ไว้แล้ว ลองทายดู!

ใส่ตัวเลขที่ทาย:
50
คุณทาย: 50
มากไป! ↓

ใส่ตัวเลขที่ทาย:
25
คุณทาย: 25
น้อยไป! ↑

ใส่ตัวเลขที่ทาย:
37
คุณทาย: 37
🎉 ถูกต้อง! คุณชนะแล้ว!
```

---

## 8. สรุปสิ่งที่เรียนรู้

| Concept | Example |
|---------|---------|
| User input | `io::stdin().read_line()` |
| Parsing | `string.parse::<u32>()` |
| Random | `rand::thread_rng().gen_range()` |
| Loop | `loop { break; }` |
| Match | `match value { ... }` |
| Error handling | `match result { Ok, Err }` |
| Comparison | `Ordering::Less/Greater/Equal` |

---

[บทถัดไป: Variables & Types](/beginner/variables)
