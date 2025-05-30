FROM rust:bullseye as builder

WORKDIR /usr/src/app
COPY . .
RUN cargo build --release

FROM debian:bullseye
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/app
EXPOSE 8000

ENV ROCKET_PORT=8000
ENV ROCKET_ADDRESS=0.0.0.0

ENV JWT_SECRET=JQWtt4NvvE20nvKfHAWcTmkQ5q9KlkK1IrQjSTLDYUOjpohmN4
ENV VITE_MAIN_SSO=https://sso.joltamp.pl/api/v0/
ENV VITE_MAIN_BACKEND=/
ENV MONGO_URI=mongodb://localhost:27017

CMD ["app"]
