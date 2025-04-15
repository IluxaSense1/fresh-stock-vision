
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Lock, LogIn } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.token);
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в систему",
        });
        navigate('/');
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка входа",
          description: "Неверное имя пользователя или пароль",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Проблема с подключением к серверу",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
          <CardDescription>
            Введите свои учетные данные для доступа к системе управления складом
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Войти
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
