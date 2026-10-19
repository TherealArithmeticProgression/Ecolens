
![Ecolens Logo](https://github.com/TherealArithmeticProgression/Ecolens/blob/master/0219380b-9c04-4815-a3ac-596a5c762b17.png)

# EcoLens 


A Manifest V3 browser extension prototype for searching openly licensed images before generating a new image.

## Load in Chrome or Edge

1. Open the browser's extensions page and enable Developer mode.
2. Choose **Load unpacked** and select this folder.
3. Open EcoLens from the toolbar, enter a prompt, and choose **Find open images**.
4. Review each source and its license before reusing an image. Turn on comparison and paste a generated image URL to view it beside the first result.

## What this version does

- Runs a small pattern-based privacy check locally in the popup. Prompts matching the patterns are blocked from search.
- Sends the prompt to the Openverse image-search API only after the user presses the search button.
- Shows source, creator and license metadata from Openverse results.
- Supports a manual side-by-side comparison with a generated image URL.

Openverse offers anonymous API access subject to rate limits. This prototype uses its search API and does not scrape source websites. See [Openverse API docs](https://api.openverse.org/v1/) and [authentication and throttling](https://docs.openverse.org/api/reference/authentication_and_throttling.html).

## Limits and next step

This MVP does not yet inspect chat pages or intercept prompts in web apps. Automatic page integration requires permission to read a chat composer on specific websites. An all-sites content script was rejected during implementation review because it would read prompts across every site and transmit them to an external search API. Keep this popup-based flow until site-specific access is approved and implemented.

The privacy check is only a handful of regular expressions. It cannot detect every personal detail, infer whether a description identifies a person, or reliably detect private images. Do not treat a passing check as a guarantee that a prompt is safe to share.
