use std::env;
use mongodb::{Client, Database};

pub async fn db_init() -> Database {
    let mongo_uri = env::var("MONGO_URI").unwrap_or_else(|_| {
        "mongodb://localhost:27017".to_string()
    });

    let client = Client::with_uri_str(&mongo_uri)
        .await
        .expect("Failed to connect to MongoDB, dumbass");

    client.database("slu")
}