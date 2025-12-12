# Serde & JSON

Serde คือ library สำหรับ serialization/deserialization ที่ดีที่สุดใน Rust! 🚀

:::tip Serde = SERialize + DEserialize
เป็น library ที่ใช้มากที่สุดใน Rust ecosystem ดาวน์โหลดกว่า 200 ล้านครั้ง!
:::

---

## 1. เริ่มต้นใช้งาน

### 1.1 เพิ่ม Dependencies

```toml
# Cargo.toml
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

```bash
# หรือใช้ cargo add
cargo add serde --features derive
cargo add serde_json
```

---

## 2. Basic Usage

### 2.1 Serialize (Rust → JSON)

<RustPlayground>

```rust
use serde::Serialize;

#[derive(Serialize, Debug)]
struct Person {
    name: String,
    age: u32,
    email: String,
}

fn main() {
    let person = Person {
        name: String::from("สมชาย"),
        age: 25,
        email: String::from("somchai@example.com"),
    };
    
    // Serialize to JSON string
    let json = serde_json::to_string(&person).unwrap();
    println!("JSON: {}", json);
    
    // Pretty print
    let pretty = serde_json::to_string_pretty(&person).unwrap();
    println!("\nPretty:\n{}", pretty);
}
```

</RustPlayground>

### 2.2 Deserialize (JSON → Rust)

<RustPlayground>

```rust
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct Person {
    name: String,
    age: u32,
    email: String,
}

fn main() {
    let json = r#"
        {
            "name": "สมหญิง",
            "age": 30,
            "email": "somying@example.com"
        }
    "#;
    
    // Deserialize from JSON
    let person: Person = serde_json::from_str(json).unwrap();
    println!("{:#?}", person);
}
```

</RustPlayground>

---

## 3. Serde Attributes

### 3.1 Rename Fields

<RustPlayground>

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct User {
    #[serde(rename = "userName")]
    name: String,
    
    #[serde(rename = "userAge")]
    age: u32,
}

fn main() {
    let user = User {
        name: String::from("Alice"),
        age: 25,
    };
    
    let json = serde_json::to_string_pretty(&user).unwrap();
    println!("{}", json);
    // {"userName":"Alice","userAge":25}
}
```

</RustPlayground>

### 3.2 Rename All

<RustPlayground>

```rust
use serde::{Serialize, Deserialize};

// Convert all fields to snake_case, camelCase, etc.
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Config {
    database_url: String,      // → "databaseUrl"
    max_connections: u32,      // → "maxConnections"
    enable_logging: bool,      // → "enableLogging"
}

fn main() {
    let config = Config {
        database_url: String::from("postgres://localhost"),
        max_connections: 10,
        enable_logging: true,
    };
    
    println!("{}", serde_json::to_string_pretty(&config).unwrap());
}
```

</RustPlayground>

### 3.3 Skip Fields

<RustPlayground>

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct User {
    username: String,
    
    #[serde(skip_serializing)]
    password: String,  // ไม่รวมใน JSON output
    
    #[serde(skip_deserializing, default)]
    internal_id: u64,  // ไม่อ่านจาก JSON
}

fn main() {
    let user = User {
        username: String::from("admin"),
        password: String::from("secret123"),
        internal_id: 12345,
    };
    
    let json = serde_json::to_string_pretty(&user).unwrap();
    println!("Serialized (no password):\n{}", json);
}
```

</RustPlayground>

### 3.4 Default Values

<RustPlayground>

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct Settings {
    name: String,
    
    #[serde(default)]  // ใช้ Default::default() ถ้าไม่มี
    enabled: bool,
    
    #[serde(default = "default_port")]
    port: u16,
}

fn default_port() -> u16 {
    8080
}

fn main() {
    let json = r#"{"name": "MyApp"}"#;
    
    let settings: Settings = serde_json::from_str(json).unwrap();
    println!("{:#?}", settings);
    // enabled = false (default)
    // port = 8080 (custom default)
}
```

</RustPlayground>

---

## 4. Complex Types

### 4.1 Enums

<RustPlayground>

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
enum Status {
    Active,
    Inactive,
    Pending { reason: String },
}

#[derive(Serialize, Deserialize, Debug)]
struct Task {
    name: String,
    status: Status,
}

fn main() {
    let tasks = vec![
        Task { 
            name: String::from("Task 1"), 
            status: Status::Active 
        },
        Task { 
            name: String::from("Task 2"), 
            status: Status::Pending { 
                reason: String::from("Waiting for approval") 
            } 
        },
    ];
    
    println!("{}", serde_json::to_string_pretty(&tasks).unwrap());
}
```

</RustPlayground>

### 4.2 Option และ Null

<RustPlayground>

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct User {
    name: String,
    
    #[serde(skip_serializing_if = "Option::is_none")]
    nickname: Option<String>,  // ไม่แสดงถ้าเป็น None
}

fn main() {
    let user1 = User {
        name: String::from("Alice"),
        nickname: Some(String::from("Ally")),
    };
    
    let user2 = User {
        name: String::from("Bob"),
        nickname: None,
    };
    
    println!("User 1: {}", serde_json::to_string(&user1).unwrap());
    println!("User 2: {}", serde_json::to_string(&user2).unwrap());
}
```

</RustPlayground>

### 4.3 Nested Structs

<RustPlayground>

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct Address {
    street: String,
    city: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Person {
    name: String,
    address: Address,
    tags: Vec<String>,
}

fn main() {
    let person = Person {
        name: String::from("สมชาย"),
        address: Address {
            street: String::from("123 ถนนสุขุมวิท"),
            city: String::from("กรุงเทพ"),
        },
        tags: vec![
            String::from("developer"),
            String::from("rust"),
        ],
    };
    
    println!("{}", serde_json::to_string_pretty(&person).unwrap());
}
```

</RustPlayground>

---

## 5. Working with JSON Values

<RustPlayground>

```rust
use serde_json::{Value, json};

fn main() {
    // สร้าง JSON แบบ dynamic
    let data = json!({
        "name": "Alice",
        "age": 30,
        "skills": ["Rust", "Python"],
        "address": {
            "city": "Bangkok"
        }
    });
    
    // Access values
    println!("Name: {}", data["name"]);
    println!("First skill: {}", data["skills"][0]);
    println!("City: {}", data["address"]["city"]);
    
    // Check if key exists
    if let Some(age) = data.get("age") {
        println!("Age: {}", age);
    }
    
    // Convert to string
    println!("\nFull JSON:\n{}", serde_json::to_string_pretty(&data).unwrap());
}
```

</RustPlayground>

---

## 6. Error Handling

<RustPlayground>

```rust
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct Config {
    host: String,
    port: u16,
}

fn main() {
    // Invalid JSON
    let bad_json = r#"{"host": "localhost"}"#;  // missing port
    
    match serde_json::from_str::<Config>(bad_json) {
        Ok(config) => println!("Config: {:?}", config),
        Err(e) => println!("Error: {}", e),
    }
    
    // Valid JSON
    let good_json = r#"{"host": "localhost", "port": 8080}"#;
    
    match serde_json::from_str::<Config>(good_json) {
        Ok(config) => println!("Config: {:?}", config),
        Err(e) => println!("Error: {}", e),
    }
}
```

</RustPlayground>

---

## 7. File I/O with Serde

```rust
use std::fs;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct Config {
    database_url: String,
    port: u16,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Config {
        database_url: String::from("postgres://localhost/mydb"),
        port: 8080,
    };
    
    // Write to file
    let json = serde_json::to_string_pretty(&config)?;
    fs::write("config.json", &json)?;
    
    // Read from file
    let content = fs::read_to_string("config.json")?;
    let loaded: Config = serde_json::from_str(&content)?;
    
    println!("Loaded: {}:{}", loaded.database_url, loaded.port);
    
    Ok(())
}
```

---

## 8. Other Formats

Serde รองรับหลาย format!

| Crate | Format |
|-------|--------|
| `serde_json` | JSON |
| `serde_yaml` | YAML |
| `toml` | TOML |
| `serde_cbor` | CBOR (binary) |
| `bincode` | Binary |
| `csv` | CSV |

```toml
# Cargo.toml
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_yaml = "0.9"
toml = "0.8"
```

---

## 9. สรุป

| Attribute | Description |
|-----------|-------------|
| `#[derive(Serialize)]` | Enable serialization |
| `#[derive(Deserialize)]` | Enable deserialization |
| `#[serde(rename)]` | Rename field |
| `#[serde(rename_all)]` | Rename all fields |
| `#[serde(skip)]` | Skip field |
| `#[serde(default)]` | Use default value |
| `#[serde(flatten)]` | Flatten nested struct |

---

[บทถัดไป: Debugging](/beginner/debugging)
