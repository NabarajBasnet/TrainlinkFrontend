'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ProposalCardProps {
  proposal: {
    _id: string;
    trainerId: {
      firstName: string;
      lastName: string;
      profilePicture?: string;
    };
    memberId: {
      firstName: string;
      lastName: string;
      profilePicture?: string;
    };
    planId: {
      title: string;
      description: string;
    };
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  };
  userRole: 'trainer' | 'member';
  onRespond?: (proposalId: string, action: 'accept' | 'reject') => void;
  onDelete?: (proposalId: string) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  userRole,
  onRespond,
  onDelete
}) => {
  const isPending = proposal.status === 'pending';
  const isTrainer = userRole === 'trainer';
  const isMember = userRole === 'member';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage 
                src={isTrainer ? proposal.memberId.profilePicture : proposal.trainerId.profilePicture} 
              />
              <AvatarFallback>
                {isTrainer 
                  ? `${proposal.memberId.firstName[0]}${proposal.memberId.lastName[0]}`
                  : `${proposal.trainerId.firstName[0]}${proposal.trainerId.lastName[0]}`
                }
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {isTrainer 
                  ? `${proposal.memberId.firstName} ${proposal.memberId.lastName}`
                  : `${proposal.trainerId.firstName} ${proposal.trainerId.lastName}`
                }
              </CardTitle>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(proposal.status)}>
            {proposal.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold">Plan: {proposal.planId.title}</h4>
            <p className="text-sm text-gray-600">{proposal.planId.description}</p>
          </div>
          <div>
            <h4 className="font-semibold">Message:</h4>
            <p className="text-sm text-gray-700">{proposal.message}</p>
          </div>
          
          {isPending && (
            <div className="flex space-x-2">
              {isMember && onRespond && (
                <>
                  <Button 
                    onClick={() => onRespond(proposal._id, 'accept')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button 
                    onClick={() => onRespond(proposal._id, 'reject')}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </>
              )}
              {isTrainer && onDelete && (
                <Button 
                  onClick={() => onDelete(proposal._id)}
                  variant="outline"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 