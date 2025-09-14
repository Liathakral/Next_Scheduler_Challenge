export async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `${res.status}`);
  }
  return res.json();
}
