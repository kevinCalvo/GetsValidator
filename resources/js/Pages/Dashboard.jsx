import { CheckboxWithLink } from '@/Components/CheckboxWithLink';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import 'flowbite';
import Swal from 'sweetalert2';

export default function Dashboard({ auth }) {
    const { data, setData, post, processing } = useForm({
        documento: '',
        tipodoc: 'CC',
        date: '',
        value: '',
        name: '',
        acceptedTerms: false,
    });
    const { flash } = usePage().props;
    const [formError, setFormError] = useState(null);
    const { errors } = usePage().props;



    useEffect(() => {
        if (flash && flash.error) {
            setFormError(flash.error);
        }
        if (flash && flash.status === 'success') {
            Swal.close();
        }
    }, [flash]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.acceptedTerms) {
            setFormError('Debes aceptar los términos para continuar.');
            return;
        }
        if (!data.documento) {
            setFormError('El numero de documento es obligatoria.');
            return;
        }

        if (data.tipodoc === 'CE' && !data.date) {
            setFormError('La fecha de expedición es obligatoria para el tipo de documento CE.');
            return;
        }
        if (data.tipodoc === 'PP' && !data.name) {
            setFormError('El nombre es obligatoria para el tipo de documento PP.');
            return;
        }

        Swal.fire({
            imageUrl: "/img/r-Gets.png",
            title: 'Cargando...',
            text: 'Por favor espera mientras generamos tu reporte',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            await post(route("antecedentes"), {
                onSuccess: () => {
                    console.log("enviado");
                    Swal.close();
                },
                onError: (errors) => {
                    Swal.close();
                    console.log("error en validacion");

                    console.log(errors);
                    Swal.fire({
                        icon: 'error',
                        title: 'Errores de validación',
                        html: `
                            <ul>
                                ${Object.values(errors).map(error => `<li>${error}</li>`).join('')}
                            </ul>
                        `,
                    });
                },
            });

        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        };
    };

    const handleCheckboxChange = (event) => {
        setData("acceptedTerms", event.target.checked);
        setFormError(null);
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Consulta por documento</h2>}
        >
            <Head title="Consulta por documento" />

            <div className="py-10">
                <div className="max-w-7xl mx-4 md:mx-auto sm:px-6 lg:px-8  flex gap-x-4">
                    <div className="bg-white p-4 overflow-hidden m-auto md:m-0 shadow-sm rounded-lg">
                        <form method="POST" onSubmit={handleSubmit} className="max-w-sm ">
                            <div className="mb-5">
                                <label htmlFor="documento" className="block mb-2 text-lg font-medium text-gray-900">Documento a Consultar</label>
                                <input
                                    type="text"
                                    id="documento"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Ingrese el numero de documento"
                                    value={data.documento}
                                    onChange={(e) => setData("documento", e.target.value)}
                                />
                            </div>


                            <div className='mb-5'>
                                <label htmlFor="tipodoc" className="block mb-2 text-lg font-medium text-gray-900">Tipo de documento</label>
                                <select value={data.tipodoc} id="tipodoc" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={(e) =>
                                    setData("tipodoc", e.target.value)
                                } >
                                    <option value='CC'>CC (Cédula de Ciudadanía)</option>
                                    <option value='CE'>CE (Cédula de Extranjería)</option>
                                    <option value='PP'>PP (Pasaporte)</option>
                                    <option value='PPT'>PPT (Permiso por Protección Temporal)</option>
                                </select>
                            </div>
                            {(data.tipodoc === 'CC' || data.tipodoc === 'CE') && (
                                <div className="mb-5">
                                    <label htmlFor="date" className="block mb-2 text-lg font-medium text-gray-900">
                                        Fecha de expedición {data.tipodoc === 'CE' ? '(Obligatoria)' : '(Opcional)'}
                                    </label>
                                    <input type="date" id="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={(e) =>
                                        setData("date", e.target.value)
                                    } />
                                </div>
                            )}
                            {(data.tipodoc === 'PP') && (
                                <div className="mb-5">
                                    <label htmlFor="date" className="block mb-2 text-lg font-medium text-gray-900">
                                        Nombre
                                    </label>
                                    <input type="text" id="name" placeholder='Ingrese el nombre' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={(e) =>
                                        setData("name", e.target.value)
                                    } />
                                </div>
                            )}
                            <div>
                                <h3 class="mb-4 font-semibold text-gray-900">Tipo</h3>
                                <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
                                    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                        <div class="flex items-center ps-3">
                                            <input id="vue-radio-list" name="tipo" type="radio" value="visitante" class="w-4 h-4 text-[#9c60b4] bg-gray-100 border-gray-300 " onChange={(e) => setData("value", e.target.value)} />
                                            <label for="vue-radio-list" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">Visitante</label>
                                        </div>
                                    </li>
                                    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                        <div class="flex items-center ps-3">
                                            <input onChange={(e) => setData("value", e.target.value)} id="react-radio-list" name="tipo" type="radio" value="operador" class="w-4 h-4 text-[#9c60b4] bg-gray-100 border-gray-300 " />
                                            <label for="react-radio-list" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">Operador</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className='my-3'>
                                <CheckboxWithLink checked={data.acceptedTerms} onChange={handleCheckboxChange} />
                                {formError && <p className="text-red-500 text-sm">{formError}</p>}

                            </div>
                            <button type="submit" className="text-white bg-[#9c60b4] hover:bg-[#C39BD3] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Generar reporte</button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
