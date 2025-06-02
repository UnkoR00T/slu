use std::sync::Arc;
use rocket::fairing::{Fairing, Info, Kind};
use rocket::{Data, Request};
use rocket_prometheus::prometheus::CounterVec;

pub struct RequestCounter {
    pub(crate) counter: Arc<CounterVec>,
}

#[rocket::async_trait]
impl Fairing for RequestCounter {
    fn info(&self) -> Info {
        Info {
            name: "Global Request Counter",
            kind: Kind::Request,
        }
    }

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut Data<'_>) {
        let method = request.method().as_str();
        let route_path = request.uri().path().to_string(); // static path, not matched Rocket route name

        // Increment label-based counter
        self.counter.with_label_values(&[method, &route_path]).inc();
    }
}