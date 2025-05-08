import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import 'moment/locale/id';
import domtoimage from 'dom-to-image';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    ShowLoading$ = new BehaviorSubject(false);

    ShowSidebar$ = new BehaviorSubject(false);

    ShowTopMenu$ = new BehaviorSubject(false);

    constructor() { }

    getVersion(): string {
        return "0.0.1";
    }

    exportToPdf1(divId: string, fileTitle: string) {
        let data = document.getElementById(`${divId}`) as any;
        html2canvas(data, { backgroundColor: '#FFFFFF' }).then(canvas => {
            let imgWidth = 208;
            let pageHeight = 295;
            let imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png');
            let pdf = new jspdf('p', 'mm', 'a4');
            let position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

            // Instead of saving the PDF directly, create a Blob
            const pdfOutput = pdf.output('blob');

            // Create a URL for the Blob and open it in a new window
            const pdfUrl = URL.createObjectURL(pdfOutput);
            const pdfWindow: Window | any = window.open(pdfUrl, '_blank');

            // Automatically trigger the print dialog
            pdfWindow.onload = function () {
                pdfWindow.focus(); // Ensure the window is in focus
                pdfWindow.print();
            };

            // pdf.save(`${fileTitle}.pdf`);
        });
    }

    exportToPdf(divId: string, fileTitle: string) {
        const node = document.getElementById(divId);

        if (node) {
            domtoimage.toPng(node)
                .then((dataUrl) => {
                    // Generate the PDF
                    const pdf = new jspdf('p', 'mm', 'a4');
                    const imgProps = pdf.getImageProperties(dataUrl);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

                    // Open the PDF in a new window and trigger print
                    const pdfBlob = pdf.output('blob');
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    const pdfWindow: any = window.open(pdfUrl);

                    pdfWindow.onload = () => {
                        pdfWindow.focus();
                        pdfWindow.print();
                    };
                })
                .catch((error) => {
                    console.error('Error capturing the element:', error);
                });
        } else {
            console.error('Element not found:', divId);
        }
    }

    onFormatDate(date: Date, format?: string): any {
        moment.locale('id');
        return format ? moment(date).format(format) : moment(date).format('yyyy-mm-DD HH:mm:ss');
    }

    onCountJumlahHari(start: Date, end: Date): any {
        const startDate = moment(start),
            endDate = moment(end);

        return endDate.diff(startDate, 'days');
    }

    onFormatPhoneNumber(phone_number: string): string {
        return phone_number.replace(/^(\+62|0)/, '62');
    }
}
