use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};
use std::env;
use dotenvy::dotenv;
use mongodb::{bson, Collection, Database};
use mongodb::bson::Document;
use rocket::http::Status;
use rocket::response::status;
use rocket::State;
use tracing::{error, info};
use uuid::Uuid;
use crate::functions::jwt_secret::get_jwt_secret;
use crate::types::claims::Claims;
use crate::types::db::user_db_type::User;

#[derive(Debug, Deserialize)]
struct TokenInput {
    token: Uuid,
}

#[rocket::post("/login", data = "<input>")]
pub async fn login(input: Json<TokenInput>, db: &State<Database>) -> Result<String, Status> {
    info!("Login request");
    let secret: String = get_jwt_secret();
    let expiration = Utc::now() + Duration::seconds(15);
    let claims = Claims {
        sub: input.token.clone(),
        exp: expiration.timestamp() as usize,
    };
    let collection: Collection<User> = db.collection::<User>("users");
    let user: User = User {
        id: None,
        user_id: input.token
    };
    let req = collection.insert_one(user, None).await;
    match req {
        Ok(_) => {
            Ok(encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_bytes())).unwrap())
        }
        Err(e) => {
            error!("DBQueryError - Failed to insert data.");
            Err(Status::InternalServerError)
        }
    }
}
