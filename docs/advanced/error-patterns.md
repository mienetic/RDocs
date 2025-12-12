# Advanced Error Handling

จัดการ Error แบบ Production-Ready! 🛡️

:::tip Error Handling ที่ดีคือหัวใจของ Production Code!
เรียนรู้วิธีจัดการ error อย่างมืออาชีพ ไม่ใช่แค่ `.unwrap()` ไปทุกที่!
:::

---

## 1. Error Traits

### 1.1 std::error::Error Trait

<RustPlayground>

```rust
use std::error::Error;
use std::fmt;

#[derive(Debug)]
struct MyError {
    message: String,
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "MyError: {}", self.message)
    }
}

impl Error for MyError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None  // ไม่มี underlying error
    }
}

fn might_fail() -> Result<(), MyError> {
    Err(MyError {
        message: String::from("Something went wrong!"),
    })
}

fn main() {
    match might_fail() {
        Ok(()) => println!("Success!"),
        Err(e) => {
            println!("Error: {}", e);
            println!("Debug: {:?}", e);
        }
    }
}
```

</RustPlayground>

### 1.2 Error with Source (Error Chaining)

<RustPlayground>

```rust
use std::error::Error;
use std::fmt;
use std::num::ParseIntError;

#[derive(Debug)]
struct ConfigError {
    message: String,
    source: Option<Box<dyn Error>>,
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "ConfigError: {}", self.message)
    }
}

impl Error for ConfigError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        self.source.as_ref().map(|e| e.as_ref() as &(dyn Error + 'static))
    }
}

fn parse_port(s: &str) -> Result<u16, ConfigError> {
    s.parse::<u16>().map_err(|e| ConfigError {
        message: format!("Invalid port: {}", s),
        source: Some(Box::new(e)),
    })
}

fn main() {
    match parse_port("abc") {
        Ok(port) => println!("Port: {}", port),
        Err(e) => {
            println!("Error: {}", e);
            
            // ดู error chain
            let mut source = e.source();
            while let Some(e) = source {
                println!("  Caused by: {}", e);
                source = e.source();
            }
        }
    }
}
```

</RustPlayground>

---

## 2. thiserror Crate

### 2.1 Setup

```toml
[dependencies]
thiserror = "1"
```

### 2.2 Simple Usage

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum AppError {
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    
    #[error("Not found: {id}")]
    NotFound { id: u32 },
    
    #[error("Database error")]
    Database(#[from] DatabaseError),
    
    #[error("IO error")]
    Io(#[from] std::io::Error),
}

// #[from] ทำให้ ? ทำงานอัตโนมัติ!
fn read_file() -> Result<String, AppError> {
    let content = std::fs::read_to_string("config.txt")?;  // auto convert
    Ok(content)
}
```

### 2.3 With Source

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum ConfigError {
    #[error("Failed to read config file")]
    ReadError {
        path: String,
        #[source]
        source: std::io::Error,
    },
    
    #[error("Failed to parse config")]
    ParseError {
        #[source]
        source: serde_json::Error,
    },
}
```

---

## 3. anyhow Crate

### 3.1 Setup

```toml
[dependencies]
anyhow = "1"
```

### 3.2 Basic Usage

```rust
use anyhow::{anyhow, Context, Result};

fn read_config() -> Result<Config> {
    let content = std::fs::read_to_string("config.json")
        .context("Failed to read config file")?;
    
    let config: Config = serde_json::from_str(&content)
        .context("Failed to parse config")?;
    
    Ok(config)
}

fn main() -> Result<()> {
    let config = read_config()?;
    
    // Or with custom error
    if config.port == 0 {
        return Err(anyhow!("Port cannot be zero"));
    }
    
    println!("Starting on port {}", config.port);
    Ok(())
}
```

### 3.3 anyhow vs thiserror

| Feature | thiserror | anyhow |
|---------|-----------|--------|
| Use case | Library code | Application code |
| Error type | Custom enum | `anyhow::Error` |
| Error matching | ✅ Yes | Limited |
| Context | Manual | `.context()` |
| Backtrace | Manual | Automatic |

---

## 4. Error Propagation Patterns

### 4.1 The ? Operator

<RustPlayground>

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username() -> Result<String, io::Error> {
    let mut f = File::open("username.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
}

// เทียบเท่ากับ:
fn read_username_verbose() -> Result<String, io::Error> {
    let mut f = match File::open("username.txt") {
        Ok(file) => file,
        Err(e) => return Err(e),
    };
    let mut s = String::new();
    match f.read_to_string(&mut s) {
        Ok(_) => Ok(s),
        Err(e) => Err(e),
    }
}

fn main() {
    match read_username() {
        Ok(name) => println!("Username: {}", name),
        Err(e) => println!("Error: {}", e),
    }
}
```

</RustPlayground>

### 4.2 Converting Errors

<RustPlayground>

```rust
use std::num::ParseIntError;

#[derive(Debug)]
struct MyError(String);

impl From<ParseIntError> for MyError {
    fn from(e: ParseIntError) -> Self {
        MyError(format!("Parse error: {}", e))
    }
}

fn parse_and_double(s: &str) -> Result<i32, MyError> {
    let n: i32 = s.parse()?;  // Auto-convert via From
    Ok(n * 2)
}

fn main() {
    match parse_and_double("21") {
        Ok(n) => println!("Result: {}", n),
        Err(e) => println!("Error: {:?}", e),
    }
    
    match parse_and_double("abc") {
        Ok(n) => println!("Result: {}", n),
        Err(e) => println!("Error: {:?}", e),
    }
}
```

</RustPlayground>

---

## 5. Error Recovery Patterns

### 5.1 Default Values

<RustPlayground>

```rust
fn main() {
    let value = "abc".parse::<i32>().unwrap_or(0);
    println!("Value: {}", value);  // 0
    
    let value = "42".parse::<i32>().unwrap_or_default();
    println!("Value: {}", value);  // 42
    
    let value = "abc"
        .parse::<i32>()
        .unwrap_or_else(|e| {
            println!("Parse failed: {}", e);
            -1
        });
    println!("Value: {}", value);  // -1
}
```

</RustPlayground>

### 5.2 Retry Logic

<RustPlayground>

```rust
use std::thread::sleep;
use std::time::Duration;

fn flaky_operation() -> Result<i32, &'static str> {
    static mut COUNTER: i32 = 0;
    unsafe {
        COUNTER += 1;
        if COUNTER < 3 {
            Err("Not ready yet")
        } else {
            Ok(42)
        }
    }
}

fn with_retry<T, E, F>(mut f: F, max_attempts: u32) -> Result<T, E>
where
    F: FnMut() -> Result<T, E>,
    E: std::fmt::Display,
{
    for attempt in 1..=max_attempts {
        match f() {
            Ok(value) => return Ok(value),
            Err(e) if attempt < max_attempts => {
                println!("Attempt {} failed: {}", attempt, e);
                // sleep(Duration::from_millis(100 * attempt as u64));
            }
            Err(e) => return Err(e),
        }
    }
    unreachable!()
}

fn main() {
    match with_retry(flaky_operation, 5) {
        Ok(v) => println!("Success: {}", v),
        Err(e) => println!("Failed after retries: {}", e),
    }
}
```

</RustPlayground>

### 5.3 Fallback

<RustPlayground>

```rust
fn primary() -> Result<i32, &'static str> {
    Err("Primary failed")
}

fn fallback() -> Result<i32, &'static str> {
    Ok(42)
}

fn main() {
    let result = primary().or_else(|_| fallback());
    println!("Result: {:?}", result);
}
```

</RustPlayground>

---

## 6. Collecting Results

<RustPlayground>

```rust
fn main() {
    let strings = vec!["1", "2", "three", "4"];
    
    // Collect all successes, fail on first error
    let result: Result<Vec<i32>, _> = strings
        .iter()
        .map(|s| s.parse::<i32>())
        .collect();
    
    println!("All or nothing: {:?}", result);
    
    // Collect only successes
    let successes: Vec<i32> = strings
        .iter()
        .filter_map(|s| s.parse::<i32>().ok())
        .collect();
    
    println!("Only successes: {:?}", successes);
    
    // Partition successes and errors
    let (oks, errs): (Vec<_>, Vec<_>) = strings
        .iter()
        .map(|s| s.parse::<i32>())
        .partition(Result::is_ok);
    
    let oks: Vec<i32> = oks.into_iter().map(Result::unwrap).collect();
    let errs: Vec<_> = errs.into_iter().map(Result::unwrap_err).collect();
    
    println!("Oks: {:?}", oks);
    println!("Errs: {:?}", errs);
}
```

</RustPlayground>

---

## 7. Exit Codes

<RustPlayground>

```rust
use std::process::ExitCode;

fn run() -> Result<(), String> {
    // Simulate error
    Err("Something went wrong".to_string())
}

fn main() -> ExitCode {
    match run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("Error: {}", e);
            ExitCode::FAILURE
        }
    }
}
```

</RustPlayground>

---

## 8. Best Practices

### 8.1 When to Use What

| Situation | Use |
|-----------|-----|
| Library code | `Result<T, CustomError>` with thiserror |
| Application code | `anyhow::Result<T>` |
| Unrecoverable | `panic!` |
| Tests | `.unwrap()` / `.expect()` OK |
| Prototype | `.unwrap()` OK (temporarily) |

### 8.2 Error Messages

<RustPlayground>

```rust
fn main() {
    // ❌ Bad
    // let f = File::open("config").unwrap();
    
    // ✅ Good - descriptive message
    // let f = File::open("config")
    //     .expect("Failed to open config file");
    
    // ✅ Better - include context
    // let f = File::open("config")
    //     .context("Failed to open config file")?;
}
```

</RustPlayground>

---

## 9. สรุป

| Pattern | Description |
|---------|-------------|
| `?` operator | Propagate errors |
| `#[from]` | Auto-convert errors |
| `.context()` | Add error context |
| `.unwrap_or()` | Provide default |
| `.or_else()` | Fallback logic |
| `thiserror` | Library error types |
| `anyhow` | Application errors |
| Error chain | Multi-layer errors |

---

[กลับไปหน้า Advanced](/advanced/)
