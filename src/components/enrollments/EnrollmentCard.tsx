'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface EnrollmentCardProps {
  enrollment: {
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
    status: 'active' | 'completed' | 'cancelled';
    startDate: string;
    endDate?: string;
    progress: {
      completedSessions: number;
      totalSessions: number;
      lastSessionDate?: string;
    };
  };
  userRole: 'trainer' | 'member';
  onUpdateProgress?: (enrollmentId: string, progress: any) => void;
  onCancel?: (enrollmentId: string) => void;
}

export const EnrollmentCard: React.FC<EnrollmentCardProps> = ({
  enrollment,
  userRole,
  onUpdateProgress,
  onCancel
}) => {
  const isActive = enrollment.status === 'active';
  const isTrainer = userRole === 'trainer';
  const progressPercentage = enrollment.progress.totalSessions > 0 
    ? (enrollment.progress.completedSessions / enrollment.progress.totalSessions) * 100 
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
                src={isTrainer ? enrollment.memberId.profilePicture : enrollment.trainerId.profilePicture} 
              />
              <AvatarFallback>
                {isTrainer 
                  ? `${enrollment.memberId.firstName[0]}${enrollment.memberId.lastName[0]}`
                  : `${enrollment.trainerId.firstName[0]}${enrollment.trainerId.lastName[0]}`
                }
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {isTrainer 
                  ? `${enrollment.memberId.firstName} ${enrollment.memberId.lastName}`
                  : `${enrollment.trainerId.firstName} ${enrollment.trainerId.lastName}`
                }
              </CardTitle>
              <p className="text-sm text-gray-600">
                Started {formatDistanceToNow(new Date(enrollment.startDate), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(enrollment.status)}>
            {enrollment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Plan: {enrollment.planId.title}</h4>
            <p className="text-sm text-gray-600">{enrollment.planId.description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{enrollment.progress.completedSessions}/{enrollment.progress.totalSessions} sessions</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          {enrollment.progress.lastSessionDate && (
            <p className="text-sm text-gray-600">
              Last session: {formatDistanceToNow(new Date(enrollment.progress.lastSessionDate), { addSuffix: true })}
            </p>
          )}
          
          {isActive && (
            <div className="flex space-x-2">
              {isTrainer && onUpdateProgress && (
                <Button 
                  onClick={() => onUpdateProgress(enrollment._id, {
                    completedSessions: enrollment.progress.completedSessions + 1,
                    totalSessions: enrollment.progress.totalSessions
                  })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Mark Session Complete
                </Button>
              )}
              {onCancel && (
                <Button 
                  onClick={() => onCancel(enrollment._id)}
                  variant="outline"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 