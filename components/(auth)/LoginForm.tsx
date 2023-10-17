"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { BookKey } from 'lucide-react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

export default function AuthForm() {

  async function login() {
    await signIn('azure-ad');
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <CardHeader>
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>
        </CardHeader>
        <CardFooter className="mt-6">
          <Button
          onClick={login}
          variant='outline' className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50">
            <BookKey className="h-5 w-5 text-gray-400"/>
            <span className="ml-4">Sign in with SSO</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
