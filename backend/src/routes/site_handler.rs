use rocket::fs::NamedFile;
use std::path::{Path, PathBuf};
use rocket::get;

// Add a new route
#[get("/<_..>", rank = 20)]
pub async fn site_handler() -> Option<NamedFile> {
    // Serve index.html for any unknown path under /site
    if cfg!(debug_assertions) {
        NamedFile::open(Path::new("www/dist/index.html")).await.ok()
    }else{
        NamedFile::open(Path::new("static/index.html")).await.ok()
    }
}