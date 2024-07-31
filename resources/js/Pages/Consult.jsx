import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from "@inertiajs/react";
import 'flowbite';

export default function Consult({ auth, historicos }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Consulta</h2>}
        >
            <Head title="Historial" />

            <div className="py-10">
                <div className="max-w-7xl  sm:px-6 lg:px-8 mx-auto">
                    <div className="bg-white p-4 overflow-hidden mx-4 md:mx-auto shadow-sm rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Históricos</h3>
                        {historicos.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full max-w-[70%] bg-white border border-gray-200 hidden md:table">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border-b">Nombre</th>
                                            <th className="px-4 py-2 border-b">Cédula</th>
                                            <th className="px-4 py-2 border-b">Fecha de reporte</th>
                                            <th className="px-4 py-2 border-b">Tipo Documento</th>
                                            <th className="px-4 py-2 border-b">Fecha de expedición</th>
                                            <th className="px-4 py-2 border-b">Tipo de Entrada</th>
                                            <th className="px-4 py-2 border-b">Ver Reporte</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historicos.map((historico) => (
                                            <tr className='text-center' key={historico.id}>
                                                <td className="px-4 py-3 border-b">{historico.name ? historico.name : 'No identificado'}</td>
                                                <td className="px-4 py-3 border-b">{historico.doc}</td>
                                                <td className="px-4 py-3 border-b">{historico.fechaR}</td>
                                                <td className="px-4 py-3 border-b">{historico.typedoc}</td>
                                                <td className="px-4 py-2 border-b">{historico.fechaE ? historico.fechaE : 'No identificada'}</td>
                                                <td className="px-4 py-3 border-b">{historico.typeofentry}</td>
                                                <td className="px-4 py-3 border-b">
                                                    <Link
                                                        href={route('report.show', { doc: historico.doc })}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        <box-icon type='solid' color='gray' name='report'></box-icon>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="md:hidden">
                                    {historicos.map((historico) => (
                                        <div key={historico.id} className="border-b border-gray-200 p-4">
                                            <div className="font-semibold">Nombre: {historico.name ? historico.name : 'No identificado'}</div>
                                            <div>Cédula: {historico.doc}</div>
                                            <div>Fecha de reporte: {historico.fechaR}</div>
                                            <div>Tipo Documento: {historico.typedoc}</div>
                                            <div>Fecha de expedición: {historico.fechaE ? historico.fechaE : 'No identificada'}</div>
                                            <div>Tipo de Entrada: {historico.typeofentry}</div>
                                            <Link
                                                href={route('report.show', { doc: historico.doc })}
                                                className="text-blue-500 hover:underline mt-2 inline-block"
                                            >
                                                Ver Reporte
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No hay históricos disponibles.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
