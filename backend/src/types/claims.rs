use rocket::serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub(crate) sub: Uuid,
    pub(crate) exp: usize,
}