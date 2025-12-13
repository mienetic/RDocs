# Trait Objects vs Generics

เลือกระหว่าง Static Dispatch และ Dynamic Dispatch! 

---

## Generics (Static Dispatch)

<RustPlayground>

```rust
trait Animal {
 fn speak(&self) -> &str;
}

struct Dog;
struct Cat;

impl Animal for Dog {
 fn speak(&self) -> &str { "Woof!" }
}

impl Animal for Cat {
 fn speak(&self) -> &str { "Meow!" }
}

// Generic function - Static Dispatch
// Compiler สร้าง copy สำหรับแต่ละ type
fn make_speak<T: Animal>(animal: &T) {
 println!("{}", animal.speak());
}

fn main() {
 let dog = Dog;
 let cat = Cat;
 
 make_speak(&dog); // เร็ว! ไม่มี runtime overhead
 make_speak(&cat);
}
```

</RustPlayground>

---

## Trait Objects (Dynamic Dispatch)

<RustPlayground>

```rust
trait Animal {
 fn speak(&self) -> &str;
}

struct Dog;
struct Cat;

impl Animal for Dog {
 fn speak(&self) -> &str { "Woof!" }
}

impl Animal for Cat {
 fn speak(&self) -> &str { "Meow!" }
}

// Trait Object - Dynamic Dispatch
// ใช้ vtable ตอน runtime
fn make_speak(animal: &dyn Animal) {
 println!("{}", animal.speak());
}

fn main() {
 let dog = Dog;
 let cat = Cat;
 
 make_speak(&dog);
 make_speak(&cat);
 
 // สามารถเก็บ mixed types ใน Vec ได้!
 let animals: Vec<Box<dyn Animal>> = vec![
 Box::new(Dog),
 Box::new(Cat),
 Box::new(Dog),
 ];
 
 for animal in &animals {
 println!("{}", animal.speak());
 }
}
```

</RustPlayground>

---

## เมื่อไหร่ใช้อะไร?

### ใช้ Generics เมื่อ:
- Performance สำคัญมาก
- รู้ types ทั้งหมดตอน compile time
- ต้องการ inline optimization

### ใช้ Trait Objects เมื่อ:
- ต้องการ heterogeneous collection
- Plugin system
- ลด binary size (ไม่ monomorphize)

---

## Object Safety

<RustPlayground>

```rust
// Object-safe trait
trait Drawable {
 fn draw(&self);
 fn area(&self) -> f64;
}

// NOT object-safe! (มี generic method)
trait NotObjectSafe {
 fn process<T>(&self, item: T); // ไม่สามารถใช้กับ dyn ได้
}

// NOT object-safe! (return Self)
trait Clone2 {
 fn clone(&self) -> Self; // ไม่สามารถใช้กับ dyn ได้
}

struct Circle { radius: f64 }
struct Square { side: f64 }

impl Drawable for Circle {
 fn draw(&self) { println!("Drawing circle"); }
 fn area(&self) -> f64 { 3.14159 * self.radius * self.radius }
}

impl Drawable for Square {
 fn draw(&self) { println!("Drawing square"); }
 fn area(&self) -> f64 { self.side * self.side }
}

fn main() {
 let shapes: Vec<Box<dyn Drawable>> = vec![
 Box::new(Circle { radius: 5.0 }),
 Box::new(Square { side: 4.0 }),
 ];
 
 for shape in &shapes {
 shape.draw();
 println!("Area: {}", shape.area());
 }
}
```

</RustPlayground>

---

## Quick Reference

| Feature | Generics | Trait Objects |
|---------|----------|---------------|
| Dispatch | Static (compile time) | Dynamic (runtime) |
| Performance | Faster | Slight overhead |
| Binary Size | Larger (monomorphization) | Smaller |
| Heterogeneous | | |
| Object Safety | N/A | Required |

---

[← Typestate](/patterns/typestate) | [Testing →](/patterns/testing)
