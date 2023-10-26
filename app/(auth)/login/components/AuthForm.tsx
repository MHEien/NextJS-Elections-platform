"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardFooter, CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { BookKey } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui';

export default function AuthForm() {

  const [email, setEmail] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const { toast } = useToast();

  const login = async () => {
    signIn('email', { email }, { callbackUrl: `${window.location.origin}/vote` });
  }
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const params = new URLSearchParams(window.location.search);
      const error = params.get('error');

      if (error) {
        toast({
          title: 'Access Denied',
          variant: "destructive",
          description: 'You have not been invited to any elections yet. If this is an oversight, please contact your Administrator or Control Committee.'
        });
      }
    }
  }, [isMounted, toast]);

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
        <CardHeader>
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to vote
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Label>
            Email
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
          </Label>
        </CardContent>
        <CardFooter className="mt-6">
          <Button
          onClick={login}
          variant='outline' className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50">
            <BookKey className="h-5 w-5 text-gray-400"/>
            <span className="ml-4">Send login link</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}