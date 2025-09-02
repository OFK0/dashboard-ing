import rollupReplace from '@rollup/plugin-replace';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';
import parseArgs from 'minimist';

const args = parseArgs(process.argv.slice(2), {
  boolean: true,
});

let browsers = [
  playwrightLauncher({ product: 'chromium' }),
  playwrightLauncher({ product: 'firefox', concurrency: 1 }),
  playwrightLauncher({ product: 'webkit' }),
];

if (args.debug) {
  browsers = [
    puppeteerLauncher({
      launchOptions: {
        args: ['--no-sandbox'],
        devtools: true,
        headless: !!args.headless,
      },
    }),
  ];
}

const replace = fromRollup(rollupReplace);

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  files: 'src/**/*.test.js',
  rootDir: './',
  nodeResolve: true,
  port: 8765,
  coverageConfig: {
    include: ['src/components/**/*.js'],
    threshold: {
      branches: 85,
      statements: 85,
      functions: 85,
      lines: 85,
    },
  },

  mimeTypes: {
    'src/components/**/*.css': 'js',
  },

  browsers,

  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    esbuildPlugin({ ts: true, target: 'esnext' }),
  ],

  testRunnerHtml: testFramework => `<html>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`,
});
