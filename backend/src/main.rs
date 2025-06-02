use std::env;
use std::sync::Arc;
use dotenvy::dotenv;
use rocket::fs::{relative, FileServer};
use rocket::routes;
use rocket::tokio::sync::Mutex;
use rocket_prometheus::prometheus::{CounterVec, Opts};
use rocket_prometheus::PrometheusMetrics;
use tracing::info;
use crate::cors::CORS;
use crate::db_init::{db_init};
use crate::routes::auth::{login, verify};
use crate::types::metrics::RequestCounter;

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

    let prometheus = PrometheusMetrics::new();
    let registry = prometheus.registry();

    let request_counter = CounterVec::new(
        Opts::new("http_requests_total", "Total HTTP requests"),
        &["method", "path"]
    ).unwrap();

    registry.register(Box::new(request_counter.clone())).unwrap();

    info!("Seting up .env");
    dotenv().ok();
    info!("Seting up database");
    let db = db_init().await;
    info!("Seting up api routes");
    rocket::build()
        .manage(db)
        .attach(prometheus.clone())
        .attach(RequestCounter {
            counter: Arc::new(request_counter),
        })
        .attach(CORS)
        .mount("/api", rocket::routes![
            cors::preflight_cors,
            login::login,
            verify::verify,
        ])
        .mount("/api/metrics", prometheus)
}
