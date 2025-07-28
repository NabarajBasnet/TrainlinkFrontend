// src/services/proposalService.ts
import { toast } from "sonner";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface ProposalFace {
  memberId: string;
  planId: string | null;
  message: string;
}

export class ProposalService {
  static async sendProposal(data: ProposalFace) {
    try {
      const response = await fetch(`${API_BASE}/create-proposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resBody = await response.json();
      toast.success(resBody.message);
      return resBody;
    } catch (error) {
      console.error("Proposal error:", error);
      toast.error(error.message);
      throw error;
    }
  }

  // Trainers only
  static async getProposals() {
    try {
      const response = await fetch(`${API_BASE}/get-proposals`);
      const resBody = await response.json();
      return resBody;
    } catch (error) {
      toast.error(error.message);
      console.error("Fetch proposals error:", error);
      throw error;
    }
  }

  static async respondToProposal(
    proposalId: string,
    action: "accept" | "reject"
  ) {
    try {
      const response = await fetch(`${API_BASE}/${proposalId}/respond`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ action }),
      });
      return await response.json();
    } catch (error) {
      console.error("Response error:", error);
      throw error;
    }
  }

  static async deleteProposal(proposalId: string) {
    try {
      const response = await fetch(`${API_BASE}/${proposalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }
}
