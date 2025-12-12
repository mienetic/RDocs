# Environment & Config

จัดการ Configuration และ Environment Variables! ⚙️

:::tip Configuration ที่ดี = Application ที่ flexible!
เรียนรู้วิธีจัดการ config files, env vars, และ command-line arguments
:::

---

## 1. Environment Variables

### 1.1 Basic std::env

<RustPlayground>

```rust
use std::env;

fn main() {
    // Get single variable
    match env::var("HOME") {
        Ok(val) => println!("HOME = {}", val),
        Err(_) => println!("HOME not set"),
    }
    
    // With default
    let user = env::var("USER").unwrap_or(String::from("unknown"));
    println!("USER = {}", user);
    
    // Check if exists
    if env::var("DEBUG").is_ok() {
        println!("Debug mode enabled");
    }
    
    // List all
    println!("\nAll variables:");
    for (key, value) in env::vars().take(5) {
        println!("  {} = {}", key, value);
    }
}
```

</RustPlayground>

### 1.2 Set/Remove Variables

```rust
use std::env;

fn main() {
    // Set variable (current process only)
    env::set_var("MY_VAR", "my_value");
    println!("MY_VAR = {}", env::var("MY_VAR").unwrap());
    
    // Remove variable
    env::remove_var("MY_VAR");
    println!("MY_VAR exists: {}", env::var("MY_VAR").is_ok());
}
```

---

## 2. dotenv

### 2.1 Setup

```toml
[dependencies]
dotenvy = "0.15"
```

### 2.2 .env File

```env
# .env
DATABASE_URL=postgres://localhost/mydb
API_KEY=secret123
PORT=8080
DEBUG=true
```

### 2.3 Usage

```rust
use std::env;

fn main() {
    // Load .env file
    dotenvy::dotenv().ok();
    
    // Now use env::var() as normal
    let db_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse()
        .expect("PORT must be a number");
    
    println!("Database: {}", db_url);
    println!("Port: {}", port);
}
```

---

## 3. config crate

### 3.1 Setup

```toml
[dependencies]
config = "0.14"
serde = { version = "1", features = ["derive"] }
```

### 3.2 Config Files

```yaml
# config/default.yaml
database:
  host: localhost
  port: 5432
  name: myapp

server:
  host: "0.0.0.0"
  port: 8080

logging:
  level: info
```

```yaml
# config/production.yaml
database:
  host: db.example.com

logging:
  level: warn
```

### 3.3 Load Config

```rust
use config::{Config, Environment, File};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Database {
    host: String,
    port: u16,
    name: String,
}

#[derive(Debug, Deserialize)]
struct Server {
    host: String,
    port: u16,
}

#[derive(Debug, Deserialize)]
struct Settings {
    database: Database,
    server: Server,
}

fn main() {
    let env = std::env::var("RUN_ENV").unwrap_or_else(|_| "development".into());
    
    let settings = Config::builder()
        // Start with default
        .add_source(File::with_name("config/default"))
        // Add environment-specific
        .add_source(File::with_name(&format!("config/{}", env)).required(false))
        // Override with environment variables
        .add_source(Environment::with_prefix("APP").separator("_"))
        .build()
        .unwrap();
    
    let settings: Settings = settings.try_deserialize().unwrap();
    
    println!("Database: {}:{}/{}", 
        settings.database.host, 
        settings.database.port,
        settings.database.name);
    println!("Server: {}:{}", 
        settings.server.host, 
        settings.server.port);
}
```

---

## 4. TOML Config

### 4.1 Setup

```toml
[dependencies]
toml = "0.8"
serde = { version = "1", features = ["derive"] }
```

### 4.2 Config File

```toml
# config.toml
[server]
host = "localhost"
port = 8080

[database]
url = "postgres://localhost/myapp"
max_connections = 10

[features]
enable_cache = true
enable_logging = true
```

### 4.3 Load TOML

```rust
use serde::Deserialize;
use std::fs;

#[derive(Debug, Deserialize)]
struct Config {
    server: Server,
    database: Database,
    features: Features,
}

#[derive(Debug, Deserialize)]
struct Server {
    host: String,
    port: u16,
}

#[derive(Debug, Deserialize)]
struct Database {
    url: String,
    max_connections: u32,
}

#[derive(Debug, Deserialize)]
struct Features {
    enable_cache: bool,
    enable_logging: bool,
}

fn main() {
    let content = fs::read_to_string("config.toml")
        .expect("Failed to read config file");
    
    let config: Config = toml::from_str(&content)
        .expect("Failed to parse config");
    
    println!("Server: {}:{}", config.server.host, config.server.port);
    println!("Database: {}", config.database.url);
    println!("Cache enabled: {}", config.features.enable_cache);
}
```

---

## 5. JSON Config

```rust
use serde::Deserialize;
use std::fs;

#[derive(Debug, Deserialize)]
struct Config {
    name: String,
    port: u16,
    features: Vec<String>,
}

fn main() {
    let content = fs::read_to_string("config.json")
        .expect("Failed to read config");
    
    let config: Config = serde_json::from_str(&content)
        .expect("Failed to parse config");
    
    println!("Name: {}", config.name);
    println!("Port: {}", config.port);
    println!("Features: {:?}", config.features);
}
```

---

## 6. Builder Pattern

```rust
#[derive(Debug)]
struct Config {
    host: String,
    port: u16,
    timeout: u64,
    max_retries: u32,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            host: String::from("localhost"),
            port: 8080,
            timeout: 30,
            max_retries: 3,
        }
    }
}

impl Config {
    fn builder() -> ConfigBuilder {
        ConfigBuilder::default()
    }
}

#[derive(Default)]
struct ConfigBuilder {
    host: Option<String>,
    port: Option<u16>,
    timeout: Option<u64>,
    max_retries: Option<u32>,
}

impl ConfigBuilder {
    fn host(mut self, host: impl Into<String>) -> Self {
        self.host = Some(host.into());
        self
    }
    
    fn port(mut self, port: u16) -> Self {
        self.port = Some(port);
        self
    }
    
    fn build(self) -> Config {
        let default = Config::default();
        Config {
            host: self.host.unwrap_or(default.host),
            port: self.port.unwrap_or(default.port),
            timeout: self.timeout.unwrap_or(default.timeout),
            max_retries: self.max_retries.unwrap_or(default.max_retries),
        }
    }
}

fn main() {
    let config = Config::builder()
        .host("api.example.com")
        .port(3000)
        .build();
    
    println!("{:?}", config);
}
```

---

## 7. Layered Configuration

```rust
use std::env;

#[derive(Debug)]
struct Config {
    database_url: String,
    port: u16,
    log_level: String,
}

impl Config {
    fn load() -> Self {
        // Priority: Env > CLI > File > Default
        
        let port = env::var("PORT")
            .ok()
            .and_then(|s| s.parse().ok())
            .unwrap_or(8080);
        
        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| String::from("sqlite://data.db"));
        
        let log_level = env::var("LOG_LEVEL")
            .unwrap_or_else(|_| String::from("info"));
        
        Config {
            database_url,
            port,
            log_level,
        }
    }
}

fn main() {
    let config = Config::load();
    println!("{:?}", config);
}
```

---

## 8. Validation

```rust
use std::env;

#[derive(Debug)]
struct Config {
    port: u16,
    database_url: String,
}

#[derive(Debug)]
enum ConfigError {
    MissingEnv(String),
    InvalidPort(String),
}

impl Config {
    fn load() -> Result<Self, ConfigError> {
        let port_str = env::var("PORT")
            .unwrap_or_else(|_| "8080".to_string());
        
        let port: u16 = port_str.parse()
            .map_err(|_| ConfigError::InvalidPort(port_str))?;
        
        if port < 1024 {
            return Err(ConfigError::InvalidPort(
                "Port must be >= 1024".to_string()
            ));
        }
        
        let database_url = env::var("DATABASE_URL")
            .map_err(|_| ConfigError::MissingEnv("DATABASE_URL".to_string()))?;
        
        Ok(Config { port, database_url })
    }
}

fn main() {
    match Config::load() {
        Ok(config) => println!("Config: {:?}", config),
        Err(e) => eprintln!("Config error: {:?}", e),
    }
}
```

---

## 9. สรุป

| Method | Use Case |
|--------|----------|
| `std::env` | Simple env vars |
| `dotenvy` | .env files |
| `config` | Multiple sources |
| `toml` | TOML config files |
| `serde_json` | JSON config files |

| Pattern | Description |
|---------|-------------|
| Layered | Env > CLI > File > Default |
| Builder | Fluent configuration |
| Validation | Check values at load time |

---

[กลับไปหน้า Intermediate](/intermediate/)
