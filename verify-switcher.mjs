// Temporary verification script — drives a real Chrome over CDP to open the
// module switcher and dump what the dropdown renders.
const PORT = process.argv[2] ?? '9222';
const URL_TO_OPEN = process.argv[3] ?? 'http://localhost:3111/docs/networking-ccna';

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
const page = targets.find((t) => t.type === 'page');
if (!page) throw new Error('no page target');

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});

await new Promise((resolve) => ws.addEventListener('open', resolve));

function send(method, params = {}) {
  return new Promise((resolve) => {
    const msgId = ++id;
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

const evaluate = async (expression) => {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return res.result?.result?.value;
};

await send('Page.enable');
await send('Runtime.enable');
await send('Page.navigate', { url: URL_TO_OPEN });
await new Promise((r) => setTimeout(r, 9000));

console.log('URL:', await evaluate('location.pathname'));
console.log('trigger present:', await evaluate(`!!document.querySelector('[aria-label="Switch module"]')`));
console.log('listbox before click:', await evaluate(`!!document.querySelector('[role="listbox"]')`));

await evaluate(`document.querySelector('[aria-label="Switch module"]').click()`);
await new Promise((r) => setTimeout(r, 900));

console.log('listbox after click:', await evaluate(`!!document.querySelector('[role="listbox"]')`));
console.log('option count:', await evaluate(`document.querySelectorAll('[role="listbox"] [role="option"]').length`));
console.log('each option (icon + title + category):');
console.log(
  await evaluate(`
    Array.from(document.querySelectorAll('[role="listbox"] [role="option"]')).map((o, i) =>
      (i + 1) + '. ' +
      (o.querySelector('svg') ? '[icon]' : '[NO ICON]') + ' ' +
      o.innerText.replace(/\\n/g, ' | ')
    ).join('\\n')
  `),
);

ws.close();
