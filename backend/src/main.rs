use std::env;
use dotenvy::dotenv;
use rocket::fs::{relative, FileServer};
use rocket::routes;
use crate::cors::CORS;
use crate::routes::auth::{login, verify};
use crate::routes::site_handler;

mod routes;
mod guards;
mod types;
mod functions;
mod cors;

#[rocket::launch]
fn rocket() -> _ {
    dotenv().ok();
    let file: FileServer;
    if cfg!(debug_assertions) {
        file = FileServer::from(relative!("www/dist")).rank(10);
    }else{
        file = FileServer::from(relative!("static")).rank(10);
    }
    rocket::build()
    .attach(CORS)
    .mount("/", file)
    .mount("/", routes![
        cors::preflight_cors,
        site_handler::site_handler
    ])
    .mount("/api/v0", rocket::routes![
        login::login,
        verify::verify,
    ])
}
