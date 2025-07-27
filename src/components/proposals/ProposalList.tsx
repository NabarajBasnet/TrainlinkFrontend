'use client';

import React, { useState, useEffect } from 'react';
import { ProposalCard } from './ProposalCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';

interface Proposal {
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
}

export const ProposalList: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'trainer' | 'member'>('member');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Get user role and proposals
    fetchProposals();

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for new proposals
    socket.on('newProposal', (data) => {
      setProposals(prev => [data.proposal, ...prev]);
      toast.success("You have received a new training proposal!");
    });

    // Listen for proposal responses
    socket.on('proposalResponse', (data) => {
      setProposals(prev => 
        prev.map(proposal => 
          proposal._id === data.proposalId 
            ? { ...proposal, status: data.status }
            : proposal
        )
      );
      
      toast.success(`Your proposal has been ${data.action}!`);
    });

    return () => {
      socket.off('newProposal');
      socket.off('proposalResponse');
    };
  }, [socket]);

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProposals(data.data);
        
        // Determine user role based on first proposal
        if (data.data.length > 0) {
          const firstProposal = data.data[0];
          // This is a simplified logic - you might want to get user role from auth context
          setUserRole('member'); // Default to member for now
        }
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (proposalId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        const data = await response.json();
        setProposals(prev => 
          prev.map(proposal => 
            proposal._id === proposalId 
              ? { ...proposal, status: data.data.status }
              : proposal
          )
        );
        
        toast.success(`Proposal ${action}ed successfully!`);
      }
    } catch (error) {
      console.error('Error responding to proposal:', error);
      toast.error("Failed to respond to proposal");
    }
  };

  const handleDelete = async (proposalId: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setProposals(prev => prev.filter(proposal => proposal._id !== proposalId));
        toast.success("Proposal deleted successfully!");
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast.error("Failed to delete proposal");
    }
  };

  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const respondedProposals = proposals.filter(p => p.status !== 'pending');

  if (loading) {
    return <div>Loading proposals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Proposals</h2>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingProposals.length})
          </TabsTrigger>
          <TabsTrigger value="responded">
            Responded ({respondedProposals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingProposals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending proposals
            </p>
          ) : (
            pendingProposals.map(proposal => (
              <ProposalCard
                key={proposal._id}
                proposal={proposal}
                userRole={userRole}
                onRespond={handleRespond}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="responded" className="space-y-4">
          {respondedProposals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No responded proposals
            </p>
          ) : (
            respondedProposals.map(proposal => (
              <ProposalCard
                key={proposal._id}
                proposal={proposal}
                userRole={userRole}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 