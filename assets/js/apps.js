/*

google event clicking the pdf

*/

document.addEventListener('DOMContentLoaded', function() {
    const pdfLink = document.querySelector('a[href="https://wp.tasai.org/wp-content/uploads/SSPI_report_2023_web.pdf"]'); // Replace with the actual PDF URL
    if (pdfLink) {
        pdfLink.addEventListener('click', function() {
            // Send the event to Google Analytics 4
            gtag('event', 'sspi_event_click', {
                'sspi_pdf': pdfLink.href // Send the PDF URL as a parameter
            });
        });
    }
});

