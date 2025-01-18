'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import api from '@/app/api/api';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Alert from '@mui/material/Alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [erroMsg, setMensagem] = useState('');
    const router = useRouter();
    const { setUser } = useAuth();
    const { toast: shadToast } = useToast();
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api('/user/login', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    senha: password,
                }),
            });

            const data = await res.json();

            if (data.user && data.message === 'Login bem-sucedido') {
                setUser(data.user);
                toast.success('Login realizado com sucesso!');
                router.push('/dashboard');
            } else {
                setMensagem('Email ou senha incorretos');
                toast.error(data.message || 'Email ou senha incorretos');
            }
        } catch (error) {
            setMensagem('Erro ao conectar com o servidor');
            toast.error('Erro ao conectar com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCadastro = (e: React.FormEvent) => {
        e.preventDefault();
        shadToast({
            title: 'Sucesso',
            description: 'Cadastro realizado',
        });
    };

    const handleRecuperarSenha = (e: React.FormEvent) => {
        e.preventDefault();
        shadToast({
            title: 'Sucesso',
            description: 'Email de recuperação enviado',
        });
    };

    const cardBgColor = isDarkMode ? 'bg-zinc-900' : 'bg-gray-100';
    const textColor = isDarkMode ? 'text-white' : 'text-zinc-900';
    const inputBgColor = isDarkMode ? 'bg-zinc-700' : 'bg-white';
    const inputBorderColor = isDarkMode ? 'border-zinc-600' : 'border-gray-300';
    const placeholderTextColor = isDarkMode ? 'placeholder:text-zinc-400' : 'placeholder:text-gray-500';
    const buttonBgColor = isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
    const alertBgColor = isDarkMode ? '#212121' : '#f0f0f0';
    const linkTextColor = isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700';
    const dialogBgColor = isDarkMode ? 'bg-zinc-800' : 'bg-white';


    return (
        <div className={`relative flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-zinc-900'}`}>
         <div className="absolute top-4 right-4 flex items-center">
           <span className="mr-2 text-sm text-gray-500">Modo Claro</span>
          <Switch  onCheckedChange={toggleTheme} checked={!isDarkMode} />
        </div>
               <Card className={`w-[400px] ${cardBgColor} ${textColor}`}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl text-center font-bold">ConstruERP</CardTitle>
        <p className="text-zinc-400 text-center text-sm">Sistema de Gestão para Construção</p>

      </CardHeader>
      <CardContent>
                    {erroMsg && (
                        <Alert severity="error" variant="filled" sx={{ backgroundColor: alertBgColor, color: isDarkMode ? '#fff' : '#000' }}>
                            {' '}
                            {erroMsg}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            {/* <Label htmlFor="email">Email</Label> */}
                            <Input
                                id="email"
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                className={`${inputBgColor} ${inputBorderColor} ${textColor} ${placeholderTextColor}`}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            {/* <Label htmlFor="password">Senha</Label> */}
                            <Input
                                id="password"
                                type="password"
                                className={`${inputBgColor} ${inputBorderColor} ${textColor} ${placeholderTextColor}`}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="rememberMeCheck"
                                    disabled={isLoading}
                                    className={`ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 border-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500 ${isDarkMode ? '' : 'border-gray-400' }`}
                                />
                                <Label htmlFor="rememberMeCheck" className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                                    Lembrar minha senha
                                </Label>
                            </div>
                        </div>
                        <Button type="submit" className={`w-full ${buttonBgColor} text-white`} disabled={isLoading}>
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>
                    <div className="mt-4 flex items-center justify-between">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className={`text-sm ${linkTextColor}`}>
                                    Cadastre-se
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={`${dialogBgColor} ${textColor}`}>
                                <DialogHeader>
                                    <DialogTitle>Criar Conta</DialogTitle>
                                    <DialogDescription>Preencha os dados abaixo para criar sua conta.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCadastro} className="space-y-4">
                                    <Input placeholder="Nome" className={`${inputBgColor} ${inputBorderColor} ${textColor} ${placeholderTextColor}`} />
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        className={`${inputBgColor} ${inputBorderColor} ${textColor} ${placeholderTextColor}`}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Senha"
                                        className={`${inputBgColor} ${inputBorderColor} ${textColor} ${placeholderTextColor}`}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Confirmar Senha"
                                        className={`${inputBgColor} ${inputBorderColor} ${textColor} ${placeholderTextColor}`}
                                    />
                                    <Button type="submit" className={`w-full ${buttonBgColor} text-white`}>
                                        Criar Conta
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className={`text-sm ${linkTextColor}`}>
                                    Esqueci minha senha
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={`${dialogBgColor} ${textColor}`}>
                                <DialogHeader>
                                    <DialogTitle>Recuperar Senha</DialogTitle>
                                    <DialogDescription>Digite seu email para receber as instruções de recuperação.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleRecuperarSenha} className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        className={`${inputBgColor} ${inputBorderColor} ${textColor} ${placeholderTextColor}`}
                                    />
                                    <Button type="submit" className={`w-full ${buttonBgColor} text-white`}>
                                        Enviar
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
           <Toaster position="bottom-right" />
        </div>
    );
}