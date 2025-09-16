"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({children, headerLabel, backButtonLabel,
     backButtonHref, showSocial } : CardWrapperProps) => {
  return (
    <Card className="w-[380px] shadow-md mt-10 md:mt-20 mb-20">
      <CardHeader>
        <Header label={headerLabel}/>
      </CardHeader>
      <CardContent>
      {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
        label={backButtonLabel}
        href={backButtonHref}
        />
      </CardFooter>
      <CardFooter>
      <p className="!text-tiny-medium text-dark-3 dark:text-gray-100">By signing up, you agree to the  <a href="/terms" target="_blank" className="text-blue underline">Terms of Service</a> and <a href="/privacy-policy" target="_blank" className="text-blue underline">Privacy Policy</a></p>
      </CardFooter>
    </Card>
  );
};