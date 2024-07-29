
import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head, useForm, Link, usePage, router } from "@inertiajs/react";



const IndexUserAdmin = ({ auth, users }) => {
    const handleDelete = (id) => {
        if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
            router.delete(route("DeleteUser.admin", id));
        }
    };
    return (
        <AuthenticatedLayoutAdmin
            user={auth.user}
        >
            <Head title="Admin" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 sm:w-full flex sm:flex-col md:flex-row  gap-4">

                    <div className="bg-white p-4 overflow-hidden w-full shadow-sm sm:rounded-lg">
                        <div className='flex justify-between mb-4'>
                            <h3 className="text-lg font-semibold ">Usuarios</h3>
                            <Link className='bg-[#C39BD3] p-2 rounded-lg font-bold' href={route('CreateUser.admin')}>Crear Ususario</Link>
                        </div>

                        {users.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border-b">Nombre</th>
                                            <th className="px-4 py-2 border-b">Correo</th>
                                            <th className="px-4 py-2 border-b">Fecha del registro</th>
                                            <th className="px-4 py-2 border-b">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr className='text-center' >
                                                <td className="px-4 py-3 border-b">{user.name}</td>
                                                <td className="px-4 py-3 border-b">{user.email}</td>
                                                <td className="px-4 py-3 border-b">
                                                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 border-b">
                                                    <Link /* href={route('planesedit.admin', [user.id])} */>
                                                        <box-icon color="purple" name='edit'></box-icon>
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id
                                                            )
                                                        }
                                                    >
                                                        <box-icon
                                                            color="red"
                                                            name="trash"
                                                        ></box-icon>
                                                    </button>

                                                </td>
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
        </AuthenticatedLayoutAdmin >
    )
}

export default IndexUserAdmin
