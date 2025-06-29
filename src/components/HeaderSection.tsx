'use client'

import { FileText, User, LogOut } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeaderSection() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <header className="relative flex justify-between items-center py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-md w-full">

        <div className='flex items-center space-x-2 font-bold'>
          <FileText className="w-6 h-6 hover:rotate-12 transition-transform duration-300" />
          <Link href="/dashboard">Read2Recap</Link>
        </div>
        <div className='text-gray-500'>
          <Link href="/dashboard/summaries">Your Summaries</Link>
        </div>
        <div>
          <Popover>
            <PopoverTrigger>
              <div className='flex items-center space-x-2 cursor-pointer'>
                <User className="w-4 h-4 hover:rotate-12 transition-transform duration-300" />
                <span className='text-gray-500'>{session?.user?.name}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className='w-40'>
              <div className='flex items-center space-x-2 cursor-pointer' onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </div>
            </PopoverContent>
          </Popover>
        </div>

      </header>
    );
}