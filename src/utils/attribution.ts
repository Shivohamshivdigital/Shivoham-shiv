// Captures ad/campaign attribution from the URL (UTMs + Google/Meta click ids)
// and remembers it, so it can be attached to every lead / signup. This is how
// we know which ad (or search term) a customer came from.

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string; // paid-search keyword / search term
  utm_content?: string;
  gclid?: string; // Google Ads click id
  fbclid?: string; // Meta/Facebook click id
  referrer?: string;
  landing_page?: string;
}

const KEY = "shivoham_attribution";
const TRACK_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;

/** Run once on page load. Stores the first ad-touch (keeps it if already set). */
export function captureAttribution(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    TRACK_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) found[k] = v;
    });

    const hasTracking = Object.keys(found).length > 0;
    const existing = localStorage.getItem(KEY);

    // Overwrite when a new ad click arrives; otherwise seed once for organic/direct.
    if (hasTracking) {
      const data: Attribution = {
        ...found,
        referrer: document.referrer || undefined,
        landing_page: window.location.pathname + window.location.search,
      };
      localStorage.setItem(KEY, JSON.stringify(data));
    } else if (!existing) {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          referrer: document.referrer || undefined,
          landing_page: window.location.pathname + window.location.search,
        })
      );
    }
  } catch {
    /* localStorage unavailable — ignore */
  }
}

/** Returns the stored attribution to attach to a submission. */
export function getAttribution(): Attribution {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
