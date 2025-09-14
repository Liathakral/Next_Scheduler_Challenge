export async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || `${res.status} ${res.statusText}`);
  return json;
}
