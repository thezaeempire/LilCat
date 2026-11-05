// Lil Companion cross-tab cat coordinator (Manifest V3 service worker).
// Exactly one tab owns the visible cat. Every tab keeps its own static hut and food bowl.
let ownerTabId = null;
let operationQueue = Promise.resolve();

async function getOwner() {
  if (ownerTabId !== null) {
    try { await chrome.tabs.get(ownerTabId); return ownerTabId; }
    catch (_) { ownerTabId = null; }
  }
  const saved = await chrome.storage.session.get("lilCatOwnerTabId");
  const candidate = saved.lilCatOwnerTabId;
  if (Number.isInteger(candidate)) {
    try { await chrome.tabs.get(candidate); ownerTabId = candidate; return ownerTabId; }
    catch (_) { /* stale tab id; claim a fresh one below */ }
  }
  return null;
}

async function setOwner(tabId) {
  const previous = await getOwner();
  if (previous !== null && previous !== tabId) {
    chrome.tabs.sendMessage(previous, { type: "lil-cat-deactivate" }).catch(() => {});
  }
  ownerTabId = tabId;
  await chrome.storage.session.set({ lilCatOwnerTabId: tabId });
  chrome.tabs.sendMessage(tabId, { type: "lil-cat-activate", showIntro: false }).catch(() => {});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (!Number.isInteger(tabId)) return;

  if (message?.type === "lil-cat-register") {
    operationQueue = operationQueue.then(async () => {
      const owner = await getOwner();
      if (owner === null) {
        ownerTabId = tabId;
        await chrome.storage.session.set({ lilCatOwnerTabId: tabId });
        sendResponse({ owner: true, showIntro: true });
      } else {
        sendResponse({ owner: owner === tabId, showIntro: false });
      }
    }).catch(() => sendResponse({ owner: false, showIntro: false }));
    return true;
  }

  if (message?.type === "lil-cat-summon") {
    operationQueue = operationQueue.then(async () => {
      await setOwner(tabId);
      sendResponse({ ok: true });
    }).catch(() => sendResponse({ ok: false }));
    return true;
  }
});

chrome.tabs.onRemoved.addListener(async removedTabId => {
  const owner = await getOwner();
  if (owner === removedTabId) {
    ownerTabId = null;
    await chrome.storage.session.remove("lilCatOwnerTabId");
    // Ask already-open tabs to compete for ownership; the first response wins.
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id !== undefined) chrome.tabs.sendMessage(tab.id, { type: "lil-cat-try-claim" }).catch(() => {});
    }
  }
});
