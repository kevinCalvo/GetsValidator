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
    /* console.log('Data completa:', data); */

    const { rut, runt_app, nombre, registraduria_certificado, peps, peps_consolidado, peps_denon, ofac, ofac_nombre, lista_onu, europol, interpol, procuraduria, contraloria, contaduria, defunciones_registraduria, insolvencias, policia, delitos_sexuales, rut_estado, proveedores_ficticios, juzgados_tyba, contadores_s, simit, rama, sisben, dest, libretamilitar, secop, typedoc } = data;
    const licencias = runt_app?.licencia?.licencias || [];
    const totalLicencias = runt_app?.licencia?.totalLicencias || 0;

    const groupedPeps = groupByCategory(peps || [], 'CATEGORIA');
    const groupedPepsConsolidado = groupByCategory(peps_consolidado || [], 'categoria');
    const groupedPepsDenon = groupByCategory(peps_denon || [], 'CATEGORIA');

    const renderCityData = (details) => {
        if (typeof details === 'boolean') {
            return (
                <div className="p-4 border border-gray-200 rounded-lg  mb-4">
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
                <div className="p-4 border border-gray-200 rounded-lg mb-4">
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

    const generatePDF = (data) => {
        const input = document.getElementById('pdf-content');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageHeight = pdf.internal.pageSize.height;
        const pageWidth = pdf.internal.pageSize.width;
        const margin = 10;
        const contentWidth = pageWidth - 2 * margin;
        const contentHeight = pageHeight - 2 * margin;

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            let imgHeight = (canvas.height * contentWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, imgHeight);
            heightLeft -= contentHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
                heightLeft -= contentHeight;
            }
            const fileName = `${nombre}_reporte.pdf`.replace(/\s+/g, '-');
            pdf.save(fileName);


        });
    };
    const extractDate = (dateString) => {

        const match = dateString.match(/(\d{2}, \w{3} \d{4})/);
        if (match) {
            const date = new Date(match[0]);
            return date.toLocaleDateString();
        }
        return "Fecha no disponible";
    };
    const printDocument = () => {
        window.print();
    };
    const libretaInfo = libretamilitar?.info;
    const cities = [
        'cali',
        'villavicencio',
        'monteria',
        'tunja',
        'cartagena',
        'pasto',
        'palmira',
        'neiva',
        'medellin',
        'manizales',
        'florencia',
        'popayan',
        'buga',
        'bucaramanga',
        'armenia',
        'bogota',
        'ibague',
        'quibdo',
        'barranquilla',
        'ladorada',
        'santamarta',
        'pereira',
        'valledupar',

    ];

    return (
        <div className='bg-gray-200'>
            <Head title="Reporte" />



            <div className="py-4">
                <div className=' max-w-7xl mx-4 md:mx-auto sm:px-6 lg:px-8 flex justify-between  my-3'>
                    <a className='bg-[#C39BD3] h-9 text-sm block p-2 rounded-lg' href={route('dashboard')}>
                        Volver
                    </a>
                    <div className='flex gap-x-2'>

                        {/*  <button onClick={generatePDF} className="bg-[#C39BD3] h-9 text-sm p-2 rounded-lg">Descargar PDF</button> */}
                        <button
                            onClick={printDocument}
                            className="bg-[#C39BD3] h-9 text-sm p-2 rounded-lg"
                        >
                            Imprimir PDF
                        </button>
                    </div>




                </div>
                <div id="pdf-content" className=" max-w-7xl mx-4 md:mx-auto sm:px-6 lg:px-8">
                    <header>
                        <div class="bg-[#C39BD3] border-gray-200 h-auto px-4 rounded-lg lg:px-6 py-2.5">
                            <div class="flex flex-wrap  justify-between items-center mx-auto max-w-screen-xl">
                                <a href="/">
                                    <img src="/img/r-Gets.png" className="block h-9 w-auto fill-current " />
                                </a>
                                <div className='mt-2 md:mt-0'>
                                    <span className='font-extrabold'>Reporte:</span> {nombre} - {(data.defunciones_registraduria && data.defunciones_registraduria.doc) || data.id}
                                    <p className='text-xs md:text-sm'>
                                        <span className='font-extrabold'>Fecha:</span>
                                        {(data.defunciones_registraduria && data.defunciones_registraduria.date) || extractDate(data.fecha)}
                                    </p>
                                </div>

                            </div>

                        </div>
                    </header>
                    <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">

                        <p className="text-xl font-semibold mb-5">{nombre ? nombre : 'No se pudo identificar'}</p>

                        <div className="grid grid-cols-1  md:grid-cols-4  lg:grid-cols-7 gap-4 mb-5">
                            <div className="flex gap-2 flex-col">
                                <p className="font-semibold">{typedoc}:</p>
                                {(data.defunciones_registraduria && data.defunciones_registraduria.doc) || data.id}
                            </div>
                            {data.Estado && (
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Estado:</p>
                                    <p>{data.Estado}</p>
                                </div>
                            )}
                            <div className="flex gap-2 flex-col">
                                <p className='font-semibold'>RUT:</p>
                                <p>{rut ? rut : 'No encontrado'}</p>
                            </div>
                            <div className="flex gap-2 flex-col">
                                <p className='font-semibold'>RUT Estado:</p>
                                <p>{data.rut_estado ? data.rut_estado : 'No encontrado'}</p>
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
                                <p>{(data.defunciones_registraduria && data.defunciones_registraduria.date) || extractDate(data.fecha)}</p>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Registraduría Nacional del Estado Civil</p>
                        {registraduria_certificado === "Error" ? (
                            <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-600">
                                La fuente de consulta presenta indisponibilidad.
                            </div>
                        ) : registraduria_certificado ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="font-semibold">Cédula:</p>
                                    <p>{registraduria_certificado.cedula}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className="font-semibold">Fecha de Expedición:</p>
                                    <p>{registraduria_certificado.fecha_exp}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className="font-semibold">Lugar de Expedición:</p>
                                    <p>{registraduria_certificado.lugar_exp}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className="font-semibold">Nombre:</p>
                                    <p>{registraduria_certificado.nombre}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className="font-semibold">Estado:</p>
                                    <p>{registraduria_certificado.estado}</p>
                                </div>
                            </div>
                        ) : (
                            <p className='text-gray-500'>No se encontró registros.</p>
                        )}
                    </div>

                    {groupedPeps && (
                        <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Listas y Personas Expuestas Políticamente (PEPs)</p>
                            {Object.keys(groupedPeps).length === 0 ? (
                                <p className='text-gray-500'>No se encontraron registros.</p>
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
                        <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
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
                        <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Lista Clinton (OFAC), Búsqueda por Documento</p>
                            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="text-gray-500">{ofac ? ofac : "No registra en la fuente"}</p>
                                </div>

                            </div>
                        </div>
                    )}
                    {ofac_nombre && (
                        <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
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
                        <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
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
                        <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
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
                        <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
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
                        <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">
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
                        <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
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
                        <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Contaduría General de la Nación</p>
                            {contaduria === "Error" ? (
                                <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-600">
                                    La fuente de consulta presenta indisponibilidad.
                                </div>
                            ) : contaduria ? (
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
                        <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Defunciones Registraduria</p>
                            <div className="grid grid-cols-1  md:grid-cols-3  lg:grid-cols-3 gap-4 mb-5">
                                <div className="flex gap-2 flex-col">
                                    <p className="font-semibold">Documento:</p>
                                    <p>{defunciones_registraduria.doc}</p>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Fecha de consulta:</p>
                                    {/* <p>{defunciones_registraduria.date}</p> */}
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <p className='font-semibold'>Estado</p>
                                    <p>{defunciones_registraduria.validity}</p>
                                </div>

                            </div>
                        </div>
                    )}
                    {insolvencias && (
                        <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">
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

                    <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Policía Nacional de Colombia
                        </p>
                        <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-5 gap-4 mb-5">
                            <div className="flex gap-2 flex-col">
                                <p className="text-gray-500">{policia ? policia : "No registra en la fuente"}</p>
                            </div>

                        </div>
                    </div>
                    {delitos_sexuales && (
                        <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">
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
                    <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Registro Único Tributario (RUT)
                        </p>
                        <div className="grid grid-cols-1  md:grid-cols-1  lg:grid-cols-1 gap-4 mb-5">
                            <div className="flex gap-2 flex-col">
                                <p className="">{rut ? rut : "No registra en la fuente"} - {rut_estado}</p>
                            </div>

                        </div>
                    </div>
                    <div className="bg-white overflow-hidden  mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">DIAN (Proveedores ficticios)
                        </p>
                        <div className="grid grid-cols-1  md:grid-cols-1  lg:grid-cols-1 gap-4 mb-5">
                            <div className="flex gap-2 flex-col">
                                <p className="text-gray-500">{proveedores_ficticios ? proveedores_ficticios : "No registra en la fuente"}</p>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Juzgados Tyba - Justicia XXI</p>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-5">
                            {(!Array.isArray(juzgados_tyba) || juzgados_tyba.length === 0) ? (
                                <p className='text-gray-500'>No registra en la fuente</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                                    {juzgados_tyba.map((item, index) => (
                                        <div key={index} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg">
                                            {/* Información básica del proceso */}
                                            <div className="space-y-2">
                                                <p><strong>Clase Proceso:</strong> {item["CLASE PROCESO"] || "No disponible"}</p>
                                                <p><strong>Código Proceso:</strong> {item["CODIGO PROCESO"] || "No disponible"}</p>
                                                <p><strong>Despacho:</strong> {item["DESPACHO"] || "No disponible"}</p>
                                                <p><strong>Proceso Privado:</strong> {item["proceso_privado"] ? "Sí" : "No"}</p>
                                            </div>

                                            {/* Información adicional si existe */}
                                            {item["INFO PROCES0"] && typeof item["INFO PROCES0"] === 'object' && (
                                                <div className="mt-4 border-t pt-4">
                                                    <p className="font-semibold text-lg">Información Adicional:</p>

                                                    {/* Información general */}
                                                    {Object.entries(item["INFO PROCES0"]).map(([key, value], idx) => (
                                                        key !== 'actuaciones' && key !== 'sujetos' ? (
                                                            <p key={idx} className="flex items-center">
                                                                <strong className="w-48 text-gray-700">{key}:</strong> {value || "No disponible"}
                                                            </p>
                                                        ) : null
                                                    ))}

                                                    {/* Actuaciones */}
                                                    {item["INFO PROCES0"]["actuaciones"] && Array.isArray(item["INFO PROCES0"]["actuaciones"]) && item["INFO PROCES0"]["actuaciones"].length > 0 && (
                                                        <div className="mt-4">
                                                            <p className="font-semibold text-lg">Actuaciones:</p>
                                                            {item["INFO PROCES0"]["actuaciones"].map((actuacion, actIndex) => (
                                                                <div key={actIndex} className="border-t pt-2">
                                                                    {Object.entries(actuacion).map(([key, value], idx) => (
                                                                        <p key={idx} className="flex items-center">
                                                                            <strong className="w-48 text-gray-700">{key}:</strong> {value || "No disponible"}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Sujetos */}
                                                    {item["INFO PROCES0"]["sujetos"] && Array.isArray(item["INFO PROCES0"]["sujetos"]) && item["INFO PROCES0"]["sujetos"].length > 0 && (
                                                        <div className="mt-4">
                                                            <p className="font-semibold text-lg">Sujetos:</p>
                                                            {item["INFO PROCES0"]["sujetos"].map((sujeto, subjIndex) => (
                                                                <div key={subjIndex} className="border-t pt-2">
                                                                    {Object.entries(sujeto).map(([key, value], idx) => (
                                                                        <p key={idx} className="flex items-center">
                                                                            <strong className="w-48 text-gray-700">{key}:</strong> {value || "No disponible"}
                                                                        </p>
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

                    <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Información SIMIT</p>
                        {/* Verifica si `simit` tiene un error */}
                        {simit && simit === 'Error' ? (
                            <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-600">
                                La fuente de consulta presenta indisponibilidad.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-5">
                                {/* Información General */}
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">Resumen General</h3>
                                    <p><strong>Número de Documento:</strong> {simit.numero_documento || "No disponible"}</p>
                                    <p><strong>Total General:</strong> {simit.total_general ? simit.total_general.toLocaleString() : "No disponible"}</p>
                                    <p><strong>Total Multas:</strong> {simit.total_multas ? simit.total_multas.toLocaleString() : "No disponible"}</p>
                                    <p><strong>Total Multas a Pagar:</strong> {simit.total_multas_pagar ? simit.total_multas_pagar.toLocaleString() : "No disponible"}</p>
                                    <p><strong>Total a Pagar:</strong> {simit.total_pagar ? simit.total_pagar.toLocaleString() : "No disponible"}</p>
                                    <p><strong>Acuerdos por Pagar:</strong> {simit.total_acuardos_por_pagar ? simit.total_acuardos_por_pagar.toLocaleString() : "No disponible"}</p>
                                    <p><strong>Paz y Salvo:</strong> {simit.paz_salvo ? "Sí" : "No"}</p>
                                </div>

                                {/* Cursos */}
                                {simit.cursos && simit.cursos.length > 0 && (
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-4">Cursos</h3>
                                        {simit.cursos.map((curso, index) => (
                                            <div key={index} className="mb-4 border-t pt-4">
                                                <p><strong>Centro de Instrucción:</strong> {curso.centro_intruccion || "No disponible"}</p>
                                                <p><strong>Certificado:</strong> {curso.certificado || "No disponible"}</p>
                                                <p><strong>Ciudad:</strong> {curso.cuidad || "No disponible"}</p>
                                                <p><strong>Estado:</strong> {curso.estado || "No disponible"}</p>
                                                <p><strong>Fecha Comparendo:</strong> {curso.fecha_comparendo || "No disponible"}</p>
                                                <p><strong>Fecha del Curso:</strong> {curso.fecha_curso || "No disponible"}</p>
                                                <p><strong>Fecha de Reporte:</strong> {curso.fecha_reporte || "No disponible"}</p>
                                                <p><strong>Número de Multa:</strong> {curso.numero_multa || "No disponible"}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Multas */}
                                {simit.multas && simit.multas.length > 0 && (
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-4">Multas</h3>
                                        {simit.multas.map((multa, index) => (
                                            <div key={index} className="mb-4 border-t pt-4">
                                                <p><strong>Comparendo:</strong> {multa.comparendo ? "Sí" : "No"}</p>
                                                <p><strong>Comparendo Electrónico:</strong> {multa.comparendo_electronico ? "Sí" : "No"}</p>
                                                <p><strong>Consecutivo Comparendo:</strong> {multa.consecutivo_comparendo || "No disponible"}</p>
                                                <p><strong>Departamento:</strong> {multa.departamento || "No disponible"}</p>
                                                <p><strong>Estado:</strong> {multa.estado || "No disponible"}</p>
                                                <p><strong>Fecha Comparendo:</strong> {multa.fecha_comparendo || "No disponible"}</p>
                                                <p><strong>Fecha Notificación:</strong> {multa.fecha_notificacion || "No disponible"}</p>
                                                <p><strong>Número Comparendo:</strong> {multa.numero_comparendo || "No disponible"}</p>
                                                <p><strong>Organismo de Tránsito:</strong> {multa.organismo_transito || "No disponible"}</p>
                                                <p><strong>Placa:</strong> {multa.placa || "No disponible"}</p>
                                                <p><strong>Total a Pagar:</strong> {multa.total_pagar ? multa.total_pagar.toLocaleString() : "No disponible"}</p>
                                                <p><strong>Valor Descuento:</strong> {multa.valor_descuento ? multa.valor_descuento.toLocaleString() : "No disponible"}</p>
                                                <p><strong>Valor Descuento Interés:</strong> {multa.valor_descuento_interes ? multa.valor_descuento_interes.toLocaleString() : "No disponible"}</p>
                                                <p><strong>Valor Descuento Pronto Pago:</strong> {multa.valor_descuento_pronto_pago ? multa.valor_descuento_pronto_pago.toLocaleString() : "No disponible"}</p>
                                                <p><strong>Valor Interés:</strong> {multa.valor_interes ? multa.valor_interes.toLocaleString() : "No disponible"}</p>
                                                <p><strong>Valor Multa:</strong> {multa.valor_multa ? multa.valor_multa.toLocaleString() : "No disponible"}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Contadores sancionados</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-5">
                            {Array.isArray(contadores_s) && contadores_s.length === 0 ? (
                                <p className='text-gray-500'>No registra en la fuente</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">
                                    {Array.isArray(contadores_s) && contadores_s.map((item, index) => (
                                        <div key={index} className="flex gap-2 flex-col">
                                            <p>{item || "No disponible"}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden mt-4 sm:rounded-lg p-6">
                        <p className="text-xl font-semibold mb-5">Información de Ramas</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-5">
                            {rama && typeof rama === 'object' && Object.keys(rama).length > 0 ? (
                                Object.entries(rama).map(([cityKey, details], index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
                                        <h3 className="text-lg font-semibold mb-4">{cityKey.replace(/jepms$/, '')}</h3>
                                        {renderCityData(details)}
                                    </div>
                                ))
                            ) : (
                                <p className='text-gray-500'>No hay información disponible</p>
                            )}
                        </div>
                    </div>

                    {sisben ? (
                        Object.keys(sisben).length > 0 ? (
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-xl font-semibold mb-5">Información de SISBEN</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Nombre:</p>
                                        <p>{sisben.Nombre}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Apellido:</p>
                                        <p>{sisben.Apellido}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Ficha:</p>
                                        <p>{sisben.Ficha}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Departamento:</p>
                                        <p>{sisben.Departamento}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Municipio:</p>
                                        <p>{sisben.Municipio}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Estado:</p>
                                        <p>{sisben.Estado}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Grupo:</p>
                                        <p>{sisben.Grupo}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Tipo de grupo:</p>
                                        <p>{sisben['Tipo de grupo']}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Actualización Ciudadano:</p>
                                        <p>{sisben['Actualizacion Ciudadano']}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-xl font-semibold mb-5">Información de SISBEN</p>
                                <p>No registra en la fuente</p>
                            </div>
                        )
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Información de SISBEN</p>
                            <p>No registra en la fuente</p>
                        </div>
                    )}
                    {secop ? (
                        Object.keys(secop).length > 0 ? (
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-xl font-semibold mb-5">Contratación Pública en SECOP</p>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Nombre Del Represen Legal:</p>
                                        <p>{secop.nombre_del_represen_legal}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Nombre De La Entidad:</p>
                                        <p>{secop.nombre_de_la_entidad}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Detalle Del Objeto A Contratar:</p>
                                        <p>{secop.detalle_del_objeto_a_contratar}</p>
                                    </div>

                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Cuantia Proceso:</p>
                                        <p>{secop.cuantia_proceso}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Estado Del Proceso:</p>
                                        <p>{secop.estado_del_proceso}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Tipo De Contrato:</p>
                                        <p>{secop.tipo_de_contrato}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Tipo De Proceso:</p>
                                        <p>{secop.tipo_de_proceso}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Url Proceso En Secop:</p>
                                        <p>{secop.url_proceso_en_secop}</p>
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <p className="font-semibold">Fecha De Firma Del Contrato:</p>
                                        <p>{secop.fecha_de_firma_del_contrato}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-xl font-semibold mb-5">Contratación Pública en SECOP</p>
                                <p>No registra en la fuente</p>
                            </div>
                        )
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Contratación Pública en SECOP</p>
                            <p>No registra en la fuente</p>
                        </div>
                    )}
                    {libretamilitar ? (
                        Object.keys(libretamilitar).length > 0 ? (
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-xl font-semibold mb-5">Libreta Militar</p>
                                {libretaInfo ? (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                                        <p className="font-bold">Información Importante:</p>
                                        <p>{libretaInfo}</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                                        <div className="flex gap-2 flex-col">
                                            <p className="font-semibold">Nombre:</p>
                                            <p>{libretamilitar.nombre}</p>
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <p className="font-semibold">Documento:</p>
                                            <p>{libretamilitar.documento}</p>
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <p className="font-semibold">Tipo de Documento:</p>
                                            <p>{libretamilitar.tipo_documento}</p>
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <p className="font-semibold">Clase:</p>
                                            <p>{libretamilitar.clase}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-xl font-semibold mb-5">Libreta Militar</p>
                                <p>No registra en la fuente</p>
                            </div>
                        )
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Libreta Militar</p>
                            <p>No registra en la fuente</p>
                        </div>
                    )}

                    {dest ? (
                        <div>

                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Evidencias</p>
                                <p className="text-2xl font-semibold mb-5">Antecedentes Juduciales</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/policia.jpg`}
                                        alt="Imagen"
                                        className="w-[70%]   mt-2"
                                    />
                                </div>

                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Instituto Nacional Penitenciario y Carcelario (INPEC)</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/inpec.jpg`}
                                        alt="Imagen"
                                        className="w-[70%]   mt-2"
                                    />
                                </div>

                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Procuraduría General de la Nación (Consulta en Línea)</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/procuraduria.jpg`}
                                        alt="Imagen"
                                        className="w-[70%]   mt-2"
                                    />
                                </div>

                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Lista Clinton (OFAC), Búsqueda por Documento</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/ofac.jpg`}
                                        alt="Imagen"
                                        className="w-[70%]   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Lista Clinton (OFAC), Búsqueda por nombre</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/ofac_nombre.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Consejo de Seguridad de la Naciones Unidas (ONU)</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/onu.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Organización Internacional de Policía Criminal (INTERPOL)</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/interpol.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">European Union Most Wanted List (EUROPOL)</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/europol.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">CIDOB Peps nivel mundial</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/cidob.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Libreta militar</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/libretamilitar.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Juzgados Tyba - Justicia XXI</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/tyba.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">
                                    Juzgados de Ejecución de Penas y Medidas de Seguridad (JEPMS)
                                </p>
                                <div className="flex justify-center flex-col items-center">
                                    {cities.map((city) => (
                                        <div key={city} className="flex justify-center items-center flex-col mb-4">
                                            <p className="text-2xl font-semibold mb-2">{city.charAt(0).toUpperCase() + city.slice(1)}</p>
                                            <img
                                                src={`https://static.tusdatos.co/${dest}/${city}jepms.jpg`}
                                                alt={`Imagen de ${city}`}
                                                className="mt-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Contaduría General de la Nación</p>
                                {contaduria && contaduria === 'Error' ? (
                                    <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-600">
                                        La fuente de consulta presenta indisponibilidad.
                                    </div>
                                ) : (
                                    <div className='flex justify-center items-center'>
                                        <img
                                            src={`https://static.tusdatos.co/${dest}/contaduria.jpg`}
                                            alt="Imagen"
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Contraloría General de la República (Consulta en Línea)</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/contraloria.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Defunciones Registraduria</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/defunciones_registraduria.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">Sistema Integrado de Multas y Sanciones de Tránsito (SIMIT)</p>
                                {simit && simit === "Error" ? (
                                    <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-600">
                                        La fuente de consulta presenta indisponibilidad.
                                    </div>
                                ) : (
                                    <div className='flex justify-center items-center'>
                                        <img
                                            src={`https://static.tusdatos.co/${dest}/simit.jpg`}
                                            alt="Imagen"
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                                <p className="text-2xl font-semibold mb-5">RUT (Registro Único Tributario)</p>
                                <div className='flex justify-center items-center'>
                                    <img
                                        src={`https://static.tusdatos.co/${dest}/rut.jpg`}
                                        alt="Imagen"
                                        className="   mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm mt-4 sm:rounded-lg p-6">
                            <p className="text-xl font-semibold mb-5">Imagen</p>
                            <p>No hay imagen disponible</p>
                        </div>
                    )}

                </div>


            </div>
        </div >
    );
}

export default Reporte;
