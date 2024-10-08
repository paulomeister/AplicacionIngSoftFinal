import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export const PdfViewer = ({ url }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
            <div style={{ height: '750px' }}>
                <Viewer
                    fileUrl={`/api/proxy?urlArchivo=${encodeURIComponent(url)}`} // Sin comillas y URL codificada
                    plugins={[defaultLayoutPluginInstance]}
                />
            </div>
        </Worker>
    );
};