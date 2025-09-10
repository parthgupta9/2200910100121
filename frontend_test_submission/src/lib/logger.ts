export default async function Log(
  stack: "frontend" | "backend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  packageName: string,
  message: string
): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, packageName, message }),
    });
  } catch (err) {
    console.warn("Frontend Log failed:", (err as Error).message);
  }
}
