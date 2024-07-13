import { CheckboxWithLink } from '@/Components/CheckboxWithLink';
import { MultiLevelSidebar } from '@/Components/MultiLevelSidebar';
import Sidebar from '@/Components/Sidebar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import 'flowbite';

export default function PageScanner({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        documento: '',
        tipodoc: 'CC',
        date: '',
        value: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await post(route("antecedentes"), {
                onSuccess: () => {
                    console.log("enviado");
                },
                onError: (errors) => {
                    console.log("error en validacion");
                    console.log(errors);
                },
            });
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        }
    };
    return (
        <AuthenticatedLayout
            user={auth.user}

        >
            <Head title="Consulta Scanner" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-4 overflow-hidden shadow-sm sm:rounded-lg">
                        <form method="POST" onSubmit={handleSubmit} className="max-w-sm ">
                            <div className="mb-5">
                                <label htmlFor="documento" className="block mb-2 text-lg font-medium text-gray-900">Escanear cédula</label>

                                <input type="text" id="documento" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Escanear cédula" onChange={(e) =>
                                    setData("documento", e.target.value)
                                } required />
                            </div>
                            <div>
                                <h3 class="mb-4 font-semibold text-gray-900">Tipo</h3>
                                <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
                                    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                        <div class="flex items-center ps-3">
                                            <input id="vue-radio-list" name="tipo" type="radio" value="visitante" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" onChange={(e) => setData("value", e.target.value)} />
                                            <label for="vue-radio-list" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">Visitante</label>
                                        </div>
                                    </li>
                                    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                        <div class="flex items-center ps-3">
                                            <input onChange={(e) => setData("value", e.target.value)} id="react-radio-list" name="tipo" type="radio" value="operador" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                            <label for="react-radio-list" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">Operador</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className='my-3'>
                                <CheckboxWithLink />

                            </div>

                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Ver reporte</button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
