async function fetchUrl(url) {
  const response = await fetch(url).catch(() => null);

  if (!response || !response.ok) {
    return { ok: false, data: null };
  }

  const data = await response.json().catch(() => null);

  if (!data) {
    return { ok: false, data: null };
  }

  return { ok: true, data: data };
}

module.exports = { fetchUrl };
