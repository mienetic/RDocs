# WebAssembly (WASM)

Compile Rust to WebAssembly! 🕸️

:::tip Rust + WASM = Perfect Match!
Rust เป็นหนึ่งในภาษาที่ดีที่สุดสำหรับ WASM - เร็ว, เล็ก, และปลอดภัย!
:::

---

## 1. Setup

### 1.1 Install wasm-pack

```bash
# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Or with cargo
cargo install wasm-pack

# Add WASM target
rustup target add wasm32-unknown-unknown
```

### 1.2 Create Project

```bash
cargo new --lib my-wasm
cd my-wasm
```

### 1.3 Cargo.toml

```toml
[package]
name = "my-wasm"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"

[dev-dependencies]
wasm-bindgen-test = "0.3"
```

---

## 2. Hello WASM

### 2.1 Rust Code

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

// Export function to JavaScript
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// Export with different name
#[wasm_bindgen(js_name = addNumbers)]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

### 2.2 Build

```bash
wasm-pack build --target web
```

### 2.3 Use in HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Rust WASM</title>
</head>
<body>
    <script type="module">
        import init, { greet, addNumbers } from './pkg/my_wasm.js';
        
        async function main() {
            await init();
            
            console.log(greet("World"));
            console.log(addNumbers(2, 3));
        }
        
        main();
    </script>
</body>
</html>
```

---

## 3. JavaScript Interop

### 3.1 Call JavaScript from Rust

```rust
use wasm_bindgen::prelude::*;

// Import JavaScript function
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);
}

#[wasm_bindgen]
pub fn show_alert() {
    alert("Hello from Rust!");
}

#[wasm_bindgen]
pub fn console_log() {
    log("Logging from Rust");
    log_u32(42);
}
```

### 3.2 DOM Manipulation

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = document)]
    fn getElementById(id: &str) -> JsValue;
}

// Or use web-sys crate for full DOM API
```

---

## 4. web-sys: Full Web APIs

### 4.1 Setup

```toml
[dependencies]
wasm-bindgen = "0.2"
web-sys = { version = "0.3", features = [
    "Document",
    "Element",
    "HtmlElement",
    "Window",
    "console",
]}
```

### 4.2 DOM Access

```rust
use wasm_bindgen::prelude::*;
use web_sys::{Document, Element, Window};

fn window() -> Window {
    web_sys::window().expect("no global window")
}

fn document() -> Document {
    window().document().expect("no document")
}

#[wasm_bindgen]
pub fn update_element(id: &str, text: &str) {
    let document = document();
    if let Some(element) = document.get_element_by_id(id) {
        element.set_text_content(Some(text));
    }
}

#[wasm_bindgen]
pub fn create_element(tag: &str) -> Element {
    document()
        .create_element(tag)
        .expect("failed to create element")
}
```

---

## 5. Types

### 5.1 Supported Types

| Rust Type | JavaScript Type |
|-----------|-----------------|
| `i32`, `u32`, `f64` | `number` |
| `bool` | `boolean` |
| `String`, `&str` | `string` |
| `Vec<T>` | `Array` |
| `Option<T>` | `T \| undefined` |
| `Result<T, E>` | throws on Err |

### 5.2 Custom Structs

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Point {
    x: f64,
    y: f64,
}

#[wasm_bindgen]
impl Point {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64) -> Point {
        Point { x, y }
    }
    
    #[wasm_bindgen(getter)]
    pub fn x(&self) -> f64 {
        self.x
    }
    
    #[wasm_bindgen(getter)]
    pub fn y(&self) -> f64 {
        self.y
    }
    
    pub fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}
```

---

## 6. Async

```rust
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, Response};

#[wasm_bindgen]
pub async fn fetch_data(url: &str) -> Result<JsValue, JsValue> {
    let mut opts = RequestInit::new();
    opts.method("GET");
    
    let request = Request::new_with_str_and_init(url, &opts)?;
    
    let window = web_sys::window().unwrap();
    let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
    let resp: Response = resp_value.dyn_into()?;
    
    let json = JsFuture::from(resp.json()?).await?;
    Ok(json)
}
```

---

## 7. Performance Tips

### 7.1 Optimize Size

```toml
# Cargo.toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
```

### 7.2 Use wee_alloc

```toml
[dependencies]
wee_alloc = "0.4"
```

```rust
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
```

---

## 8. Testing

```rust
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn test_greet() {
    assert_eq!(greet("World"), "Hello, World!");
}
```

```bash
wasm-pack test --chrome --headless
```

---

## 9. Build Targets

| Target | Use Case |
|--------|----------|
| `--target web` | ES modules for browsers |
| `--target bundler` | For webpack, rollup |
| `--target nodejs` | Node.js |
| `--target no-modules` | No bundler, `<script>` tag |

---

## 10. สรุป

| Tool | Purpose |
|------|---------|
| `wasm-pack` | Build and package |
| `wasm-bindgen` | JS interop |
| `web-sys` | Web APIs |
| `js-sys` | JS built-ins |

| Command | Description |
|---------|-------------|
| `wasm-pack build` | Build for web |
| `wasm-pack test` | Run tests |
| `wasm-pack publish` | Publish to npm |

---

[บทถัดไป: FFI](/advanced/ffi)
