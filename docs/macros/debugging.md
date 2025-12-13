# Debugging Macros - Debug

`dbg!`, `todo!`, `unimplemented!`, `unreachable!` สำหรับ debug! 

---

## dbg! - Debug พิมพ์ค่า

<RustPlayground>

```rust
fn main() {
 let x = 5;
 let y = 10;
 
 // dbg! พิมพ์ค่าพร้อม file:line
 dbg!(x);
 dbg!(y);
 dbg!(x + y);
 
 // dbg! return ค่าด้วย!
 let result = dbg!(x * 2) + dbg!(y / 2);
 println!("result = {}", result);
}
```

</RustPlayground>

:::tip dbg! output
```
[src/main.rs:5] x = 5
[src/main.rs:6] y = 10
[src/main.rs:7] x + y = 15
```
แสดง file, line number, expression, และ value!
:::

---

## dbg! ใน expressions

<RustPlayground>

```rust
fn main() {
 let nums = vec![1, 2, 3, 4, 5];
 
 // ใช้ dbg! ใน pipeline
 let doubled: Vec<_> = nums
 .iter()
 .map(|x| dbg!(x * 2))
 .collect();
 
 println!("doubled = {:?}", doubled);
 
 // dbg! หลายค่า
 let a = 1;
 let b = 2; 
 let c = 3;
 dbg!(a, b, c);
}
```

</RustPlayground>

---

## todo! - ยังไม่ได้ implement

<RustPlayground>

```rust
fn calculate_tax(income: f64) -> f64 {
 // TODO: ยังไม่ได้ implement
 todo!()
}

fn process_order(id: u32) -> Result<(), String> {
 todo!("implement order processing for id {}", id)
}

fn main() {
 println!("App started");
 
 // ถ้าเรียก function ที่มี todo! จะ panic
 // calculate_tax(50000.0);
 
 println!("Demo finished");
}
```

</RustPlayground>

---

## unimplemented! - ยังไม่ implement (deprecated style)

<RustPlayground>

```rust
trait Animal {
 fn speak(&self);
 fn walk(&self);
}

struct Dog;

impl Animal for Dog {
 fn speak(&self) {
 println!("Woof!");
 }
 
 fn walk(&self) {
 // ยังไม่ได้ implement
 unimplemented!()
 }
}

fn main() {
 let dog = Dog;
 dog.speak();
 
 // dog.walk(); // จะ panic!
}
```

</RustPlayground>

:::tip todo! vs unimplemented!
- `todo!()` - หมายความว่า "จะทำทีหลัง"
- `unimplemented!()` - หมายความว่า "ไม่ได้วางแผนจะทำ"

ใช้ `todo!()` ดีกว่า เพราะชัดเจนกว่า
:::

---

## unreachable! - ถ้ามาถึงจุดนี้คือ bug

<RustPlayground>

```rust
fn main() {
 let x = 42u8;
 
 // unreachable! ใช้เมื่อ compiler ไม่รู้ว่าถึงไม่ได้
 let description = match x {
 0..=50 => "low",
 51..=100 => "medium",
 101..=200 => "high",
 201..=u8::MAX => "very high",
 // _ => unreachable!(), // ไม่ต้อง เพราะ covered หมดแล้ว
 };
 
 println!("{}: {}", x, description);
}
```

</RustPlayground>

---

## unreachable! ในทางปฏิบัติ

<RustPlayground>

```rust
enum Direction { North, South, East, West }

fn move_player(dir: Direction) -> (i32, i32) {
 match dir {
 Direction::North => (0, 1),
 Direction::South => (0, -1),
 Direction::East => (1, 0),
 Direction::West => (-1, 0),
 }
 // ไม่ต้อง unreachable! เพราะ match ครบทุก variants
}

fn parse_direction(s: &str) -> Direction {
 match s.to_lowercase().as_str() {
 "north" | "n" => Direction::North,
 "south" | "s" => Direction::South,
 "east" | "e" => Direction::East,
 "west" | "w" => Direction::West,
 _ => unreachable!("validated before calling"),
 }
}

fn main() {
 let valid_dirs = ["north", "south", "east", "west"];
 
 for dir in valid_dirs {
 // สมมุติว่า validate แล้ว
 let d = parse_direction(dir);
 let (dx, dy) = move_player(d);
 println!("{} => ({}, {})", dir, dx, dy);
 }
}
```

</RustPlayground>

---

## Quick Reference

### Macros
| Macro | ใช้เมื่อ | Panics? |
|-------|---------|---------|
| `dbg!` | Debug พิมพ์ค่า | |
| `todo!` | ยังไม่ implement | |
| `unimplemented!` | ไม่วางแผนจะทำ | |
| `unreachable!` | ไม่ควรมาถึง | |

### เมื่อไหร่ใช้อะไร
| Situation | ใช้ |
|-----------|-----|
| ดูค่าตัวแปร | `dbg!` |
| Placeholder | `todo!` |
| Match arm ที่เป็นไปไม่ได้ | `unreachable!` |
| Stub implementation | `unimplemented!` |

---

[← Assertions](./assertions) | [Panic →](./panic)
