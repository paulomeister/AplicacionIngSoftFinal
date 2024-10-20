import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


export const PdfViewer = ({ url, userId = '', documentId= '' }) => {

    const transform = (slot) => ({
        ...slot,
        // These slots will be empty
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,

    });

    const renderToolbar = (Toolbar) => (
        <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
        sidebarTabs: (defaultTabs) => [
            // Remove the attachments tab (\`defaultTabs[2]\`)
            defaultTabs[0], // Thumbnails tab
            defaultTabs[1] // Bookmarks tab
        ],
    });

    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
            <div style={{ height: '750px' }}>
                <Viewer
                    // xxxxxx fileUrl={`/api/proxy?urlArchivo=${encodeURIComponent(url)}`}
                    // |||||| fileUrl={`http://localhost:8080/Documentos/viewFile?fileId=${url}&userId=${userId}&documentId=${documentId}`}
                    fileUrl={`http://localhost:8080/Documentos/viewFile?fileId=${url}&userId=${userId}&documentId=${documentId}`}
                    plugins={[ defaultLayoutPluginInstance ]}
                />
            </div>
        </Worker>
    );
};