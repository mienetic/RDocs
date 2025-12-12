# Traits & Generics

Polymorphism ใน Rust!

## What are Traits?

Traits คือ "interface" ที่กำหนดพฤติกรรมร่วมกัน

<RustPlayground>

```rust
// ประกาศ Trait
trait Greet {
    fn say_hello(&self) -> String;
    
    // Default implementation
    fn say_goodbye(&self) -> String {
        String::from("Goodbye!")
    }
}

// Implement Trait สำหรับ Struct
struct Person {
    name: String,
}

impl Greet for Person {
    fn say_hello(&self) -> String {
        format!("Hello, I'm {}!", self.name)
    }
    // say_goodbye ใช้ default implementation
}

struct Robot {
    id: u32,
}

impl Greet for Robot {
    fn say_hello(&self) -> String {
        format!("BEEP BOOP, I am Robot #{}", self.id)
    }
    
    fn say_goodbye(&self) -> String {
        String::from("SHUTTING DOWN...")
    }
}

fn main() {
    let person = Person { name: String::from("Alice") };
    let robot = Robot { id: 42 };
    
    println!("{}", person.say_hello());
    println!("{}", person.say_goodbye());
    println!("{}", robot.say_hello());
    println!("{}", robot.say_goodbye());
}
```

</RustPlayground>

### เปรียบเทียบ Traits vs Interfaces

| Feature | Rust Traits | Java Interface | Go Interface |
|---------|-------------|----------------|--------------|
| Explicit impl | Yes | Yes | No (duck typing) |
| Default methods | Yes | Yes | No |
| Multiple impl | Yes | Yes | Yes |
| Generics | Yes | Yes | No |
| Associated types | Yes | No | No |

## Generics

<RustPlayground>

```rust
// Function กับ Generics
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    
    largest
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    let result = largest(&numbers);
    println!("Largest number: {}", result);
    
    let chars = vec!['y', 'm', 'a', 'q'];
    let result = largest(&chars);
    println!("Largest char: {}", result);
}
```

</RustPlayground>

### Generic Structs

<RustPlayground>

```rust
// Struct กับ Generics
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Self {
        Point { x, y }
    }
    
    fn x(&self) -> &T {
        &self.x
    }
}

// Specific implementation for f64
impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

fn main() {
    let int_point = Point::new(5, 10);
    let float_point = Point::new(3.0, 4.0);
    
    println!("int_point.x: {}", int_point.x());
    println!("float_point distance: {}", float_point.distance_from_origin());
}
```

</RustPlayground>

### Multiple Generic Types

<RustPlayground>

```rust
struct Pair<T, U> {
    first: T,
    second: U,
}

impl<T, U> Pair<T, U> {
    fn new(first: T, second: U) -> Self {
        Pair { first, second }
    }
    
    fn swap(self) -> Pair<U, T> {
        Pair {
            first: self.second,
            second: self.first,
        }
    }
}

fn main() {
    let pair = Pair::new(5, "hello");
    println!("first: {}, second: {}", pair.first, pair.second);
    
    let swapped = pair.swap();
    println!("first: {}, second: {}", swapped.first, swapped.second);
}
```

</RustPlayground>

## Trait Bounds

<RustPlayground>

```rust
use std::fmt::Display;

// Trait bound syntax
fn print_info<T: Display>(item: T) {
    println!("Info: {}", item);
}

// where clause (อ่านง่ายกว่าถ้ามีหลาย bounds)
fn compare_and_print<T, U>(t: T, u: U)
where
    T: Display + Clone,
    U: Display,
{
    println!("T: {}, U: {}", t.clone(), u);
}

fn main() {
    print_info("Hello");
    print_info(42);
    
    compare_and_print("text", 123);
}
```

</RustPlayground>

### Multiple Trait Bounds

<RustPlayground>

```rust
use std::fmt::{Display, Debug};

// ใช้ + เพื่อบอกว่าต้อง implement ทั้งสอง traits
fn print_both<T: Display + Debug>(item: T) {
    println!("Display: {}", item);
    println!("Debug: {:?}", item);
}

fn main() {
    print_both(42);
    print_both("hello");
}
```

</RustPlayground>

## Common Standard Library Traits

<RustPlayground>

```rust
// derive macro ช่วยสร้าง trait impl อัตโนมัติ
#[derive(Debug, Clone, PartialEq, Default)]
struct Person {
    name: String,
    age: u32,
}

fn main() {
    let p1 = Person {
        name: String::from("Alice"),
        age: 30,
    };
    
    // Debug - พิมพ์แบบ debug
    println!("{:?}", p1);
    println!("{:#?}", p1);  // pretty print
    
    // Clone - สร้าง copy
    let p2 = p1.clone();
    
    // PartialEq - เปรียบเทียบ
    println!("p1 == p2: {}", p1 == p2);
    
    // Default - สร้าง default value
    let default_person = Person::default();
    println!("Default: {:?}", default_person);
}
```

</RustPlayground>

### Common Traits Summary

| Trait | ทำอะไร | Derive? |
|-------|--------|---------|
| `Debug` | {:?} formatting | Yes |
| `Clone` | Deep copy | Yes |
| `Copy` | Bitwise copy | Yes |
| `PartialEq` | == comparison | Yes |
| `Eq` | Full equality | Yes |
| `PartialOrd` | <, >, <=, >= | Yes |
| `Ord` | Total ordering | Yes |
| `Default` | Default value | Yes |
| `Hash` | Hashing | Yes |
| `Display` | {} formatting | No |
| `From`/`Into` | Type conversion | No |

## Implementing Display

<RustPlayground>

```rust
use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 10, y: 20 };
    println!("Point: {}", p);  // ใช้ Display
}
```

</RustPlayground>

## Trait Objects (Dynamic Dispatch)

<RustPlayground>

```rust
trait Animal {
    fn speak(&self);
}

struct Dog;
struct Cat;

impl Animal for Dog {
    fn speak(&self) {
        println!("Woof!");
    }
}

impl Animal for Cat {
    fn speak(&self) {
        println!("Meow!");
    }
}

// dyn keyword = dynamic dispatch
fn make_sound(animal: &dyn Animal) {
    animal.speak();
}

fn main() {
    let dog = Dog;
    let cat = Cat;
    
    make_sound(&dog);
    make_sound(&cat);
    
    // Vec of different types
    let animals: Vec<Box<dyn Animal>> = vec![Box::new(Dog), Box::new(Cat)];
    
    for animal in &animals {
        animal.speak();
    }
}
```

</RustPlayground>

### Static vs Dynamic Dispatch

| | Static (Generics) | Dynamic (dyn Trait) |
|---|-------------------|---------------------|
| Performance | เร็วกว่า (inlined) | ช้ากว่า (vtable) |
| Binary size | ใหญ่กว่า (monomorphization) | เล็กกว่า |
| Flexibility | Compile-time only | Runtime |
| Object collection | ไม่ได้ | ได้ (Box dyn Trait) |

## Associated Types

<RustPlayground>

```rust
trait Container {
    type Item;  // Associated type
    
    fn add(&mut self, item: Self::Item);
    fn get(&self, index: usize) -> Option<&Self::Item>;
}

struct Stack<T> {
    items: Vec<T>,
}

impl<T> Container for Stack<T> {
    type Item = T;
    
    fn add(&mut self, item: T) {
        self.items.push(item);
    }
    
    fn get(&self, index: usize) -> Option<&T> {
        self.items.get(index)
    }
}

fn main() {
    let mut stack = Stack { items: vec![] };
    stack.add(1);
    stack.add(2);
    stack.add(3);
    
    println!("Item 0: {:?}", stack.get(0));
    println!("Item 1: {:?}", stack.get(1));
}
```

</RustPlayground>

## สรุป

| Concept | คำอธิบาย |
|---------|---------|
| Trait | Interface กำหนดพฤติกรรม |
| Generic | Code ที่ทำงานกับหลาย types |
| Trait Bound | จำกัด generic ให้มี trait |
| dyn Trait | Dynamic dispatch |
| derive | Auto-implement traits |
| Associated Type | Type ที่กำหนดใน trait |

**ยินดีด้วย!** คุณจบระดับ Intermediate แล้ว!

---

[ไปต่อระดับ Advanced!](/advanced/)
