const $ = (id) => document.getElementById(id);
const promptBox = $('prompt');
const privatePatterns = [
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN-like identifier
  /\b(?:\d[ -]*?){13,19}\b/, // payment-card-like number
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:password|passcode|secret|api[_ -]?key)\s*[:=]/i,
  /\b(?:my|our)\s+(?:medical|health|bank|account)\s+(?:record|number|details?)\b/i
];
function checkPrivacy() {
  const text = promptBox.value.trim();
  const flagged = privatePatterns.some((pattern) => pattern.test(text));
  $('privacy').className = `privacy ${flagged ? 'warn' : text ? '' : 'neutral'}`;
  $('privacy').innerHTML = `<span class="dot"></span><span>${flagged ? 'Possible personal data detected. Search blocked; remove it before continuing.' : 'Privacy check runs on this device.'}</span>`;
  $('search').disabled = !text || flagged;
  return flagged;
}
promptBox.addEventListener('input', checkPrivacy);
$('compareToggle').addEventListener('change', () => $('compareBox').classList.toggle('hidden', !$('compareToggle').checked));
$('search').addEventListener('click', searchOpenverse);
$('compare').addEventListener('click', showComparison);
async function searchOpenverse() {
  if (checkPrivacy()) return;
  const query = promptBox.value.trim();
  $('status').textContent = 'Searching Openverse…';
  $('results').replaceChildren();
  try {
    const url = new URL('https://api.openverse.org/v1/images/');
    url.searchParams.set('q', query);
    url.searchParams.set('page_size', '12');
    url.searchParams.set('license_type', 'commercial,modification');
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Openverse returned ${response.status}`);
    const data = await response.json();
    const results = (data.results || []).filter((item) => item.thumbnail && item.url);
    $('status').textContent = results.length ? `${results.length} openly licensed matches. Review the source and license before use.` : 'No matches found. You can continue in your image generator.';
    for (const item of results) $('results').append(makeCard(item));
  } catch (error) {
    $('status').textContent = `Could not search Openverse: ${error.message}. Try again when connected.`;
  }
}
function makeCard(item) {
  const card = document.createElement('article'); card.className = 'card';
  const img = document.createElement('img'); img.loading = 'lazy'; img.src = item.thumbnail; img.alt = item.title || 'Openverse result';
  const meta = document.createElement('div'); meta.className = 'meta';
  const title = document.createElement('strong'); title.textContent = item.title || 'Untitled image';
  const details = document.createElement('p'); details.textContent = `${item.creator || 'Creator unknown'} · ${item.license || 'License details'}`;
  const link = document.createElement('a'); link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'View source and license ↗';
  meta.append(title, details, link); card.append(img, meta); return card;
}
function showComparison() {
  const generated = $('generatedUrl').value.trim();
  if (!generated) { $('status').textContent = 'Paste a generated image URL to compare.'; return; }
  let parsed; try { parsed = new URL(generated); } catch { $('status').textContent = 'Enter a valid image URL.'; return; }
  if (!['http:', 'https:'].includes(parsed.protocol)) { $('status').textContent = 'Use an http or https image URL.'; return; }
  const first = $('results').querySelector('.card img');
  if (!first) { $('status').textContent = 'Search for open images first, then compare.'; return; }
  const pair = document.createElement('div'); pair.className = 'pair';
  const left = document.createElement('figure'); const leftImg = first.cloneNode(); const leftCaption = document.createElement('figcaption'); leftCaption.textContent = 'Open image match'; left.append(leftImg, leftCaption);
  const right = document.createElement('figure'); const rightImg = document.createElement('img'); rightImg.src = parsed.href; rightImg.alt = 'Generated image'; const caption = document.createElement('figcaption'); caption.textContent = 'Generated image'; right.append(rightImg, caption);
  pair.append(left, right); $('results').prepend(pair); $('status').textContent = 'Compare the visual match above.';
}
checkPrivacy();
