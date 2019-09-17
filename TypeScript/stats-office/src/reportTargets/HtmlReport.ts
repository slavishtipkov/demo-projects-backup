import fs from 'fs';

import { OutputTarget } from '../Summary';

export class HtmlReport implements OutputTarget {
  print(report: string): void {
    const html = `
      <html>
        <body>
        <div>
        <h1>Analysis Output</h1>
        <div>${report}</div>
      </div>
        </body>
      </html>
    `;

    fs.writeFileSync('report.html', html);
  }
}
