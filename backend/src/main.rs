use std::env;
use dotenvy::dotenv;
use rocket::fs::{relative, FileServer};
use rocket::routes;
use tracing::info;
use crate::cors::CORS;
use crate::db_init::{db_init};
use crate::routes::auth::{login, verify};

mod routes;
mod guards;
mod types;
mod functions;
mod cors;
mod db_init;

#[rocket::launch]
async fn rocket() -> _ {

    if (!cfg!(debug_assertions)) {
        tracing_subscriber::fmt()
            .with_env_filter("info")
            .with_writer(std::fs::File::create("/var/log/slu/slu-backend.log").unwrap())
            .init();
    }
    info!("Tracing setup complete!");

    info!("Seting up .env");
    dotenv().ok();
    info!("Seting up database");
    let db = db_init().await;
    info!("Seting up api routes");
    rocket::build()
        .manage(db)
        .attach(CORS)
        .mount("/api", rocket::routes![
            cors::preflight_cors,
            login::login,
            verify::verify,
        ])
}
