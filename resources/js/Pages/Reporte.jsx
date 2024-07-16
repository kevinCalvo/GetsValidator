import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const groupByCategory = (data, categoryField) => {
    return data.reduce((acc, item) => {
        const category = item[categoryField] || 'Sin Categoría';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});
};

const Reporte = ({ auth, data }) => {
    console.log('Data completa:', data);

    const { rut, runt_app, nombre, registraduria_certificado, peps, peps_consolidado, peps_denon, ofac, ofac_nombre, lista_onu, europol, interpol, procuraduria, contraloria, contaduria, defunciones_registraduria, insolvencias, policia, delitos_sexuales, rut_estado, proveedores_ficticios, juzgados_tyba, contadores_s } = data;
    const licencias = runt_app?.licencia?.licencias || [];
    const totalLicencias = runt_app?.licencia?.totalLicencias || 0;

    const groupedPeps = groupByCategory(peps || [], 'CATEGORIA');
    const groupedPepsConsolidado = groupByCategory(peps_consolidado || [], 'categoria');
    const groupedPepsDenon = groupByCategory(peps_denon || [], 'CATEGORIA');

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reporte</h2>}>
            <Head title="Reporte" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-5">Reporte</h1>
                        <p className="text-xl font-semibold mb-5">{nombre}</p>

                        <div className="grid grid-cols-1  md:grid-cols-4  lg:grid-cols-7 gap-4 mb-5">
                            <div className="flex gap-2 flex-col">
                                <p className="font-semibold">Cédula:</p>
                                <p>{data.defunciones_registraduria.doc}</p>
                            </div>
                            {data.Estado && (
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Estado:</p>
                                    <p>{data.Estado}</p>
                                </div>
                            )}
                            <div className="flex gap-2 flex-col">
                                <p className='font-semibold'>RUT:</p>
                                <p>{rut}</p>
                            </div>
                            <div className="flex gap-2 flex-col">
                                <p className='font-semibold'>RUT Estado:</p>
                                <p>{data.rut_estado}</p>
                            </div>
                            <div className="flex gap-2 flex-col">
                                <p className='font-semibold'>Género:</p>
                                <p>{data.genero}</p>
                            </div>

                            <div className='flex gap-2 flex-col'>
                                <p className="font-semibold">Licencias:</p>
                                {licencias.length > 0 && totalLicencias > 0 ? (
                                    <ul>
                                        {licencias.map((licencia, index) => (
                                            <li key={index} className="">
                                                <p>{licencia.categoria}: {licencia.estado}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No encontradas</p>
                                )}
                            </div>
                            <div className="flex gap-2 flex-col">
                                <p className='font-semibold'>Fecha del reporte:</p>
                                <p>{data.defunciones_registraduria.date}</p>
                            </div>
                        </div>
                    </div>

                    {registraduria_certificado && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Registraduría Nacional del Estado Civil</p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="font-semibold">Cédula:</p>
                                    <p>{registraduria_certificado.cedula}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Fecha de Expedición:</p>
                                    <p>{registraduria_certificado.fecha_exp}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Lugar de Expedición:</p>
                                    <p>{registraduria_certificado.lugar_exp}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Nombre:</p>
                                    <p>{registraduria_certificado.nombre}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Estado:</p>
                                    <p>{registraduria_certificado.estado}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {groupedPeps && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Listas y Personas Expuestas Políticamente (PEPs)</p>
                            {Object.keys(groupedPeps).length === 0 ? (
                                <p>No se encontraron registros.</p>
                            ) : (
                                Object.entries(groupedPeps).map(([category, items]) => (
                                    <div key={category} className="mb-4">
                                        <p className="text-lg font-bold">{category}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {items.map((pep, index) => (
                                                <div key={index} className="flex gap-2 flex-col">
                                                    <p className="font-semibold">Nombre Completo:</p>
                                                    <p>{pep.NOMBRECOMPLETO}</p>
                                                    <p className="font-semibold">Categoría:</p>
                                                    <p>{pep.CATEGORIA}</p>
                                                    <p className="font-semibold">Estado:</p>
                                                    <p>{pep.ESTADO}</p>
                                                    <p className="font-semibold">Fecha de Actualización:</p>
                                                    <p>{pep.FECHA_UPDATE}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {groupedPepsConsolidado && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            {/* <p className="text-xl font-semibold mb-5">PEPs Consolidado</p> */}
                            {Object.keys(groupedPepsConsolidado).length === 0 ? (
                                <p>No se encontraron registros.</p>
                            ) : (
                                Object.entries(groupedPepsConsolidado).map(([category, items]) => (
                                    <div key={category} className="mb-4">
                                        <p className="text-lg font-bold mb-4">{category}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-6">
                                            {items.map((pep, index) => (
                                                <div key={index} className="grid grid-cols-2 gap-2 items-center">
                                                    <p>{pep.nombre_lista}</p>
                                                    <p className="text-gray-500">registro no encontrado</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {ofac && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Lista Clinton (OFAC), Búsqueda por Documento</p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="text-gray-500">{ofac ? ofac : "No registra en la fuente"}</p>
                                </div>

                            </div>
                        </div>
                    )}
                    {ofac_nombre && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Lista Clinton (OFAC), Búsqueda por Nombre
                            </p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="text-gray-500">{ofac_nombre ? ofac_nombre : "No registra en la fuente"}</p>
                                </div>

                            </div>
                        </div>
                    )}
                    {lista_onu && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5"> Consejo de Seguridad de la Naciones Unidas (ONU)
                            </p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="text-gray-500">{lista_onu ? lista_onu : "No registra en la fuente"}</p>
                                </div>

                            </div>
                        </div>
                    )}
                    {europol && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5"> European Union Most Wanted List (EUROPOL)
                            </p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                {europol.length === 0 ? (
                                    <p className='text-gray-500'>No registra en la fuente</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                                        {europol.map((item, index) => (
                                            <div key={index} className="flex gap-2 flex-col">
                                                <p>{item}</p>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {interpol && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Organización Internacional de Policía Criminal (INTERPOL)
                            </p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="text-gray-500">{interpol ? interpol : "No registra en la fuente"}</p>
                                </div>

                            </div>
                        </div>
                    )}
                    {procuraduria && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5"> Procuraduría General de la Nación (Consulta en Línea)
                            </p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                {procuraduria.length === 0 ? (
                                    <p className='text-gray-500'>No registra en la fuente</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                                        {procuraduria.map((item, index) => (
                                            <div key={index} className="flex gap-2 flex-col">
                                                <p>{item}</p>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {contraloria && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Contraloría General de la República (Consulta en Línea)
                            </p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="text-gray-500">{contraloria ? contraloria : "No registra en la fuente"}</p>
                                </div>

                            </div>
                        </div>
                    )}
                    {contaduria && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Contaduría General de la Nación
                            </p>
                            {contaduria ? (
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-5">
                                    <div className="flex gap-2 flex-col">
                                        <p>{data.contaduria_hallazgo}</p>
                                        <a className='text-blue-600' href={data.contaduria_pdf}>Descargar certificado PDF</a>
                                    </div>
                                </div>
                            ) : (
                                <p className='text-gray-500'>No se encontró registro</p>
                            )}
                        </div>
                    )}
                    {defunciones_registraduria && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Defunciones Registraduria</p>
                            <div className="grid grid-cols-1  md:grid-cols-3  lg:grid-cols-3 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="font-semibold">Documento:</p>
                                    <p>{defunciones_registraduria.doc}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Fecha de consulta:</p>
                                    <p>{defunciones_registraduria.date}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Estado</p>
                                    <p>{defunciones_registraduria.validity}</p>
                                </div>

                            </div>
                        </div>
                    )}
                    {insolvencias && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5"> Insolvencias Supersociedades
                            </p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                {insolvencias.length === 0 ? (
                                    <p className='text-gray-500'>No registra en la fuente</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                                        {insolvencias.map((item, index) => (
                                            <div key={index} className="flex gap-2 flex-col">
                                                <p>{item}</p>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Policía Nacional de Colombia
                        </p>
                        <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                            <div className="flex gap-2 flex-col">
                                <p className="text-gray-500">{policia ? policia : "No registra en la fuente"}</p>
                            </div>

                        </div>
                    </div>
                    {delitos_sexuales && (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Delitos sexuales contra menores de edad
                            </p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-1 gap-4 mb-5">
                                {delitos_sexuales.length === 0 ? (
                                    <p className='text-gray-500'>No registra en la fuente</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">
                                        {delitos_sexuales.map((item, index) => (
                                            <div key={index} className="flex gap-2 flex-col">
                                                <p>{item}</p>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Registro Único Tributario (RUT)
                        </p>
                        <div className="grid grid-cols-1  md:grid-cols-1  lg:grid-cols-1 gap-4 mb-5">
                            <div className="flex gap-2 flex-col">
                                <p className="">{rut ? rut : "No registra en la fuente"} - {rut_estado}</p>
                            </div>

                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">DIAN (Proveedores ficticios)
                        </p>
                        <div className="grid grid-cols-1  md:grid-cols-1  lg:grid-cols-1 gap-4 mb-5">
                            <div className="flex gap-2 flex-col">
                                <p className="text-gray-500">{proveedores_ficticios ? proveedores_ficticios : "No registra en la fuente"}</p>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Juzgados Tyba - Justicia XXI
                        </p>
                        <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-1 gap-4 mb-5">
                            {juzgados_tyba.length === 0 ? (
                                <p className='text-gray-500'>No registra en la fuente</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">
                                    {juzgados_tyba.map((item, index) => (
                                        <div key={index} className="flex gap-2 flex-col">
                                            <p>{item}</p>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Contadores sancionados
                        </p>
                        <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-1 gap-4 mb-5">
                            {contadores_s.length === 0 ? (
                                <p className='text-gray-500'>No registra en la fuente</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">
                                    {contadores_s.map((item, index) => (
                                        <div key={index} className="flex gap-2 flex-col">
                                            <p>{item}</p>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout >
    );
}

export default Reporte;
