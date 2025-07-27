"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SendProposalFormProps {
  planId: string;
  memberId: string;
  planTitle: string;
  onProposalSent?: () => void;
  onCancel?: () => void;
}

export const SendProposalForm: React.FC<SendProposalFormProps> = ({
  planId,
  memberId,
  planTitle,
  onProposalSent,
  onCancel,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          planId,
          memberId,
          message: message.trim(),
        }),
      });

      if (response.ok) {
        toast.success("Proposal sent successfully!");
        setMessage("");
        onProposalSent?.();
      } else {
        const error = await response.json();
        toast.error("Failed to send proposal");
      }
    } catch (error) {
      console.error("Error sending proposal:", error);
      toast.error("Failed to send proposal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send Proposal</CardTitle>
        <p className="text-sm text-gray-600">
          Send a proposal for: <strong>{planTitle}</strong>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message to Member
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd be a great trainer for this member..."
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/1000 characters
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex-1"
            >
              {loading ? "Sending..." : "Send Proposal"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
