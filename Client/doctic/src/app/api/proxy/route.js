import { NextResponse } from 'next/server';

export async function GET(request) {
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const urlArchivo = searchParams.get('urlArchivo'); // Capturar el 'urlArchivo' del documento

    if (!urlArchivo) {
        return new NextResponse('Missing document URL', { status: 400 });
    }

    try {
        const response = await fetch(urlArchivo, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
            },
        });

        if (!response.ok) {
            return new NextResponse(`Error fetching PDF: ${response.status}`, { status: response.status });
        }

        const data = await response.arrayBuffer(); // Leer los datos como un array buffer
        const headers = new Headers(response.headers);
        headers.set('Content-Type', 'application/pdf');

        return new NextResponse(data, {
            headers,
            status: 200,
        });
    } catch (error) {
        console.error('Error fetching PDF:', error);
        return new NextResponse('Error fetching PDF', { status: 500 });
    }
}

