'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProposalList } from '@/components/proposals/ProposalList';
import { ActiveCollaborations } from '@/components/collaborations/ActiveCollaborations';
import { useSocketAuth } from '@/hooks/useSocketAuth';

export default function Dashboard() {
  // Initialize socket authentication
  useSocketAuth();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Tabs defaultValue="proposals" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="collaborations">Active Collaborations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proposals" className="mt-6">
          <ProposalList />
        </TabsContent>
        
        <TabsContent value="collaborations" className="mt-6">
          <ActiveCollaborations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
