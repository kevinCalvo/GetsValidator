import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    /*   console.log('Data completa:', data); */

    const { rut, runt_app, nombre, registraduria_certificado, peps, peps_consolidado, peps_denon, ofac, ofac_nombre, lista_onu, europol, interpol, procuraduria, contraloria, contaduria, defunciones_registraduria, insolvencias, policia, delitos_sexuales, rut_estado, proveedores_ficticios, juzgados_tyba, contadores_s, simit, rama } = data;
    const licencias = runt_app?.licencia?.licencias || [];
    const totalLicencias = runt_app?.licencia?.totalLicencias || 0;

    const groupedPeps = groupByCategory(peps || [], 'CATEGORIA');
    const groupedPepsConsolidado = groupByCategory(peps_consolidado || [], 'categoria');
    const groupedPepsDenon = groupByCategory(peps_denon || [], 'CATEGORIA');

    const renderCityData = (details) => {
        if (typeof details === 'boolean') {
            return (
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
                    <p>{details ? 'Información disponible' : 'No se encontró información'}</p>
                </div>
            );
        }
        const renderActuaciones = (actuaciones) => {
            return (
                <div className="mb-4">
                    <h4 className="text-md font-semibold mb-2">Actuaciones:</h4>
                    <ul className="list-disc pl-5">
                        {actuaciones.map((act, idx) => (
                            <li key={idx} className="mb-2">
                                <p><strong>Tipo:</strong> {act.tipo}</p>
                                <p><strong>Fecha:</strong> {act.fecha}</p>
                                <p><strong>Folio:</strong> {act.folio}</p>
                                <p><strong>Cuadernos:</strong> {act.cuadernos}</p>
                                <p><strong>Anotación:</strong> {act.anotacion}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        };

        if (typeof details === 'object') {
            return (
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
                    {Object.entries(details).map(([codigo, info]) => (
                        <div key={codigo} className="mb-4 border-t pt-4">
                            <p><strong>Código:</strong> {codigo}</p>
                            <p><strong>Delitos:</strong> {info.delitos}</p>
                            <p><strong>Observaciones:</strong> {info.observaciones}</p>
                            <p>
                                <strong>Actuaciones:</strong>
                                <p>
                                    {info.actuaciones && renderActuaciones(info.actuaciones)}
                                </p>


                            </p>
                            <p>
                                <strong>Imagen:</strong>
                                <img src={info.pantallap} alt={`Imagen de ${codigo}`} className="w-full max-w-xs mt-2" />
                            </p>
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };


    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reporte</h2>}>
            <Head title="Reporte" />

            <div className="py-12">
                <div id="pdf-content" className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-5">Reporte</h1>
                        <p className="text-xl font-semibold mb-5">{nombre}</p>
                        {/*  <button onClick={generatePDF} className="mt-4 bg-blue-500 text-white p-2 rounded">Generar PDF</button> */}
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
                                <p>{data.genero ? data.genero : 'N/A'}</p>
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
                    {Array.isArray(europol) ? (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">European Union Most Wanted List (EUROPOL)</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                                {europol.length === 0 ? (
                                    <p className='text-gray-500'>No registra en la fuente</p>
                                ) : (
                                    europol.map((item, index) => (
                                        <div key={index} className="flex gap-2 flex-col">
                                            <p>{item}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">No encontrado</p>
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

                    {Array.isArray(procuraduria) ? (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Procuraduría General de la Nación (Consulta en Línea)</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                                {procuraduria.length === 0 ? (
                                    <p className='text-gray-500'>No registra en la fuente</p>
                                ) : (
                                    procuraduria.map((item, index) => (
                                        <div key={index} className="flex gap-2 flex-col">
                                            <p>{item}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">No encontrado</p>
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
                        <p className="text-xl font-semibold mb-5">Juzgados Tyba - Justicia XXI</p>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-5">
                            {juzgados_tyba.length === 0 ? (
                                <p className='text-gray-500'>No registra en la fuente</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                                    {juzgados_tyba.map((item, index) => (
                                        <div key={index} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg shadow-sm">
                                            {/* Información básica del proceso */}
                                            <div className="space-y-2">
                                                <p><strong>Clase Proceso:</strong> {item["CLASE PROCESO"]}</p>
                                                <p><strong>Código Proceso:</strong> {item["CODIGO PROCESO"]}</p>
                                                <p><strong>Despacho:</strong> {item["DESPACHO"]}</p>
                                                <p><strong>Proceso Privado:</strong> {item["proceso_privado"] ? "Sí" : "No"}</p>
                                            </div>

                                            {/* Información adicional si existe */}
                                            {item["INFO PROCES0"] && (
                                                <div className="mt-4 border-t pt-4">
                                                    <p className="font-semibold text-lg">Información Adicional:</p>

                                                    {/* Información general */}
                                                    {Object.entries(item["INFO PROCES0"]).map(([key, value], idx) => (
                                                        key !== 'actuaciones' && key !== 'sujetos' ? (
                                                            <p key={idx} className="flex items-center"><strong className="w-48 text-gray-700">{key}:</strong> {value || "No disponible"}</p>
                                                        ) : null
                                                    ))}

                                                    {/* Actuaciones */}
                                                    {item["INFO PROCES0"]["actuaciones"] && item["INFO PROCES0"]["actuaciones"].length > 0 && (
                                                        <div className="mt-4">
                                                            <p className="font-semibold text-lg">Actuaciones:</p>
                                                            {item["INFO PROCES0"]["actuaciones"].map((actuacion, actIndex) => (
                                                                <div key={actIndex} className="border-t pt-2">
                                                                    {Object.entries(actuacion).map(([key, value], idx) => (
                                                                        <p key={idx} className="flex items-center"><strong className="w-48 text-gray-700">{key}:</strong> {value || "No disponible"}</p>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Sujetos */}
                                                    {item["INFO PROCES0"]["sujetos"] && item["INFO PROCES0"]["sujetos"].length > 0 && (
                                                        <div className="mt-4">
                                                            <p className="font-semibold text-lg">Sujetos:</p>
                                                            {item["INFO PROCES0"]["sujetos"].map((sujeto, subjIndex) => (
                                                                <div key={subjIndex} className="border-t pt-2">
                                                                    {Object.entries(sujeto).map(([key, value], idx) => (
                                                                        <p key={idx} className="flex items-center"><strong className="w-48 text-gray-700">{key}:</strong> {value || "No disponible"}</p>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Información SIMIT</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-5">
                            {/* Información General */}
                            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Resumen General</h3>
                                <p><strong>Número de Documento:</strong> {simit.numero_documento}</p>
                                <p><strong>Total General:</strong> {simit.total_general.toLocaleString()}</p>
                                <p><strong>Total Multas:</strong> {simit.total_multas.toLocaleString()}</p>
                                <p><strong>Total Multas a Pagar:</strong> {simit.total_multas_pagar.toLocaleString()}</p>
                                <p><strong>Total a Pagar:</strong> {simit.total_pagar.toLocaleString()}</p>
                                <p><strong>Acuerdos por Pagar:</strong> {simit.total_acuardos_por_pagar.toLocaleString()}</p>
                                <p><strong>Paz y Salvo:</strong> {simit.paz_salvo ? "Sí" : "No"}</p>
                            </div>

                            {/* Cursos */}
                            {simit.cursos.length > 0 && (
                                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4">Cursos</h3>
                                    {simit.cursos.map((curso, index) => (
                                        <div key={index} className="mb-4 border-t pt-4">
                                            <p><strong>Centro de Instrucción:</strong> {curso.centro_intruccion}</p>
                                            <p><strong>Certificado:</strong> {curso.certificado}</p>
                                            <p><strong>Ciudad:</strong> {curso.cuidad}</p>
                                            <p><strong>Estado:</strong> {curso.estado}</p>
                                            <p><strong>Fecha Comparendo:</strong> {curso.fecha_comparendo || "No disponible"}</p>
                                            <p><strong>Fecha del Curso:</strong> {curso.fecha_curso}</p>
                                            <p><strong>Fecha de Reporte:</strong> {curso.fecha_reporte}</p>
                                            <p><strong>Número de Multa:</strong> {curso.numero_multa}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Multas */}
                            {simit.multas.length > 0 && (
                                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4">Multas</h3>
                                    {simit.multas.map((multa, index) => (
                                        <div key={index} className="mb-4 border-t pt-4">
                                            <p><strong>Comparendo:</strong> {multa.comparendo ? "Sí" : "No"}</p>
                                            <p><strong>Comparendo Electrónico:</strong> {multa.comparendo_electronico ? "Sí" : "No"}</p>
                                            <p><strong>Consecutivo Comparendo:</strong> {multa.consecutivo_comparendo || "No disponible"}</p>
                                            <p><strong>Departamento:</strong> {multa.departamento}</p>
                                            <p><strong>Estado:</strong> {multa.estado || "No disponible"}</p>
                                            <p><strong>Fecha Comparendo:</strong> {multa.fecha_comparendo}</p>
                                            <p><strong>Fecha Notificación:</strong> {multa.fecha_notificacion || "No disponible"}</p>
                                            <p><strong>Número Comparendo:</strong> {multa.numero_comparendo}</p>
                                            <p><strong>Organismo de Tránsito:</strong> {multa.organismo_transito}</p>
                                            <p><strong>Placa:</strong> {multa.placa}</p>
                                            <p><strong>Total a Pagar:</strong> {multa.total_pagar.toLocaleString()}</p>
                                            <p><strong>Valor Descuento:</strong> {multa.valor_descuento.toLocaleString()}</p>
                                            <p><strong>Valor Descuento Interés:</strong> {multa.valor_descuento_interes.toLocaleString()}</p>
                                            <p><strong>Valor Descuento Pronto Pago:</strong> {multa.valor_descuento_pronto_pago.toLocaleString()}</p>
                                            <p><strong>Valor Interés:</strong> {multa.valor_interes.toLocaleString()}</p>
                                            <p><strong>Valor Multa:</strong> {multa.valor_multa.toLocaleString()}</p>
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

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Información de Ramas</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-5">
                            {Object.entries(rama).map(([cityKey, details], index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
                                    <h3 className="text-lg font-semibold mb-4">{cityKey.replace(/jepms$/, '')}</h3>
                                    {renderCityData(details)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </AuthenticatedLayout >
    );
}

export default Reporte;
