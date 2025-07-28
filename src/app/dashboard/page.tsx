'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProposalList } from '@/components/proposals/ProposalList';
import { ActiveCollaborations } from '@/components/collaborations/ActiveCollaborations';

export default function Dashboard() {


  return (
    <div className="w-full p-4">
      <Tabs defaultValue="proposals" className="w-full">
        <TabsList className="grid w-full rounded-sm grid-cols-2">
          <TabsTrigger value="proposals" className='cursor-pointer rounded-sm'>Proposals</TabsTrigger>
          <TabsTrigger value="collaborations" className='cursor-pointer rounded-sm'>Active Collaborations</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="rounded-sm cursor-pointer mt-6">
          <ProposalList />
        </TabsContent>

        <TabsContent value="collaborations" className="rounded-sm cursor-pointer mt-6">
          <ActiveCollaborations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
