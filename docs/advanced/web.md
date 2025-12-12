# Web Development

สร้าง Web Application ด้วย Rust! 🌐

:::tip Rust สำหรับ Web = เร็วมาก!
Rust web frameworks เร็วกว่า Node.js, Python หลายเท่า และใช้ memory น้อยกว่ามาก!
:::

---

## 1. Web Frameworks

| Framework | Style | ความนิยม |
|-----------|-------|---------|
| **Axum** | Modern, Tower-based | ⭐⭐⭐ |
| **Actix-web** | Actor-based, fast | ⭐⭐⭐ |
| **Rocket** | Declarative, easy | ⭐⭐ |
| **Warp** | Filter-based | ⭐⭐ |

---

## 2. Axum - Hello World

### 2.1 Setup

```toml
# Cargo.toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### 2.2 Basic Server

```rust
use axum::{
    routing::get,
    Router,
};

#[tokio::main]
async fn main() {
    // สร้าง router
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }));

    // รัน server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
```

---

## 3. Routes และ Handlers

### 3.1 Multiple Routes

```rust
use axum::{
    routing::{get, post},
    Router,
};

async fn hello() -> &'static str {
    "Hello, World!"
}

async fn about() -> &'static str {
    "About page"
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(hello))
        .route("/about", get(about))
        .route("/health", get(|| async { "OK" }));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

### 3.2 Path Parameters

```rust
use axum::{
    extract::Path,
    routing::get,
    Router,
};

async fn get_user(Path(id): Path<u32>) -> String {
    format!("User ID: {}", id)
}

async fn get_post(Path((user_id, post_id)): Path<(u32, u32)>) -> String {
    format!("User: {}, Post: {}", user_id, post_id)
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/users/:id", get(get_user))
        .route("/users/:user_id/posts/:post_id", get(get_post));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

### 3.3 Query Parameters

```rust
use axum::{
    extract::Query,
    routing::get,
    Router,
};
use serde::Deserialize;

#[derive(Deserialize)]
struct Pagination {
    page: Option<u32>,
    limit: Option<u32>,
}

async fn list_items(Query(params): Query<Pagination>) -> String {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(10);
    format!("Page: {}, Limit: {}", page, limit)
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/items", get(list_items));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
// GET /items?page=2&limit=20
```

---

## 4. JSON API

### 4.1 JSON Response

```rust
use axum::{
    routing::get,
    Json, Router,
};
use serde::Serialize;

#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
    email: String,
}

async fn get_user() -> Json<User> {
    Json(User {
        id: 1,
        name: String::from("Alice"),
        email: String::from("alice@example.com"),
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/user", get(get_user));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

### 4.2 JSON Request

```rust
use axum::{
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct CreateUser {
    name: String,
    email: String,
}

#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
    email: String,
}

async fn create_user(Json(payload): Json<CreateUser>) -> Json<User> {
    let user = User {
        id: 1,
        name: payload.name,
        email: payload.email,
    };
    Json(user)
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/users", post(create_user));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

---

## 5. State Management

```rust
use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};

#[derive(Default)]
struct AppState {
    users: Mutex<Vec<User>>,
}

#[derive(Clone, Serialize)]
struct User {
    id: u32,
    name: String,
}

#[derive(Deserialize)]
struct CreateUser {
    name: String,
}

async fn list_users(State(state): State<Arc<AppState>>) -> Json<Vec<User>> {
    let users = state.users.lock().unwrap();
    Json(users.clone())
}

async fn create_user(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateUser>,
) -> Json<User> {
    let mut users = state.users.lock().unwrap();
    let user = User {
        id: users.len() as u32 + 1,
        name: payload.name,
    };
    users.push(user.clone());
    Json(user)
}

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState::default());

    let app = Router::new()
        .route("/users", get(list_users).post(create_user))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

---

## 6. Middleware

```rust
use axum::{
    middleware::{self, Next},
    extract::Request,
    response::Response,
    routing::get,
    Router,
};
use std::time::Instant;

async fn logging_middleware(req: Request, next: Next) -> Response {
    let start = Instant::now();
    let method = req.method().clone();
    let uri = req.uri().clone();
    
    let response = next.run(req).await;
    
    let duration = start.elapsed();
    println!("{} {} - {:?}", method, uri, duration);
    
    response
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "Hello!" }))
        .layer(middleware::from_fn(logging_middleware));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

---

## 7. Error Handling

```rust
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use serde_json::json;

// Custom error type
enum AppError {
    NotFound,
    BadRequest(String),
    InternalError,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::NotFound => (StatusCode::NOT_FOUND, "Not found"),
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg.leak()),
            AppError::InternalError => (StatusCode::INTERNAL_SERVER_ERROR, "Internal error"),
        };

        let body = Json(json!({
            "error": message
        }));

        (status, body).into_response()
    }
}

async fn get_user(axum::extract::Path(id): axum::extract::Path<u32>) -> Result<String, AppError> {
    if id == 0 {
        return Err(AppError::BadRequest("ID cannot be 0".to_string()));
    }
    if id > 100 {
        return Err(AppError::NotFound);
    }
    Ok(format!("User {}", id))
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/users/:id", get(get_user));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

---

## 8. Database (SQLx)

### 8.1 Setup

```toml
[dependencies]
sqlx = { version = "0.7", features = ["runtime-tokio", "postgres"] }
```

### 8.2 Usage

```rust
use sqlx::postgres::PgPoolOptions;

#[derive(sqlx::FromRow)]
struct User {
    id: i32,
    name: String,
    email: String,
}

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://user:pass@localhost/db")
        .await?;

    // Query
    let users = sqlx::query_as::<_, User>("SELECT id, name, email FROM users")
        .fetch_all(&pool)
        .await?;

    for user in users {
        println!("{}: {}", user.id, user.name);
    }

    // Insert
    sqlx::query("INSERT INTO users (name, email) VALUES ($1, $2)")
        .bind("Alice")
        .bind("alice@example.com")
        .execute(&pool)
        .await?;

    Ok(())
}
```

---

## 9. Complete REST API

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post, put, delete},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Clone, Serialize)]
struct Todo {
    id: u32,
    title: String,
    completed: bool,
}

#[derive(Deserialize)]
struct CreateTodo {
    title: String,
}

#[derive(Deserialize)]
struct UpdateTodo {
    title: Option<String>,
    completed: Option<bool>,
}

type Db = Arc<Mutex<Vec<Todo>>>;

async fn list_todos(State(db): State<Db>) -> Json<Vec<Todo>> {
    let todos = db.lock().unwrap();
    Json(todos.clone())
}

async fn create_todo(State(db): State<Db>, Json(payload): Json<CreateTodo>) -> (StatusCode, Json<Todo>) {
    let mut todos = db.lock().unwrap();
    let todo = Todo {
        id: todos.len() as u32 + 1,
        title: payload.title,
        completed: false,
    };
    todos.push(todo.clone());
    (StatusCode::CREATED, Json(todo))
}

async fn get_todo(State(db): State<Db>, Path(id): Path<u32>) -> Result<Json<Todo>, StatusCode> {
    let todos = db.lock().unwrap();
    todos
        .iter()
        .find(|t| t.id == id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn update_todo(
    State(db): State<Db>,
    Path(id): Path<u32>,
    Json(payload): Json<UpdateTodo>,
) -> Result<Json<Todo>, StatusCode> {
    let mut todos = db.lock().unwrap();
    let todo = todos.iter_mut().find(|t| t.id == id).ok_or(StatusCode::NOT_FOUND)?;
    
    if let Some(title) = payload.title {
        todo.title = title;
    }
    if let Some(completed) = payload.completed {
        todo.completed = completed;
    }
    
    Ok(Json(todo.clone()))
}

async fn delete_todo(State(db): State<Db>, Path(id): Path<u32>) -> StatusCode {
    let mut todos = db.lock().unwrap();
    let len = todos.len();
    todos.retain(|t| t.id != id);
    
    if todos.len() < len {
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}

#[tokio::main]
async fn main() {
    let db: Db = Arc::new(Mutex::new(Vec::new()));

    let app = Router::new()
        .route("/todos", get(list_todos).post(create_todo))
        .route("/todos/:id", get(get_todo).put(update_todo).delete(delete_todo))
        .with_state(db);

    println!("Server running on http://localhost:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

---

## 10. สรุป

| Topic | Description |
|-------|-------------|
| Axum | Modern web framework |
| Router | Define routes |
| Extractors | Path, Query, Json, State |
| Middleware | Request/Response processing |
| Error handling | Custom error types |
| SQLx | Database access |

---

[กลับไปหน้า Advanced](/advanced/)
