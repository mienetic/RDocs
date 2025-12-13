# Performance & Profiling

ทำให้ Rust code เร็วขึ้น! 

:::tip Rust = เร็วอยู่แล้ว แต่ยังเร็วกว่าได้อีก!
เรียนรู้วิธี benchmark, profile, และ optimize Rust code!
:::

---

## 1. Benchmarking

### 1.1 criterion (Standard)

```toml
# Cargo.toml
[dev-dependencies]
criterion = { version = "0.5", features = ["html_reports"] }

[[bench]]
name = "my_benchmark"
harness = false
```

```rust
// benches/my_benchmark.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
 match n {
 0 => 1,
 1 => 1,
 n => fibonacci(n - 1) + fibonacci(n - 2),
 }
}

fn criterion_benchmark(c: &mut Criterion) {
 c.bench_function("fib 20", |b| {
 b.iter(|| fibonacci(black_box(20)))
 });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
```

```bash
cargo bench
```

### 1.2 Comparing Implementations

```rust
use criterion::{criterion_group, criterion_main, BenchmarkId, Criterion};

fn bench_fibonacci(c: &mut Criterion) {
 let mut group = c.benchmark_group("Fibonacci");
 
 for n in [10, 20, 30].iter() {
 group.bench_with_input(
 BenchmarkId::new("Recursive", n),
 n,
 |b, n| b.iter(|| fibonacci_recursive(*n)),
 );
 
 group.bench_with_input(
 BenchmarkId::new("Iterative", n),
 n,
 |b, n| b.iter(|| fibonacci_iterative(*n)),
 );
 }
 
 group.finish();
}
```

---

## 2. Profiling

### 2.1 perf (Linux)

```bash
# Build with debug symbols
cargo build --release

# Profile
perf record ./target/release/myapp
perf report
```

### 2.2 flamegraph

```bash
# Install
cargo install flamegraph

# Generate flamegraph
cargo flamegraph --bin myapp

# Open flamegraph.svg in browser
```

### 2.3 Instruments (macOS)

```bash
# Build optimized with symbols
cargo build --release

# Open with Instruments
instruments -t "Time Profiler" ./target/release/myapp
```

::: best-practice
**Benchmark ด้วย `--release` เสมอ**
อย่าลืม flag `--release` เวลาวัด Performance!
Debug build (default) ช้ากว่า Release build **10-100 เท่า** เพราะไม่มีการ Optimize และมี Debug checks เต็มไปหมด
:::

---

## 3. Compiler Optimizations

### 3.1 Release Profile

```toml
# Cargo.toml
[profile.release]
opt-level = 3 # Optimization level (0-3, s, z)
lto = true # Link-time optimization
codegen-units = 1 # Single codegen unit
panic = "abort" # Abort on panic (smaller binary)
strip = true # Strip symbols
```

### 3.2 Profile Options

| Option | Values | Effect |
|--------|--------|--------|
| `opt-level` | 0-3, s, z | Optimization level |
| `lto` | false, true, thin | Link-time optimization |
| `codegen-units` | 1-256 | Parallel compilation |
| `panic` | unwind, abort | Panic behavior |
| `debug` | 0, 1, 2, true | Debug info |

---

## 4. Performance Tips

### 4.1 Avoid Allocations

<RustPlayground>

```rust
fn main() {
 // Slow: allocates new String
 let strings: Vec<String> = (0..1000)
 .map(|i| format!("item_{}", i))
 .collect();
 
 // Faster: pre-allocate capacity
 let mut strings = Vec::with_capacity(1000);
 for i in 0..1000 {
 strings.push(format!("item_{}", i));
 }
 
 println!("Created {} strings", strings.len());
}
```

</RustPlayground>

::: recommendation
**ใช้ `Vec::with_capacity` เสมอถ้าทำได้**
ถ้าเรารู้จำนวนคร่าวๆ ว่าจะมีกี่ Items การจองที่ไว้ก่อน (Pre-allocation) ช่วยลดการ Re-allocate memory ได้มหาศาล และทำให้ Code เร็วขึ้นอย่างเห็นได้ชัด
:::

### 4.2 Use Iterators

<RustPlayground>

```rust
fn main() {
 let numbers: Vec<i32> = (0..1000).collect();
 
 // Slow: creates intermediate Vec
 // let doubled: Vec<_> = numbers.iter().map(|x| x * 2).collect();
 // let sum: i32 = doubled.iter().sum();
 
 // Fast: lazy evaluation, no intermediate Vec
 let sum: i32 = numbers.iter().map(|x| x * 2).sum();
 
 println!("Sum: {}", sum);
}
```

</RustPlayground>

### 4.3 String Operations

<RustPlayground>

```rust
fn main() {
 // Slow: many allocations
 let mut s = String::new();
 for i in 0..100 {
 s = s + &i.to_string() + ", ";
 }
 
 // Fast: single allocation
 let parts: Vec<String> = (0..100).map(|i| i.to_string()).collect();
 let s = parts.join(", ");
 
 // Even faster with capacity
 let mut s = String::with_capacity(400);
 for i in 0..100 {
 s.push_str(&i.to_string());
 s.push_str(", ");
 }
 
 println!("Length: {}", s.len());
}
```

</RustPlayground>

### 4.4 Avoid Cloning

<RustPlayground>

```rust
fn process(data: &str) {
 println!("Processing: {}", data);
}

fn main() {
 let data = String::from("hello");
 
 // Unnecessary clone
 // process(&data.clone());
 
 // Just borrow
 process(&data);
 
 // data is still valid here
 println!("Data: {}", data);
}
```

</RustPlayground>

---

## 5. SIMD

### 5.1 Portable SIMD (nightly)

```rust
#![feature(portable_simd)]
use std::simd::f32x4;

fn add_arrays(a: &[f32; 4], b: &[f32; 4]) -> [f32; 4] {
 let va = f32x4::from_array(*a);
 let vb = f32x4::from_array(*b);
 (va + vb).to_array()
}
```

### 5.2 packed_simd (stable)

```toml
[dependencies]
packed_simd = "0.3"
```

```rust
use packed_simd::f32x4;

fn dot_product(a: &[f32], b: &[f32]) -> f32 {
 a.chunks_exact(4)
 .zip(b.chunks_exact(4))
 .map(|(a, b)| {
 let va = f32x4::from_slice_unaligned(a);
 let vb = f32x4::from_slice_unaligned(b);
 (va * vb).sum()
 })
 .sum()
}
```

---

## 6. Parallelism

### 6.1 rayon

```toml
[dependencies]
rayon = "1.8"
```

```rust
use rayon::prelude::*;

fn main() {
 let numbers: Vec<i32> = (0..1_000_000).collect();
 
 // Sequential
 let sum1: i32 = numbers.iter().map(|x| x * 2).sum();
 
 // Parallel - just change iter() to par_iter()!
 let sum2: i32 = numbers.par_iter().map(|x| x * 2).sum();
 
 assert_eq!(sum1, sum2);
}
```

### 6.2 Parallel Sort

```rust
use rayon::prelude::*;

fn main() {
 let mut data: Vec<i32> = (0..1_000_000).rev().collect();
 
 // Parallel sort
 data.par_sort();
 
 println!("Sorted {} items", data.len());
}
```

---

## 7. Memory Layout

### 7.1 Cache-Friendly Data

```rust
// Cold data mixed with hot data
struct BadLayout {
 hot_field1: u32,
 cold_data: [u8; 1024],
 hot_field2: u32,
}

// Separate hot and cold data
struct GoodLayout {
 hot_field1: u32,
 hot_field2: u32,
}

struct ColdData {
 data: [u8; 1024],
}
```

### 7.2 Array of Structs vs Struct of Arrays

```rust
// Array of Structs (AoS)
struct Point { x: f32, y: f32, z: f32 }
let points: Vec<Point> = vec![];

// Struct of Arrays (SoA) - better for SIMD
struct Points {
 x: Vec<f32>,
 y: Vec<f32>,
 z: Vec<f32>,
}
```

---

## 8. Tools

| Tool | Purpose |
|------|---------|
| `criterion` | Micro-benchmarks |
| `perf` | Linux profiler |
| `flamegraph` | Visual profiler |
| `valgrind` | Memory profiler |
| `heaptrack` | Heap profiler |
| `cargo-bloat` | Binary size |
| `cargo-llvm-lines` | Monomorphization |

---

## 9. Checklist

| Item | Check |
|------|-------|
| Use `--release` | |
| Enable LTO | |
| Pre-allocate vectors | |
| Avoid unnecessary clones | |
| Use iterators | |
| Parallelize with rayon | |
| Profile before optimizing | |
| Benchmark changes | |

---

## 10. สรุป

| Topic | Tool/Technique |
|-------|---------------|
| Benchmark | criterion |
| Profile | flamegraph, perf |
| Parallelize | rayon |
| SIMD | portable_simd |
| Memory | Layout optimization |
| Compile | LTO, codegen-units |

---

[กลับไปหน้า Advanced](/advanced/)
