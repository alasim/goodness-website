export function printElement(elementId: string, title: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
      background: white;
    }

    @page {
      margin: 0;
      size: auto;
    }

    @media print {
      body { margin: 0; }
    }
  `;

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title} — Goodness Society</title>
        <style>${styles}</style>
      </head>
      <body>${el.innerHTML}</body>
    </html>
  `);

  win.document.close();

  // Wait for fonts before printing
  win.onload = () => {
    setTimeout(() => {
      win.focus();
      win.print();
      win.close();
    }, 600);
  };
}
