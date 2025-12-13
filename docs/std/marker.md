# Marker Traits - ระบุคุณสมบัติ

**std::marker** มี traits พิเศษที่ไม่มี methods แต่บอก compiler ว่า type มีคุณสมบัติอะไร! 

---

## Marker Traits คืออะไร?

Marker traits ไม่มี methods ที่ต้อง implement แต่ใช้บอก compiler ว่า type ปลอดภัยที่จะทำอะไรบางอย่าง:

| Trait | ความหมาย |
|-------|----------|
| `Send` | ส่งข้าม thread ได้ |
| `Sync` | แชร์ reference ข้าม thread ได้ |
| `Copy` | copy ได้โดยไม่ต้อง clone |
| `Sized` | ขนาดรู้ตอน compile |
| `Unpin` | ย้ายได้หลังจาก pin |

:::tip Auto Traits
ส่วนใหญ่ compiler implement ให้อัตโนมัติ ถ้าทุก field มีคุณสมบัตินั้น!
:::

---

## 1. Send - ส่งข้าม Thread ได้

<RustPlayground>

```rust
use std::thread;
use std::rc::Rc;
use std::sync::Arc;

fn main() {
 // i32 เป็น Send - ส่งข้าม thread ได้
 let number = 42;
 let handle = thread::spawn(move || {
 println!("ได้รับ: {} ใน thread ใหม่", number);
 });
 handle.join().unwrap();
 
 // Arc<T> เป็น Send (ถ้า T เป็น Send)
 let data = Arc::new(vec![1, 2, 3]);
 let data_clone = Arc::clone(&data);
 
 let handle2 = thread::spawn(move || {
 println!("Vec ใน thread: {:?}", data_clone);
 });
 handle2.join().unwrap();
 
 println!("Main thread ยังมี: {:?}", data);
 
 // Rc<T> ไม่เป็น Send - ไม่สามารถส่งข้าม thread
 // let rc = Rc::new(42);
 // thread::spawn(move || {
 // println!("{}", rc); // Error: Rc ไม่ implement Send!
 // });
}
```

</RustPlayground>

:::warning Rc ไม่ใช่ Send
`Rc` ใช้ non-atomic counter จึงไม่ปลอดภัยกับ threads ใช้ `Arc` แทน!
:::

---

## 2. Sync - แชร์ Reference ข้าม Thread

<RustPlayground>

```rust
use std::sync::Arc;
use std::thread;
use std::cell::RefCell;

fn main() {
 // i32 เป็น Sync - &i32 แชร์ข้าม thread ได้
 let number = 42;
 
 thread::scope(|s| {
 s.spawn(|| {
 println!("Thread 1 เห็น: {}", number);
 });
 s.spawn(|| {
 println!("Thread 2 เห็น: {}", number);
 });
 });
 
 // Arc<T> เป็น Sync (ถ้า T เป็น Sync)
 let shared = Arc::new(100);
 let s1 = Arc::clone(&shared);
 let s2 = Arc::clone(&shared);
 
 thread::scope(|s| {
 s.spawn(move || println!("Arc 1: {}", s1));
 s.spawn(move || println!("Arc 2: {}", s2));
 });
 
 // RefCell ไม่เป็น Sync!
 // let cell = RefCell::new(0);
 // thread::scope(|s| {
 // s.spawn(|| {
 // *cell.borrow_mut() += 1; // Error!
 // });
 // });
 
 println!("เสร็จสิ้น!");
}
```

</RustPlayground>

:::info Send vs Sync
- **Send**: ย้าย ownership ข้าม thread (T)
- **Sync**: แชร์ reference ข้าม thread (&T)
- ถ้า T เป็น Sync แล้ว &T จะเป็น Send
:::

---

## 3. Copy - คัดลอกอัตโนมัติ

<RustPlayground>

```rust
// Copy = bitwise copy อัตโนมัติ (ไม่ move)
// ต้อง derive ร่วมกับ Clone เสมอ

#[derive(Debug, Clone, Copy)]
struct Point {
 x: i32,
 y: i32,
}

// ไม่สามารถเป็น Copy ได้ เพราะมี String (ข้อมูลบน heap)
#[derive(Debug, Clone)]
struct Person {
 name: String,
 age: u32,
}

fn main() {
 // Copy type - ไม่ move
 let p1 = Point { x: 1, y: 2 };
 let p2 = p1; // Copy! (ไม่ใช่ move)
 
 println!("p1: {:?}", p1); // ยังใช้ได้!
 println!("p2: {:?}", p2);
 
 // Primitive types เป็น Copy
 let a = 42;
 let b = a; // Copy
 println!("a: {}, b: {}", a, b); // ทั้งคู่ใช้ได้
 
 // Non-Copy type - move
 let person1 = Person { 
 name: "Alice".to_string(), 
 age: 25 
 };
 let person2 = person1; // Move!
 
 // println!("{:?}", person1); // Error: person1 ถูก move
 println!("{:?}", person2);
 
 // ต้องใช้ clone() แทน
 let person3 = person2.clone();
 println!("person2: {:?}", person2); // ยังใช้ได้
 println!("person3: {:?}", person3);
}
```

</RustPlayground>

---

## 4. Sized - รู้ขนาดตอน Compile

<RustPlayground>

```rust
use std::fmt::Debug;

// T โดย default จะเป็น T: Sized
fn sized_only<T>(t: T) -> T {
 println!("ขนาด: {} bytes", std::mem::size_of_val(&t));
 t
}

// ?Sized หมายความว่าอาจไม่รู้ขนาด
// ใช้กับ reference เท่านั้น (&T หรือ Box<T>)
fn maybe_unsized<T: ?Sized + Debug>(t: &T) {
 println!("ค่า: {:?}", t);
}

fn main() {
 // Sized types - รู้ขนาด
 sized_only(42_i32); // 4 bytes
 sized_only("hello".to_string()); // 24 bytes (pointer + len + cap)
 
 println!("\n=== ?Sized ===");
 
 // str เป็น unsized (ตัว str ไม่ใช่ &str)
 let s: &str = "hello";
 maybe_unsized(s);
 
 // [i32] เป็น unsized
 let arr = [1, 2, 3, 4, 5];
 maybe_unsized(&arr[..]); // &[i32]
 
 // dyn Trait เป็น unsized
 let debug: &dyn Debug = &42;
 maybe_unsized(debug);
 
 println!("\n=== ขนาด Reference ===");
 println!("&str: {} bytes", std::mem::size_of::<&str>()); // 16 (ptr + len)
 println!("&dyn Debug: {} bytes", std::mem::size_of::<&dyn Debug>()); // 16 (ptr + vtable)
 println!("&i32: {} bytes", std::mem::size_of::<&i32>()); // 8 (ptr only)
}
```

</RustPlayground>

---

## 5. Unpin - ย้ายได้หลัง Pin

<RustPlayground>

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

// ส่วนใหญ่ของ types เป็น Unpin = ย้ายได้หลัง pin
#[derive(Debug)]
struct Moveable {
 data: i32,
}

// PhantomPinned ทำให้ไม่เป็น Unpin
#[derive(Debug)]
struct NotMoveable {
 data: i32,
 _pin: PhantomPinned, // ทำให้ type นี้ไม่เป็น Unpin
}

fn main() {
 // Unpin type - สามารถได้ &mut จาก Pin
 let mut moveable = Moveable { data: 42 };
 let pinned = Pin::new(&mut moveable);
 
 // get_mut ใช้ได้กับ Unpin types
 let inner = Pin::get_mut(pinned);
 inner.data = 100;
 println!("แก้ไขแล้ว: {:?}", moveable);
 
 // !Unpin type - Pin มีความหมายจริงๆ
 let not_moveable = NotMoveable { 
 data: 42, 
 _pin: PhantomPinned 
 };
 let boxed = Box::pin(not_moveable);
 println!("NotMoveable: {:?}", boxed);
 
 // ไม่สามารถใช้ get_mut กับ !Unpin
 // Pin::get_mut(boxed); // Error!
}
```

</RustPlayground>

---

## 6. PhantomData - แกล้งทำเป็นเก็บ Type

<RustPlayground>

```rust
use std::marker::PhantomData;

// PhantomData: "แกล้งทำเป็น" เก็บ type T โดยไม่ใช้พื้นที่

// Use case 1: กำหนด ownership ของ type parameter
struct Handle<T> {
 id: u64,
 _marker: PhantomData<T>, // "เป็นเจ้าของ" T
}

// Use case 2: กำหนด lifetime
struct Ref<'a, T> {
 ptr: *const T,
 _marker: PhantomData<&'a T>, // ผูก lifetime 'a
}

// Use case 3: Type-safe IDs
struct UserId(PhantomData<*const ()>);
struct ProductId(PhantomData<*const ()>);

fn get_user(_id: UserId) {}
fn get_product(_id: ProductId) {}

fn main() {
 let handle: Handle<String> = Handle { 
 id: 1, 
 _marker: PhantomData 
 };
 println!("Handle id: {}", handle.id);
 
 // PhantomData ไม่ใช้พื้นที่
 println!("PhantomData size: {} bytes", 
 std::mem::size_of::<PhantomData<String>>()); // 0!
 
 // Type-safe: ไม่สามารถสลับ ID ได้
 let user_id = UserId(PhantomData);
 get_user(user_id);
 
 // get_user(ProductId(PhantomData)); // Error: wrong type!
}
```

</RustPlayground>

---

## 7. Auto Traits และ Negative Impl

<RustPlayground>

```rust
use std::cell::RefCell;
use std::rc::Rc;

// Auto traits = implement อัตโนมัติถ้าทุก field มี

struct MySend {
 a: i32, // Send + Sync
 b: String, // Send + Sync
}
// MySend เป็น Send + Sync อัตโนมัติ!

struct MyNotSync {
 a: i32,
 b: RefCell<i32>, // RefCell ไม่เป็น Sync
}
// MyNotSync เป็น Send แต่ไม่เป็น Sync

struct MyNotSend {
 a: i32,
 b: Rc<i32>, // Rc ไม่เป็น Send
}
// MyNotSend ไม่เป็น Send และไม่เป็น Sync

// ตรวจสอบว่า type เป็น Send/Sync ไหม
fn requires_send<T: Send>(_: T) {}
fn requires_sync<T: Sync>(_: &T) {}

fn main() {
 let my_send = MySend { a: 1, b: String::new() };
 requires_send(my_send); // 
 
 let my_send2 = MySend { a: 2, b: String::new() };
 requires_sync(&my_send2); // 
 
 let my_not_sync = MyNotSync { a: 1, b: RefCell::new(0) };
 requires_send(my_not_sync); // Send ได้
 // requires_sync(&my_not_sync); // Error: ไม่เป็น Sync
 
 // let my_not_send = MyNotSend { a: 1, b: Rc::new(0) };
 // requires_send(my_not_send); // Error: ไม่เป็น Send
 
 println!("Compile สำเร็จ!");
}
```

</RustPlayground>

---

## Quick Reference

### Marker Traits
| Trait | ความหมาย | Auto? |
|-------|----------|-------|
| `Send` | ส่งข้าม thread ได้ | |
| `Sync` | แชร์ &T ข้าม thread ได้ | |
| `Copy` | bitwise copy ได้ | derive |
| `Sized` | รู้ขนาดตอน compile | |
| `Unpin` | ย้ายได้หลัง pin | |

### ไม่เป็น Send/Sync
| Type | Send | Sync | เหตุผล |
|------|------|------|--------|
| `Rc<T>` | | | non-atomic counter |
| `RefCell<T>` | | | interior mutability |
| `Cell<T>` | | | interior mutability |
| `*const T` | | | raw pointer |
| `*mut T` | | | raw pointer |

### PhantomData Uses
| Pattern | ใช้ทำอะไร |
|---------|---------|
| `PhantomData<T>` | แกล้งเป็นเจ้าของ T |
| `PhantomData<&'a T>` | ผูก lifetime |
| `PhantomData<*const T>` | ไม่เป็น Send/Sync |
| `PhantomPinned` | ไม่เป็น Unpin |

### กฎสำคัญ
```
T: Sync &T: Send
T: Send + Sync Arc<T>: Send + Sync
```

---

[← Panic](./panic) | [Any →](./any)
