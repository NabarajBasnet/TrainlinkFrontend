"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

interface Collaboration {
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
  status: "active" | "completed" | "cancelled";
  startDate: string;
  progress: {
    completedSessions: number;
    totalSessions: number;
    lastSessionDate?: string;
  };
}

export const ActiveCollaborations: React.FC = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"trainer" | "member">("member");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    fetchCollaborations();

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("enrollmentProgressUpdate", (data) => {
      setCollaborations((prev) =>
        prev.map((collab) =>
          collab._id === data.enrollmentId
            ? { ...collab, progress: data.progress, status: data.status }
            : collab
        )
      );

      toast.success("Your training progress has been updated!");
    });

    socket.on("enrollmentCancelled", (data) => {
      setCollaborations((prev) =>
        prev.map((collab) =>
          collab._id === data.enrollmentId
            ? { ...collab, status: "cancelled" }
            : collab
        )
      );

      toast.success("A training collaboration has been cancelled.");
    });

    return () => {
      socket.off("enrollmentProgressUpdate");
      socket.off("enrollmentCancelled");
    };
  }, [socket, toast]);

  const fetchCollaborations = async () => {
    try {
      const response = await fetch("/api/enrollments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCollaborations(data.data);
        setUserRole("member");
      }
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      toast.error("Failed to load collaborations");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (enrollmentId: string, progress: any) => {
    try {
      const response = await fetch(
        `/api/enrollments/${enrollmentId}/progress`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(progress),
        }
      );

      if (response.ok) {
        toast.success("Progress updated successfully!");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const handleCancel = async (enrollmentId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast.success("Collaboration cancelled successfully!");
      }
    } catch (error) {
      console.error("Error cancelling collaboration:", error);
      toast.error("Failed to cancel collaboration");
    }
  };

  const activeCollaborations = collaborations.filter(
    (c) => c.status === "active"
  );
  const completedCollaborations = collaborations.filter(
    (c) => c.status === "completed"
  );
  const cancelledCollaborations = collaborations.filter(
    (c) => c.status === "cancelled"
  );

  if (loading) {
    return <div>Loading collaborations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Collaborations</h2>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeCollaborations.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCollaborations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledCollaborations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeCollaborations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No active collaborations
            </p>
          ) : (
            activeCollaborations.map((collaboration) => (
              <Card key={collaboration._id} className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={
                            userRole === "trainer"
                              ? collaboration.memberId.profilePicture
                              : collaboration.trainerId.profilePicture
                          }
                        />
                        <AvatarFallback>
                          {userRole === "trainer"
                            ? `${collaboration.memberId.firstName[0]}${collaboration.memberId.lastName[0]}`
                            : `${collaboration.trainerId.firstName[0]}${collaboration.trainerId.lastName[0]}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {userRole === "trainer"
                            ? `${collaboration.memberId.firstName} ${collaboration.memberId.lastName}`
                            : `${collaboration.trainerId.firstName} ${collaboration.trainerId.lastName}`}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {collaboration.planId.title}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {collaboration.progress.completedSessions}/
                          {collaboration.progress.totalSessions} sessions
                        </span>
                      </div>
                      <Progress
                        value={
                          collaboration.progress.totalSessions > 0
                            ? (collaboration.progress.completedSessions /
                                collaboration.progress.totalSessions) *
                              100
                            : 0
                        }
                        className="w-full"
                      />
                    </div>

                    {userRole === "trainer" && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() =>
                            handleUpdateProgress(collaboration._id, {
                              completedSessions:
                                collaboration.progress.completedSessions + 1,
                              totalSessions:
                                collaboration.progress.totalSessions,
                            })
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark Session Complete
                        </Button>
                        <Button
                          onClick={() => handleCancel(collaboration._id)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedCollaborations.map((collaboration) => (
            <Card key={collaboration._id} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          userRole === "trainer"
                            ? collaboration.memberId.profilePicture
                            : collaboration.trainerId.profilePicture
                        }
                      />
                      <AvatarFallback>
                        {userRole === "trainer"
                          ? `${collaboration.memberId.firstName[0]}${collaboration.memberId.lastName[0]}`
                          : `${collaboration.trainerId.firstName[0]}${collaboration.trainerId.lastName[0]}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {userRole === "trainer"
                          ? `${collaboration.memberId.firstName} ${collaboration.memberId.lastName}`
                          : `${collaboration.trainerId.firstName} ${collaboration.trainerId.lastName}`}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {collaboration.planId.title}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledCollaborations.map((collaboration) => (
            <Card key={collaboration._id} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          userRole === "trainer"
                            ? collaboration.memberId.profilePicture
                            : collaboration.trainerId.profilePicture
                        }
                      />
                      <AvatarFallback>
                        {userRole === "trainer"
                          ? `${collaboration.memberId.firstName[0]}${collaboration.memberId.lastName[0]}`
                          : `${collaboration.trainerId.firstName[0]}${collaboration.trainerId.lastName[0]}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {userRole === "trainer"
                          ? `${collaboration.memberId.firstName} ${collaboration.memberId.lastName}`
                          : `${collaboration.trainerId.firstName} ${collaboration.trainerId.lastName}`}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {collaboration.planId.title}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
