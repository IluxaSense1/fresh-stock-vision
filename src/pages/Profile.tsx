
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
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
import { User, Mail, Save } from 'lucide-react';

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const Profile = () => {
  const { toast } = useToast();
  const form = useForm<ProfileData>();
  
  const [profile, setProfile] = React.useState<ProfileData | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/profile/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          form.reset(data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить профиль",
        });
      }
    };

    fetchProfile();
  }, []);

  const onSubmit = async (data: ProfileData) => {
    try {
      const response = await fetch('http://localhost:8000/api/profile/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Профиль обновлен",
          description: "Ваши данные успешно сохранены",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить профиль",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Профиль</h1>
          <p className="text-muted-foreground">
            Управление вашей учетной записью и настройками
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Личные данные</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Фамилия</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить изменения
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
