'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, Loader2, Send, SendHorizonal, Target, User, Mail, Phone, MapPin, Award, Star, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '../Providers/LoggedInUser/LoggedInUserProvider';
import { MdCheck, MdClose } from "react-icons/md";
import { Textarea } from "../ui/textarea";

interface User {
  _id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  contactNo?: string;
  location?: string;
  role: 'Member' | 'Trainer';
  trainerProfile?: {
    experties: string[];
    ratings: number;
    completedPrograms: number;
    isVerified: boolean;
    verificationStatus: string;
  };
  memberProfile?: {
    goals: string[];
    fitnessLevel: string;
    fitnessJourney: string;
    healthCondition: string;
    completedPlans: number;
  };
}

interface Plan {
  _id: string;
  goal: string;
  description: string;
  budgetPerWeek: number;
  preferredDaysPerWeek: number;
  availableTimeSlots: string[];
  createdAt: string;
  status: string;
}

interface Proposal {
  _id: string;
  trainerId: User;
  memberId: User;
  planId: Plan;
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
}

interface ProposalResponse {
  pendingProposals: Proposal[];
  resolvedProposals: Proposal[];
}

export const ProposalList: React.FC = () => {

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const { user, loading, refetch, setRefetch } = useUser();
  const userRole = user?.role;
  const queryClient = useQueryClient();

  // states
  const [cancellationReason, setCancellationReason] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [responseTitle, setResponseTitle] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');

  const getAllProposals = async (): Promise<ProposalResponse> => {
    try {
      const url = userRole === 'Trainer' ? `${API_BASE}/get-proposals` : `${API_BASE}/get-members-proposals`;

      const response = await fetch(url);
      const resBody = await response.json();

      if (!response.ok) toast.error(resBody.message);
      return resBody;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch proposals');
      console.error("Fetch proposals error:", error);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery<ProposalResponse>({
    queryKey: ['proposals'],
    queryFn: getAllProposals
  });

  const pendingProposals = data?.pendingProposals || [];
  const resolvedProposals = data?.resolvedProposals || [];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const cancellProposal = async (id: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch(`${API_BASE}/cancell-proposal`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, cancellationReason })
      });

      const resBody = await response.json();
      if (response.ok) {
        queryClient.invalidateQueries(['proposals']);
        setIsProcessing(false)
        setCancellationReason('');
        toast.success(resBody.message);
      };
    } catch (error) {
      setIsProcessing(false)
      console.log("Error: ", error);
      toast.error(error.message);
    };
  };

  const resendProposal = async (id: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch(`${API_BASE}/resend-proposal`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      const resBody = await response.json();
      if (response.ok) {
        queryClient.invalidateQueries(['proposals']);
        setIsProcessing(false)
        toast.success(resBody.message);
      };
    } catch (error) {
      setIsProcessing(false)
      console.log("Error: ", error);
      toast.error(error.message);
    };
  };

  const handleProposalResponse = async (proposalId: string, action: 'Accepted' | 'Rejected') => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE}/respond-proposal`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: proposalId,
          action,
          responseTitle,
          responseMessage
        })
      });

      const resBody = await response.json();
      if (response.ok) {
        queryClient.invalidateQueries(['proposals']);
        setResponseTitle('');
        setResponseMessage('');
        setIsProcessing(false);
        toast.success(resBody.message);
      }
    } catch (error) {
      setIsProcessing(false);
      console.log("Error: ", error);
      toast.error(error.message);
    }
  };

  const renderProposalDetailsDialog = (proposal: Proposal) => {
    const { trainerId, memberId, planId, message, status, createdAt, cancellationReason } = proposal;
    const date = new Date(createdAt);
    const formattedDate = format(date, 'MMM d, yyyy • h:mm a');

    // Determine which user details to show based on current user role
    const displayUser = userRole === 'Trainer' ? memberId : trainerId;
    const isTrainerView = userRole === 'Trainer';

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className='py-5 rounded-sm cursor-pointer' size="sm">
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] dark:bg-gray-900 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Proposal Details
              <Badge variant={status === 'Accepted' ? 'default' : status === 'Rejected' ? 'destructive' : 'secondary'}>
                {status}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {isTrainerView ? 'Member' : 'Trainer'} information and training plan details
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* User Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={displayUser.avatarUrl} />
                  <AvatarFallback className="text-lg">{getInitials(displayUser.fullName)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{displayUser.fullName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {displayUser.email}
                  </div>
                  {displayUser.contactNo && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {displayUser.contactNo}
                    </div>
                  )}
                  {displayUser.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {displayUser.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Role-specific information */}
              {isTrainerView && memberId.memberProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Fitness Goals
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {memberId.memberProfile.goals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Fitness Level</h4>
                    <p className="text-sm text-muted-foreground">{memberId.memberProfile.fitnessLevel}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Health Condition</h4>
                    <p className="text-sm text-muted-foreground">{memberId.memberProfile.healthCondition}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Completed Plans</h4>
                    <p className="text-sm text-muted-foreground">{memberId.memberProfile.completedPlans} plans</p>
                  </div>
                  {memberId.memberProfile.fitnessJourney && (
                    <div className="space-y-2 md:col-span-2">
                      <h4 className="font-medium">Fitness Journey</h4>
                      <p className="text-sm text-muted-foreground">{memberId.memberProfile.fitnessJourney}</p>
                    </div>
                  )}
                </div>
              )}

              {!isTrainerView && trainerId.trainerProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {trainerId.trainerProfile.experties.map((expertise, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {expertise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Rating
                    </h4>
                    <p className="text-sm text-muted-foreground">{trainerId.trainerProfile.ratings}/5</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Completed Programs</h4>
                    <p className="text-sm text-muted-foreground">{trainerId.trainerProfile.completedPrograms} programs</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      {trainerId.trainerProfile.isVerified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                      Verification
                    </h4>
                    <p className="text-sm text-muted-foreground">{trainerId.trainerProfile.verificationStatus}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Training Plan Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Training Plan Details</h4>
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Goal</p>
                    <p className="text-sm text-muted-foreground">{planId.goal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Budget</p>
                    <p className="text-sm text-muted-foreground">${planId.budgetPerWeek}/week</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Frequency</p>
                    <p className="text-sm text-muted-foreground">{planId.preferredDaysPerWeek} days/week</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time Slots</p>
                    <p className="text-sm text-muted-foreground">{planId.availableTimeSlots.join(', ')}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{planId.description}</p>
                </div>
              </div>
            </div>

            {/* Proposal Message */}
            <div className="space-y-2">
              <h4 className="font-medium">Proposal Message</h4>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{message}</p>
              </div>
            </div>

            {/* Cancellation Reason if exists */}
            {status === 'Cancelled' && cancellationReason && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Cancellation Reason</h4>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{cancellationReason}</p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex justify-between text-xs text-muted-foreground pt-4 border-t">
              <span>Created: {formattedDate}</span>
              <span>Updated: {format(new Date(proposal.updatedAt), 'MMM d, yyyy • h:mm a')}</span>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="py-5 rounded-sm cursor-pointer">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderProposalCard = (proposal: Proposal) => {
    const { trainerId, memberId, planId, message, status, createdAt } = proposal;
    const date = new Date(createdAt);
    const formattedDate = format(date, 'MMM d, yyyy');

    // Determine which user to display based on current user role
    const displayUser = userRole === 'Trainer' ? memberId : trainerId;
    const displayProfile = userRole === 'Trainer' ? memberId.memberProfile : trainerId.trainerProfile;

    return (
      <Card key={proposal._id} className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={displayUser.avatarUrl} />
              <AvatarFallback>{getInitials(displayUser.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{displayUser.fullName}</h3>
              <p className="text-sm text-muted-foreground">
                {userRole === 'Trainer'
                  ? `${displayUser.location || 'Location not specified'} • ${displayProfile?.fitnessLevel || 'Fitness level not specified'}`
                  : `${displayProfile?.experties?.join(', ') || 'No specialties listed'} • ${displayProfile?.ratings || 0}/5 rating`
                }
              </p>
            </div>
          </div>
          <Badge variant={status === 'Accepted' ? 'default' : status === 'Rejected' ? 'destructive' : status === 'Cancelled' ? 'secondary' : 'secondary'}>
            {status}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">{message}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="truncate">{planId.goal}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>${planId.budgetPerWeek}/week</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{planId.preferredDaysPerWeek} days/week</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="truncate">{planId.availableTimeSlots.join(', ')}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Sent on {formattedDate}</p>
          <div className="flex items-center gap-2">
            {user?.role === 'Trainer' && proposal?.status === 'Cancelled' && (
              <Button
                onClick={() => resendProposal(proposal._id)}
                className='rounded-sm py-5 cursor-pointer'
                size="sm"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin duration-500 h-4 w-4" />
                ) : (
                  <SendHorizonal className="h-4 w-4" />
                )}
                <span className="ml-1">
                  {isProcessing ? 'Resending...' : 'Resend'}
                </span>
              </Button>
            )}
            {status === 'Pending' && (
              <>
                {renderProposalDetailsDialog(proposal)}

                {userRole === 'Trainer' ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="py-5 rounded-sm cursor-pointer">Cancel Proposal</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
                      <DialogHeader>
                        <DialogTitle>Cancel Proposal</DialogTitle>
                        <DialogDescription>
                          Optionally provide a reason for cancellation.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                          <Label htmlFor="cancel-reason">Reason</Label>
                          <Input
                            id="cancel-reason"
                            name="cancelReason"
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            className="py-5 rounded-sm"
                            placeholder="E.g. Client is unresponsive or unavailable"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" className="py-5 rounded-sm cursor-pointer">Close</Button>
                        </DialogClose>
                        <Button onClick={() => cancellProposal(proposal._id)}
                          variant="destructive"
                          className="py-5 rounded-sm cursor-pointer"
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Loader2 className="animate-spin duration-500 h-4 w-4" /> : <MdClose className="h-4 w-4" />}
                          <span className="ml-1">
                            {isProcessing ? 'Cancelling...' : 'Confirm Cancel'}
                          </span>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="cursor-pointer py-5 rounded-sm">Respond</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
                      <DialogHeader>
                        <DialogTitle>Respond to Proposal</DialogTitle>
                        <DialogDescription>
                          Provide a response message before accepting or rejecting the proposal.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                          <Label htmlFor="response-title">Title</Label>
                          <Input
                            id="response-title"
                            name="responseTitle"
                            value={responseTitle}
                            onChange={(e) => setResponseTitle(e.target.value)}
                            className="py-5 rounded-sm"
                            placeholder="E.g. Training request accepted"
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="response-message">Message</Label>
                          <Textarea
                            id="response-message"
                            name="responseMessage"
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            placeholder="You have been assigned a trainer. Let's get started!"
                            className="border rounded-sm px-3 py-2 focus:outline-orange-500"
                            rows={7}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="py-5 rounded-sm cursor-pointer"
                            onClick={() => handleProposalResponse(proposal._id, 'Rejected')}
                            disabled={isProcessing || !responseTitle.trim() || !responseMessage.trim()}
                          >
                            {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : <MdClose className="h-4 w-4" />}
                            <span className="ml-1">Reject</span>
                          </Button>
                        </DialogClose>
                        <Button
                          className="py-5 rounded-sm cursor-pointer"
                          onClick={() => handleProposalResponse(proposal._id, 'Accepted')}
                          disabled={isProcessing || !responseTitle.trim() || !responseMessage.trim()}
                        >
                          {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : <MdCheck className="h-4 w-4" />}
                          <span className="ml-1">Accept</span>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}

            {status !== 'Pending' && status !== 'Cancelled' && renderProposalDetailsDialog(proposal)}
          </div>
        </CardFooter>
      </Card>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load proposals. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] rounded-sm">
          <TabsTrigger value="pending" className="cursor-pointer rounded-sm">
            Pending ({pendingProposals?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="responded" className="cursor-pointer rounded-sm">
            Responded ({resolvedProposals?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
              ))}
            </div>
          ) : pendingProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                <Clock className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium">No pending proposals</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have any pending proposals at the moment. Check back later for new requests.
              </p>
            </div>
          ) : (
            pendingProposals.map(renderProposalCard)
          )}
        </TabsContent>

        <TabsContent value="responded" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
              ))}
            </div>
          ) : resolvedProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium">No responded proposals</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Your responses to proposals will appear here once you've accepted or rejected them.
              </p>
            </div>
          ) : (
            resolvedProposals.map(renderProposalCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
