import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


export const PdfViewer = ({ url }) => {

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
            // Remove the attachments tab and Bookmarks tab (\`defaultTabs[2]\ defaultTabs[1] \`)
            defaultTabs[0], // Thumbnails tab
            defaultTabs[1] 
        ],
    });

    const { renderDefaultToolbar, Toolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
            <div style={{ height: '750px' }}>
                <Viewer
                    fileUrl={`/api/proxy?urlArchivo=${encodeURIComponent(url)}`} // Sin comillas y URL codificada
                    plugins={[ defaultLayoutPluginInstance ]}
                />
            </div>
        </Worker>
    );
};