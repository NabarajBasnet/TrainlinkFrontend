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
import { Calendar, Clock, DollarSign, Loader2, Send, SendHorizonal, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '../Providers/LoggedInUser/LoggedInUserProvider';
import { MdCheck, MdClose } from "react-icons/md";
import { Textarea } from "../ui/textarea";

interface User {
  _id: string;
  fullName: string;
  avatarUrl?: string;
  trainerProfile?: {
    experties: string[];
    ratings: number;
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

  const renderProposalCard = (proposal: Proposal) => {
    const { trainerId, planId, message, status, createdAt } = proposal;
    const date = new Date(createdAt);
    const formattedDate = format(date, 'MMM d, yyyy');

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

    return (
      <Card key={proposal._id} className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={trainerId.avatarUrl} />
              <AvatarFallback>{getInitials(trainerId.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{trainerId.fullName}</h3>
              <p className="text-sm text-muted-foreground">
                {trainerId.trainerProfile?.experties.join(', ') || 'No specialties listed'}
              </p>
            </div>
          </div>
          <Badge variant={status === 'Accepted' ? 'default' : status === 'Rejected' ? 'destructive' : 'secondary'}>
            {status}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{message}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{planId.goal}</span>
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
              <span>{planId.availableTimeSlots.join(', ')}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Sent on {formattedDate}</p>
          <div className="flex items-end justify-end">
            {proposal?.status === 'Cancelled' &&
              <Button onClick={() => resendProposal(proposal._id)} className='rounded-sm py-5 cursor-pointer' size="sm">
                {isProcessing ? <Loader2 className="animate-spin duration-500" /> : <SendHorizonal />}
                <span>
                  {isProcessing ? 'Resending...' : 'Resend Proposal'}
                </span>
              </Button>
            }
          </div>
          {status === 'Pending' && (
            <div className="space-x-2 flex items-center">
              <Button variant="outline" className='cursor-pointer' size="sm">View Details</Button>
              {userRole === 'Trainer' ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="cursor-pointer">Cancel Proposal</Button>
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
                      >
                        {isProcessing ? <Loader2 className="animate-spin duration-500" /> : <MdClose />}
                        <span>
                          {isProcessing ? 'Cancelling...' : 'Confirm Cancel'}
                        </span>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                      <Button size="sm" className="cursor-pointer">Respond</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
                      <DialogHeader>
                        <DialogTitle>Respond to Proposal</DialogTitle>
                        <DialogDescription>
                          Provide a short response message before accepting or rejecting the proposal.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                          <Label htmlFor="response-title">Title</Label>
                          <Input
                            id="response-title"
                            name="responseTitle"
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
                            placeholder="You have been assigned a trainer. Let's get started!"
                            className="border rounded-sm px-3 py-2 focus:outline-orange-500"
                            rows={7}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" className="py-5 rounded-sm cursor-pointer">
                            <MdClose />
                            <span>Reject</span>
                          </Button>
                        </DialogClose>
                        <Button type="submit" className="py-5 rounded-sm cursor-pointer">
                          <MdCheck />
                          <span>Accept</span>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              )}
            </div>
          )}
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Proposals</h2>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] rounded-sm">
          <TabsTrigger value="pending" className="cursor-pointer rounded-sm">
            Pending ({pendingProposals?.length})
          </TabsTrigger>
          <TabsTrigger value="responded" className="cursor-pointer rounded-sm">
            Responded ({resolvedProposals?.length})
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
            resolvedProposals?.map(renderProposalCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
