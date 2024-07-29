
import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import { useEffect } from 'react';

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';


const CreateUserAdmin = ({ auth, users }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('StoreUser.admin'));
    };
    return (
        <AuthenticatedLayoutAdmin
            user={auth.user}
        >


            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 sm:w-full flex sm:flex-col md:flex-row  gap-4">

                    <div className="bg-white p-4 overflow-hidden w-full shadow-sm sm:rounded-lg">
                        <h1 className='text-xl mb-4 font-bold'>Registrar Usuario</h1>
                        <form className='' onSubmit={submit}>
                            <div className='flex md:flex-row sm:flex-col gap-3 w-full md:w-[80%]'>


                                <div className='w-full md:w-1/2'>
                                    <div>
                                        <InputLabel htmlFor="name" value="Nombre" />

                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />

                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel htmlFor="email" value="Correo" />

                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />

                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                </div>
                                <div className='w-full md:w-1/2'>


                                    <div className="">
                                        <InputLabel htmlFor="password" value="Contraseña" />

                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />

                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />

                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                        />

                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </div>
                                </div>

                            </div>
                            <div className="flex gap-x-3  mt-4">

                                <PrimaryButton className="" disabled={processing}>
                                    Registrar
                                </PrimaryButton>
                                <Link className='inline-flex items-center px-4 py-2 bg-[#9c60b4] hover:bg-[#C39BD3]  border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest  active:bg-[#9c60b4] transition ease-in-out duration-150' href={route('indexUser.admin')}> Volver</Link>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayoutAdmin >
    )
}

export default CreateUserAdmin
