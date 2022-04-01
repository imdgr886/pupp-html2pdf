import { Router } from 'express';
import Html2PdfController from '@controllers/html2pdf.controller';
import { FromUrlDto, FromBase64ContentDto } from '@dtos/html2pdf.dto';
import { Routes } from '@interfaces/routes.interface';
// import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class Html2PdfRoute implements Routes {
  public path = '/pdf';
  public router = Router();
  public html2PdfController = new Html2PdfController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/url`, [], this.html2PdfController.explodeFromUrl);
    this.router.post(`${this.path}/base64`, validationMiddleware(FromBase64ContentDto, 'body'), this.html2PdfController.explodeFromBase64Content);
  }
}

export default Html2PdfRoute;
