'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Search, Eye, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VerificationApplication {
  _id: string;
  fullName: string;
  email: string;
  trainerProfile: {
    verificationStatus: 'pending' | 'approved' | 'rejected';
    verificationApplication: {
      submittedAt: string;
      reviewedAt?: string;
      reviewedBy?: string;
      rejectionReason?: string;
      documents: {
        governmentId: string;
        businessLicense?: string;
      };
      fullName?: string;
      phoneNumber?: string;
      businessName?: string;
      businessType?: string;
      website?: string;
      socialMediaHandles?: string;
      reasonForVerification?: string;
      additionalInfo?: string;
    };
  };
}

const VerificationManagement = () => {
  const [applications, setApplications] = useState<VerificationApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<VerificationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<VerificationApplication | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/verification-applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      toast.error('Failed to load verification applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.trainerProfile.verificationApplication?.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.trainerProfile.verificationStatus === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const payload = {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/update-verification-status/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(`Application ${status} successfully`);
        fetchApplications();
        setRejectionReason('');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verification Applications Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.fullName}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {application.trainerProfile.verificationApplication?.businessName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.trainerProfile.verificationApplication?.businessType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application.trainerProfile.verificationStatus)}
                    </TableCell>
                    <TableCell>
                      {new Date(application.trainerProfile.verificationApplication?.submittedAt || '').toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {application.trainerProfile.verificationStatus === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(application._id, 'approved')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const reason = prompt('Please provide a reason for rejection:');
                                if (reason) {
                                  setRejectionReason(reason);
                                  handleStatusUpdate(application._id, 'rejected');
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No verification applications found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Application Details</DialogTitle>
            <DialogDescription>
              Review the application details and supporting documents.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <p className="text-sm">{selectedApplication.trainerProfile.verificationApplication?.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="font-semibold mb-3">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Business Name</label>
                    <p className="text-sm">{selectedApplication.trainerProfile.verificationApplication?.businessName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Business Type</label>
                    <p className="text-sm">{selectedApplication.trainerProfile.verificationApplication?.businessType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <p className="text-sm">{selectedApplication.trainerProfile.verificationApplication?.website || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Social Media</label>
                    <p className="text-sm">{selectedApplication.trainerProfile.verificationApplication?.socialMediaHandles || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold mb-3">Supporting Documents</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <label className="text-sm font-medium">Government ID</label>
                      <p className="text-xs text-gray-500">Required document</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedApplication.trainerProfile.verificationApplication?.documents.governmentId, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                  {selectedApplication.trainerProfile.verificationApplication?.documents.businessLicense && (
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <label className="text-sm font-medium">Business License</label>
                        <p className="text-xs text-gray-500">Additional document</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedApplication.trainerProfile.verificationApplication?.documents.businessLicense, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reason and Additional Info */}
              <div>
                <h3 className="font-semibold mb-3">Application Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Reason for Verification</label>
                    <p className="text-sm mt-1">{selectedApplication.trainerProfile.verificationApplication?.reasonForVerification}</p>
                  </div>
                  {selectedApplication.trainerProfile.verificationApplication?.additionalInfo && (
                    <div>
                      <label className="text-sm font-medium">Additional Information</label>
                      <p className="text-sm mt-1">{selectedApplication.trainerProfile.verificationApplication.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedApplication.trainerProfile.verificationStatus === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleStatusUpdate(selectedApplication._id, 'approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const reason = prompt('Please provide a reason for rejection:');
                      if (reason) {
                        setRejectionReason(reason);
                        handleStatusUpdate(selectedApplication._id, 'rejected');
                      }
                    }}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerificationManagement; 