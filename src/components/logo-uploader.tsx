'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ImagePlus, Loader2 } from 'lucide-react';

interface LogoUploaderProps {
  onLogoUpload: (url: string) => void;
}

export function LogoUploader({ onLogoUpload }: LogoUploaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useState<React.RefObject<HTMLInputElement>>(null);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({ variant: 'destructive', title: 'File too large', description: 'Please select a file smaller than 2MB.' });
      return;
    }

    setIsUploading(true);
    setLogoPreview(URL.createObjectURL(file));

    try {
      const filePath = `logos/${user.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      onLogoUpload(downloadURL);
      setLogoPreview(downloadURL); // Update preview with final URL

      toast({
        title: 'Logo Uploaded!',
        description: 'Your logo is now ready to be used in the invoice.',
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload your logo. Please try again.' });
      setLogoPreview(null); // Clear preview on failure
    } finally {
      setIsUploading(false);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Company Logo</CardTitle>
        <CardDescription>Add your logo to be displayed on the invoice.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
          {logoPreview ? (
            <Image src={logoPreview} alt="Logo Preview" width={192} height={192} className="object-contain" />
          ) : (
            <div className="text-muted-foreground text-center">
              <ImagePlus className="mx-auto h-12 w-12" />
              <p>Logo Preview</p>
            </div>
          )}
        </div>
        <Input
          id="logo-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          accept="image/png, image/jpeg, image/gif"
          className="hidden"
          disabled={isUploading}
        />
        <Button onClick={handleChooseFileClick} disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Choose File'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}