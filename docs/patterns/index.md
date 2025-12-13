# Design Patterns

รวม Patterns และแนวทางการเขียน Rust ที่ดี!

---

## Patterns

- [ Error Handling](./error-handling) - จัดการ Errors อย่างมืออาชีพ
- [ Async/Await](./async) - Async Programming Patterns
::: tip
**@ Binding**
ใช้ `@` เพื่อ "TEST และ KEEP" ค่าไว้ในตัวแปรพร้อมกัน
เช่น `match msg { Message::Hello(id @ 3..=7) => ... }` (เช็คว่า 3-7 และเก็บค่าไว้ใน `id`)
:::
- [ Builder](./builder) - สร้าง Objects แบบ step-by-step
- [Newtype](./newtype) - Type Safety และ Wrapping
- [Smart Pointers](./smart-pointers) - Box, Rc, Arc, RefCell, Cow
- [Iterator](./iterator) - Iterator Combinators และ Patterns
- [Typestate](./typestate) - Compile-time State Machines
- [Trait Objects](./trait-objects) - Static vs Dynamic Dispatch
- [ Testing](./testing) - Unit Tests, Mocking, Property Testing
- [Unsafe](./unsafe) - Raw Pointers, Safe Abstractions
- [ FFI](./ffi) - C Interop, Bindings
- [ Lifetime](./lifetime) - Lifetime Annotations, Elision

---

## Related

- [Cheat Sheet](/cheatsheet) - รวมทุกอย่างในหน้าเดียว
- [Traits](/traits/) - Trait Patterns
- [Functions](/functions/) - Standard Library Functions
