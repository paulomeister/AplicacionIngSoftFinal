import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


// TODO: Implement the url into the fileUrl when the pdf delivery server or other stuff is hosting the files.
export const PdfViewer = ({url}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <div style={{ height: '750px' }}>
            <Viewer
                fileUrl={`http://localhost:8045/pdf/compressed.tracemonkey-pldi-09.pdf`}
                plugins={[
                    defaultLayoutPluginInstance, // TODO: Research how to modify the default layout PDF Viewer
                ]}
            />
        </div>
    </Worker>
);
}

