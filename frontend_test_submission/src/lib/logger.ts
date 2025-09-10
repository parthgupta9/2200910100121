const LOG_API_URL = process.env.NEXT_PUBLIC_LOG_API_URL as string;
const LOG_API_TOKEN = process.env.NEXT_PUBLIC_LOG_API_TOKEN as string;

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export default async function Log(
  stack: "frontend" | "backend",
  level: LogLevel,
  packageName: string,
  message: string
): Promise<void> {
  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOG_API_TOKEN}`,
      },
      body: JSON.stringify({ stack, level, package: packageName, message }),
    });
  } catch (err) {
    console.warn("Log failed", (err as Error).message);
  }
}
