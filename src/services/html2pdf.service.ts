import { Pool } from 'generic-pool';
const createPuppeteerPool = require('@invertase/puppeteer-pool');
import { Browser, Page, PDFOptions } from 'puppeteer';
import { v1 as uuidv1 } from 'uuid';
import { HttpException } from '@exceptions/HttpException';
import path from 'path';
import { BASE_URL } from '@config';

class Html2PdfService {
  protected pool: Pool<Browser>;

  constructor() {
    this.initPool();
  }

  protected initPool(): void {
    this.pool = createPuppeteerPool({
      min: 1,
      max: 2,
      acquireTimeoutMillis: 10000, // 调用在超时前等待资源的最大毫秒数。
      idleTimeoutMillis: 30000, // 对象在池中处于空闲状态的最小时间，在该对象因空闲时间而符合退出条件之前
      puppeteerLaunchArgs: [
        {
          slowMo: 50,
          headless: true,
          ignoreHTTPSErrors: true,
          idleTimeoutMillis: 30000,
          width: 1920,
          height: 1080,
          args: [
            '--disable-gpu', // GPU硬件加速
            '--disable-dev-shm-usage', // 创建临时文件共享内存
            '--disable-setuid-sandbox', // uid沙盒
            '--no-first-run', // 没有设置首页。在启动的时候，就会打开一个空白页面。
            '--no-sandbox', // 沙盒模式
            '--no-zygote', //
            '--single-process', // 单进程运行
            '--no-default-browser-check', // 不检查默认浏览器
            '--disable-extensions', // 禁止扩展
            '--disable-bundled-ppapi-flash', // 禁止内置 flash
          ],
        },
      ],
    });
  }

  protected async explode(loadContent: (page: Page) => void, options?: PDFOptions) {
    let browser: Browser, page: Page;
    const filename: string = uuidv1().replace(/-/g, '') + '.pdf';
    const defaultOptions: PDFOptions = {
      printBackground: true,
      margin: { top: '1in', left: '0', right: '0', bottom: '0.8in' },
      path: path.join(__dirname, '../../storage', filename),
      format: 'a4',
      //   displayHeaderFooter: needWaterMark ? true : false,
      //   footerTemplate: needWaterMark ? footerTemplate : `<div></div>`,
      //   headerTemplate: needWaterMark ? headerTemplate : `<div></div>`,
    };

    try {
      browser = await this.pool.acquire();
      page = await browser.newPage();
      //await page.setViewport({ width: 1920, height: 1080 });
      await loadContent(page);
      await page.pdf({ ...defaultOptions, ...options });
      return BASE_URL + '/' + filename;
    } catch (e) {
      console.log(e);
      throw new HttpException(500, 'Server Error');
    } finally {
      browser && (await this.pool.release(browser));
      await page?.close();
    }
  }

  public async explodeFromUrl(url: string, options?: PDFOptions): Promise<String> {
    return await this.explode(async (page: Page) => {
      await page.goto(url, {
        waitUntil: ['load', 'domcontentloaded'],
      });
    }, options);
  }

  public async explodeFromContent(content: string, options?: PDFOptions): Promise<String> {
    return await this.explode(async (page: Page) => {
      await page.setContent(content, {
        waitUntil: ['load', 'domcontentloaded'],
      });
    }, options);
  }
}

export default new Html2PdfService();
