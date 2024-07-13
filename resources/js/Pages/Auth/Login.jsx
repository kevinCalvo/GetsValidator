import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { AiOutlineTwitter } from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";

export default function Login({ canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <section section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0" >
            <div className="md:w-1/3 max-w-sm">
                <img
                    src="/img/logo.png"

                />
            </div>
            <div className="md:w-1/3 max-w-sm">
                <div className="text-center my-2 ">
                    <label className="mr-1 text-3xl font-bold">Gets Validator</label>

                </div>
                <form onSubmit={submit}>
                    <div>
                        <input
                            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
                            placeholder="Correo electrónico"
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <input
                            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
                            placeholder="Contraseña"
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="block mt-4">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600">Recuérdame</span>
                        </label>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                ¿Ha olvidado su contraseña?

                            </Link>
                        )}

                        <PrimaryButton className="ms-4" disabled={processing}>
                            iniciar sesión
                        </PrimaryButton>
                    </div>

                </form>
            </div>
        </section >

    );
}
