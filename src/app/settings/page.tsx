
'use client';

import { useEffect, useState, useRef } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface SettingsData {
    name: string;
    email: string;
    phone: string;
    web: string;
    area: string;
    template: string;
    themeColor: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [web, setWeb] = useState('');
  const [area, setArea] = useState('');
  const [template, setTemplate] = useState('classic');
  const [themeColor, setThemeColor] = useState('#F39C12');

  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    if (user) {
      const fetchSettings = async () => {
        const settingsDocRef = doc(db, 'settings', user.uid);
        const docSnap = await getDoc(settingsDocRef);

        if (docSnap.exists()) {
          const settings = docSnap.data() as SettingsData;
          setName(settings.name || '');
          setEmail(settings.email || '');
          setPhone(settings.phone || '');
          setWeb(settings.web || '');
          setArea(settings.area || '');
          setTemplate(settings.template || 'classic');
          setThemeColor(settings.themeColor || '#F39C12');
        } else {
            // Set name from auth if available and settings are new
            setName(user.displayName || '');
            setEmail(user.email || '');
        }
      };
      fetchSettings();
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in to save settings.' });
        return;
    }
    setIsSaving(true);
    try {
      const settingsDocRef = doc(db, 'settings', user.uid);
      const settingsData: Omit<SettingsData, 'logo'> = {
        name, email, phone, web, area, template, themeColor
      };
      await setDoc(settingsDocRef, settingsData, { merge: true });
      toast({
        title: 'Settings Saved!',
        description: 'Your information has been updated.',
      });
    } catch (error) {
       console.error("Failed to save settings to Firestore", error);
       toast({
         variant: 'destructive',
         title: 'Error saving settings',
         description: 'Could not save settings. Please try again.',
       });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
          <p className="text-muted-foreground">Manage your account and branding settings.</p>
        </header>
        
        <Card>
          <CardHeader>
            <CardTitle>Invoice Template</CardTitle>
            <CardDescription>Choose the design and theme for your invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <Label>Template</Label>
                <RadioGroup value={template} onValueChange={setTemplate} className="mt-2 grid grid-cols-2 gap-4">
                  <Label className="border rounded-md p-2 flex flex-col items-center gap-2 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="classic" id="classic"/>
                    <div className="border rounded-md p-2 w-full aspect-[1/1.41] bg-white overflow-hidden">
                      {/* Classic Template Preview */}
                      <div className="flex justify-between items-start">
                        <div className="w-1/3 space-y-1">
                           <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
                           <div className="h-2 w-full rounded-sm bg-gray-400"></div>
                           <div className="h-1 w-3/4 rounded-sm bg-gray-300"></div>
                        </div>
                        <div className="w-1/3 text-right space-y-1">
                          <div className="h-3 w-full rounded-sm bg-gray-400"></div>
                          <div className="h-1 w-1/2 ml-auto rounded-sm bg-gray-300"></div>
                          <div className="h-1 w-2/3 ml-auto rounded-sm bg-gray-300"></div>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full" style={{backgroundColor: themeColor}}></div>
                      <div className="mt-4 h-2 w-1/4 rounded-sm bg-gray-400"></div>
                      <div className="mt-2 h-1 w-1/3 rounded-sm bg-gray-300"></div>
                      <div className="mt-4 space-y-1">
                        <div className="h-4 w-full flex items-center p-1" style={{backgroundColor: themeColor}}><div className="h-2 w-full bg-white/80 rounded-sm"></div></div>
                        <div className="h-3 w-full bg-gray-100 border-b border-gray-200"></div>
                        <div className="h-3 w-full bg-gray-100 border-b border-gray-200"></div>
                      </div>
                    </div>
                    <span className="font-semibold mt-2">Classic</span>
                  </Label>
                   <Label className="border rounded-md p-2 flex flex-col items-center gap-2 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="modern" id="modern"/>
                     <div className="border rounded-md p-2 w-full aspect-[1/1.41] bg-white overflow-hidden">
                      {/* Modern Template Preview */}
                      <div className="flex justify-between items-start">
                        <div className="w-1/3 space-y-1">
                           <div className="w-6 h-6 rounded-md bg-gray-200"></div>
                           <div className="h-2 w-full rounded-sm bg-gray-400"></div>
                           <div className="h-1 w-3/4 rounded-sm bg-gray-300"></div>
                        </div>
                        <div className="w-1/3 text-right space-y-1">
                          <div className="h-3 w-full rounded-sm" style={{backgroundColor: themeColor}}></div>
                          <div className="h-1 w-1/2 ml-auto rounded-sm bg-gray-300"></div>
                        </div>
                      </div>
                       <div className="grid grid-cols-3 gap-2 mt-4">
                         <div className="h-1 w-full rounded-sm bg-gray-300"></div>
                         <div className="h-1 w-full rounded-sm bg-gray-300"></div>
                         <div className="h-1 w-full rounded-sm bg-gray-300"></div>
                       </div>
                      <div className="mt-4 space-y-1">
                        <div className="h-2 w-full bg-gray-200 border-b border-gray-300"></div>
                        <div className="h-3 w-full bg-gray-100 border-b border-gray-200"></div>
                        <div className="h-3 w-full bg-gray-100 border-b border-gray-200"></div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <div className="w-1/3 space-y-1">
                          <div className="h-1 w-full bg-gray-300"></div>
                          <div className="h-1 w-full bg-gray-300"></div>
                          <div className="h-2 w-full" style={{backgroundColor: themeColor}}></div>
                        </div>
                      </div>
                    </div>
                    <span className="font-semibold mt-2">Modern</span>
                  </Label>
                   <Label className="border rounded-md p-2 flex flex-col items-center gap-2 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="professional" id="professional"/>
                     <div className="border rounded-md p-2 w-full aspect-[1/1.41] bg-white overflow-hidden">
                      {/* Professional Template Preview */}
                      <div className="h-4 w-full rounded-t-sm" style={{backgroundColor: themeColor}}></div>
                      <div className="flex justify-between mt-2 px-1">
                         <div className="w-1/2 space-y-1">
                           <div className="h-1 w-full bg-gray-300 rounded-sm"></div>
                           <div className="h-1 w-2/3 bg-gray-300 rounded-sm"></div>
                         </div>
                         <div className="w-1/3 space-y-1">
                           <div className="h-1 w-full bg-gray-300 rounded-sm"></div>
                           <div className="h-1 w-3/4 ml-auto bg-gray-300 rounded-sm"></div>
                         </div>
                      </div>
                      <div className="mt-2 space-y-1 px-1">
                         <div className="h-3 w-full bg-gray-200 border-y border-gray-300"></div>
                         <div className="h-2 w-full bg-gray-100 border-b border-gray-200"></div>
                         <div className="h-2 w-full bg-gray-100 border-b border-gray-200"></div>
                      </div>
                       <div className="flex justify-end mt-2 px-1">
                        <div className="w-1/3 space-y-1">
                          <div className="h-1 w-full bg-gray-300"></div>
                          <div className="h-1 w-full bg-gray-300"></div>
                        </div>
                       </div>
                       <div className="flex justify-end mt-1 px-1">
                        <div className="w-1/4 h-2 rounded-sm" style={{backgroundColor: themeColor}}></div>
                       </div>
                    </div>
                    <span className="font-semibold mt-2">Professional</span>
                  </Label>
                   <Label className="border rounded-md p-2 flex flex-col items-center gap-2 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="ginyard" id="ginyard"/>
                     <div className="border rounded-md p-2 w-full aspect-[1/1.41] bg-white overflow-hidden">
                      {/* Ginyard Template Preview */}
                      <div className="h-full w-full rounded-md p-1" style={{backgroundColor: themeColor}}>
                        <div className="bg-white/80 h-full w-full rounded-sm p-1 space-y-2">
                           <div className="flex justify-between items-center">
                              <div className="h-2 w-1/4 rounded-sm bg-gray-400"></div>
                              <div className="h-2 w-1/6 rounded-sm bg-gray-400"></div>
                           </div>
                           <div className="h-1 w-1/3 rounded-sm bg-gray-300"></div>
                           <div className="h-1 w-1/2 rounded-sm bg-gray-300"></div>
                           <div className="h-4 w-full mt-2 flex items-center p-1 opacity-50" style={{backgroundColor: themeColor}}><div className="h-2 w-full bg-white/80 rounded-sm"></div></div>
                           <div className="h-3 w-full bg-gray-100 border-b border-gray-200"></div>
                           <div className="h-3 w-full bg-gray-100 border-b border-gray-200"></div>
                        </div>
                      </div>
                    </div>
                    <span className="font-semibold mt-2">Ginyard</span>
                  </Label>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                 <Label htmlFor="theme-color">Theme Color</Label>
                 <Input id="theme-color" type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-24 h-12 p-1" />
              </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="web">Website</Label>
              <Input id="web" value={web} onChange={(e) => setWeb(e.target.value)} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="area">Address</Label>
              <Textarea id="area" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
          </CardContent>
        </Card>

         <div className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
         </div>
      </div>
    </AppLayout>
  );
}
