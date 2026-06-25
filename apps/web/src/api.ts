const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export interface HealthStatus {
  status: string;
  service: string;
  environment: string;
}

export const getHealth = async (): Promise<HealthStatus> => {
  const response = await fetch(`${apiUrl}/health`);
  if (!response.ok) throw new Error("API indisponível");
  const payload = await response.json();
  return payload.data;
};
