# Core Traits

`Clone`, `Copy`, `Default`, `Drop` - traits พื้นฐาน! 

---

## Clone - สร้างสำเนา

<RustPlayground>

```rust
#[derive(Clone, Debug)]
struct Point {
 x: i32,
 y: i32,
}

fn main() {
 let p1 = Point { x: 10, y: 20 };
 let p2 = p1.clone(); // explicit clone
 
 println!("p1: {:?}", p1);
 println!("p2: {:?}", p2);
 
 // Vec implements Clone
 let v1 = vec![1, 2, 3];
 let v2 = v1.clone();
 println!("\nv1: {:?}", v1);
 println!("v2: {:?}", v2);
}
```

</RustPlayground>

---

## Copy - สำเนาอัตโนมัติ

<RustPlayground>

```rust
#[derive(Copy, Clone, Debug)]
struct Point {
 x: i32,
 y: i32,
}

fn main() {
 let p1 = Point { x: 10, y: 20 };
 let p2 = p1; // copy, ไม่ใช่ move!
 
 // ทั้งคู่ยังใช้ได้
 println!("p1: {:?}", p1);
 println!("p2: {:?}", p2);
 
 // primitive types เป็น Copy
 let x = 42;
 let y = x;
 println!("\nx: {}, y: {}", x, y);
}
```

</RustPlayground>

---

## Default - ค่าเริ่มต้น

<RustPlayground>

```rust
#[derive(Default, Debug)]
struct Config {
 debug: bool,
 port: u16,
 name: String,
}

fn main() {
 // ใช้ Default::default()
 let cfg: Config = Default::default();
 println!("Default config: {:?}", cfg);
 
 // หรือ struct update syntax
 let cfg2 = Config {
 port: 8080,
 ..Default::default()
 };
 println!("Custom port: {:?}", cfg2);
 
 // primitives มี Default
 println!("\nDefault values:");
 println!(" bool: {}", bool::default());
 println!(" i32: {}", i32::default());
 println!(" String: {:?}", String::default());
}
```

</RustPlayground>

---

## Drop - Cleanup

<RustPlayground>

```rust
struct Resource {
 name: String,
}

impl Drop for Resource {
 fn drop(&mut self) {
 println!("Dropping: {}", self.name);
 }
}

fn main() {
 println!("Creating resources...");
 
 let _r1 = Resource { name: "First".to_string() };
 let _r2 = Resource { name: "Second".to_string() };
 
 {
 let _r3 = Resource { name: "Inner".to_string() };
 println!("End of inner scope");
 } // r3 dropped here
 
 println!("End of main");
} // r2, r1 dropped here (LIFO order)
```

</RustPlayground>

---

## Quick Reference

### Core Traits
| Trait | Derivable | คำอธิบาย |
|-------|-----------|---------|
| `Clone` | | `.clone()` สร้างสำเนา |
| `Copy` | | สำเนาอัตโนมัติ (ต้องมี Clone) |
| `Default` | | `::default()` ค่าเริ่มต้น |
| `Drop` | | cleanup เมื่อออกจาก scope |

### Copy Requirements
- ต้อง fields ทั้งหมดเป็น Copy
- ไม่มี heap allocation
- ไม่ implement Drop

---

[← Index](./index) | [Comparison →](./comparison)
