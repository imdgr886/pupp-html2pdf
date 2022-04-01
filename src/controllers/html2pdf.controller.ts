import Html2PdfService from '@services/html2pdf.service';
import { NextFunction, Request, Response } from 'express';
import { FromUrlDto, FromBase64ContentDto } from '@dtos/html2pdf.dto';
import { Buffer } from 'buffer';

export default class Html2PdfController {
  public explodeFromUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: FromUrlDto = req.body;
      //const fileUrl = Html2PdfService.explodeFromUrl(data.url);
      //res.json({ file_url: fileUrl });
      res.send(await Html2PdfService.explodeFromUrl(data.url));
    } catch (error) {
      next(error);
    }
  };

  public explodeFromBase64Content = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: FromBase64ContentDto = req.body;
      //const content = Buffer.from(data.content).toString('ascii');
      //const fileUrl = Html2PdfService.explodeFromContent(content);
      res.send(await Html2PdfService.explodeFromContent(data.content));
      //res.json({ file_url: fileUrl });
    } catch (error) {
      next(error);
    }
  };
}
