import { CheckboxWithLink } from '@/Components/CheckboxWithLink';
import { MultiLevelSidebar } from '@/Components/MultiLevelSidebar';
import Sidebar from '@/Components/Sidebar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import 'flowbite';

export default function Consult({ auth, historicos }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Consulta</h2>}
        >
            <Head title="Historial" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-4 overflow-hidden shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Históricos</h3>
                        {historicos.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border-b">Nombre</th>
                                            <th className="px-4 py-2 border-b">Cédula</th>
                                            <th className="px-4 py-2 border-b">Fecha de reporte</th>
                                            <th className="px-4 py-2 border-b">Tipo Documento</th>
                                            <th className="px-4 py-2 border-b">	Fecha de expedición</th>
                                            <th className="px-4 py-2 border-b">Tipo de Entrada</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historicos.map((historico) => (
                                            <tr className='text-center' key={historico.id}>
                                                <td className="px-4 py-3 border-b">{historico.name}</td>
                                                <td className="px-4 py-3 border-b">{historico.doc}</td>
                                                <td className="px-4 py-3 border-b">{historico.fechaR}</td>
                                                <td className="px-4 py-3 border-b">{historico.typedoc}</td>
                                                <td className="px-4 py-2 border-b">{historico.fechaE ? historico.fechaE : 'No identificada'}</td>
                                                <td className="px-4 py-3 border-b">{historico.typeofentry}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
