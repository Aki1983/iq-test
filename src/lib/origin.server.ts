import { getRequest } from "@tanstack/react-start/server";

export function getRequestOrigin(): string {
  const req = getRequest();
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "localhost:8080";
  const proto =
    req.headers.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]")
      ? "http"
      : "https");
  return `${proto}://${host}`;
}
