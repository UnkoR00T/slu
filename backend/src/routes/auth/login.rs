use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};
use std::env;
use dotenvy::dotenv;
use rocket::http::Status;
use rocket::response::status;
use crate::functions::jwt_secret::get_jwt_secret;
use crate::types::claims::Claims;

#[derive(Debug, Deserialize)]
struct TokenInput {
    token: String,
}

#[rocket::post("/login", data = "<input>")]
pub async fn login(input: Json<TokenInput>) -> Result<String, Status> {

    let secret: String = get_jwt_secret();
    let expiration = Utc::now() + Duration::seconds(15);
    let claims = Claims {
        sub: input.token.clone(),
        exp: expiration.timestamp() as usize,
    };

    Ok(encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_bytes())).unwrap())
}
