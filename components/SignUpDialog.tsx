// components/SignUpDialog.tsx
'use client'; // Mark as client component if using client-side hooks or interactions

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'; // Adjust path if necessary
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignUpDialogProps {
  // Optional: You can pass props to control the dialog from parent
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SignUpDialog({ initialOpen = false, onOpenChange }: SignUpDialogProps) {
  const [open, setOpen] = useState(initialOpen);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle dialog open/close state changes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signing up with:', { email, password });
    // Here you would typically send data to your backend
    // After successful signup, you might close the dialog:
    // setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* DialogTrigger: This is what you click to open the dialog */}
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition duration-300 transform hover:scale-105">
          Join Our Community!
        </Button>
      </DialogTrigger>

      {/* DialogContent: This is the actual pop-up content */}
      <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded-xl shadow-2xl animate-fade-in-up">
        {/* DialogHeader: Title and Description */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-extrabold text-gray-900 mb-2">
            🚀 Ready to Get Started?
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Sign up now to unlock exclusive features and updates!
          </DialogDescription>
        </DialogHeader>

        {/* Custom Content: Our Sign-up Form */}
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-gray-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right text-gray-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* DialogFooter: Action buttons */}
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
          >
            Create Account
          </Button>
          <Button
            type="button" // Important: type="button" to prevent form submission
            onClick={() => setOpen(false)}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-2 rounded-lg transition duration-200"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}