export interface DetectionRecord {
  id: string;
  news_text: string;
  prediction: 'REAL' | 'FAKE';
  confidence: number | null;
  created_at: string;
}

export interface PredictionResponse {
  prediction: 'REAL' | 'FAKE';
  confidence?: number | null;
  analysisId?: string;
}