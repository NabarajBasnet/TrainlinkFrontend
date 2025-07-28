'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProposalList } from '@/components/proposals/ProposalList';
import { ActiveCollaborations } from '@/components/collaborations/ActiveCollaborations';

export default function Dashboard() {


  return (
    <div className="container mx-auto p-6">
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
