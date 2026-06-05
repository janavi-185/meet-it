import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { env } from "../../../config/env.js";
import {
  AnalysisResponse,
  ActionItem,
  SummaryItem,
  DecisionItem,
  FollowUpItem,
} from "../analysis.model.js";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    if (!env.geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    this.genAI = new GoogleGenerativeAI(env.geminiApiKey);
    // Using gemini-1.5-flash as the default stable model via env
    this.model = this.genAI.getGenerativeModel({
      model: env.geminiModel,
    });
    console.log("Gemini Model:", env.geminiModel);
  }

  async generateAnalysis(prompt: string): Promise<AnalysisResponse> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const parsedResponse = JSON.parse(text) as AnalysisResponse;
      this.validateResponse(parsedResponse);

      return parsedResponse;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw new Error(
        `AI Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        { cause: error },
      );
    }
  }

  private validateResponse(data: AnalysisResponse): void {
    const requiredKeys: (keyof AnalysisResponse)[] = [
      "summary",
      "actionItems",
      "decisions",
      "followUps",
    ];

    for (const key of requiredKeys) {
      if (!Array.isArray(data[key])) {
        throw new Error(`Invalid AI response: '${key}' must be an array`);
      }

      const items = data[key] as (
        | SummaryItem
        | ActionItem
        | DecisionItem
        | FollowUpItem
      )[];

      for (const item of items) {
        // Every insight must contain citations
        if (
          !item.citations ||
          !Array.isArray(item.citations) ||
          item.citations.length === 0
        ) {
          throw new Error(
            `Invalid AI response: Every insight in '${key}' must have at least one citation`,
          );
        }

        for (const citation of item.citations) {
          if (!citation.timestamp) {
            throw new Error(
              `Invalid AI response: Citation in '${key}' is missing timestamp`,
            );
          }
        }

        // Validate specific fields
        if (key === "actionItems") {
          const action = item as ActionItem;
          if (!action.task || !action.assignee) {
            throw new Error(
              "Invalid AI response: Action items must have 'task' and 'assignee'",
            );
          }
        } else {
          const otherItem = item as SummaryItem | DecisionItem | FollowUpItem;
          if (!otherItem.text) {
            throw new Error(
              `Invalid AI response: Items in '${key}' must have 'text'`,
            );
          }
        }
      }
    }
  }
}
