'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Shield, FileText, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUser } from '@/components/Providers/LoggedInUser/LoggedInUserProvider';

const VerificationApplication = () => {
  const userContext = useUser();
  const user = (userContext as any)?.user;
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.contactNo || '',
    businessName: '',
    businessType: '',
    website: '',
    socialMediaHandles: '',
    reasonForVerification: '',
    additionalInfo: '',
    governmentId: null as File | null,
    businessLicense: null as File | null,
  });

  const getVerificationStatus = () => {
    if (user?.trainerProfile?.isVerified) {
      return {
        status: 'verified',
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        text: 'Verified Trainer',
        color: 'bg-green-100 text-green-800',
        description: 'Your account has been verified by our team.'
      };
    } else if (user?.trainerProfile?.verificationStatus === 'pending') {
      return {
        status: 'pending',
        icon: <Clock className="h-5 w-5 text-yellow-500" />,
        text: 'Verification Pending',
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Your verification application is under review.'
      };
    } else {
      return {
        status: 'unverified',
        icon: <XCircle className="h-5 w-5 text-gray-500" />,
        text: 'Not Verified',
        color: 'bg-gray-100 text-gray-800',
        description: 'Apply for verification to build trust with clients.'
      };
    }
  };

  const handleFileChange = (field: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key as keyof typeof formData] !== null) {
          formDataToSend.append(key, formData[key as keyof typeof formData]);
        }
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apply-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Verification application submitted successfully!');
        setIsOpen(false);
        // Refresh user data
        window.location.reload();
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-orange-500" />
            <CardTitle className="text-lg">Trainer Verification</CardTitle>
          </div>
          <Badge className={verificationStatus.color}>
            {verificationStatus.icon}
            <span className="ml-2">{verificationStatus.text}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          {verificationStatus.description}
        </p>

        {verificationStatus.status === 'unverified' && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Apply for Verification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] dark:bg-gray-800 overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Trainer Verification Application</DialogTitle>
                <DialogDescription>
                  Complete this form to apply for trainer verification. This helps build trust with potential clients.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Input
                        id="businessType"
                        value={formData.businessType}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                        placeholder="e.g., Personal Training, Fitness Studio"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socialMediaHandles">Social Media Handles</Label>
                      <Input
                        id="socialMediaHandles"
                        value={formData.socialMediaHandles}
                        onChange={(e) => setFormData(prev => ({ ...prev, socialMediaHandles: e.target.value }))}
                        placeholder="@instagram, @facebook"
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Documents */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Verification Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="governmentId">Government ID *</Label>
                      <div className="mt-1">
                        <Input
                          id="governmentId"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('governmentId', e.target.files?.[0] as File)}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a valid government-issued ID (passport, driver's license, etc.)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="businessLicense">Business License (if applicable)</Label>
                      <div className="mt-1">
                        <Input
                          id="businessLicense"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] as File)}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload your business license or certification documents
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Additional Information</h3>
                  <div>
                    <Label htmlFor="reasonForVerification">Why do you want to be verified? *</Label>
                    <Textarea
                      id="reasonForVerification"
                      value={formData.reasonForVerification}
                      onChange={(e) => setFormData(prev => ({ ...prev, reasonForVerification: e.target.value }))}
                      placeholder="Explain why verification is important for your business..."
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                      placeholder="Any additional information that might help with verification..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className="bg-orange-500 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-white">Privacy Policy</h4>
                  <p className="text-sm text-gray-100">
                    By submitting this application, you agree to our verification process. 
                    Your personal information will be used solely for verification purposes 
                    and will be handled in accordance with our privacy policy. 
                    We may contact you for additional verification if needed.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {verificationStatus.status === 'pending' && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Application Under Review</span>
            </div>
            <p className="text-sm text-yellow-700">
              We're currently reviewing your verification application. This process typically takes 3-5 business days. 
              You'll receive an email notification once the review is complete.
            </p>
          </div>
        )}

        {verificationStatus.status === 'verified' && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Verification Complete</span>
            </div>
            <p className="text-sm text-green-700">
              Congratulations! Your account has been verified. You now have access to verified trainer features 
              and can build trust with potential clients.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationApplication; 