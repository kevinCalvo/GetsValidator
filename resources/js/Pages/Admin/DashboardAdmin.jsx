
import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head, useForm, Link, usePage } from "@inertiajs/react";

const DashboardAdmin = ({ auth, plans, queries, users }) => {
    return (
        <AuthenticatedLayoutAdmin
            user={auth.user}
        >
            <Head title="Admin" />

            <div className="py-10">
                <div className="max-w-7xl mx-4 md:mx-auto sm:px-6 lg:px-8 sm:w-full flex sm:flex-col md:flex-row  gap-4">
                    <div className="bg-white   overflow-hidden sm:w-full md:w-1/2 shadow-sm rounded-lg">
                        <h1 className=" bg-[#C39BD3] text-base p-4 md:text-xl  font-bold ">Resumen del Plan</h1>
                        <ul className='p-4'>
                            {plans && plans.map((plan, index) => (
                                <li key={index} className="mb-4">
                                    <div className="text-base"><strong>Consultas Disponibles:</strong> {plan.amount}</div>
                                    <div className="text-base"><strong>Consultas Realizadas:</strong> {plan.purchase_amount - plan.amount}</div>
                                    <div className="text-base"><strong>Consultas del Plan:</strong> {plan.purchase_amount}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white  overflow-hidden sm:w-full md:w-1/2  rounded-lg">

                        <h1 className="bg-[#C39BD3]  text-base md:text-xl  font-bold p-4 ">Total de Usuarios registrados</h1>

                        <h1 className='p-4'>{users}</h1>
                    </div>
                </div>
            </div>
        </AuthenticatedLayoutAdmin>
    )
}

export default DashboardAdmin
